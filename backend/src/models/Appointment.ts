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

    if (await checkDate(appointment.doctorId, appointment.date.toISOString())) {
      return next(new Error('Doctor has already an appointment in that date'));
    }
    return next();
  }
);

const checkDate = async (doctorId: ObjectId, date: string) => {
  const Appointment = mongoose.model<IAppointment, AppointmentModel>(
    'Appointment'
  );
  const appointments = await Appointment.find({
    doctorId: doctorId,
  });

  if (
    appointments.filter((app) => app.date.toISOString() === date).length !== 0
  ) {
    return true;
  }
  return false;
};

mongoose.model('Appointment', appointmentSchema);
