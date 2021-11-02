const nodemailer = require('nodemailer');
require('dotenv').config();

const SENDER_HOST = process.env.SENDER_HOST;
const SENDER_PORT = process.env.SENDER_PORT;
const PASSWORD = process.env.PASSWORD;
const EMAIL = process.env.EMAIL;

class CreateSender {
    async send(message) {
        const config = {
            host: SENDER_HOST,
            port: SENDER_PORT,
            secure: true,
            auth: {
                user: EMAIL,
                pass: PASSWORD,
            },
        };
        
        const transporter = nodemailer.createTransport(config);
        try {
            const result = await transporter.sendMail({ ...message, from: EMAIL });
        return result
        } catch (error) {
            console.log(error);
        }
    };
};

module.exports = {CreateSender};