import { Router, Request, Response } from 'express';
import requireAuth from '../middlewares/requireAuthHandler/RequireAuthHandlerMiddleware';
import requireAdminAuth from '../middlewares/requireAdminAuthHandler/RequireAdminAuthHandlerMiddleware';
import { UserType } from '../types/usertype';
import User from '../models/User';

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
  const { email, password, name, userType = UserType.Customer } = req.body;

  if (!email || !password || !name) {
    return res
      .status(422)
      .send({ message: 'Mush provide email, name and password' });
  }

  const user = new User({ email, password, name, userType });

  user
    .save()
    .then(() => {
      return res.send({ email, name, userType });
    })
    .catch((error: Error) => {
      return res.status(422).send({ message: 'Email already in use' });
    });
});

router.use(requireAdminAuth).put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { email, password, name, userType } = req.body;

  const user = await User.findById(userId);
  if (user) {
    let isSamePassword: boolean | Error = true;
    if (password) {
      try {
        isSamePassword = await user.comparePassword(password);
      } catch (error) {
        return res.status(422).send({
          message: `Error changing the password, try again\n${error}`,
        });
      }
    }
    if (isSamePassword) {
      return res.status(422).send({ message: `Password is the same` });
    }
    user.password = password;
    user.email = email ? email : user.email;
    user.name = name ? name : user.name;
    user.userType = userType ? userType : user.userType;
    user
      .save()
      .then(() => {
        return res.status(200).send(user);
      })
      .catch((error: Error) => {
        return res.status(500).send({ message: error.message });
      });
  } else {
    return res.status(422).send({ message: 'User not found' });
  }
});

router.use(requireAdminAuth).delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  User.findByIdAndDelete(userId)
    .then(() => {
      return res.status(200).send({ message: 'User deleted' });
    })
    .catch((error: Error) => {
      return res.status(500).send({ message: error.message });
    });
});

export default router;
