import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { fetchStudents } from '../../redux/slices/userSlice';
import { fetchLeaveRequests } from '../../redux/slices/leaveSlice';

const ManageStudents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { students, loading } = useSelector((state) => state.user);
  const { requests } = useSelector((state) => state.leave);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchLeaveRequests({ advisorId: user?.id }));
  }, [dispatch, user]);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'primary';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter students based on search term
  const filteredStudents = students.filter((student) => {
    return searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get student's leave requests
  const getStudentLeaveRequests = (studentId) => {
    return requests.filter(req => req.studentId === studentId);
  };

  if (loading && students.length === 0) {
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
          Manage Students
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/advisor/students/add')}
        >
          Add New Student
        </Button>
      </Box>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name, roll number or department"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Students Table */}
      <TableContainer component={Paper} className="responsive-table-to-cards">
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Roll Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Attendance</TableCell>
              <TableCell>Present Days</TableCell>
              <TableCell>Absent Days</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell data-label="Roll Number">{student.rollNumber}</TableCell>
                  <TableCell data-label="Name">{student.name}</TableCell>
                  <TableCell data-label="Department">{student.department}</TableCell>
                  <TableCell data-label="Semester">{student.semester}</TableCell>
                  <TableCell data-label="Attendance">
                    <Chip 
                      label={`${student.attendancePercentage}%`} 
                      color={getAttendanceColor(student.attendancePercentage)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell data-label="Present Days">{student.presentDays}</TableCell>
                  <TableCell data-label="Absent Days">{student.absentDays}</TableCell>
                  <TableCell align="center" data-label="Actions">
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewDetails(student)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  {students.length === 0 
                    ? 'No students found.'
                    : 'No matching students found.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Student Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Student Details
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            &times;
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedStudent && (
            <Grid container spacing={3}>
              {/* Student Profile Card */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar 
                      sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
                    >
                      {selectedStudent.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      {selectedStudent.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {selectedStudent.rollNumber}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={1}>
                      <Grid item xs={6} sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" color="text.secondary">
                          Department
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography variant="body2">
                          {selectedStudent.department}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" color="text.secondary">
                          Semester
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography variant="body2">
                          {selectedStudent.semester}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography variant="body2">
                          {selectedStudent.email || 'Not available'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" color="text.secondary">
                          Phone
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography variant="body2">
                          {selectedStudent.phone || 'Not available'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Attendance Card */}
              <Grid item xs={12} md={8}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Attendance Overview
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Card sx={{ textAlign: 'center', bgcolor: getAttendanceColor(selectedStudent.attendancePercentage), color: 'white' }}>
                          <CardContent>
                            <Typography variant="h4">{selectedStudent.attendancePercentage}%</Typography>
                            <Typography variant="body2">Overall Attendance</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
                          <CardContent>
                            <Typography variant="h4">{selectedStudent.presentDays}</Typography>
                            <Typography variant="body2">Present Days</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card sx={{ textAlign: 'center', bgcolor: 'error.light', color: 'white' }}>
                          <CardContent>
                            <Typography variant="h4">{selectedStudent.absentDays}</Typography>
                            <Typography variant="body2">Absent Days</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                    
                    {selectedStudent.attendancePercentage < 75 && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                          <WarningIcon fontSize="small" sx={{ mr: 1 }} />
                          This student's attendance is below the required 75% threshold.
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Recent Leave Requests */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Leave Requests
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {getStudentLeaveRequests(selectedStudent.id).length > 0 ? (
                      <List>
                        {getStudentLeaveRequests(selectedStudent.id).slice(0, 5).map((request) => (
                          <ListItem key={request.id} divider>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: request.status === 'approved' ? 'success.main' : request.status === 'rejected' ? 'error.main' : 'warning.main' }}>
                                <PersonIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="subtitle1">
                                    {request.leaveType} Leave
                                  </Typography>
                                  <Chip 
                                    label={request.status} 
                                    color={request.status === 'approved' ? 'success' : request.status === 'rejected' ? 'error' : 'warning'} 
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
                      <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                        No leave requests found for this student.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageStudents;