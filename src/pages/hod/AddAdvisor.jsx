import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { createAsyncThunk } from '@reduxjs/toolkit';

// This would be implemented in userSlice.js
const addAdvisor = createAsyncThunk(
  'user/addAdvisor',
  async (advisorData, { rejectWithValue }) => {
    try {
      // For development/testing purposes, simulate a successful response
      // Remove this mock response and uncomment the actual API call when backend is ready
      return {
        id: Math.floor(Math.random() * 1000),
        ...advisorData,
        createdAt: new Date().toISOString()
      };
      
      // Uncomment this when your backend is ready
      // const response = await api.post('/api/users/advisors', advisorData);
      // return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add advisor' });
    }
  }
);

const AddAdvisor = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: user?.department || '',
    assignedClass: '',
    qualification: '',
    experience: '',
    specialization: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [errors, setErrors] = useState({});
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.assignedClass.trim()) {
      newErrors.assignedClass = 'Assigned class is required';
    }
    
    if (!formData.qualification.trim()) {
      newErrors.qualification = 'Qualification is required';
    }
    
    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required';
    } else if (isNaN(formData.experience) || Number(formData.experience) < 0) {
      newErrors.experience = 'Experience must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real implementation, this would dispatch the action to Redux
      // await dispatch(addAdvisor(formData)).unwrap();
      
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSnackbar({
        open: true,
        message: 'Class Advisor added successfully!',
        severity: 'success'
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: user?.department || '',
        assignedClass: '',
        qualification: '',
        experience: '',
        specialization: ''
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to add Class Advisor',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  // Mock data for classes
  const classes = [
    'CS-2021',
    'CS-2022',
    'CS-2023',
    'CS-2024',
    'CS-2025',
    'IT-2021',
    'IT-2022',
    'IT-2023',
    'IT-2024',
    'IT-2025'
  ];
  
  // Mock data for qualifications
  const qualifications = [
    'Ph.D',
    'M.Tech',
    'M.E',
    'M.Sc',
    'MBA',
    'B.Tech',
    'B.E'
  ];
  
  // Mock data for specializations
  const specializations = [
    'Artificial Intelligence',
    'Machine Learning',
    'Data Science',
    'Computer Networks',
    'Database Management',
    'Software Engineering',
    'Web Development',
    'Mobile Development',
    'Cybersecurity',
    'Cloud Computing'
  ];
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Class Advisor
      </Typography>
      
      <Card className="glass-card" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Department Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ minWidth: 200 }}>
              <Typography variant="body2" color="text.secondary">
                Department
              </Typography>
              <Typography variant="body1" gutterBottom>
                {user?.department || 'Computer Science'}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 200 }}>
              <Typography variant="body2" color="text.secondary">
                HOD
              </Typography>
              <Typography variant="body1" gutterBottom>
                {user?.name || 'Not available'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Class Advisor Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={!!errors.phone}
                helperText={errors.phone}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.department}>
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                  labelId="department-label"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  label="Department"
                  required
                >
                  <MenuItem value="Computer Science">Computer Science</MenuItem>
                  <MenuItem value="Information Technology">Information Technology</MenuItem>
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Mechanical">Mechanical</MenuItem>
                  <MenuItem value="Civil">Civil</MenuItem>
                </Select>
                {errors.department && (
                  <Typography variant="caption" color="error">
                    {errors.department}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.assignedClass}>
                <InputLabel id="class-label">Assigned Class</InputLabel>
                <Select
                  labelId="class-label"
                  name="assignedClass"
                  value={formData.assignedClass}
                  onChange={handleInputChange}
                  label="Assigned Class"
                  required
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                  ))}
                </Select>
                {errors.assignedClass && (
                  <Typography variant="caption" color="error">
                    {errors.assignedClass}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.qualification}>
                <InputLabel id="qualification-label">Qualification</InputLabel>
                <Select
                  labelId="qualification-label"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  label="Qualification"
                  required
                >
                  {qualifications.map((qual) => (
                    <MenuItem key={qual} value={qual}>{qual}</MenuItem>
                  ))}
                </Select>
                {errors.qualification && (
                  <Typography variant="caption" color="error">
                    {errors.qualification}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Experience (years)"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleInputChange}
                error={!!errors.experience}
                helperText={errors.experience}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="specialization-label">Specialization</InputLabel>
                <Select
                  labelId="specialization-label"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  label="Specialization"
                >
                  {specializations.map((spec) => (
                    <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{ minWidth: 150 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Add Class Advisor'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddAdvisor;