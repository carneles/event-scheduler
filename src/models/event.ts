import { StandardError } from "src/utils/standard_error";

export interface IEvent {
    id?: string;
    name: string;
    message: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};

export interface IEventCreateRequest {
    name?: string;
    message?: string;
}

export interface IEventResponse {
    error?: StandardError
    data?: IEvent
}