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
      {'Copyright © '} {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

export default Copyright;
