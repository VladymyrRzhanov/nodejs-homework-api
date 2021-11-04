const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { Schema, model, SchemaTypes } = require('mongoose');
const { SubscriptionType } = require('../config/constants');

const SALT_FACTOR = 6;

const option = {
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
        type: SchemaTypes.String,
        required: [true, 'Email is required'],
        unique: true,
        validate(value) {
            const re = /\S+@\S+.\S+/
            return re.test(String(value).toLowerCase())
        }
    },
    password: {
        type: SchemaTypes.String,
        required: [true, 'Password is required'],
    },
    subscription: {
        type: SchemaTypes.String,
        enum: [SubscriptionType.STARTER, SubscriptionType.PRO, SubscriptionType.BUSINESS],
        default: SubscriptionType.STARTER
    },
    token: {
        type: SchemaTypes.String,
        default: null,
    },
    avatar: {
        type: SchemaTypes.String,
        default: function () {
            return gravatar.url(this.email, { s: '250' }, true);
        }
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verifyToken: {
        type: String,
        required: [true, 'Verify token is required'],
        default: uuidv4()
    }
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