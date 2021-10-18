const { Schema, model } = require('mongoose');

const option =
{
    versionKey: false,
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (_doc, ret) {
            delete ret._id
            return ret
        }
    }
};

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact']
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favourite: {
        type: Boolean,
        default: false,
    },
},
    option
);

const Contact = model('contact', contactSchema);

module.exports = Contact;