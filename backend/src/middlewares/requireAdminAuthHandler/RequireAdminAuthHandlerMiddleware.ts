import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import { RequestWithUser, UserIDJwtPayload } from '../../types/User';
import Config from '../../config/config';
import { UserType } from '../../types/usertype';
import User from '../../models/User';

const secretKet = Config.getInstance().params.secretKey;

const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ error: 'You must be log in as admin' });
  }

  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, secretKet, async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: 'You must be log in as admin' });
    }

    const { userId } = <UserIDJwtPayload>payload;
    const user = await User.findById(userId);
    if (user && user.userType === UserType.Admin) {
      (<RequestWithUser>req).user = user;
    } else {
      return res.status(401).send({ error: 'User not found' });
    }
    next();
  });
};

export default requireAdminAuth;
