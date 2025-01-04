import jwt from 'jsonwebtoken';
import { env } from 'node:process';

import modelRole from '../models/roles.js';
import modelUser from '../models/users.js';

const verifyToken = async (req, res, next) => {

    const authHeader = req.get('Authorization');

    // jika token tidak ada, kembalikan respons error
    if (!authHeader) return res.status(401).json({ succes: false, message: 'Tidak ada token atau sudah logout sebelumnya' });

    const tokenHeader = authHeader.split(' ')[1];

    if (!tokenHeader) {
        return next(res.status(401).json({
            status: 401,
            message: 'Login terlebih dahulu!'
        }))
    }

    let decoded;
    try {
        decoded = jwt.verify(tokenHeader, env.JWT_SECRET);
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: false,
                message: 'Token sudah kadaluarsa'
            });
        }

        return next(res.status(401).json({
            message: err
        }))
    }

    const currentUser = await modelUser.findOne({
        where: { email: decoded.email },
        attributes: { exclude: ['password'] }
    });

    if (!currentUser) {
        return next(res.status(401).json({
            status: 401,
            message: "User sudah tidak ada, token sudah tidak bisa digunakan"
        }))
    }
    req.user = currentUser
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
