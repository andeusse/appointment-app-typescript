import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import IUser from '../../types/IUser';

import Appointments from '../../views/Appointments';
import Signin from '../../views/Signin';
import Signup from '../../views/Signup';
import Error from '../../views/Error';
import NewAppointment from '../../views/NewAppointment';
import UserProfile from '../../views/UserProfile';
import Doctors from '../../views/Doctors';
import Users from '../../views/Users';

import UserRoute from './UserRoute';
import NonUserRoute from './NonUserRoute';
import AdminRoute from './AdminRoute';
import NavigationBar from '../NavigationBar';
import DoctorAppointments from '../../views/DoctorAppointments';

type Props = {
  user: IUser | undefined;
};

const Router = (props: Props) => {
  const { user } = props;
  const router = createBrowserRouter([
    {
      path: '/',
      element: <NavigationBar></NavigationBar>,
      errorElement: <Error></Error>,
      children: [
        {
          index: true,
          element: (
            <UserRoute user={user}>
              <NewAppointment />
            </UserRoute>
          ),
        },
        {
          path: '/',
          element: (
            <UserRoute user={user}>
              <NewAppointment />
            </UserRoute>
          ),
        },
        {
          path: '/profile',
          element: (
            <UserRoute user={user}>
              <UserProfile />
            </UserRoute>
          ),
        },
        {
          path: '/appointments',
          element: (
            <UserRoute user={user}>
              <Appointments />
            </UserRoute>
          ),
        },

        {
          path: '/doctorappointments',
          element: (
            <UserRoute user={user}>
              <DoctorAppointments />
            </UserRoute>
          ),
        },

        {
          path: '/doctors',
          element: (
            <AdminRoute user={user}>
              <Doctors />
            </AdminRoute>
          ),
        },
        {
          path: '/users',
          element: (
            <AdminRoute user={user}>
              <Users />
            </AdminRoute>
          ),
        },

        {
          path: '/signin',
          element: (
            <NonUserRoute user={user}>
              <Signin />
            </NonUserRoute>
          ),
        },
        {
          path: '/signup',
          element: (
            <NonUserRoute user={user}>
              <Signup />
            </NonUserRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
