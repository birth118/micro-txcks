import { CustomError } from './custom-error';
export declare class BadRequestError extends CustomError {
    statusCode: number;
    message: string;
    constructor(msg: string);
    serializeErrors(): {
        message: string;
    }[];
}
