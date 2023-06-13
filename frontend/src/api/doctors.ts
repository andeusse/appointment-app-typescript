import api from './api';

export const getDoctors = (token: string, day: string) => {
  return api.get(`/doctors?day=${day}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getDoctor = (token: string, id: string, day: string) => {
  return api.get(`/doctors/${id}?day=${day}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
