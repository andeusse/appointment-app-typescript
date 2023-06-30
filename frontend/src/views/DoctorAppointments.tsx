import React, { useEffect, useState } from 'react';
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  Alert,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import moment, { Moment } from 'moment';

import disableDates from '../utils/disableDates';
import isLoadingState from '../atoms/isLoadingAtom';
import { getDoctor } from '../api/doctors';
import userState from '../atoms/userAtom';

type Props = {};

const DoctorAppointments = (props: Props) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const setIsLoading = useSetRecoilState(isLoadingState);
  const [appointmentDate, setAppointmentDate] = React.useState<Moment>(
    moment()
  );
  const user = useRecoilValue(userState);

  // useEffect(() => {
  //   if (user && user.token && user.) {
  //     getDoctor(user)
  //   }
  // }, [])

  const handleAppointmentDateChange = (newDate: moment.Moment | null) => {
    setIsLoading(true);
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
                  <TableCell>Actions</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Doctor</TableCell>
                  <TableCell align="right">Attended</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {appointments.map((appointment) => (
                  <TableRow
                    key={appointment._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <IconButton
                        aria-label="edit"
                        disabled={moment(appointment.date) < moment()}
                        onClick={() => handleOpen(appointment)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        disabled={moment(appointment.date) < moment()}
                        onClick={() => handleDeleteAppointment(appointment._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">
                      {moment(appointment.date).format('YYYY-MM-DD hh:mm A')}
                    </TableCell>
                    <TableCell align="right">
                      {appointment.doctorName}
                    </TableCell>
                    <TableCell align="right">
                      {appointment.attended ? (
                        <CheckIcon style={{ color: 'green' }}></CheckIcon>
                      ) : (
                        <CloseIcon style={{ color: 'red' }}></CloseIcon>
                      )}
                    </TableCell>
                  </TableRow>
                ))} */}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default DoctorAppointments;
