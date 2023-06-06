import React from 'react';
import { useRecoilState } from 'recoil';

import {
  AppBar,
  Container,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
  Tooltip,
  Avatar,
  Link as LinkBase,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import themeState from '../atoms/themeAtom';
import { themeType } from '../types/themeType';
import IUser from '../types/IUser';
import { UserType } from '../types/usertype';
import { Link, Outlet } from 'react-router-dom';

type Props = {
  user: IUser | undefined;
};

const nonUserPages = ['Signin', 'Signup'];
const userPages = ['Home'];
const adminPages = ['Home', 'Doctors', 'Users'];

const userSettings = ['Profile', 'Appointments', 'Logout'];

const NavigationBar = (props: Props) => {
  const { user } = props;
  let pages: string[] = [];

  if (user === undefined) {
    pages = nonUserPages;
  }
  if (user !== undefined && user.userType === UserType.Customer) {
    pages = userPages;
  }
  if (user !== undefined && user.userType === UserType.Admin) {
    pages = adminPages;
  }

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
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Link
                  key={page}
                  to={`/${page}`}
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 1, color: 'white', display: 'block' }}
                  >
                    {page}
                  </Button>
                </Link>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0, pr: '10px' }}>
              <IconButton onClick={handleChangeTheme}>
                {theme === themeType.Light && <LightModeIcon></LightModeIcon>}
                {theme === themeType.Dark && <DarkModeIcon></DarkModeIcon>}
              </IconButton>
            </Box>

            {user !== undefined && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar>AE</Avatar>
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
                  {userSettings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <LinkBase
                        component={Link}
                        to={`/${setting}`}
                        style={{
                          textDecoration: 'none',
                        }}
                      >
                        <Typography textAlign="center">{setting}</Typography>
                      </LinkBase>
                    </MenuItem>
                  ))}
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
