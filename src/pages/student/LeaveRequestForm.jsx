import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  FormHelperText,
  Divider
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { submitLeaveRequest } from '../../redux/slices/leaveSlice';

const LeaveRequestForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.leave);

  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: null,
    toDate: null,
    reason: '',
    documents: null
  });

  const [formErrors, setFormErrors] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: ''
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {
      leaveType: '',
      fromDate: '',
      toDate: '',
      reason: ''
    };

    if (!formData.leaveType) {
      errors.leaveType = 'Leave type is required';
      isValid = false;
    }

    if (!formData.fromDate) {
      errors.fromDate = 'From date is required';
      isValid = false;
    }

    if (formData.leaveType === 'full-day' && !formData.toDate) {
      errors.toDate = 'To date is required for full-day leave';
      isValid = false;
    }

    if (formData.fromDate && formData.toDate && formData.fromDate > formData.toDate) {
      errors.toDate = 'To date must be after from date';
      isValid = false;
    }

    if (!formData.reason.trim()) {
      errors.reason = 'Reason is required';
      isValid = false;
    } else if (formData.reason.trim().length < 10) {
      errors.reason = 'Reason must be at least 10 characters';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date
    });

    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      documents: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create form data for submission
    const leaveData = {
      studentId: user.id,
      leaveType: formData.leaveType,
      fromDate: formData.fromDate,
      toDate: formData.leaveType === 'half-day' ? formData.fromDate : formData.toDate,
      reason: formData.reason,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    const result = await dispatch(submitLeaveRequest(leaveData));

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/student/leave/requests');
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Submit Leave Request
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Leave Request Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.message || 'Failed to submit leave request. Please try again.'}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.leaveType}>
                <InputLabel id="leave-type-label">Leave Type</InputLabel>
                <Select
                  labelId="leave-type-label"
                  id="leaveType"
                  name="leaveType"
                  value={formData.leaveType}
                  label="Leave Type"
                  onChange={handleChange}
                >
                  <MenuItem value="full-day">Full Day Leave</MenuItem>
                  <MenuItem value="half-day">Half Day Leave</MenuItem>
                  <MenuItem value="on-duty">On-Duty (OD) Leave</MenuItem>
                </Select>
                {formErrors.leaveType && (
                  <FormHelperText>{formErrors.leaveType}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="From Date"
                  value={formData.fromDate}
                  onChange={(date) => handleDateChange('fromDate', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formErrors.fromDate}
                      helperText={formErrors.fromDate}
                    />
                  )}
                  disablePast
                />
              </LocalizationProvider>
            </Grid>

            {formData.leaveType === 'full-day' && (
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="To Date"
                    value={formData.toDate}
                    onChange={(date) => handleDateChange('toDate', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!formErrors.toDate}
                        helperText={formErrors.toDate}
                      />
                    )}
                    disablePast
                    minDate={formData.fromDate}
                  />
                </LocalizationProvider>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="reason"
                name="reason"
                label="Reason for Leave"
                multiline
                rows={4}
                value={formData.reason}
                onChange={handleChange}
                error={!!formErrors.reason}
                helperText={formErrors.reason}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Supporting Documents (Optional)
              </Typography>
              <input
                accept="application/pdf,image/*"
                style={{ display: 'none' }}
                id="documents-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="documents-file">
                <Button variant="outlined" component="span">
                  Upload Document
                </Button>
              </label>
              {formData.documents && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {formData.documents.name}
                </Typography>
              )}
              <FormHelperText>
                Upload any supporting documents (medical certificate, event invitation, etc.)
              </FormHelperText>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/student/dashboard')}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Request'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default LeaveRequestForm;