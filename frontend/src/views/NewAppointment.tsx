import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  Button,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';

import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import isLoadingState from '../atoms/isLoadingAtom';
import { getDoctors } from '../api/doctors';
import userState from '../atoms/userAtom';
import IAppointments from '../types/IAppointments';
import { addAppointment } from '../api/appointment';

type Props = {};

const NewAppointment = (props: Props) => {
  const [appointmentDate, setAppointmentDate] = React.useState<Moment | null>(
    moment()
  );
  const [apiError, setApiError] = useState<string | null>(null);

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
          setAppointments(res.data as IAppointments[]);
        })
        .catch((error) => {
          setApiError(error.response.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [setIsLoading, user]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedDoctor && selectedDate && user && user.token) {
      setIsLoading(true);
      addAppointment(
        {
          doctorId: selectedDoctor.doctor._id,
          date: selectedDate,
          description: `Appointment done by the application on ${moment()}`,
        },
        user.token
      )
        .then((res) => {
          setApiError(null);
          const newAppointments = appointments.filter((a) => {
            if (a.doctor._id === selectedDoctor.doctor._id) {
              const newAvailableAppointments = a.availableAppointmens.filter(
                (aa) => aa !== selectedDate.toString()
              );
              a.availableAppointmens = newAvailableAppointments;
              return a;
            } else {
              return a;
            }
          });
          setAppointments(newAppointments);
          setselectedDoctor(undefined);
          setselectedDate(undefined);
        })
        .catch((error) => {
          setApiError(error.response.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

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
          });
      }
    }
  };

  const handleDoctorChange = (event: SelectChangeEvent<any>) => {
    const doctor = appointments.find(
      (a) => a.doctor._id === event.target.value
    );
    setselectedDoctor(doctor);
  };

  const handleHourChange = (event: SelectChangeEvent<any>) => {
    setselectedDate(event.target.value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LocalHospitalIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            New Appointment
          </Typography>

          {!!apiError && <Alert severity="error">{apiError}</Alert>}

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
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
                      onChange={handleHourChange}
                    >
                      {selectedDoctor.availableAppointmens.map(
                        (appointment) => (
                          <MenuItem key={appointment} value={appointment}>
                            {moment(appointment).format('hh:mm A')}
                          </MenuItem>
                        )
                      )}
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
              Confirm Appointment
            </Button>
          </Box>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default NewAppointment;

const disableDates = (date: moment.Moment) => {
  const day = date.day();
  const nextMonth = moment().add(2, 'month');

  if (day === 0 || day === 6 || date > nextMonth) {
    return true;
  }
  return false;
};
