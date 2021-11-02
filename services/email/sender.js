const nodemailer = require('nodemailer');
require('dotenv').config();


const PASSWORD = process.env.PASSWORD;
class CreateSender {
    async send(message) {
        const config = {
            host: 'smtp.meta.ua',
            port: 465,
            secure: true,
            auth: {
                user: 'v.rzhanov@meta.ua',
                pass: PASSWORD,
            },
        };
        
        const transporter = nodemailer.createTransport(config);
        try {
            const result = await transporter.sendMail({ ...message, from: 'v.rzhanov@meta.ua' });
        return result
        } catch (error) {
            console.log(error);
        }
    };
};

module.exports = {CreateSender};