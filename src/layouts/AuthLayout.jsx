import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography } from '@mui/material';

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 2,
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            INFO Institute of Engineering
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom color="text.secondary">
            Attendance Management Portal
          </Typography>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;