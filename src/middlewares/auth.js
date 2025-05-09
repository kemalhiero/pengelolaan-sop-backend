import jwt from 'jsonwebtoken';
import { env } from 'node:process';

import modelRole from '../models/roles.js';
import modelUser from '../models/users.js';

/**
 * Middleware untuk memverifikasi token JWT pada header Authorization.
 * 
 * - Jika token tidak ada atau tidak valid, akan mengembalikan respons error 401.
 * - Jika token valid, akan mencari user berdasarkan identity_number yang ada di token.
 * - Jika user ditemukan, data user (tanpa password dan id_role) beserta nama role akan disimpan di req.user.
 */
const verifyToken = async (req, res, next) => {

    const authHeader = req.get('Authorization');

    // jika token tidak ada, kembalikan respons error
    if (!authHeader) return res.status(401).json({ message: 'Tidak ada token atau sudah logout sebelumnya' });

    const tokenHeader = authHeader.split(' ')[1];

    if (!tokenHeader) {
        return next(res.status(401).json({
            status: 401,
            message: 'Login terlebih dahulu!'
        }))
    };

    let decoded;
    try {
        decoded = jwt.verify(tokenHeader, env.JWT_SECRET);
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token sudah kadaluarsa'
            });
        }

        return next(res.status(401).json({
            message: err
        }))
    };

    const currentUser = await modelUser.findOne({
        where: { identity_number: decoded.idnumber },
        attributes: { exclude: ['id_role', 'password'] },
        include: {
            model: modelRole,
            attributes: ['role_name']
        }
    });
    currentUser.dataValues.role = currentUser.dataValues.role.role_name;

    if (!currentUser) {
        return next(res.status(401).json({
            message: "User sudah tidak ada, token sudah tidak bisa digunakan"
        }))
    };
    req.user = currentUser.dataValues;
    next()
};

/**
 * Middleware untuk mengotorisasi akses berdasarkan peran (role) pengguna.
 *
 * @param {string[]} roles - Array berisi daftar peran yang diizinkan mengakses resource.
 * @returns {function} Middleware Express yang memeriksa apakah peran pengguna termasuk dalam daftar yang diizinkan.
 * @throws {TypeError} Jika parameter roles bukan berupa array.
 *
 * @example
 * // Hanya izinkan akses untuk role 'pj' dan 'kadep'
 * app.get('/pj', verifyToken, authorizeRole(['admin', 'kadep']), controllerFunction);
 */
const authorizeRole = (roles) => {
    if (!Array.isArray(roles)) {
        throw new TypeError('Parameter roles harus berupa array');
    }
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Anda tidak memiliki akses ke resource ini'
            });
        }
        next();
    };
};

export { verifyToken, authorizeRole };
