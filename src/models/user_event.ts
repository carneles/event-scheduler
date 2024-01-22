export interface IUserEvent {
    id?: string;
    userId: string;
    eventId: string;
    date: Date;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};