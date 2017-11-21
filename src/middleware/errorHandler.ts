import * as express from 'express';
import { IError } from '../shared';

export function errorHandler(err: IError, req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (err.statusCode) {
        res.status(err.statusCode).send({
            message: err.message
        });
    } else {
        res.status(500).send({
            message: err.message
        });
    }
}
