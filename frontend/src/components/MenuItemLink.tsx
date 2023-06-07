import {
  Link as LinkBase,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from '@mui/material';
import { Link } from 'react-router-dom';

type Props = {
  to: string;
  text: string;
  handleClick: () => void;
  icon: JSX.Element;
};

const MenuItemLink = (props: Props) => {
  const { to, text, handleClick, icon } = props;
  return (
    <LinkBase
      component={Link}
      to={`/${to}`}
      style={{
        textDecoration: 'none',
      }}
    >
      <MenuItem onClick={handleClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{text}</ListItemText>
      </MenuItem>
    </LinkBase>
  );
};

export default MenuItemLink;
