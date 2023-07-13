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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import PersonIcon from '@mui/icons-material/Person';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import DeleteIcon from '@mui/icons-material/Delete';

import isLoadingState from '../atoms/isLoadingAtom';
import userState from '../atoms/userAtom';
import { changeUserById, deleteUserById, getUsers } from '../api/user';
import { IUser } from '../types/IUser';
import { UserType } from '../types/usertype';

type Props = {};

const Users = (props: Props) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const setIsLoading = useSetRecoilState(isLoadingState);

  const [users, setUsers] = useState<IUser[]>([]);

  const user = useRecoilValue(userState);

  useEffect(() => {
    if (user && user.token) {
      setIsLoading(true);
      getUsers(user.token)
        .then((res) => {
          setApiError(null);
          setUsers(res.data as IUser[]);
        })
        .catch((error) => {
          setApiError(error.response.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [setIsLoading, user]);

  const handleUserDelete = (userId: string) => {
    if (user && user.token) {
      setIsLoading(true);
      deleteUserById(userId, user?.token)
        .then((res) => {
          setApiError(res.data.message);
          setUsers(users.filter((u) => u._id !== userId));
        })
        .catch((error) => {
          setApiError(error.response.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleUserTypeChange = (
    event: SelectChangeEvent<UserType>,
    userToChange: IUser
  ) => {
    const newValue = event.target.value as UserType;
    if (user && user.token) {
      setIsLoading(true);
      userToChange.userType = newValue;
      changeUserById(userToChange._id, userToChange, user?.token)
        .then((res) => {
          setUsers(
            users.map((u) => {
              if (u._id === userToChange._id) {
                u.userType = newValue;
                return u;
              }
              return u;
            })
          );
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
            <PersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Users
          </Typography>

          {!!apiError && <Alert severity="error">{apiError}</Alert>}

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">Actions</TableCell>
                  <TableCell align="right">Id</TableCell>
                  <TableCell align="right">Name</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">User Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow
                    key={u._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <IconButton
                        aria-label="delete"
                        disabled={
                          user !== undefined &&
                          user.name !== undefined &&
                          u.name === user.name
                        }
                        onClick={() => handleUserDelete(u._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">{u._id}</TableCell>
                    <TableCell align="right">{u.name}</TableCell>
                    <TableCell align="right">{u.email}</TableCell>
                    <TableCell align="right">
                      <FormControl sx={{ m: 0, minWidth: 120 }} size="small">
                        <InputLabel>User Type</InputLabel>
                        <Select
                          value={u.userType}
                          label="userType"
                          disabled={
                            user !== undefined &&
                            user.name !== undefined &&
                            u.name === user.name
                          }
                          onChange={(e) => handleUserTypeChange(e, u)}
                        >
                          {(
                            Object.keys(UserType) as Array<
                              keyof typeof UserType
                            >
                          ).map((userType) => {
                            return (
                              <MenuItem
                                key={userType}
                                value={userType.toLowerCase()}
                              >
                                {userType}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
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

export default Users;
