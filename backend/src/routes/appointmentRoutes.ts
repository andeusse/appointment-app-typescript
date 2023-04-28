import { Router, Request, Response } from 'express';
import mongoose, { Error } from 'mongoose';
import {
  AppointmentModel,
  IAppointment,
  RequestWithUserAppointment,
} from '../types/Appointment';
import { IUser, RequestWithUser, UserModel } from '../types/User';
import requireAuth from '../middlewares/requireAuthHandler/RequireAuthHandlerMiddleware';

const User = mongoose.model<IUser, UserModel>('User');
const Appointment = mongoose.model<IAppointment, AppointmentModel>(
  'Appointment'
);

const router = Router();

router.use(requireAuth);

router.get('/appointments', async (req: Request, res: Response) => {
  const user = (<RequestWithUser>req).user;
  const appointments = await Appointment.find({ userId: user._id });
  return res.status(200).send(appointments);
});

router.post('/appointments', async (req: Request, res: Response) => {
  const user = (<RequestWithUserAppointment>req).user;
  const { doctorId, description, date } = (<RequestWithUserAppointment>req)
    .body;
  const doctor = User.find({ userId: doctorId });

  if (!doctorId || !description || !date) {
    return res.send({
      message: 'Doctor ID, description and date are mandatory',
    });
  }

  const appointment = new Appointment({
    date: date,
    description: description,
    doctorId: doctorId,
    userId: user._id,
  });

  appointment
    .save()
    .then(() => {
      return res.status(200).send(appointment);
    })
    .catch((error: Error) => {
      return res.status(500).send({ message: error });
    });
});

export default router;
