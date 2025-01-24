import { env } from 'node:process';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createTransport } from 'nodemailer';
import { randomBytes } from 'crypto'
import { Op } from 'sequelize';

import modelRole from '../models/roles.js';
import modelUser from '../models/users.js';
import modelResetToken from '../models/reset_token.js';

// Konfigurasi email (gunakan environment variables di production)
const transporter = createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: env.EMAIL_USERNAME,
        pass: env.EMAIL_PASSWORD
    }
});

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

const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const dataUser = await modelUser.findOne({
            where: { email }
        });
        if (!dataUser) return res.status(404).json({ message: 'Email tidak terdaftar dalam sistem' });

        // Generate token unik
        const token = randomBytes(32).toString('hex');
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 1); // Token berlaku 1 jam

        await modelResetToken.create({
            id_user: dataUser.dataValues.id_user,
            token, used: false,
            expiry_date: tokenExpiry
        });

        const resetLink = `${env.FRONTEND_URL}reset-pw?token=${token}`;
        const mailOptions = {
            from: env.EMAIL_USERNAME,
            to: email,
            subject: 'Reset Password SIPP DSI Universitas Andalas',
            html: `
              <h2>Reset Password</h2>
              <p>Silakan klik tautan di bawah ini untuk mereset password Anda:</p>
              <a href="${resetLink}">${resetLink}</a>
              <p>Tautan ini akan kadaluarsa dalam 1 jam.</p>
              <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
            `
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email reset password telah dikirim' });

    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { token, password, confirm_password } = req.body;

        // Validasi password
        if (password !== confirm_password) {
            return res.status(400).json({ message: 'Password dan konfirmasi password tidak cocok' });
        };

        // Cek token di database
        const resetToken = await modelResetToken.findOne({
            where: {
                token,
                used: false,
                expiry_date: {
                    [Op.gt]: new Date() // Token belum kadaluarsa
                }
            }
        });
        if (!resetToken) return res.status(400).json({ message: 'Token tidak valid atau sudah kadaluarsa' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await modelUser.update(
            { password: hashedPassword },
            { where: { id_user: resetToken.dataValues.id_user } }
        );

        // Tandai token sudah digunakan
        await resetToken.update({ used: true });
        console.info('password berhasil diperbarui')
        res.status(200).json({ message: 'Password berhasil direset' });
    } catch (error) {
        next(error);
    }
};

const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        const dataUser = await modelUser.findByPk(req.user.id_user, { attributes: ['id_user', 'password'] });
        if (!bcrypt.compareSync(currentPassword, dataUser.dataValues.password)) {
            return res.status(404).json({ message: 'sandi anda salah!' })
        }

        if (newPassword != confirmPassword) {
            return res.status(404).json({ message: 'kata sandi tidak sesuai!' });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await dataUser.update({
            password: hashedPassword
        });

        res.status(200).json({
            message: 'sukses perbarui sandi'
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { id_number, name, gender, email } = req.body;

        const dataUser = await modelUser.findByPk(req.user.id_user, {
            attributes: ['id_number', 'name', 'gender', 'email']
        });

        if (email != dataUser.dataValues.email) {
            
        }

    } catch (error) {
        next(error);
    }
}

export { registUser, loginUser, logoutUser, forgetPassword, resetPassword, updatePassword, updateProfile };
