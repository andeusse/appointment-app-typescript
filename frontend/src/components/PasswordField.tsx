import { Visibility, VisibilityOff } from '@mui/icons-material';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import React, { useState } from 'react';

type Props = {
  error: string | undefined;
  id?: string;
  handlePropertyChange?: (e: any) => void;
  value?: string;
};

const PasswordField = (props: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const { error, id = 'password', handlePropertyChange, value } = props;

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  return (
    <TextField
      required
      fullWidth
      name={id}
      label="Password"
      type={showPassword ? 'text' : 'password'}
      id={id}
      autoComplete="current-password"
      error={!!error}
      helperText={error}
      value={value}
      onChange={handlePropertyChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;
