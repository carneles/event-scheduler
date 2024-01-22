import { Schema, model } from 'mongoose';
import { ISchedule } from '../models/schedule';

const ScheduleSchema = new Schema<ISchedule>({
    jobId: { type: String, required: true },
    message: { type: String, required: true },
    scheduledSendDate: { type: Date, required: true },
    retry: { type: Number, required: true },
    status: { type: String, required: true }
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

const ScheduleModel = model('Schedule', ScheduleSchema);

export { ScheduleModel };