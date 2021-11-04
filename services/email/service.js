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
                name: 'Phonebook',
                link: this.link
            }
        });

        const email = {
            body: {
                intro: "Welcome to Phonebook! We're happy you signed up to us.",
                action: {
                    instructions: 'This link will verify your email address, and then you&#8217;ll officially be a part of the Phonebook community.',
                    button: {
                        color: '#fda65c',
                        text: 'Verify your email address',
                        link: `${this.link}/api/users/verify/${verifyToken}`,
                        logo: 'https://cdn4.iconfinder.com/data/icons/business-finance-vol-12-2/512/1-512.png'
                    }
                },
                outro: 'See you there! Best regards, the Phonebook team'
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