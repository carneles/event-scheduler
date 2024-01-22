import { Router, Request, Response } from "express";
import { UserService } from "../services/user";
import { IUserCreateRequest, IUserResponse } from "../models/user";
import { StandardError } from "src/utils/standard_error";

export class UserController {
    private router: Router;
    private userService: UserService;

    constructor(userService: UserService) {
        this.router = Router();
        this.router.post('/', this.create.bind(this));
        this.router.get('/:id', this.getById.bind(this));
        //this.router.patch('/:id', this.update.bind(this));
        this.userService = userService;
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

    async getById(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const result: IUserResponse = await this.userService.getById(id);

            return res.status(200).json(result);
        } catch (err: StandardError | any) {
            const errRes = this.processError(err);
            const { code } = err;
            switch (code) {
                case 'ERR_USER_NOT_FOUND':
                    return res.status(400).json(errRes);
                default:
                    return res.status(500).json({ error: 'Internal server error' })
            }
        }
    }

    async create(req: Request, res: Response) {
        const request: IUserCreateRequest = req.body;
        try {
            const result: IUserResponse = await this.userService.create(request);
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

    /*async update(req: Request, res: Response) {
        const id = req.params.id;
        const request: IUserUpdateRequest = req.body;
        try {
            const result: IUserResponse = await this.userService.update(id, request);
            return res.status(200).json(result);
        } catch (err: StandardError | any) {
            const errRes = this.processError(err);
            const { code } = err;
            switch (code) {
                case 'ERR_USER_NOT_FOUND':
                    return res.status(400).json(errRes);
                default:
                    return res.status(500).json({ error: 'Internal server error' })
            }
        }
    }*/
}