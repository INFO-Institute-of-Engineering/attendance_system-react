import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './redux/store';
import { theme } from './theme';
import AppRoutes from './routes';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;