export class StandardError extends Error {
    code: string;

    context?: object | null;

    constructor(code: string, message: string, context?: object | null) {
        super();

        this.name = code;
        this.code = code;
        this.message = message;
        this.context = context;
    }
}