import { IUser, IUserCreateRequest, IUserResponse, IUserUpdateRequest } from "../models/user.js";
import { UserModel } from "../mongoose/user.js"
import moment from "moment";
import { env } from "../env.js"

export interface IUserService {
    create(request: IUserCreateRequest): Promise<IUserResponse>;
    getById(id: string): Promise<IUserResponse>;
    update(id: string, request: IUserUpdateRequest): Promise<IUserResponse>;
}

export class UserService implements IUserService {

    public constructor() {
    }

    public async create(request: IUserCreateRequest): Promise<IUserResponse> {
        const user: IUser = {
            firstName: request.firstName,
            lastName: request.lastName,
            birthDate: moment(request.birthDate, env.DATE_FORMAT).toDate()
        }
        const userModel = new UserModel<IUser>(user);

        const result = await userModel.save();

        const response: IUserResponse = {
            id: result.id,
            firstName: result.firstName,
            lastName: result.lastName,
            birthDate: moment(result.birthDate).format(env.DATE_FORMAT),
            createdAt: moment(result.createdAt).format(env.DATE_TIME_FORMAT),
            updatedAt: moment(result.updatedAt).format(env.DATE_TIME_FORMAT),
        }
        return response;
    }

    public async getById(id: string): Promise<IUserResponse> {
        const result = await UserModel.findById(id);
        const response: IUserResponse = {
            id: result?.id,
            firstName: result?.firstName,
            lastName: result?.lastName,
            birthDate: moment(result?.birthDate).format(env.DATE_FORMAT),
            createdAt: moment(result?.createdAt).format(env.DATE_TIME_FORMAT),
            updatedAt: moment(result?.updatedAt).format(env.DATE_TIME_FORMAT),
        }
        return response;
    }

    public async update(id: string, request: IUserUpdateRequest): Promise<IUserResponse> {
        const user = await UserModel.findById(id);
        if (user != undefined) {
            if (request.firstName != undefined) {
                user.firstName = request.firstName;
            }
            if (request.lastName != undefined) {
                user.lastName = request.lastName;
            }
            if (request.birthDate != undefined) {
                user.birthDate = moment(request.birthDate, env.DATE_FORMAT).toDate();
            }

            const result = await user.save();

            const response: IUserResponse = {
                id: result.id,
                firstName: result.firstName,
                lastName: result.lastName,
                birthDate: moment(result.birthDate).format(env.DATE_FORMAT),
                createdAt: moment(result.createdAt).format(env.DATE_TIME_FORMAT),
                updatedAt: moment(result.updatedAt).format(env.DATE_TIME_FORMAT),
            }
            return response;
        } else {
            throw new Error('ERR_USER_NOT_FOUND');
        }
    }
}