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
const addStudent = createAsyncThunk(
  'user/addStudent',
  async (studentData, { rejectWithValue }) => {
    try {
      // For development/testing purposes, simulate a successful response
      // Remove this mock response and uncomment the actual API call when backend is ready
      return {
        id: Math.floor(Math.random() * 1000),
        ...studentData,
        createdAt: new Date().toISOString()
      };
      
      // Uncomment this when your backend is ready
      // const response = await api.post('/api/users/students', studentData);
      // return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add student' });
    }
  }
);

const AddStudent = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    department: user?.department || '',
    semester: '',
    section: '',
    classId: user?.assignedClass || ''
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
    
    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll Number is required';
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
    
    if (!formData.semester.trim()) {
      newErrors.semester = 'Semester is required';
    }
    
    if (!formData.section.trim()) {
      newErrors.section = 'Section is required';
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
      // await dispatch(addStudent(formData)).unwrap();
      
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSnackbar({
        open: true,
        message: 'Student added successfully!',
        severity: 'success'
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        rollNumber: '',
        email: '',
        phone: '',
        department: user?.department || '',
        semester: '',
        section: '',
        classId: user?.assignedClass || ''
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to add student',
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
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Student
      </Typography>
      
      <Card className="glass-card" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Class Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ minWidth: 200 }}>
              <Typography variant="body2" color="text.secondary">
                Class
              </Typography>
              <Typography variant="body1" gutterBottom>
                {user?.assignedClass || 'CS-2023'}
              </Typography>
            </Box>
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
                Advisor
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
          Student Details
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
                label="Roll Number"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleInputChange}
                error={!!errors.rollNumber}
                helperText={errors.rollNumber}
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
            
            <Grid item xs={12} md={4}>
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
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!errors.semester}>
                <InputLabel id="semester-label">Semester</InputLabel>
                <Select
                  labelId="semester-label"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  label="Semester"
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <MenuItem key={sem} value={sem.toString()}>{sem}</MenuItem>
                  ))}
                </Select>
                {errors.semester && (
                  <Typography variant="caption" color="error">
                    {errors.semester}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!errors.section}>
                <InputLabel id="section-label">Section</InputLabel>
                <Select
                  labelId="section-label"
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  label="Section"
                  required
                >
                  {['A', 'B', 'C', 'D'].map((section) => (
                    <MenuItem key={section} value={section}>{section}</MenuItem>
                  ))}
                </Select>
                {errors.section && (
                  <Typography variant="caption" color="error">
                    {errors.section}
                  </Typography>
                )}
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
                  {loading ? <CircularProgress size={24} /> : 'Add Student'}
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

export default AddStudent;