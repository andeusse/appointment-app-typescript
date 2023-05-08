const mockingoose = require('mockingoose');

import { describe, expect, test } from '@jest/globals';
import User from '../../models/User';
import { UserType } from '../../types/usertype';

describe('Appointment models', () => {
  test('should return the appointment list', async () => {
    mockingoose(User).toReturn(
      [
        {
          email: 'email@email.com',
          password: 'password',
          name: 'John Doe',
          userType: UserType.Admin,
        },
        {
          email: 'email@email.com',
          password: 'password',
          name: 'John Doe',
          userType: UserType.Admin,
        },
        {
          email: 'email@email.com',
          password: 'password',
          name: 'John Doe',
          userType: UserType.Admin,
        },
        {
          email: 'email@email.com',
          password: 'password',
          name: 'John Doe',
          userType: UserType.Admin,
        },
      ],
      'find'
    );

    const appointments = await User.find({});
    expect(appointments.length).toBe(4);
  });
});
