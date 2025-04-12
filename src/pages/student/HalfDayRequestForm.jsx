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

const HalfDayRequestForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.leave);

  const [formData, setFormData] = useState({
    date: null,
    session: '', // 'morning' or 'afternoon'
    reason: '',
    documents: null
  });

  const [formErrors, setFormErrors] = useState({
    date: '',
    session: '',
    reason: ''
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {
      date: '',
      session: '',
      reason: ''
    };

    if (!formData.date) {
      errors.date = 'Date is required';
      isValid = false;
    }

    if (!formData.session) {
      errors.session = 'Session is required';
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

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date: date
    });

    // Clear error when field is changed
    if (formErrors.date) {
      setFormErrors({
        ...formErrors,
        date: ''
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
    const halfDayData = {
      studentId: user.id,
      leaveType: 'half-day',
      fromDate: formData.date,
      toDate: formData.date, // Same as fromDate for half-day leave
      session: formData.session,
      reason: formData.reason,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    const result = await dispatch(submitLeaveRequest(halfDayData));

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/student/leave/requests');
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Submit Half-Day Leave Request
      </Typography>
      <Paper className="glass-card" sx={{ p: 3, mb: 4 }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          Fill out the form below to request a half-day leave. Your request will be reviewed by your class advisor and then by the HoD.
        </Typography>
        <Divider sx={{ my: 2 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.message || 'Something went wrong. Please try again.'}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date *"
                  value={formData.date}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formErrors.date}
                      helperText={formErrors.date}
                      className="glass-input"
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.session} className="glass-input">
                <InputLabel id="session-label">Session *</InputLabel>
                <Select
                  labelId="session-label"
                  name="session"
                  value={formData.session}
                  onChange={handleChange}
                  label="Session *"
                >
                  <MenuItem value="">Select Session</MenuItem>
                  <MenuItem value="morning">Morning Session</MenuItem>
                  <MenuItem value="afternoon">Afternoon Session</MenuItem>
                </Select>
                {formErrors.session && <FormHelperText>{formErrors.session}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason for Leave *"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                multiline
                rows={4}
                error={!!formErrors.reason}
                helperText={formErrors.reason || 'Provide details about why you need this leave'}
                className="glass-input"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Supporting Documents (Optional)
              </Typography>
              <input
                type="file"
                onChange={handleFileChange}
                style={{ marginBottom: '16px' }}
              />
              <FormHelperText>
                Upload any relevant documents to support your leave request
              </FormHelperText>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                className="glass-button"
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Half-Day Request'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default HalfDayRequestForm;