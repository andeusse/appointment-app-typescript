import { Moment } from 'moment';

export default interface IAppointment {
  description: string;
  date: Moment;
  doctorId: string;
}
