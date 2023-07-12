import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  Alert,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import isLoadingState from '../atoms/isLoadingAtom';
import disableDates from '../utils/disableDates';
import IDoctorAppointment from '../types/IDoctorAppointment';
import { changeAppointment } from '../api/appointment';
import userState from '../atoms/userAtom';
import IAppointment from '../types/IAppointment';
import { IUser } from '../types/IUser';
import { getUsers } from '../api/user';
import { UserType } from '../types/usertype';
import { getDoctorAppointments } from '../api/doctors';

type Props = {};

const Doctors = (props: Props) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const setIsLoading = useSetRecoilState(isLoadingState);

  const [doctors, setDoctors] = useState<IUser[]>([]);

  const [appointmentDate, setAppointmentDate] = useState<Moment>(moment());

  const [selectedDoctor, setselectedDoctor] = useState<IUser | undefined>();

  const [appointments, setAppointments] = useState<IDoctorAppointment[]>([]);

  const user = useRecoilValue(userState);

  useEffect(() => {
    if (user && user.token) {
      setIsLoading(true);
      getUsers(user.token, UserType.Doctor)
        .then((res) => {
          setApiError(null);
          const doctors = res.data as IUser[];
          setDoctors(doctors);
          if (doctors.length > 0) {
            setselectedDoctor(doctors[0]);
          }
        })
        .catch((error) => {
          setApiError(error.response.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [setIsLoading, user]);

  useEffect(() => {
    setIsLoading(true);
    if (user && user.token) {
      getDoctorAppointments(
        user.token,
        appointmentDate.format('YYYY-MM-DD'),
        selectedDoctor?._id
      )
        .then((res) => {
          setAppointments(res.data.appointments as IDoctorAppointment[]);
        })
        .catch((error) => {
          setApiError(error.response.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [appointmentDate, selectedDoctor, setIsLoading, user]);

  const handleAppointmentDateChange = (newDate: moment.Moment | null) => {
    if (newDate !== null) {
      setAppointmentDate(newDate);
    }
  };

  const handleDoctorChange = (event: SelectChangeEvent<any>) => {
    const doctor = doctors.find((a) => a._id === event.target.value);
    setselectedDoctor(doctor);
  };

  const handleAttendedChange = (appointment: IDoctorAppointment) => {
    if (user && user.token) {
      setIsLoading(true);
      const newAppointment: IAppointment = {
        date: appointment.date,
        description: appointment.description,
        doctorId: appointment.doctorId,
        attended: !appointment.attended,
      };
      changeAppointment(appointment._id, newAppointment, user.token)
        .then((res) => {
          setApiError(null);
          setAppointments((oldApp) => {
            const newApps = oldApp.map((a) => {
              if (a._id === appointment._id) {
                a.attended = !a.attended;
              }
              return a;
            });
            return newApps;
          });
        })
        .catch((error) => {
          setApiError(error.response.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
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
            <FormatListNumberedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Doctors appointments
          </Typography>

          {!!apiError && <Alert severity="error">{apiError}</Alert>}
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Typography component="h6" variant="h6">
              Select a day:
            </Typography>
            <DateCalendar
              value={appointmentDate}
              onChange={handleAppointmentDateChange}
              shouldDisableDate={disableDates}
            />
          </Box>

          {doctors.length > 0 && (
            <Grid container spacing={2} style={{ marginBottom: 10 }}>
              <Grid item xs={12} sm={4}>
                <Typography component="h6" variant="h6">
                  Select a doctor:
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl sx={{ m: 0, minWidth: 120 }} size="small">
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    value={selectedDoctor?._id || ''}
                    label="Doctor"
                    onChange={handleDoctorChange}
                  >
                    {doctors.map((doctor) => {
                      if (user && user.name !== doctor.name) {
                        return (
                          <MenuItem key={doctor._id} value={doctor._id}>
                            {doctor.name}
                          </MenuItem>
                        );
                      }
                      return <></>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">User</TableCell>
                  <TableCell align="right">Description</TableCell>
                  <TableCell align="right">Attended</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow
                    key={appointment._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="right">
                      {moment(appointment.date).format('YYYY-MM-DD hh:mm A')}
                    </TableCell>
                    <TableCell align="right">{appointment.userName}</TableCell>
                    <TableCell align="right">
                      {appointment.description}
                    </TableCell>
                    <TableCell align="right">
                      <Checkbox
                        checked={appointment.attended}
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        onChange={() => handleAttendedChange(appointment)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default Doctors;
