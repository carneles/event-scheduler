import mongoose, { Schema } from 'mongoose';

const UserEventSchema = new Schema({
    userId: { type: String, required: true },
    eventId: { type: String, required: true },
    date: { type: Date, required: true}
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    toJSON: {
        transform: function (_, ret) {
            ret.id = ret._id.toString();

            delete ret._id;
            delete ret.__v;

            return ret;
        },
    },
});

const UserEvent = mongoose.model('UserEvent', UserEventSchema);

export { UserEvent };
