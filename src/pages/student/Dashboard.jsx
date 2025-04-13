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
import { Add as AddIcon, Schedule as ScheduleIcon } from '@mui/icons-material';
import { fetchLeaveRequests, updateStats } from '../../redux/slices/leaveSlice';
import { fetchUserProfile } from '../../redux/slices/userSlice';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { profile, loading: profileLoading } = useSelector((state) => state.user);
  const { requests, stats, loading: leaveLoading } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchLeaveRequests({ studentId: user?.id }));
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

  const recentLeaveRequests = requests.slice(0, 5);

  if (profileLoading || leaveLoading) {
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
          Student Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ScheduleIcon />}
            onClick={() => navigate('/student/timetable')}
          >
            View Timetable
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/student/leave/new')}
          >
            New Leave Request
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Student Info Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Student Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {profile?.name || user?.name || 'Not available'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Roll Number
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {profile?.rollNumber || 'Not available'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {profile?.department || 'Not available'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Semester
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {profile?.semester || 'Not available'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Attendance Stats Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Attendance Overview
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Card sx={{ textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h4">{profile?.attendancePercentage || '0%'}</Typography>
                    <Typography variant="body2">Overall Attendance</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h4">{profile?.presentDays || '0'}</Typography>
                    <Typography variant="body2">Present Days</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ textAlign: 'center', bgcolor: 'error.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h4">{profile?.absentDays || '0'}</Typography>
                    <Typography variant="body2">Absent Days</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
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
                onClick={() => navigate('/student/leave/requests')}
                sx={{ ml: 'auto' }}
              >
                View All Requests
              </Button>
            </CardActions>
          </Paper>
        </Grid>

        {/* Recent Leave Requests */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Leave Requests
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {recentLeaveRequests.length > 0 ? (
              <List>
                {recentLeaveRequests.map((request) => (
                  <ListItem key={request.id} divider>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1">
                            {request.leaveType} Leave
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
                No leave requests found. Create your first leave request.
              </Typography>
            )}
            {recentLeaveRequests.length > 0 && (
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/student/leave/requests')}
                >
                  View All
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;