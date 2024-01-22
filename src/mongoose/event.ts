import { Schema, model } from 'mongoose';
import { IEvent } from 'src/models/event';

const EventSchema = new Schema<IEvent>({
    name: { type: String, required: true },
    message: { type: String, required: true },
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

EventSchema.index({ name: 1 }, { unique: true });

const EventModel = model('Event', EventSchema);

export { EventModel };