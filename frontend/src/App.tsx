import NavigationBar from './components/NavigationBar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useRecoilState } from 'recoil';
import themeState from './atoms/themeAtom';
import Router from './components/Router';
import string2Theme from './utils/string2Theme';
import IUser from './types/IUser';
import { UserType } from './types/usertype';

type Props = {};

const userPages = ['Signin'];
const authPages = ['Appointment'];
const adminPages = ['Doctors', 'Users'];

const App = (props: Props) => {
  const user: IUser = {
    email: 'email@email.com',
    name: 'Andres Eusse',
    userType: UserType.Admin,
    password: undefined,
  };

  const [theme, setTheme] = useRecoilState(themeState);
  const storageTheme = localStorage.getItem('theme');

  if (storageTheme !== null) {
    setTheme(string2Theme(storageTheme));
  }

  const themeMode = createTheme({
    palette: {
      mode: theme,
    },
  });

  return (
    <ThemeProvider theme={themeMode}>
      <CssBaseline />
      <NavigationBar pages={userPages} user={user}></NavigationBar>
      <Router user={user}></Router>
    </ThemeProvider>
  );
};

export default App;
