import { Request, Response, Router } from 'express';
import { MongoDB } from '../database/mongo';

const router = Router();

router.get('/status/server', (_req: Request, res: Response) => {
	res.send({ message: 'Running' });
});

router.get('/status/mongo', (_req: Request, res: Response) => {
	res.send({ message: MongoDB.getInstance().getStatus() });
});

export default router;
