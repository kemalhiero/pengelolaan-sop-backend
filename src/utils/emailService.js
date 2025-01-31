import { createTransport } from 'nodemailer';
import { env } from 'node:process';

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

const sendEmail = async (to, subject, html) => {
    const mailOptions = {
        // from: env.EMAIL_FROM,
        to,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;
