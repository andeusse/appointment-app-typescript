import { Router, Request, Response } from 'express';
import mongoose, { Error } from 'mongoose';
import {
  AppointmentModel,
  IAppointment,
  RequestWithUserAppointment,
} from '../types/Appointment';
import { RequestWithUser } from '../types/User';
import requireAuth from '../middlewares/requireAuthHandler/RequireAuthHandlerMiddleware';

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
      return res.status(500).send({ message: error.message });
    });
});

router.put('/appointments/:id', async (req: Request, res: Response) => {
  const appointmentId = req.params.id;
  const update = (<RequestWithUserAppointment>req).body;

  try {
    if (!(await Appointment.findById(appointmentId))) {
      return res.status(422).send({ message: 'Appointment not found' });
    } else {
      await Appointment.findByIdAndUpdate(appointmentId, update);
      return res.send(update);
    }
  } catch (error) {
    return res.send({ message: error });
  }
});

export default router;
