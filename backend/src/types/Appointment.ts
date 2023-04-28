import mongoose, { Model } from 'mongoose';
import { IUser, RequestWithUser } from './User';

export interface IAppointment {
  _id: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  doctorId: mongoose.Schema.Types.ObjectId;
  description: string;
  date: Date;
  attended: boolean;
}

export interface IAppointmentMethods {}

export type AppointmentModel = Model<IAppointment, {}, IAppointmentMethods>;

export type RequestWithUserAppointment = IAppointment & RequestWithUser;
