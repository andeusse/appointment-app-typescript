import IAppointment from '../types/IAppointment';
import api from './api';

export const getAppointments = (token: string) => {
  api.get('/appointments', { headers: { Authorization: `Bearer ${token}` } });
};

export const addAppointment = (appoinment: IAppointment, token: string) => {
  api.post(
    '/appointments',
    { ...appoinment },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const changeAppointment = (
  appointmentsId: string,
  appoinment: IAppointment,
  token: string
) => {
  api.put(
    `/appointments/${appointmentsId}`,
    { ...appoinment },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deleteAppointment = (appointmentsId: string, token: string) => {
  api.delete(`/appointments/${appointmentsId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
