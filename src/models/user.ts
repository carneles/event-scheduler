export interface IUser {
    id?: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
};

export interface IUserCreateRequest {
    firstName: string;
    lastName: string;
    birthDate: string;
}

export interface IUserResponse {
    id?: string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IUserUpdateRequest {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
}