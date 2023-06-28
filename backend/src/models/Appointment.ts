import mongoose, { Error, ObjectId } from 'mongoose';
import {
  AppointmentModel,
  IAppointment,
  IAppointmentMethods,
} from '../types/Appointment';
import User from './User';

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

appointmentSchema.pre(
  'save',
  async function (next: mongoose.CallbackWithoutResultAndOptionalError) {
    const appointment = this;

    const doctor = await User.findById(appointment.doctorId);

    if (doctor === null) {
      return next(new Error('Doctor does not exist'));
    }

    if (await checkDate('doctorId', appointment)) {
      return next(new Error('Doctor has already an appointment in that date'));
    }
    if (await checkDate('userId', appointment)) {
      return next(new Error('User has already an appointment in that date'));
    }
    return next();
  }
);

const checkDate = async (userToCheck: string, appointment: any) => {
  const Appointment = mongoose.model<IAppointment, AppointmentModel>(
    'Appointment'
  );
  const appointments = await Appointment.find({
    [userToCheck]: appointment[userToCheck],
    _id: { $ne: appointment._id },
  });

  if (
    appointments.filter(
      (a) => a.date.toISOString() === appointment.date.toISOString()
    ).length !== 0
  ) {
    return true;
  }
  return false;
};

export default mongoose.model('Appointment', appointmentSchema);
