import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import IUser from '../types/IUser';

import Appointments from '../views/Appointments';
import Signin from '../views/Signin';
import Signup from '../views/Signup';
import Error from '../views/Error';
import NewAppointment from '../views/NewAppointment';
import UserProfile from '../views/UserProfile';
import Logout from '../views/Logout';
import Doctors from '../views/Doctors';
import Users from '../views/Users';

import UserRoute from './router/UserRoute';
import NonUserRoute from './router/NonUserRoute';
import AdminRoute from './router/AdminRoute';

type Props = {
  user: IUser | undefined;
};

const Router = (props: Props) => {
  const { user } = props;
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <UserRoute user={user}>
          <NewAppointment />
        </UserRoute>
      ),
      errorElement: <Error></Error>,
    },
    {
      path: '/profile',
      element: (
        <UserRoute user={user}>
          <UserProfile />
        </UserRoute>
      ),
      errorElement: <Error></Error>,
    },
    {
      path: '/appointments',
      element: (
        <UserRoute user={user}>
          <Appointments />
        </UserRoute>
      ),
      errorElement: <Error></Error>,
    },
    {
      path: '/logout',
      element: (
        <UserRoute user={user}>
          <Logout />
        </UserRoute>
      ),
      errorElement: <Error></Error>,
    },

    {
      path: '/doctors',
      element: (
        <AdminRoute user={user}>
          <Doctors />
        </AdminRoute>
      ),
      errorElement: <Error></Error>,
    },
    {
      path: '/users',
      element: (
        <AdminRoute user={user}>
          <Users />
        </AdminRoute>
      ),
      errorElement: <Error></Error>,
    },

    {
      path: '/signin',
      element: (
        <NonUserRoute user={user}>
          <Signin />
        </NonUserRoute>
      ),
      errorElement: <Error></Error>,
    },
    {
      path: '/signup',
      element: (
        <NonUserRoute user={user}>
          <Signup />
        </NonUserRoute>
      ),
      errorElement: <Error></Error>,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
