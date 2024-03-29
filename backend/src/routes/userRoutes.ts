import { Router, Request, Response } from 'express';
import { UserType } from '../types/usertype';
import User from '../models/User';
import { RequestWithUser } from '../types/User';

const router = Router();

router.get('/users', async (req: Request, res: Response) => {
  const filter = req.query.filter as UserType | undefined;

  let users = [];
  if (filter !== undefined) {
    users = (await User.find().select('-password')).filter(
      (a) => a.userType === filter
    );
  } else {
    users = await User.find().select('-password');
  }
  return res
    .status(200)
    .send(
      users.sort((a, b) =>
        a.userType > b.userType
          ? 1
          : a.userType === b.userType
          ? a.name > b.name
            ? 1
            : -1
          : -1
      )
    );
});

router.post('/users', async (req, res) => {
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

router.put('/user', async (req, res) => {
  const reqUser = (<RequestWithUser>req).user;
  const user = await User.findById(reqUser._id);
  const { email, password, name, userType } = req.body;

  if (user) {
    let isSamePassword: boolean | Error = false;
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
    user.password = password ? password : user.password;
    user.email = email ? email : user.email;
    user.name = name ? name : user.name;
    user.userType = userType ? userType : user.userType;
    user
      .save()
      .then(() => {
        return res.status(200).send({
          email: user.email,
          name: user.name,
          userType: user.userType,
        });
      })
      .catch((error: Error) => {
        return res.status(500).send({ message: error.message });
      });
  } else {
    return res.status(422).send({ message: 'User not found' });
  }
});

router.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { email, password, name, userType } = req.body;

  const user = await User.findById(userId);
  if (user) {
    let isSamePassword: boolean | Error = false;
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
    user.password = password ? password : user.password;
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

router.delete('/users/:id', async (req, res) => {
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
