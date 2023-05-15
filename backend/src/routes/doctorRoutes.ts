import { Router, Request, Response } from 'express';
import requireAuth from '../middlewares/requireAuthHandler/RequireAuthHandlerMiddleware';
import { UserType } from '../types/usertype';
import User from '../models/User';
import Appointment from '../models/Appointment';
import { getDoctorAvailableAppointsments } from '../utils/getDoctorAvailableAppointments';

const router = Router();

router.use(requireAuth);

router.get('/doctors', async (req: Request, res: Response) => {
  const day = req.query.day;
  User.find({ userType: UserType.Doctor })
    .select(['-password', '-email'])
    .then(async (doctors) => {
      const doctorsAppointments: any = [];

      if (!day) {
        return res.status(400).send({ message: 'You must enter a day' });
      }
      if (typeof day === 'string') {
        if (Date.parse(day)) {
          const startDay = new Date(day);
          const endDay = new Date(startDay);
          endDay.setDate(endDay.getDate() + 1);
          for (const doctor of doctors) {
            const appointments = (
              await Appointment.find({
                doctorId: doctor._id,
                date: { $gte: startDay, $lte: endDay },
              })
            ).map((d) => d.date.toISOString());
            const availableAppointmens = getDoctorAvailableAppointsments(
              startDay,
              appointments
            );
            if (availableAppointmens.length !== 0) {
              doctorsAppointments.push({
                doctor,
                availableAppointmens,
              });
            }
          }
          return res.status(200).send(doctorsAppointments);
        } else {
          return res
            .status(400)
            .send({ message: 'The date has no the correct format' });
        }
      }
    })
    .catch((error: Error) => {
      return res
        .status(400)
        .send({ message: 'Error with finding the doctors, try again' });
    });
});

router.get('/doctors/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const day = req.query.day;

  User.findById(id)
    .then(async () => {
      if (!day) {
        return res.status(400).send({ message: 'You must enter a day' });
      }
      if (typeof day === 'string') {
        if (Date.parse(day)) {
          const startDay = new Date(day);
          const endDay = new Date(startDay);
          endDay.setDate(endDay.getDate() + 1);
          const appointments = (
            await Appointment.find({
              doctorId: id,
              date: { $gte: startDay, $lte: endDay },
            })
          ).map((d) => d.date.toISOString());

          const availableAppointmens = getDoctorAvailableAppointsments(
            startDay,
            appointments
          );
          return res.status(200).send({ appointments, availableAppointmens });
        } else {
          return res
            .status(400)
            .send({ message: 'The date has no the correct format' });
        }
      }
    })
    .catch((error: Error) => {
      return res.status(404).send({ message: 'Doctor not found' });
    });
});

export default router;
