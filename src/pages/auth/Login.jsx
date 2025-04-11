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
  CircularProgress
} from '@mui/material';
import { login } from '../../redux/slices/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student' // Default role
  });
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
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || 'Authentication failed'}
        </Alert>
      )}

      <FormControl fullWidth margin="normal">
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          name="role"
          value={formData.role}
          label="Role"
          onChange={handleChange}
        >
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="advisor">Class Advisor</MenuItem>
          <MenuItem value="hod">Head of Department</MenuItem>
        </Select>
      </FormControl>

      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={formData.username}
        onChange={handleChange}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Sign In'}
      </Button>

      <Typography variant="body2" color="text.secondary" align="center">
        Please contact the administrator if you're having trouble logging in.
      </Typography>
    </Box>
  );
};

export default Login;