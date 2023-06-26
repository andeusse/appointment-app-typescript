import { Moment } from 'moment';

export default interface IAppointment {
  description: string;
  date: Moment;
  doctorId: string;
}

export interface IUserAppointment {
  _id: string;
  date: Moment;
  attended: boolean;
  doctorName: string;
}
