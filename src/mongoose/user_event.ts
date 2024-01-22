import { Schema, model } from 'mongoose';
import { IUserEvent } from 'src/models/user_event';

const UserEventSchema = new Schema<IUserEvent>({
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

UserEventSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const UserEventModel = model('UserEvent', UserEventSchema);

export { UserEventModel };