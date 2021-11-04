const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema, model, SchemaTypes } = require('mongoose');

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
        type: SchemaTypes.String,
        required: [true, 'Set name for contact']
    },
    email: {
        type: SchemaTypes.String,
    },
    phone: {
        type: SchemaTypes.String,
    },
    owner: {
        type: SchemaTypes.ObjectId,
        ref: 'user',
    },
    favourite: {
        type: SchemaTypes.Boolean,
        default: false,
    },
},
    option
);

contactSchema.plugin(mongoosePaginate);

const Contact = model('contact', contactSchema);

module.exports = Contact;