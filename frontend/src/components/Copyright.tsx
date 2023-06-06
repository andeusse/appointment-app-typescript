import { Typography } from '@mui/material';

type Props = {};

const Copyright = (props: Props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © Andres Eusse. All Rights Reserved'}{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

export default Copyright;
