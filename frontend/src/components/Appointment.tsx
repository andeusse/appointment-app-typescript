import React, { useEffect, useState } from 'react';
import { IUserAppointment } from '../types/IAppointment';
import {
  SelectChangeEvent,
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getDoctors } from '../api/doctors';
import isLoadingState from '../atoms/isLoadingAtom';
import userState from '../atoms/userAtom';
import IAppointments from '../types/IAppointments';
import disableDates from '../utils/disableDates';

type Props = {
  appointment?: IUserAppointment;
  buttonText: string;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => {};
  setApiError: React.Dispatch<React.SetStateAction<string | null>>;
};

const Appointment = (props: Props) => {
  const { appointment, buttonText, handleSubmit, setApiError } = props;

  const [appointmentDate, setAppointmentDate] = React.useState<Moment | null>(
    moment()
  );

  const [appointments, setAppointments] = useState<IAppointments[]>([]);

  const [selectedDoctor, setselectedDoctor] = useState<
    IAppointments | undefined
  >();

  const [selectedDate, setselectedDate] = useState<Moment | undefined>(
    undefined
  );

  const user = useRecoilValue(userState);

  const setIsLoading = useSetRecoilState(isLoadingState);

  useEffect(() => {
    setIsLoading(true);
    if (user && user.token) {
      getDoctors(user.token, moment().format('YYYY-MM-DD'))
        .then((res) => {
          setApiError(null);
          setAppointments(res.data as IAppointments[]);
        })
        .catch((error) => {
          setApiError(error.response.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [setApiError, setIsLoading, user]);

  const handleAppointmentDateChange = (newDate: moment.Moment | null) => {
    setIsLoading(true);
    if (user && user.token) {
      if (newDate !== null) {
        getDoctors(user.token, newDate.format('YYYY-MM-DD'))
          .then((res) => {
            setAppointments(res.data as IAppointments[]);
          })
          .catch((error) => {
            setApiError(error.response.data.message);
          })
          .finally(() => {
            setIsLoading(false);
            setAppointmentDate(newDate);
            setselectedDoctor(undefined);
            setselectedDate(undefined);
          });
      }
    }
  };

  const handleDoctorChange = (event: SelectChangeEvent<any>) => {
    const doctor = appointments.find(
      (a) => a.doctor._id === event.target.value
    );
    setselectedDoctor(doctor);
    setselectedDate(undefined);
  };

  const handleDateChange = (event: SelectChangeEvent<any>) => {
    setselectedDate(event.target.value);
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography component="h6" variant="h6">
        Select a day:
      </Typography>
      <DateCalendar
        value={appointmentDate}
        onChange={handleAppointmentDateChange}
        disablePast
        shouldDisableDate={disableDates}
      />
      {appointments.length > 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography component="h6" variant="h6">
              Select a doctor:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ m: 0, minWidth: 120 }} size="small">
              <InputLabel>Doctor</InputLabel>
              <Select
                value={selectedDoctor?.doctor._id || ''}
                label="Age"
                onChange={handleDoctorChange}
              >
                {appointments.map((appointment) => (
                  <MenuItem
                    key={appointment.doctor._id}
                    value={appointment.doctor._id}
                  >
                    {appointment.doctor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )}
      {selectedDoctor !== undefined && (
        <Grid container sx={{ mt: 0.5 }} spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography component="h6" variant="h6">
              Select an hour:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ m: 0, minWidth: 120 }} size="small">
              <InputLabel>Date</InputLabel>
              <Select
                value={selectedDate || ''}
                label="Age"
                onChange={handleDateChange}
              >
                {selectedDoctor.availableAppointmens.map((appointment) => (
                  <MenuItem key={appointment} value={appointment}>
                    {moment(appointment).format('hh:mm A')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={!selectedDoctor || !selectedDate}
        sx={{ mt: 3, mb: 2 }}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

export default Appointment;
