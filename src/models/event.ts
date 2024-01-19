import mongoose, { Schema } from 'mongoose';

const EventSchema = new Schema({
    name: { type: String, required: true },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id.toString();

            delete ret._id;
            delete ret.__v;

            return ret;
        },
    },
});

const EventModel = mongoose.model('Event', EventSchema);

export { EventModel };
