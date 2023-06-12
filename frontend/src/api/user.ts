import api from './api';
import IUser from '../types/IUser';

export const getUsers = (token: string) => {
  return api.get('/users', {
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
