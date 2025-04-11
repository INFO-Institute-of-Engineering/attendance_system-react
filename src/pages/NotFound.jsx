import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const handleGoBack = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Redirect based on user role
    switch (role) {
      case 'student':
        navigate('/student/dashboard');
        break;
      case 'advisor':
        navigate('/advisor/dashboard');
        break;
      case 'hod':
        navigate('/hod/dashboard');
        break;
      default:
        navigate('/login');
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGoBack}
          sx={{ mt: 2 }}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;