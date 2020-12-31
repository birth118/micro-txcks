import { CustomError } from './custom-error';
export declare class NotAuthorised extends CustomError {
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
