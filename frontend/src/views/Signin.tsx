import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useSetRecoilState } from 'recoil';

import Copyright from '../components/Copyright';
import PasswordField from '../components/PasswordField';
import validateForm from '../utils/validateForm';
import { FormFieldsType } from '../types/formFields';
import { signin } from '../api/auth';
import userState from '../atoms/userAtom';
import IUser from '../types/IUser';
import isLoadingState from '../atoms/isLoadingAtom';

type Props = {};

const Signin = (props: Props) => {
  const setUser = useSetRecoilState(userState);
  const setIsLoading = useSetRecoilState(isLoadingState);

  const [errors, setErrors] = useState<FormFieldsType>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email, password, errors } = validateForm(event);
    setErrors(errors);

    if (
      !errors.email &&
      !errors.password &&
      email !== undefined &&
      password !== undefined
    ) {
      setIsLoading(true);
      signin(email, password)
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
          Sign in
        </Typography>

        {!!apiError && <Alert severity="error">{apiError}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            helperText={errors.email}
          />
          <PasswordField error={errors.password} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/signup">Don't have an account? Sign Up</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright />
    </Container>
  );
};

export default Signin;
