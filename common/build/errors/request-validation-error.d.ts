import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';
export declare class RequestValidationError extends CustomError {
    errors: ValidationError[];
    statusCode: number;
    constructor(err: ValidationError[]);
    serializeErrors(): {
        message: any;
        field: string;
    }[];
}
