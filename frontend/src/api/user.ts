import api from './api';
import IUser from '../types/IUser';
import { UserType } from '../types/usertype';

export const getUsers = (token: string, filter: UserType | undefined) => {
  let query = '/users';
  if (filter !== undefined) {
    query = `/users?filter=${filter}`;
  }
  return api.get(query, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addUser = (user: IUser, token: string) => {
  return api.post(
    '/users',
    { ...user },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const changeUser = (user: IUser, token: string) => {
  return api.put(
    `/user/`,
    { ...user },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const changeUserById = (userId: string, user: IUser, token: string) => {
  return api.put(
    `/users/${userId}}`,
    { ...user },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deleteUser = (userId: string, token: string) => {
  return api.delete(`/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
