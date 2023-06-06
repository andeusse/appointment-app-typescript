import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useRecoilState, useRecoilValue } from 'recoil';
import themeState from './atoms/themeAtom';
import Router from './components/router/Router';
import string2Theme from './utils/string2Theme';
import IsLoading from './components/IsLoading';
import userState from './atoms/userAtom';
import isLoadingState from './atoms/isLoadingAtom';
import { useEffect } from 'react';

type Props = {};

const App = (props: Props) => {
  const isLoading = useRecoilValue(isLoadingState);
  const [user, setUser] = useRecoilState(userState);
  const [theme, setTheme] = useRecoilState(themeState);

  useEffect(() => {
    const storageUser = localStorage.getItem('user');
    if (storageUser !== null) {
      setUser(JSON.parse(storageUser));
    }

    const storageTheme = localStorage.getItem('theme');
    if (storageTheme !== null) {
      setTheme(string2Theme(storageTheme));
    }
  }, [setTheme, setUser]);

  const themeMode = createTheme({
    palette: {
      mode: theme,
    },
  });

  return (
    <ThemeProvider theme={themeMode}>
      <CssBaseline />
      {/* <NavigationBar user={user}></NavigationBar> */}
      <Router user={user}></Router>
      <IsLoading isLoading={isLoading}></IsLoading>
    </ThemeProvider>
  );
};

export default App;
