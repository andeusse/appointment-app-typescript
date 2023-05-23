import Navigation from './components/Navigation';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useRecoilValue } from 'recoil';
import themeState from './atoms/themeAtom';

type Props = {};

const userPages = ['Signin'];
const authPages = ['Appointment'];
const adminPages = ['Doctors', 'Users'];

const App = (props: Props) => {
  const theme = useRecoilValue(themeState);
  const themeMode = createTheme({
    palette: {
      mode: theme,
    },
  });

  return (
    <ThemeProvider theme={themeMode}>
      <CssBaseline />
      <Navigation pages={userPages} isLogged={true}></Navigation>
    </ThemeProvider>
  );
};

export default App;
