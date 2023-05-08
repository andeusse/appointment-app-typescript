const mockingoose = require('mockingoose');

import { describe, expect, test } from '@jest/globals';
import Appointment from '../../models/Appointment';

describe('Appointment models', () => {
  test('should return the appointment list', async () => {
    mockingoose(Appointment).toReturn(
      [
        {
          userId: 'user1',
          doctorId: 'doctor1',
          description: 'Description',
          date: new Date(),
          attended: false,
        },
        {
          userId: 'user2',
          doctorId: 'doctor1',
          description: 'Description',
          date: new Date(),
          attended: false,
        },
        {
          userId: 'user3',
          doctorId: 'doctor2',
          description: 'Description',
          date: new Date(),
          attended: false,
        },
        {
          userId: 'user4',
          doctorId: 'doctor2',
          description: 'Description',
          date: new Date(),
          attended: false,
        },
      ],
      'find'
    );

    const appointments = await Appointment.find({});
    expect(appointments.length).toBe(4);
  });

  test('should return an array with doctor 1', async () => {
    mockingoose(Appointment).toReturn(
      [
        {
          userId: 'user1',
          doctorId: 'doctor1',
          description: 'Description',
          date: new Date(),
          attended: false,
        },
        {
          userId: 'user2',
          doctorId: 'doctor1',
          description: 'Description',
          date: new Date(),
          attended: false,
        },
      ],
      'find'
    );

    const appointments = await Appointment.find({ doctorId: 'doctor1' });
    expect(appointments.length).toBe(2);
  });
});
