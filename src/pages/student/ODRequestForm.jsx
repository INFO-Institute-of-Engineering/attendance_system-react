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

const ODRequestForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.leave);

  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    reason: '',
    eventName: '',
    eventType: '',
    venue: '',
    documents: null
  });

  const [formErrors, setFormErrors] = useState({
    fromDate: '',
    toDate: '',
    reason: '',
    eventName: '',
    eventType: '',
    venue: ''
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {
      fromDate: '',
      toDate: '',
      reason: '',
      eventName: '',
      eventType: '',
      venue: ''
    };

    if (!formData.fromDate) {
      errors.fromDate = 'From date is required';
      isValid = false;
    }

    if (!formData.toDate) {
      errors.toDate = 'To date is required';
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

    if (!formData.eventName.trim()) {
      errors.eventName = 'Event name is required';
      isValid = false;
    }

    if (!formData.eventType.trim()) {
      errors.eventType = 'Event type is required';
      isValid = false;
    }

    if (!formData.venue.trim()) {
      errors.venue = 'Venue is required';
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
    const odData = {
      studentId: user.id,
      leaveType: 'od',  // Marking as OD type
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      reason: formData.reason,
      eventName: formData.eventName,
      eventType: formData.eventType,
      venue: formData.venue,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    const result = await dispatch(submitLeaveRequest(odData));

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/student/leave/requests');
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Submit OD Request
      </Typography>
      <Paper className="glass-card" sx={{ p: 3, mb: 4 }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          Fill out the form below to request On Duty (OD) leave for events, competitions, or other official activities.
          Your request will be reviewed by your class advisor and then by the HoD.
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
                  label="From Date *"
                  value={formData.fromDate}
                  onChange={(date) => handleDateChange('fromDate', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formErrors.fromDate}
                      helperText={formErrors.fromDate}
                      className="glass-input"
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="To Date *"
                  value={formData.toDate}
                  onChange={(date) => handleDateChange('toDate', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formErrors.toDate}
                      helperText={formErrors.toDate}
                      className="glass-input"
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Event Name *"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                error={!!formErrors.eventName}
                helperText={formErrors.eventName}
                className="glass-input"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.eventType} className="glass-input">
                <InputLabel id="event-type-label">Event Type *</InputLabel>
                <Select
                  labelId="event-type-label"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  label="Event Type *"
                >
                  <MenuItem value="">Select Event Type</MenuItem>
                  <MenuItem value="conference">Conference</MenuItem>
                  <MenuItem value="workshop">Workshop</MenuItem>
                  <MenuItem value="competition">Competition</MenuItem>
                  <MenuItem value="seminar">Seminar</MenuItem>
                  <MenuItem value="sports">Sports Event</MenuItem>
                  <MenuItem value="cultural">Cultural Event</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {formErrors.eventType && <FormHelperText>{formErrors.eventType}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Venue *"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                error={!!formErrors.venue}
                helperText={formErrors.venue}
                className="glass-input"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason for OD *"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                multiline
                rows={4}
                error={!!formErrors.reason}
                helperText={formErrors.reason || 'Provide details about why you need this OD'}
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
                Upload invitation letter, event registration confirmation, or any relevant documents
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
                {loading ? <CircularProgress size={24} /> : 'Submit OD Request'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ODRequestForm;