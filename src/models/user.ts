import { StandardError } from "src/utils/standard_error";

export interface IUser {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    timezone?: string;
    birthDate: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};

export interface IUserCreateRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    birthDate?: string;
    timezone?: string;
}

export interface IUserResponse {
    error?: StandardError
    data?: IUser
}

export interface IUserUpdateRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    timezone?: string;
    birthDate?: string;
}