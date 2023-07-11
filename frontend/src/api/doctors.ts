import api from './api';

export const getDoctorsAppointments = (token: string, day: string) => {
  return api.get(`/doctors?day=${day}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getDoctorAppointments = (token: string, day: string) => {
  return api.get(`/doctors/appointments?day=${day}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
