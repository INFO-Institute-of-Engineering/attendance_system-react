import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import InfoLogo from '../assets/info-logo.svg';
import BgPattern from '../assets/bg-pattern.svg';

const AuthLayout = () => {
  const theme = useTheme();
  
  return (
    <Box
      className="particles-bg"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
        backgroundImage: `url(${BgPattern})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.1)',
          zIndex: 0
        }
      }}
    >
      {/* Decorative floating elements */}
      <Box 
        className="floating"
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(76, 175, 80, 0.2)',
          backdropFilter: 'blur(8px)',
          zIndex: 0
        }}
      />
      <Box 
        className="floating"
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(33, 150, 243, 0.15)',
          backdropFilter: 'blur(8px)',
          zIndex: 0,
          animationDelay: '2s'
        }}
      />
      <Box 
        className="floating"
        sx={{
          position: 'absolute',
          top: '30%',
          right: '15%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          zIndex: 0,
          animationDelay: '1s'
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: ['column', 'column', 'row'],
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4
          }}
        >
          {/* Left side - Logo and welcome message */}
          <Box 
            sx={{
              flex: 1,
              textAlign: ['center', 'center', 'left'],
              color: '#fff',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            <Box 
              component="img"
              src={InfoLogo}
              alt="INFO Institute Logo"
              sx={{ 
                width: '80px', 
                height: 'auto',
                mb: 2,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }}
            />
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              Welcome to Staff Portal
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom>
              Login to access your account.
            </Typography>
          </Box>
          
          {/* Right side - Login form */}
          <Paper
            elevation={0}
            className="glass-card"
            sx={{
              p: 4,
              width: ['100%', '100%', '400px'],
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Login
            </Typography>
            <Typography variant="body1" gutterBottom color="text.secondary" sx={{ mb: 3 }}>
              Enter your Account Details
            </Typography>
            <Outlet />
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;