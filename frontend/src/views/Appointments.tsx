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
  Modal,
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

import {
  changeAppointment,
  deleteAppointment,
  getAppointments,
} from '../api/appointment';
import userState from '../atoms/userAtom';
import isLoadingState from '../atoms/isLoadingAtom';
import IAppointment, { IUserAppointment } from '../types/IAppointment';
import Appointment from '../components/Appointment';

type Props = {};

const Appointments = (props: Props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = (appointment: IUserAppointment) => {
    setAppointment(appointment);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const user = useRecoilValue(userState);
  const setIsLoading = useSetRecoilState(isLoadingState);

  const [appointments, setAppointments] = useState<IUserAppointment[]>([]);
  const [appointment, setAppointment] = useState<IUserAppointment | undefined>(
    undefined
  );

  const [apiError, setApiError] = useState<string | null>(null);

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

  const formActionSubmit = (appointment: IAppointment, _id?: string) => {
    if (user && user.token && _id) {
      setOpen(false);
      changeAppointment(_id, appointment, user.token)
        .then((res) => {
          setApiError(null);
        })
        .catch((error) => {
          setApiError(error.response.data.message);
        })
        .finally(() => {
          if (user && user.token) {
            setIsLoading(true);
            getAppointments(user.token)
              .then((res) => {
                setAppointments(res.data as IUserAppointment[]);
              })
              .catch((error) => {
                setApiError(error.response.data.message);
              })
              .finally(() => {
                setIsLoading(false);
              });
          }
        });
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {appointment !== undefined && (
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Appointment
                buttonText="Change appointment"
                formActionSubmit={formActionSubmit}
                setApiError={setApiError}
                appointment={appointment}
              ></Appointment>
            </Box>
          </Modal>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default Appointments;

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
