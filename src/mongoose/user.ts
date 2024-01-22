import { Schema, model } from 'mongoose';
import { IUser } from '../models/user';

const UserSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    birthDate: { type: Date, required: true },
    timezone: { type: String, required: true },
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

const UserModel = model('User', UserSchema);

export { UserModel };