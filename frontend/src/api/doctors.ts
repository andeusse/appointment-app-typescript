import api from './api';

export const getDoctorsAppointments = (token: string, day: string) => {
  return api.get(`/doctors?day=${day}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getDoctorAppointments = (
  token: string,
  day: string,
  id: string | undefined = undefined
) => {
  let query = `/doctors/appointments?day=${day}`;
  if (id) {
    query = `/doctors/appointments/${id}?day=${day}`;
  }
  return api.get(query, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
