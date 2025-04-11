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

const HodDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { students, loading: studentsLoading } = useSelector((state) => state.user);
  const { requests, stats, loading: leaveLoading } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchLeaveRequests({ hodId: user?.id, status: 'pending' }));
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
          HOD Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/hod/leave/requests')}
        >
          Manage Leave Requests
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* HOD Info Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Department Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  HOD Name
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
                  Email
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {user?.email || 'Not available'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Contact
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {user?.phone || 'Not available'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Department Stats Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Department Overview
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
                onClick={() => navigate('/hod/students')}
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
                onClick={() => navigate('/hod/leave/requests')}
                sx={{ ml: 'auto' }}
              >
                View All Requests
              </Button>
            </CardActions>
          </Paper>
        </Grid>

        {/* Staff Management Card */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Staff Management
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" align="center">Advisors</Typography>
                    <Typography variant="h3" align="center" color="primary.main" sx={{ my: 2 }}>
                      {/* This would come from the API in a real implementation */}
                      5
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      onClick={() => navigate('/hod/staff')}
                    >
                      Manage Advisors
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" align="center">Classes</Typography>
                    <Typography variant="h3" align="center" color="primary.main" sx={{ my: 2 }}>
                      {/* This would come from the API in a real implementation */}
                      8
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      onClick={() => navigate('/hod/staff')}
                    >
                      View Class Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Leave Requests */}
        <Grid item xs={12}>
          <Paper>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Recent Leave Requests</Typography>
              <Button 
                size="small" 
                onClick={() => navigate('/hod/leave/requests')}
              >
                View All
              </Button>
            </Box>
            <Divider />
            {pendingRequests.length > 0 ? (
              <List>
                {pendingRequests.map((request) => (
                  <ListItem key={request.id} divider>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <Typography variant="subtitle1">{request.studentName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(request.fromDate)}
                          {request.toDate && request.fromDate !== request.toDate && 
                            ` to ${formatDate(request.toDate)}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <Typography variant="body2">
                          {request.reason}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={2}>
                        <Chip 
                          label={request.leaveType} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={6} sm={2} sx={{ textAlign: 'right' }}>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => navigate(`/hod/leave/requests?id=${request.id}`)}
                        >
                          Review
                        </Button>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1">No pending leave requests</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HodDashboard;