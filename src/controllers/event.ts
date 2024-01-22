import { Router, Request, Response } from "express";
import { IUserResponse } from "../models/user";
import { StandardError } from "src/utils/standard_error";
import { EventService } from "src/services/event";
import { IEventCreateRequest, IEventResponse } from "src/models/event";

export class EventController {
    private router: Router;
    private eventService: EventService;

    constructor(eventService: EventService) {
        this.router = Router();
        this.router.post('/', this.create.bind(this));
        this.eventService = eventService;
    }

    getRouter() {
        return this.router;
    }

    private processError(err: StandardError): IUserResponse {
        const errResponse: IUserResponse = {
            error: {
                code: err.code,
                name: err.code,
                message: err.message
            }
        }
        return errResponse
    }

    async create(req: Request, res: Response) {
        const request: IEventCreateRequest = req.body;
        try {
            const result: IEventResponse = await this.eventService.create(request);
            return res.status(201).json(result);
        } catch (err: StandardError | any) {
            const errRes = this.processError(err);
            const { code } = err;
            switch (code) {
                case 'ERR_INVALID_REQUEST':
                    return res.status(400).json(errRes);
                default:
                    return res.status(500).json({ error: 'Internal server error' })
            }
        }
    }
}