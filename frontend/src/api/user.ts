import api from './api';
import User, { IUser } from '../types/IUser';
import { UserType } from '../types/usertype';

export const getUsers = (
  token: string,
  filter: UserType | undefined = undefined
) => {
  let query = '/users';
  if (filter !== undefined) {
    query = `/users?filter=${filter}`;
  }
  return api.get(query, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addUser = (user: User, token: string) => {
  return api.post(
    '/users',
    { ...user },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const changeUser = (user: User, token: string) => {
  return api.put(
    `/user/`,
    { ...user },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const changeUserById = (userId: string, user: IUser, token: string) => {
  return api.put(
    `/users/${userId}`,
    { email: user.email, name: user.name, userType: user.userType },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deleteUserById = (userId: string, token: string) => {
  return api.delete(`/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
