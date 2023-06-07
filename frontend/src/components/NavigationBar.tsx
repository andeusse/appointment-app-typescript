import React from 'react';
import { useRecoilState } from 'recoil';

import {
  AppBar,
  Container,
  Toolbar,
  Box,
  IconButton,
  Menu,
  Button,
  Tooltip,
  Avatar,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import HomeIcon from '@mui/icons-material/Home';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import themeState from '../atoms/themeAtom';
import { themeType } from '../types/themeType';
import { UserType } from '../types/usertype';
import { Link, Outlet } from 'react-router-dom';
import MenuItemLink from './MenuItemLink';
import userState from '../atoms/userAtom';
import getFullNameInitials from '../utils/getFullNameInitials';

type Props = {};

type pages = {
  text: string;
  to: string;
  icon: JSX.Element;
  action: () => void;
};

const NavigationBar = (props: Props) => {
  const [user, setUser] = useRecoilState(userState);

  const [theme, setTheme] = useRecoilState(themeState);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    setAnchorElUser(null);
    localStorage.removeItem('user');
    setUser(undefined);
  };

  const nonUserPages: pages[] = [
    {
      text: 'Signin',
      to: 'signin',
      icon: <AccountCircleIcon />,
      action: handleCloseNavMenu,
    },
  ];
  const userPages: pages[] = [];
  const doctorPages: pages[] = [
    {
      text: 'Appointments',
      to: 'doctorAppointments',
      icon: <FormatListNumberedIcon />,
      action: handleCloseNavMenu,
    },
  ];
  const adminPages: pages[] = [
    {
      text: 'Doctors',
      to: 'doctors',
      icon: <LocalHospitalIcon />,
      action: handleCloseNavMenu,
    },
    {
      text: 'Users',
      to: 'users',
      icon: <PeopleAltIcon />,
      action: handleCloseNavMenu,
    },
  ];

  let pages: pages[] = [];

  if (user === undefined) {
    pages = nonUserPages;
  }
  if (user !== undefined && user.userType === UserType.Customer) {
    pages = userPages;
  }
  if (user !== undefined && user.userType === UserType.Doctor) {
    pages = doctorPages;
  }
  if (user !== undefined && user.userType === UserType.Admin) {
    pages = adminPages;
  }

  const handleChangeTheme = () => {
    const newTheme =
      theme === themeType.Light ? themeType.Dark : themeType.Light;
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {user !== undefined && (
                  <MenuItemLink
                    to=""
                    text="Home"
                    handleClick={handleCloseNavMenu}
                    icon={<HomeIcon />}
                  ></MenuItemLink>
                )}
                {pages.map((page) => (
                  <MenuItemLink
                    key={page.text}
                    to={page.to}
                    text={page.text}
                    handleClick={page.action}
                    icon={page.icon}
                  ></MenuItemLink>
                ))}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {user !== undefined && (
                <Link
                  key="Home"
                  to={`/`}
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <Button
                    startIcon={<HomeIcon />}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 1, color: 'white', ml: '10px' }}
                  >
                    Home
                  </Button>
                </Link>
              )}
              {pages.map((page) => (
                <Link
                  key={page.text}
                  to={`/${page.to}`}
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <Button
                    startIcon={page.icon}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 1, color: 'white', ml: '10px' }}
                  >
                    {page.text}
                  </Button>
                </Link>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0, mr: '10px' }}>
              <IconButton onClick={handleChangeTheme}>
                {theme === themeType.Light && <LightModeIcon></LightModeIcon>}
                {theme === themeType.Dark && <DarkModeIcon></DarkModeIcon>}
              </IconButton>
            </Box>

            {user !== undefined && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar>
                      {getFullNameInitials(
                        user.name !== undefined ? user.name : 'NN'
                      )}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItemLink
                    to="profile"
                    text="Profile"
                    handleClick={handleCloseUserMenu}
                    icon={<AccountCircleIcon />}
                  ></MenuItemLink>
                  <MenuItemLink
                    to="appointments"
                    text="Appointments"
                    handleClick={handleCloseUserMenu}
                    icon={<FormatListNumberedIcon />}
                  ></MenuItemLink>
                  <MenuItemLink
                    to=""
                    text="Logout"
                    handleClick={handleLogout}
                    icon={<LogoutIcon />}
                  ></MenuItemLink>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </>
  );
};

export default NavigationBar;
