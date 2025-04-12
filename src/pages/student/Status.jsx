import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

const Status = () => {
  const { user } = useSelector((state) => state.auth);
  const { profile, loading: profileLoading } = useSelector((state) => state.user);
  const { requests, loading: leaveLoading } = useSelector((state) => state.leave);

  // Mock data for attendance status - replace with actual API data when available
  const [attendanceStatus, setAttendanceStatus] = useState({
    overallAttendance: '85%',
    subjectWiseAttendance: [
      { subject: 'Data Structures', percentage: '90%', status: 'good' },
      { subject: 'Database Management', percentage: '85%', status: 'good' },
      { subject: 'Computer Networks', percentage: '78%', status: 'warning' },
      { subject: 'Operating Systems', percentage: '92%', status: 'good' },
      { subject: 'Web Development', percentage: '73%', status: 'warning' }
    ]
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const getLeaveStatusColor = (status) => {
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

  if (profileLoading || leaveLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Attendance & Leave Status
      </Typography>

      <Grid container spacing={3}>
        {/* Overall Attendance Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Overall Attendance
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
              <Typography variant="h2" color={parseInt(attendanceStatus.overallAttendance) < 75 ? 'error.main' : 'success.main'}>
                {attendanceStatus.overallAttendance}
              </Typography>
            </Box>
            <Typography variant="body2" align="center" color="text.secondary">
              {parseInt(attendanceStatus.overallAttendance) < 75 
                ? 'Your attendance is below the required minimum of 75%' 
                : 'Your attendance is above the required minimum'}
            </Typography>
          </Paper>
        </Grid>

        {/* Subject-wise Attendance Card */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Subject-wise Attendance
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell align="center">Percentage</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceStatus.subjectWiseAttendance.map((subject, index) => (
                    <TableRow key={index}>
                      <TableCell>{subject.subject}</TableCell>
                      <TableCell align="center">{subject.percentage}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={subject.status.toUpperCase()} 
                          color={getStatusColor(subject.status)} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Leave Requests */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Leave Requests
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.slice(0, 5).map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.leaveType}</TableCell>
                      <TableCell>{new Date(request.fromDate).toLocaleDateString()}</TableCell>
                      <TableCell>{request.toDate ? new Date(request.toDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={request.status.toUpperCase()} 
                          color={getLeaveStatusColor(request.status)} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {requests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No leave requests found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Status;