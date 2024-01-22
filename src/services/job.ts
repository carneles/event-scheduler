import moment from "moment-timezone";
import { EventModel } from "src/mongoose/event";
import { env } from "src/env"
import { IUserEvent } from "src/models/user_event";
import  Queue from "bee-queue";
import { ScheduleModel } from "src/mongoose/schedule";
import { UserEventModel } from "src/mongoose/user_event";
import { IUser } from "src/models/user";
import { UserModel } from "src/mongoose/user";
import { IEvent } from "src/models/event";
import { ISchedule } from "src/models/schedule";
import axios from 'axios';

export class JobService {
    public constructor() {
    }
    
    private async updateSchedule(jobId: string, status: string) {
        switch (status) {
            case 'IN_PROGRESS':
                await ScheduleModel.findOneAndUpdate({ jobId: jobId }, { status: 'IN_PROGRESS' });
                break;
            case 'SUCCESS':
                await ScheduleModel.findOneAndUpdate({ jobId: jobId }, { status: 'SUCCECSS' });
                break;
            case 'FAILED':
                const schedule: ISchedule | null = await ScheduleModel.findOne({ jobId: jobId });
                if (!schedule) {
                    break;
                }
                if (schedule.retry < parseInt(env.MESSAGE_SEND_MAX_RETRY)) {
                    schedule.retry += 1;
                }
                schedule.scheduledSendDate = moment(schedule.scheduledSendDate).add(1, 'day').toDate();
                await ScheduleModel.findOneAndUpdate({ jobId: jobId }, { ...schedule });
                break;
        };
    }

    async findAndSendGreetings() {
        const now = moment.utc();
        const startOfHour = now.startOf('hour').format('YYYY-MM-DDTHH:mm:ssZ');
        const endOfHour = now.endOf('hour').format('YYYY-MM-DDTHH:mm:ssZ');

        const queue = new Queue('greeting');

        const userEvents: IUserEvent[] = await UserEventModel.find({ date: { $gte: startOfHour, $lte: endOfHour} }).lean();
        for (const userEvent of userEvents) {
            const user: IUser | null = await UserModel.findById(userEvent.id);
            const event: IEvent | null = await EventModel.findById(userEvent.eventId);
            const jobId = user?.id + userEvent.date.toTimeString()
            const message = event?.message.
                replaceAll('{firstName}', user?.firstName || '').
                replaceAll('{lastName}', user?.lastName || '')
            const schedule: ISchedule = await ScheduleModel.create({
                jobId: jobId,
                scheduledSendDate: userEvent.date,
                email: user?.email,
                retry: 0,
                message: message,
                status: 'NEW'
            })
            const job: Queue.Job<ISchedule> = queue.createJob(schedule);
            job.save();
            job.on('succeeded', async (result: any) => {
                await this.updateSchedule(result.id, 'SUCCESS');
            });
            job.on('progress', async (result: any) => {
                await this.updateSchedule(result.id, 'IN_PROGRESS');
            });
            job.on('failed', async (result: any) => {
                await this.updateSchedule(result.id, 'FAILED');
            });
        }
        // process retry
        const schedules: ISchedule[] = await ScheduleModel.find({ status: 'FAILED', scheduledSendDate: { $gte: startOfHour, $lte: endOfHour }, retry: { $gt: 0, $lte: parseInt(env.MESSAGE_SEND_MAX_RETRY) } }).lean();
        for (const schedule of schedules) {
            const job: Queue.Job<ISchedule> = queue.createJob(schedule);
            job.save();
            job.on('succeeded', async (result: any) => {
                await this.updateSchedule(result.id, 'SUCCESS');
            });
            job.on('progress', async (result: any) => {
                await this.updateSchedule(result.id, 'IN_PROGRESS');
            
            });
            job.on('failed', async (result: any) => {
                await this.updateSchedule(result.id, 'FAILED');
            });
        }

        queue.process(async (job: Queue.Job<ISchedule>) => {
             const { status } = await axios.post('https://email-service.digitalenvision.com.au/send-email', {
                email: job.data.email,
                message: job.data.message
            });
            if (status === 200 || status === 201) {
                return job.id
            }
            else {
                throw new Error('JOB_FAILED')
            }
        })
    }    
}