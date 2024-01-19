import { Router, Request, Response } from "express";
import { UserService } from "../services/user.js";
import { IUserCreateRequest, IUserResponse, IUserUpdateRequest } from "../models/user.js";

export class UserController {
    private router: Router;
    private userService: UserService;

    constructor(userService: UserService) {
        this.router = Router();
        this.router.post('/', this.create.bind(this));
        this.router.get('/:id', this.getById.bind(this));
        this.userService = userService;
    }

    getRouter() {
        return this.router;
    }

    async getById(req: Request, res: Response) {
        const id = req.params.id;
        const result: IUserResponse = await this.userService.getById(id);
        return res.status(200).json(result);
    }

    async create(req: Request, res: Response) {
        const request: IUserCreateRequest = req.body;
        const result: IUserResponse = await this.userService.create(request);
        return res.status(200).json(result);
    }

    async update(req: Request, res: Response) {
        const id = req.params.id;
        const request: IUserUpdateRequest = req.body;
        const result: IUserResponse = await this.userService.update(id, request);
        return res.status(200).json(result);
    }
}