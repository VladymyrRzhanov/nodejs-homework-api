const { Schema, model } = require('mongoose');
const { SubscriptionType } = require('../config/constants');
const bcrypt = require('bcryptjs');

const SALT_FACTOR = 6;

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

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate(value) {
            const re = /\S+@\S+.\S+/
            return re.test(String(value).toLowerCase())
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    subscription: {
        type: String,
    enum: [SubscriptionType.STARTER, SubscriptionType.PRO, SubscriptionType.BUSINESS],
    default: SubscriptionType.STARTER
    },
    token: {
        type: String,
        default: null,
    },
},
    option
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(SALT_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next()
});

userSchema.methods.isValidPassword = async function (password) {
    return bcrypt.compare(password, this.password)
};

const User = model('user', userSchema);

module.exports = User;