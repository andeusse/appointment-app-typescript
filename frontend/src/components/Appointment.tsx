import React, { useEffect, useState } from 'react';
import IAppointment, { IUserAppointment } from '../types/IAppointment';
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
import { getDoctorsAppointments } from '../api/doctors';
import isLoadingState from '../atoms/isLoadingAtom';
import userState from '../atoms/userAtom';
import IAvailableAppointments from '../types/IAppointments';
import disableDates from '../utils/disableDates';

type Props = {
  appointment?: IUserAppointment;
  buttonText: string;
  formActionSubmit: (appointment: IAppointment, _id?: string) => void;
  setApiError: React.Dispatch<React.SetStateAction<string | null>>;
};

const Appointment = (props: Props) => {
  const { appointment, buttonText, formActionSubmit, setApiError } = props;

  const [appointments, setAppointments] = useState<IAvailableAppointments[]>(
    []
  );

  const [appointmentDate, setAppointmentDate] = React.useState<Moment>(
    moment()
  );
  const [selectedDoctor, setselectedDoctor] = useState<
    IAvailableAppointments | undefined
  >(undefined);
  const [selectedDate, setselectedDate] = useState<Moment | undefined>(
    undefined
  );

  const user = useRecoilValue(userState);

  const setIsLoading = useSetRecoilState(isLoadingState);

  useEffect(() => {
    setIsLoading(true);
    if (user && user.token) {
      const queryDate = (
        appointment ? moment(appointment.date) : moment()
      ).format('YYYY-MM-DD');
      getDoctorsAppointments(user.token, queryDate)
        .then((res) => {
          setApiError(null);
          if (!appointment) {
            setAppointments(res.data as IAvailableAppointments[]);
          } else {
            setAppointmentDate(moment(appointment.date));
            setAppointments(() => {
              const newValues = res.data as IAvailableAppointments[];
              setselectedDoctor(
                newValues.find((a) => a.doctor.name === appointment.doctorName)
              );
              return newValues;
            });
            setselectedDate(appointment.date);
          }
        })
        .catch((error) => {
          setApiError(error.response.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [appointment, setApiError, setIsLoading, user]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedDoctor && selectedDate) {
      setselectedDoctor(undefined);
      setselectedDate(undefined);
      if (appointment === undefined) {
        formActionSubmit({
          doctorId: selectedDoctor.doctor._id,
          date: selectedDate,
          description: `Appointment done by the application on ${moment()}`,
        });
      } else {
        formActionSubmit(
          {
            doctorId: selectedDoctor.doctor._id,
            date: selectedDate,
            description: `Appointment done by the application on ${moment()}`,
          },
          appointment._id
        );
      }

      if (user && user.token) {
        getDoctorsAppointments(user.token, appointmentDate.format('YYYY-MM-DD'))
          .then((res) => {
            setAppointments(res.data as IAvailableAppointments[]);
          })
          .catch((error) => {
            setApiError(error.response.data.message);
          })
          .finally(() => {
            setIsLoading(false);
            setselectedDoctor(undefined);
            setselectedDate(undefined);
          });
      }
    }
  };

  const handleAppointmentDateChange = (newDate: moment.Moment | null) => {
    setIsLoading(true);
    if (user && user.token) {
      if (newDate !== null) {
        getDoctorsAppointments(user.token, newDate.format('YYYY-MM-DD'))
          .then((res) => {
            setAppointments(res.data as IAvailableAppointments[]);
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
                {appointments.map((appointment) => {
                  if (user && user.name !== appointment.doctor.name) {
                    return (
                      <MenuItem
                        key={appointment.doctor._id}
                        value={appointment.doctor._id}
                      >
                        {appointment.doctor.name}
                      </MenuItem>
                    );
                  }
                })}
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
                {appointment !== undefined &&
                  selectedDoctor.doctor.name === appointment.doctorName &&
                  selectedDate === appointment.date && (
                    <MenuItem
                      key={appointment.date.toString()}
                      value={appointment.date.toString()}
                    >
                      {moment(appointment.date).format('hh:mm A')}
                    </MenuItem>
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
        {buttonText}
      </Button>
    </Box>
  );
};

export default Appointment;
