import { Router } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { IUser, UserModel } from '../types/User';
import Config from '../config/config';

const User = mongoose.model<IUser, UserModel>('User');

const router = Router();

const secretKey = Config.getInstance().params.secretKey;

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, userType = 'customer' } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .send({ message: 'Mush provide email and password' });
    }
    const user = new User({ email, password, name, userType });
    await user.save();

    const token = jwt.sign({ userId: user._id, email, name }, secretKey);

    res.send({ token, email, name, userType });
  } catch (error) {
    res.status(422).send({ message: 'Email already in use' });
  }
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).send({ message: 'Mush provide email and password' });
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        user
          .comparePassword(password)
          .then(() => {
            const token = jwt.sign(
              { userId: user._id, email: user.email, name: user.name },
              secretKey
            );
            res.send({
              token,
              email: user.email,
              name: user.name,
              userType: user.userType,
            });
          })
          .catch(() => {
            return res
              .status(422)
              .send({ message: 'Invalid email or password' });
          });
      } else {
        return res.status(422).send({ message: 'Invalid email or password' });
      }
    })
    .catch(() => {
      return res.status(422).send({ message: 'Invalid email or password' });
    });
});

export default router;
