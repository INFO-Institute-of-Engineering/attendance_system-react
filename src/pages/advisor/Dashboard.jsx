import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Card,
  CardContent,
  CardActions,
  CircularProgress
} from '@mui/material';
import { fetchLeaveRequests, updateStats } from '../../redux/slices/leaveSlice';
import { fetchStudents } from '../../redux/slices/userSlice';

const AdvisorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { students, loading: studentsLoading } = useSelector((state) => state.user);
  const { requests, stats, loading: leaveLoading } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchLeaveRequests({ advisorId: user?.id, status: 'pending' }));
  }, [dispatch, user]);

  useEffect(() => {
    if (requests.length > 0) {
      dispatch(updateStats());
    }
  }, [dispatch, requests]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get only pending requests for the dashboard
  const pendingRequests = requests.filter(req => req.status === 'pending').slice(0, 5);

  if (studentsLoading || leaveLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Advisor Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/advisor/leave/requests')}
        >
          Manage Leave Requests
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Advisor Info Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Advisor Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {user?.name || 'Not available'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {user?.department || 'Not available'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Class
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {user?.assignedClass || 'Not available'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Contact
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {user?.email || 'Not available'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Class Stats Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Class Overview
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Card sx={{ textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h4">{students.length}</Typography>
                    <Typography variant="body2">Total Students</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h4">{students.filter(s => s.attendancePercentage >= 75).length}</Typography>
                    <Typography variant="body2">Good Attendance</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ textAlign: 'center', bgcolor: 'error.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h4">{students.filter(s => s.attendancePercentage < 75).length}</Typography>
                    <Typography variant="body2">Low Attendance</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <CardActions>
              <Button 
                size="small" 
                onClick={() => navigate('/advisor/students')}
                sx={{ ml: 'auto' }}
              >
                View All Students
              </Button>
            </CardActions>
          </Paper>
        </Grid>

        {/* Leave Requests Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Leave Request Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Card sx={{ textAlign: 'center' }}>
                  <CardContent>
                    <Typography variant="h4">{stats.pending}</Typography>
                    <Typography variant="body2" color="warning.main">Pending</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ textAlign: 'center' }}>
                  <CardContent>
                    <Typography variant="h4">{stats.approved}</Typography>
                    <Typography variant="body2" color="success.main">Approved</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ textAlign: 'center' }}>
                  <CardContent>
                    <Typography variant="h4">{stats.rejected}</Typography>
                    <Typography variant="body2" color="error.main">Rejected</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <CardActions>
              <Button 
                size="small" 
                onClick={() => navigate('/advisor/leave/requests')}
                sx={{ ml: 'auto' }}
              >
                View All Requests
              </Button>
            </CardActions>
          </Paper>
        </Grid>

        {/* Pending Leave Requests */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Pending Leave Requests
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {pendingRequests.length > 0 ? (
              <List>
                {pendingRequests.map((request) => (
                  <ListItem key={request.id} divider>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1">
                            {request.studentName || 'Student'} - {request.leaveType} Leave
                          </Typography>
                          <Chip 
                            label={request.status} 
                            color={getStatusColor(request.status)} 
                            size="small" 
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {formatDate(request.fromDate)}
                            {request.toDate && request.fromDate !== request.toDate && 
                              ` to ${formatDate(request.toDate)}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {request.reason}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                No pending leave requests to review.
              </Typography>
            )}
            {pendingRequests.length > 0 && (
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/advisor/leave/requests')}
                >
                  Review All
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvisorDashboard;