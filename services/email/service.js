const Mailgen = require('mailgen');
require('dotenv').config();

const LINK = process.env.LINK;

class EmailService {
    constructor(env,sender) {
        this.sender = sender;
        switch (env) {
            case 'development':
                this.link = LINK;
                break;
        case 'production':
                this.link = 'link for production';
                break;
            default:
                this.link = 'http://127.0.0.1:3000';
                break;
        }
    };

    createTemplateEmail(verifyToken) {
        const mailGenerator = new Mailgen({
            theme: 'cerberus',
            product: {
                name: 'Mailgen',
                link: this.link
            }
        });

        const email = {
            body: {
                intro: "Welcome to Phonebook! We're very excited to have you on board.",
                action: {
                    instructions: 'To get started with Mailgen, please click here:',
                    button: {
                        color: '#22BC66', // Optional action button color
                        text: 'Confirm your account',
                        link: `${this.link}/api/users/verify/${verifyToken}`
                    }
                },
            }
        };
        return mailGenerator.generate(email)
    }

    async sendVerifyEmail(email, verifyToken) {
        const emailHtml = this.createTemplateEmail(verifyToken);
        const message = {
            to: email,
            subject: 'Verify your email',
            html: emailHtml
        };
        try {
            const result = await this.sender.send(message)
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
}

module.exports = EmailService;