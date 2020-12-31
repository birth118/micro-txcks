import e, { Request, Response, NextFunction } from 'express';
export declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => e.Response<any> | undefined;
