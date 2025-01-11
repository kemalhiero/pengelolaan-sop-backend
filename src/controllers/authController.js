import { env } from 'node:process';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import modelRole from '../models/roles.js';
import modelUser from '../models/users.js';

const registUser = async (req, res, next) => {
    try {
        const { name, id_number, email, gender, password, confirm_password } = req.body;

        if (password !== confirm_password) return res.status(401).send({ message: 'sandi tidak cocok' });

        // hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        await modelUser.create({
            id_user: nanoid(8), identity_number: id_number, name, gender, email, id_role: 1, password: hashedPassword
        });

        res.status(200).json({
            message: 'sukses regis user'
        });

    } catch (error) {
        // Handling Sequelize unique constraint error
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0].path; // mendapatkan field yang duplikat
            return res.status(409).json({
                message: `${field} sudah terdaftar`,
                field: field
            });
        }

        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'masukkan email dan password!' });

        let userData = await modelUser.findOne({
            where: { email },
            attributes: ['password'],
            include: {
                model: modelRole,
                attributes: ['role_name']
            }
        });

        if (!userData || !(bcrypt.compareSync(password, userData.password))) {
            return res.status(400).json({ message: 'Email atau Kata Sandi tidak valid' })
        };

        const token = jwt.sign({ email, role: userData.role.role_name }, env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).json({
            message: 'sukses login',
            data: { token }
        });

    } catch (error) {
        next(error);
    }
};

const logoutUser = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        const token = authHeader?.split(' ')[1];

        if (!token || token === 'null') {
            return res.status(401).json({ message: 'Tidak ada token atau sudah logout sebelumnya' });
        }

        jwt.verify(token, env.JWT_SECRET, async (err, user) => {
            if (err) {
                console.error(err);
                return res.status(401).json({ message: err });
            }

            return res.status(200).json({ message: `User ${user.email} berhasil logout` });
        });
    } catch (error) {
        next(error);
    }
};

export { registUser, loginUser, logoutUser };
