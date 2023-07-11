import { Moment } from 'moment';

export default interface IDoctorAppointment {
  _id: string;
  userName: string;
  date: Moment;
  description: string;
  doctorId: string;
  attended: boolean;
}
