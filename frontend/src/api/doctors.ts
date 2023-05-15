import api from './api';

export const getDoctors = (token: string) => {
  return api.get('/doctors', {
    headers: { Authorization: `Bearer ${token}` },
  });
};
