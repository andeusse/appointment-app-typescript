import { useEffect, useState } from 'react';
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from '@mui/material';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import moment, { Moment } from 'moment';

import disableDates from '../utils/disableDates';
import isLoadingState from '../atoms/isLoadingAtom';
import { getDoctorAppointments } from '../api/doctors';
import userState from '../atoms/userAtom';
import IDoctorAppointment from '../types/IDoctorAppointment';
import { changeAppointment } from '../api/appointment';
import IAppointment from '../types/IAppointment';

type Props = {};

const DoctorAppointments = (props: Props) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const setIsLoading = useSetRecoilState(isLoadingState);
  const [appointmentDate, setAppointmentDate] = useState<Moment>(moment());

  const [appointments, setAppointments] = useState<IDoctorAppointment[]>([]);

  const user = useRecoilValue(userState);

  useEffect(() => {
    setIsLoading(true);
    if (user && user.token) {
      getDoctorAppointments(user.token, appointmentDate.format('YYYY-MM-DD'))
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
  }, [appointmentDate, setIsLoading, user]);

  const handleAppointmentDateChange = (newDate: moment.Moment | null) => {
    if (newDate !== null) {
      setAppointmentDate(newDate);
    }
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
            Your patients appointments
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

export default DoctorAppointments;
