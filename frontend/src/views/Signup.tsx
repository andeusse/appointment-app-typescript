import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useSetRecoilState } from 'recoil';

import Copyright from '../components/Copyright';
import PasswordField from '../components/PasswordField';
import validateForm from '../utils/validateForm';
import { FormFieldsType } from '../types/formFields';
import { signup } from '../api/auth';
import userState from '../atoms/userAtom';
import IUser from '../types/IUser';
import isLoadingState from '../atoms/isLoadingAtom';

type Props = {};

const Signup = (props: Props) => {
  const setUser = useSetRecoilState(userState);
  const setIsLoading = useSetRecoilState(isLoadingState);

  const [errors, setErrors] = useState<FormFieldsType>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email, password, firstName, lastName, errors } =
      validateForm(event);
    setErrors(errors);

    if (
      !errors.email &&
      !errors.password &&
      !errors.firstName &&
      !errors.lastName &&
      email !== undefined &&
      password !== undefined &&
      firstName !== undefined &&
      lastName !== undefined
    ) {
      setIsLoading(true);
      signup(email, password, `${firstName} ${lastName}`)
        .then((res) => {
          setApiError(null);
          const user = res.data as IUser;
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

        {!!apiError && <Alert severity="error">{apiError}</Alert>}

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordField error={errors.password} />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/signin">Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright />
    </Container>
  );
};

export default Signup;
