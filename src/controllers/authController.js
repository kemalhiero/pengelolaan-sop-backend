import { randomBytes, randomInt } from 'crypto'
import { env } from 'node:process';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';

import sendEmail from '../utils/emailService.js';
import modelRole from '../models/roles.js';
import modelUser from '../models/users.js';
import modelResetToken from '../models/reset_token.js';
import modelVerificationCode from '../models/verification_code.js';
import isInstitutionalEmail from '../utils/isInstitutionalEmail.js';

const registUser = async (req, res, next) => {
    try {
        const { name, id_number, email, gender, password, confirm_password } = req.body;

        if (!isInstitutionalEmail(email)) return res.status(400).json({ message: 'Email harus menggunakan domain student.unand.ac.id atau it.unand.ac.id' });
        if (password !== confirm_password) return res.status(401).send({ message: 'sandi tidak cocok' });

        // hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        await modelUser.create({
            id_user: nanoid(8), identity_number: id_number, name, gender, email, id_role: 1, password: hashedPassword
        });

        return res.status(200).json({
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
        const { idnumber, password } = req.body;
        if (!idnumber || !password) return res.status(400).json({ message: 'masukkan nim/nip dan password!' });

        let userData = await modelUser.findOne({
            where: { identity_number: idnumber },
            attributes: ['photo', 'password'],
            include: {
                model: modelRole,
                attributes: ['role_name']
            }
        });

        if (!userData || !(bcrypt.compareSync(password, userData.password))) {
            return res.status(400).json({ message: 'NIM/NIP atau Kata Sandi tidak valid' })
        };

        const token = jwt.sign({
            idnumber,
            role: userData.role.role_name,
            photo: userData.dataValues.photo ? `${env.CLOUDFLARE_R2_PUBLIC_BUCKET_URL}/${userData.dataValues.photo}` : null
        }, env.JWT_SECRET, { expiresIn: '30d' });

        return res.status(200).json({
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

            return res.status(200).json({ message: `User ${user.idnumber} berhasil logout` });
        });
    } catch (error) {
        next(error);
    }
};

const forgetPassword = async (req, res, next) => {
    try {
        const { idnumber } = req.body;

        const dataUser = await modelUser.findOne({
            where: { identity_number: idnumber },
            attributes: ['id_user', 'email']
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
        await sendEmail(
            dataUser.dataValues.email,
            'Reset Password SIPP DSI Universitas Andalas',
            `
                <h2>Reset Password</h2>
                <p>Silakan klik tautan di bawah ini untuk mereset password Anda:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>Tautan ini akan kadaluarsa dalam 1 jam.</p>
                <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
            `
        );

        return res.status(200).json({ message: 'Email reset password telah dikirim' });

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
        return res.status(200).json({ message: 'Password berhasil direset' });
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
        };

        if (newPassword != confirmPassword) {
            return res.status(404).json({ message: 'kata sandi tidak sesuai!' });
        };

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await dataUser.update({
            password: hashedPassword
        });

        return res.status(200).json({
            message: 'sukses perbarui sandi'
        });
    } catch (error) {
        next(error);
    }
};

// ubah email di halaman profil
const sendCode = async (req, res, next) => {
    try {
        const { newEmail } = req.body;
        if (!newEmail) return res.status(404).json({ message: 'tidak ada email!' });

        const user = await modelUser.findOne({
            where: { email: newEmail },
            attributes: ['email']
        });
        if (user) return res.status(404).json({ message: 'Email sudah terdaftar!' });

        const code = randomInt(100000, 999999).toString();
        await modelVerificationCode.create({                //simpan kode ke database
            id_user: req.user.id_user,
            code,
            expiry_date: new Date(Date.now() + 15 * 60 * 1000)      //kadaluarsa dalam 15 menit
        });

        await sendEmail(
            newEmail,
            'Verifikasi Email Baru SIPP DSI Universitas Andalas',
            `
                <h1>Verifikasi Email</h1>
                <p>Gunakan kode berikut untuk memverifikasi email baru anda:</p>
                <h2>${code}</h2>
                <p>Kode ini akan kadaluarsa dalam 15 menit.</p>
            `
        );

        return res.status(200).json({ message: 'Kode verifikasi telah dikirim!' });
    } catch (error) {
        next(error);
    }
};

const verifyCode = async (req, res, next) => {
    const { code } = req.body;

    try {
        // Cari kode verifikasi yang valid
        const verifCode = await modelVerificationCode.findOne({
            where: {
                id_user: req.user.id_user,
                code,
                used: false,
                expiry_date: {
                    [Op.gt]: new Date()   // belum kadaluarsa
                }
            }
        });
        if (!verifCode) return res.status(400).json({ message: 'Kode verifikasi tidak valid atau sudah kadaluarsa!' });
        await verifCode.update({ used: true });     // Tandai kode sebagai sudah digunakan

        return res.status(200).json({ message: 'Kode verifikasi valid!' });
    } catch (error) {
        next(error);
    }
};

const updateEmail = async (req, res, next) => {
    const { oldEmail, newEmail } = req.body;
    try {

        if (isInstitutionalEmail(newEmail)) {
            return res.status(400).json({ message: 'Email harus menggunakan domain student.unand.ac.id atau it.unand.ac.id' });
        }

        const user = await modelUser.findOne({
            where: { email: oldEmail },
            attributes: ['id_user']
        });
        if (!user) return res.status(404).json({ message: 'User tidak ditemukan!' });

        await sendEmail(
            newEmail,
            'Perubahan Alamat Email SIPP DSI Universitas Andalas',
            `
                <h1>Perubahan Alamat Email</h1>
                <p>Email Anda telah diubah dari ${oldEmail} menjadi ${newEmail}.</p>
                <p>Jika Anda tidak melakukan perubahan ini, segera hubungi pihak jurusan.</p>
            `
        );

        await user.update({ email: newEmail });

        return res.status(200).json({ message: 'Email berhasil diubah!' });
    } catch (error) {
        next(error);
    }
};

export {
    registUser, loginUser, logoutUser,
    forgetPassword, resetPassword, updatePassword,
    sendCode, verifyCode, updateEmail
};
