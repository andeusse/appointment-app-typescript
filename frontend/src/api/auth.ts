import api from './api';

export const signin = (email: string, password: string) => {
  return api.post('/signin', { email, password });
};

export const signup = (email: string, password: string, name: string) => {
  return api.post('/signup', { email, password, name });
};
