import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { IUser, UserModel } from '../types/User';
import requireAuth from '../middlewares/requireAuthHandler/RequireAuthHandlerMiddleware';
import requireAdminAuth from '../middlewares/requireAdminAuthHandler/RequireAdminAuthHandlerMiddleware';
import { UserType } from '../types/usertype';

const User = mongoose.model<IUser, UserModel>('User');

const router = Router();

router.use(requireAuth).get('/doctors', async (req: Request, res: Response) => {
  const doctors = await User.find({ userType: UserType.Doctor }).select(
    '-password'
  );
  return res.status(200).send(doctors);
});

router
  .use(requireAdminAuth)
  .get('/users', async (req: Request, res: Response) => {
    const users = await User.find().select('-password');
    return res.status(200).send(users);
  });

router.use(requireAdminAuth).post('/users', async (req, res) => {
  try {
    const { email, password, name, userType = UserType.Doctor } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .send({ message: 'Mush provide email and password' });
    }
    const user = new User({ email, password, name, userType });
    await user.save();

    return res.send({ email, name, userType });
  } catch (error) {
    return res.status(422).send({ message: 'Email already in use' });
  }
});

router.use(requireAdminAuth).put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const update = req.body;

    if (!(await User.findById(userId))) {
      return res.status(422).send({ message: 'User not found' });
    } else {
      await User.findByIdAndUpdate(userId, update);
      const { password, ...data } = update;
      return res.send({ _id: userId, ...data });
    }
  } catch (error) {
    return res.status(422).send({ message: 'Error saving the user' });
  }
});

export default router;
