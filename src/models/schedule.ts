export interface ISchedule {
    id?: string;
    jobId: string;
    email: string;
    message: string;
    scheduledSendDate: Date;
    retry: number;
    status: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};