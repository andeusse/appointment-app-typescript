import React, { useState } from 'react';

import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  Alert,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useRecoilState, useSetRecoilState } from 'recoil';

import PasswordField from '../components/PasswordField';
import isLoadingState from '../atoms/isLoadingAtom';
import userState from '../atoms/userAtom';
import { FormFieldsType } from '../types/formFields';
import validateForm from '../utils/validateForm';
import IUser from '../types/IUser';
import { changeUser } from '../api/user';

type Props = {};

const UserProfile = (props: Props) => {
  const [user, setUser] = useRecoilState(userState);
  const [userForm, setUserForm] = useState<IUser | undefined>(user);

  const setIsLoading = useSetRecoilState(isLoadingState);

  const [errors, setErrors] = useState<FormFieldsType>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email, password, name, errors } = validateForm(event, true);
    setErrors(errors);
    if (
      !errors.email &&
      !errors.name &&
      !errors.passwordComparison &&
      email !== undefined &&
      name !== undefined
    ) {
      setIsLoading(true);
      let newUser: IUser = {
        email: email,
        name: name,
        userType: user?.userType,
      };
      if (password !== undefined) {
        newUser = {
          ...newUser,
          password: password,
        };
      }
      if (user !== undefined && user.token !== undefined) {
        changeUser(newUser, user.token)
          .then((res) => {
            setApiError(null);
            const resUser = { ...(res.data as IUser), token: user.token };
            localStorage.setItem('user', JSON.stringify(resUser));
            setUser(resUser);
          })
          .catch((error) => {
            setApiError(error.response.data.message);
          })
          .finally(() => {
            if (userForm) {
              setUserForm({
                ...userForm,
                password: '',
                confirmPassword: '',
              });
            }
            setIsLoading(false);
          });
      }
    }
  };

  const handlePropertyChange = (e: any) => {
    if (userForm !== undefined) {
      setUserForm({
        ...userForm,
        [e.target.id]: e.target.value,
      });
    }
  };

  return (
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
          <PersonIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Profile
        </Typography>

        {!!apiError && <Alert severity="error">{apiError}</Alert>}

        {!!errors.passwordComparison && (
          <Alert severity="error">{errors.passwordComparison}</Alert>
        )}

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                fullWidth
                id="name"
                label="Name"
                error={!!errors.name}
                helperText={errors.name}
                value={userForm?.name}
                onChange={handlePropertyChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                error={!!errors.email}
                helperText={errors.email}
                value={userForm?.email}
                onChange={handlePropertyChange}
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordField
                error={errors.password}
                handlePropertyChange={handlePropertyChange}
                value={userForm?.password || ''}
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordField
                error={errors.confirmPassword}
                id="confirmPassword"
                handlePropertyChange={handlePropertyChange}
                value={userForm?.confirmPassword || ''}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update user
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserProfile;
