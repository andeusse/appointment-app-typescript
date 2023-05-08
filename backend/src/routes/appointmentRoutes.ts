import { Router, Request, Response } from 'express';
import { Error } from 'mongoose';
import { RequestWithUserAppointment } from '../types/Appointment';
import { RequestWithUser } from '../types/User';
import requireAuth from '../middlewares/requireAuthHandler/RequireAuthHandlerMiddleware';
import Appointment from '../models/Appointment';

const router = Router();

router.use(requireAuth);

router.get('/appointments', async (req: Request, res: Response) => {
  const user = (<RequestWithUser>req).user;
  Appointment.find({ userId: user._id })
    .then((appointments) => {
      return res.status(200).send(appointments);
    })
    .catch((error: Error) => {
      return res.status(500).send({ message: error.message });
    });
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
  const { date, description, doctorId } = (<RequestWithUserAppointment>req)
    .body;

  if (!date || !description || !doctorId) {
    return res.status(422).send({
      message:
        'The user must send date, description and the doctor identification',
    });
  }

  const appointment = await Appointment.findById(appointmentId);
  if (appointment) {
    appointment.date = date;
    appointment.description = description;
    appointment.doctorId = doctorId;
    appointment
      .save()
      .then(() => {
        return res.status(200).send(appointment);
      })
      .catch((error: Error) => {
        return res.status(500).send({ message: error.message });
      });
  } else {
    return res.status(422).send({ message: 'Appointment not found' });
  }
});

router.delete('/appointments/:id', async (req: Request, res: Response) => {
  const appointmentId = req.params.id;

  Appointment.findByIdAndDelete(appointmentId)
    .then(() => {
      return res.status(200).send({ message: 'Appointment deleted' });
    })
    .catch((error: Error) => {
      return res.status(500).send({ message: error.message });
    });
});

export default router;
