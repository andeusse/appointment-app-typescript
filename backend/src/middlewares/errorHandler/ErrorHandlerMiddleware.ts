import { Request, Response, NextFunction } from 'express';

import { Error } from './Error';

export function handleError(
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction
) {
	res.status(err.status).send(err.message);
}
