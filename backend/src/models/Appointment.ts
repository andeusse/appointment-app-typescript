import mongoose, { Error, ObjectId } from 'mongoose';
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

appointmentSchema.pre(
  'save',
  async function (next: mongoose.CallbackWithoutResultAndOptionalError) {
    const appointment = this;

    if (
      await checkDate(
        'doctorId',
        appointment.doctorId,
        appointment.date.toISOString()
      )
    ) {
      return next(new Error('Doctor has already an appointment in that date'));
    }
    if (
      await checkDate(
        'userId',
        appointment.userId,
        appointment.date.toISOString()
      )
    ) {
      return next(new Error('User has already an appointment in that date'));
    }
    return next();
  }
);

const checkDate = async (userToCheck: string, id: ObjectId, date: string) => {
  const Appointment = mongoose.model<IAppointment, AppointmentModel>(
    'Appointment'
  );
  const appointments = await Appointment.find({
    [userToCheck]: id,
  });

  if (
    appointments.filter((app) => app.date.toISOString() === date).length !== 0
  ) {
    return true;
  }
  return false;
};

export default mongoose.model('Appointment', appointmentSchema);
