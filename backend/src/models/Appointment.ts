import mongoose from 'mongoose';
import {
  AppointmentModel,
  IAppointment,
  IAppointmentMethods,
} from '../types/Appointment';

const appointmentSchema = new mongoose.Schema<
  IAppointment,
  AppointmentModel,
  IAppointmentMethods
>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: false,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: false,
  },
  description: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: false,
  },
  date: {
    type: mongoose.Schema.Types.Date,
    required: true,
    unique: false,
  },
  attended: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
    required: false,
    unique: false,
  },
});

mongoose.model('Appointment', appointmentSchema);
