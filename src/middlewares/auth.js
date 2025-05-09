import jwt from 'jsonwebtoken';
import { env } from 'node:process';

import modelRole from '../models/roles.js';
import modelUser from '../models/users.js';

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

const authorizeRole = (roles) => {
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
