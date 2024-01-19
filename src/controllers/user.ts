import { Router, Request, Response } from "express";

export class UserController {
    private router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/', this.get.bind(this));
    }

    getRouter() {
        return this.router;
    }

    async get(_: Request, res: Response) {
        return res.status(200).json({ desc: "hello"});
    }
}