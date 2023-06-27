import { useEffect, useState } from 'react';

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
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import moment from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { deleteAppointment, getAppointments } from '../api/appointment';
import userState from '../atoms/userAtom';
import isLoadingState from '../atoms/isLoadingAtom';
import { IUserAppointment } from '../types/IAppointment';

type Props = {};

const Appointments = (props: Props) => {
  const user = useRecoilValue(userState);
  const setIsLoading = useSetRecoilState(isLoadingState);
  const [appointments, setAppointments] = useState<IUserAppointment[]>([]);

  const [apiError, setApiError] = useState<string | null>(null);

  const handleEditAppointment = (id: string) => {
    if (user && user.token) {
    }
  };

  const handleDeleteAppointment = (id: string) => {
    if (user && user.token) {
      setIsLoading(true);
      deleteAppointment(id, user.token)
        .then((res) => {
          setApiError(null);
          setAppointments(appointments.filter((a) => a._id !== id));
        })
        .catch((error) => {
          setApiError(error.response.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (user && user.token) {
      setIsLoading(true);
      getAppointments(user.token)
        .then((res) => {
          setApiError(null);
          setAppointments(res.data as IUserAppointment[]);
        })
        .catch((error) => {
          setApiError(error.response.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [setIsLoading, user]);

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
            Your Appointments
          </Typography>

          {!!apiError && <Alert severity="error">{apiError}</Alert>}

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
                {appointments.map((appointment) => (
                  <TableRow
                    key={appointment._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <IconButton
                        aria-label="edit"
                        disabled={moment(appointment.date) < moment()}
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default Appointments;
