import { IUser, IUserCreateRequest, IUserResponse } from "../models/user";
import { UserModel } from "../mongoose/user"
import moment from "moment-timezone";
import { env } from "../env"
import { StandardError } from "src/utils/standard_error";
import { EventModel } from "src/mongoose/event";
import { IUserEvent } from "src/models/user_event";
import { UserEventModel } from "src/mongoose/user_event";
import { IEvent } from "src/models/event";

export interface IUserService {
    create(request: IUserCreateRequest): Promise<IUserResponse>;
    getById(id: string): Promise<IUserResponse>;
    //update(id: string, request: IUserUpdateRequest): Promise<IUserResponse>;
}

export class UserService implements IUserService {

    public constructor() {
    }

    private validate(user: IUserCreateRequest) {
        switch (true) {
            case !user.firstName:
                throw new StandardError('ERR_INVALID_REQUEST', 'Firstname cannot empty.');
            case !user.lastName:
                throw new StandardError('ERR_INVALID_REQUEST', 'Lastname cannot empty.');
            case !user.birthDate:
                throw new StandardError('ERR_INVALID_REQUEST', 'Birthdate cannot empty.');
            case !user.timezone:
                throw new StandardError('ERR_INVALID_REQUEST', 'Timezone cannot empty.');
            default:
                break;
        }
    }

    public async create(request: IUserCreateRequest): Promise<IUserResponse> {
        this.validate(request)
        const user: IUser = {
            firstName: request.firstName || '',
            lastName: request.lastName || '',
            email: request.email || '',
            birthDate: moment.tz(request.birthDate || '', env.DATE_FORMAT, request.timezone || '').toDate(),
            timezone: request.timezone || ''
        }
        const result: IUser = await UserModel.create(user);

        const event: IEvent | null = await EventModel.findOne({ name: 'BIRTHDAY' });
        if (event && event !== null) { // we don't want to break user experience
            // user enter birthday usually in their local time
            const localEventDate = moment.tz(request.birthDate || '', env.DATE_FORMAT, request.timezone || '');
            // add send time so message will be sent at that local time
            const utcEventDate = localEventDate.clone().add({ hour: parseInt(env.MESSAGE_SEND_TIME, 10) }).utc();

            const userEvent: IUserEvent = {
                userId: result.id || '',
                eventId: event.id || '',
                date: utcEventDate.toDate(),
            }
            await UserEventModel.create(userEvent)
        }
    
        const response: IUserResponse = {
            data: {
                id: result.id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                birthDate: moment(result.birthDate).format(env.DATE_FORMAT),
                createdAt: moment(result.createdAt).format(env.DATE_TIME_FORMAT),
                updatedAt: moment(result.updatedAt).format(env.DATE_TIME_FORMAT),
                timezone: result.timezone,
            }
        }
        return response;
    }

    public async getById(id: string): Promise<IUserResponse> {
        const result = await UserModel.findById(id);
        if (!result) {
            throw new StandardError('ERR_USER_NOT_FOUND', 'User not found.');
        }
        const response: IUserResponse = {
            data: {
                id: result?.id,
                firstName: result?.firstName,
                lastName: result?.lastName,
                email: result?.email,
                birthDate: moment(result?.birthDate).format(env.DATE_FORMAT),
                createdAt: moment(result?.createdAt).format(env.DATE_TIME_FORMAT),
                updatedAt: moment(result?.updatedAt).format(env.DATE_TIME_FORMAT),
                timezone: result.timezone,
            }
        }
        return response;
    }
/*
    public async update(id: string, request: IUserUpdateRequest): Promise<IUserResponse> {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new StandardError('ERR_USER_NOT_FOUND', 'User not found.');
        }
        if (request.firstName != undefined) {
            user.firstName = request.firstName;
        }
        if (request.lastName != undefined) {
            user.lastName = request.lastName;
        }
        if (request.birthDate != undefined) {
            user.birthDate = moment(request.birthDate, env.DATE_FORMAT).toDate();
        }
        if (request.timezone != undefined) {
            user.timezone = request.timezone;
        }

        await UserModel.findOneAndUpdate({ _id: id }, { ...user }, { new: true })

        if (request.birthDate != undefined || request.timezone != undefined) {
            const event: IEvent | null = await EventModel.findOne({ name: 'BIRTHDAY' });
            if (event && event !== null) { // we don't want to break user experience
                // user enter birthday usually in their local time
                const localEventDate = moment.tz(user.birthDate.toString(), env.DATE_FORMAT, user.timezone || '');
                const utcEventDate = localEventDate.clone().utc();

                const oldUserEvent = await UserEvent.find()
                const userEvent: IUserEvent = {
                    userId: result.id || '',
                    eventId: event.id || '',
                    date: utcEventDate.toDate(),
                }
                await UserEventModel.create(userEvent)
            }
        }

        const response: IUserResponse = {
            data: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                birthDate: moment(user.birthDate).format(env.DATE_FORMAT),
                createdAt: moment(user.createdAt).format(env.DATE_TIME_FORMAT),
                updatedAt: moment(user.updatedAt).format(env.DATE_TIME_FORMAT),
                timezone: user.timezone,
            }
        }
        return response;

    }*/
}