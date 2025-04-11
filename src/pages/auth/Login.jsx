import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { login } from '../../redux/slices/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student' // Default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({
      username: formData.username,
      password: formData.password,
      role: formData.role
    }));

    if (result.meta.requestStatus === 'fulfilled') {
      // Redirect based on role
      switch (result.payload.user.role) {
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
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ 
        mt: 3,
        position: 'relative',
        '& .MuiTextField-root, & .MuiFormControl-root': {
          mb: 2.5
        }
      }}
    >
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: '10px',
            background: 'rgba(211, 47, 47, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(211, 47, 47, 0.3)'
          }}
        >
          {error.message || 'Authentication failed'}
        </Alert>
      )}

      <FormControl fullWidth className="glass-input">
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          name="role"
          value={formData.role}
          label="Role"
          onChange={handleChange}
          startAdornment={
            <InputAdornment position="start">
              <SchoolIcon sx={{ color: 'primary.main' }} />
            </InputAdornment>
          }
        >
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="advisor">Class Advisor</MenuItem>
          <MenuItem value="hod">Head of Department</MenuItem>
        </Select>
      </FormControl>

      <TextField
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={formData.username}
        onChange={handleChange}
        className="glass-input"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon sx={{ color: 'primary.main' }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        className="glass-input"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ color: 'primary.main' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        className="glass-button"
        sx={{ 
          mt: 4, 
          mb: 3,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 'bold',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'all 0.5s',
          },
          '&:hover::after': {
            left: '100%',
          }
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Login'}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255,255,255,0.7)',
            fontStyle: 'italic',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          New Staff?
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 0.5,
            color: 'rgba(255,255,255,0.9)',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          Kindly contact your administrator to facilitate your access to the staff portal.
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;