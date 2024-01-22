import { IEvent, IEventCreateRequest, IEventResponse } from "../models/event";
import { EventModel } from "../mongoose/event"
import moment from "moment";
import { env } from "../env"
import { StandardError } from "src/utils/standard_error";

export interface IEventService {
    create(request: IEventCreateRequest): Promise<IEventResponse>;
}

export class EventService implements IEventService {

    public constructor() {
    }

    private validate(event: IEventCreateRequest) {
        switch (true) {
            case !event.name:
                throw new StandardError('ERR_INVALID_REQUEST', 'Name cannot empty.');
            case !event.message:
                throw new StandardError('ERR_INVALID_REQUEST', 'Message cannot empty.');
            default:
                break;
        }
    }

    public async create(request: IEventCreateRequest): Promise<IEventResponse> {
        this.validate(request)
        const event: IEvent = {
            name: request.name || '',
            message: request.message || '',
        }
        const eventModel = new EventModel<IEvent>(event);

        const result = await eventModel.save();

        const response: IEventResponse = {
            data: {
                id: result.id,
                name: result.name,
                message: result.message,
                createdAt: moment(result.createdAt).format(env.DATE_TIME_FORMAT),
                updatedAt: moment(result.updatedAt).format(env.DATE_TIME_FORMAT),
            }
        }
        return response;
    }
}