import { useState } from 'react';
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  Alert,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import isLoadingState from '../atoms/isLoadingAtom';
import userState from '../atoms/userAtom';
import { addAppointment } from '../api/appointment';
import IAppointment from '../types/IAppointment';
import Appointment from '../components/Appointment';

type Props = {};

const NewAppointment = (props: Props) => {
  const [apiError, setApiError] = useState<string | null>(null);

  const user = useRecoilValue(userState);

  const setIsLoading = useSetRecoilState(isLoadingState);

  const formActionSubmit = (appointment: IAppointment) => {
    if (user && user.token) {
      setIsLoading(true);
      addAppointment(
        {
          doctorId: appointment.doctorId,
          date: appointment.date,
          description: appointment.description,
        },
        user.token
      )
        .then((res) => {
          setApiError(null);
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
            <LocalHospitalIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            New Appointment
          </Typography>

          {!!apiError && <Alert severity="error">{apiError}</Alert>}

          <Appointment
            buttonText="Confirm appoinment"
            formActionSubmit={formActionSubmit}
            setApiError={setApiError}
          ></Appointment>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default NewAppointment;
