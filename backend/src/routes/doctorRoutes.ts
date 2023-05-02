import { Router, Request, Response } from 'express';
import mongoose, { Error } from 'mongoose';
import { IUser, UserModel } from '../types/User';
import requireAuth from '../middlewares/requireAuthHandler/RequireAuthHandlerMiddleware';
import requireAdminAuth from '../middlewares/requireAdminAuthHandler/RequireAdminAuthHandlerMiddleware';
import { UserType } from '../types/usertype';

const User = mongoose.model<IUser, UserModel>('User');

const router = Router();

router.use(requireAuth).get('/doctors', async (req: Request, res: Response) => {
  const doctors = await User.find({ userType: UserType.Doctor });
  return res.status(200).send(doctors);
});

router.use(requireAdminAuth).post('/doctors', async (req, res) => {
  try {
    const { email, password, name, userType = UserType.Doctor } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .send({ message: 'Mush provide email and password' });
    }
    const user = new User({ email, password, name, userType });
    await user.save();

    res.send({ email, name, userType });
  } catch (error) {
    res.status(422).send({ message: 'Email already in use' });
  }
});

export default router;
