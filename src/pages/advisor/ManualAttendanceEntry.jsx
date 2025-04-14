import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Button,
  CircularProgress,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { fetchStudents } from '../../redux/slices/userSlice';
import { bulkUpdateAttendance } from '../../redux/slices/attendanceSlice';

const ManualAttendanceEntry = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { students, loading: studentsLoading } = useSelector((state) => state.user);
  const { loading: attendanceLoading } = useSelector((state) => state.attendance || { loading: false });
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Get unique classes from students
  const classes = [...new Set(students.map(student => student.className).filter(Boolean))];

  useEffect(() => {
    dispatch(fetchStudents({ advisorId: user?.id }));
  }, [dispatch, user]);

  useEffect(() => {
    // Initialize attendance records when students or selected class changes
    if (selectedClass) {
      const classStudents = students.filter(student => student.className === selectedClass);
      setAttendanceRecords(classStudents.map(student => ({
        studentId: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        present: true,
        onLeave: false,
        remarks: ''
      })));
    } else {
      setAttendanceRecords([]);
    }
  }, [selectedClass, students]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const handleAttendanceChange = (index, field, value) => {
    const updatedRecords = [...attendanceRecords];
    
    // If changing present status and new value is true, set onLeave to false
    if (field === 'present' && value === true) {
      updatedRecords[index] = {
        ...updatedRecords[index],
        present: true,
        onLeave: false
      };
    } 
    // If changing onLeave status and new value is true, set present to false
    else if (field === 'onLeave' && value === true) {
      updatedRecords[index] = {
        ...updatedRecords[index],
        present: false,
        onLeave: true
      };
    }
    // For all other cases, just update the specified field
    else {
      updatedRecords[index] = {
        ...updatedRecords[index],
        [field]: value
      };
    }
    
    setAttendanceRecords(updatedRecords);
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      setSnackbar({
        open: true,
        message: 'Please select a class and date',
        severity: 'error'
      });
      return;
    }

    try {
      // Format the date to ISO string for consistency
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      // Prepare the attendance data for submission
      const attendanceData = {
        classId: selectedClass,
        date: formattedDate,
        attendanceRecords: attendanceRecords.map(record => ({
          studentId: record.studentId,
          present: record.present,
          onLeave: record.onLeave,
          remarks: record.remarks
        }))
      };
      
      await dispatch(bulkUpdateAttendance(attendanceData)).unwrap();
      
      setSnackbar({
        open: true,
        message: 'Attendance data saved successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to save attendance data',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleMarkAllPresent = () => {
    setAttendanceRecords(prev => prev.map(record => ({
      ...record,
      present: true,
      onLeave: false
    })));
  };

  if (studentsLoading && students.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Manual Attendance Entry
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                maxDate={new Date()}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="class-select-label">Select Class</InputLabel>
              <Select
                labelId="class-select-label"
                value={selectedClass}
                label="Select Class"
                onChange={handleClassChange}
              >
                {classes.map(className => (
                  <MenuItem key={className} value={className}>{className}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} container justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleMarkAllPresent}
              disabled={attendanceRecords.length === 0}
              sx={{ mr: 1 }}
            >
              Mark All Present
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveAttendance}
              disabled={attendanceLoading || attendanceRecords.length === 0}
            >
              {attendanceLoading ? 'Saving...' : 'Save Attendance'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {selectedClass ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Roll Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="center">Present</TableCell>
                <TableCell align="center">On Leave</TableCell>
                <TableCell>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((record, index) => (
                  <TableRow key={record.studentId}>
                    <TableCell>{record.rollNumber}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={record.present}
                        onChange={(e) => handleAttendanceChange(index, 'present', e.target.checked)}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={record.onLeave}
                        onChange={(e) => handleAttendanceChange(index, 'onLeave', e.target.checked)}
                        color="secondary"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Optional remarks"
                        value={record.remarks}
                        onChange={(e) => handleAttendanceChange(index, 'remarks', e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    No students found in this class.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Please select a class to view and manage attendance.
          </Typography>
        </Paper>
      )}

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManualAttendanceEntry;