import { useEffect, useState } from 'react';
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
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { fetchStudents } from '../../redux/slices/userSlice';
import { updateAttendance } from '../../redux/slices/attendanceSlice';

const AttendanceManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { students, loading: studentsLoading } = useSelector((state) => state.user);
  const { loading: attendanceLoading } = useSelector((state) => state.attendance || { loading: false });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState({
    presentDays: 0,
    absentDays: 0,
    leaveDays: 0,
    totalDays: 0
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    dispatch(fetchStudents({ advisorId: user?.id }));
  }, [dispatch, user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditAttendance = (student) => {
    setSelectedStudent(student);
    setAttendanceData({
      presentDays: student.presentDays || 0,
      absentDays: student.absentDays || 0,
      leaveDays: student.leaveDays || 0,
      totalDays: student.totalDays || (student.presentDays + student.absentDays + student.leaveDays) || 0
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAttendanceChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    setAttendanceData(prev => {
      const newData = { ...prev, [field]: numValue };
      
      // Automatically update totalDays when any of the other fields change
      if (field !== 'totalDays') {
        newData.totalDays = newData.presentDays + newData.absentDays + newData.leaveDays;
      }
      
      return newData;
    });
  };

  const handleSaveAttendance = async () => {
    if (selectedStudent) {
      try {
        await dispatch(updateAttendance({
          studentId: selectedStudent.id,
          ...attendanceData
        })).unwrap();
        
        setSnackbar({
          open: true,
          message: 'Attendance data updated successfully',
          severity: 'success'
        });
        setOpenDialog(false);
        
        // Refresh student data
        dispatch(fetchStudents({ advisorId: user?.id }));
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || 'Failed to update attendance data',
          severity: 'error'
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Get unique classes from students
  const classes = [...new Set(students.map(student => student.className).filter(Boolean))];

  // Filter students based on search term, class filter, and tab
  const filteredStudents = students.filter((student) => {
    const matchesSearch = searchTerm === '' || 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = classFilter === 'all' || student.className === classFilter;
    
    // Tab 0: All students, Tab 1: Low attendance students
    const matchesTab = tabValue === 0 || 
      (tabValue === 1 && student.attendancePercentage < 75);
    
    return matchesSearch && matchesClass && matchesTab;
  });

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'primary';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const calculateAttendancePercentage = (present, total) => {
    if (!total) return 0;
    return Math.round((present / total) * 100);
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
        Attendance Management
      </Typography>

      {/* Tabs for filtering */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All Students" />
          <Tab label="Low Attendance Students" />
        </Tabs>
      </Paper>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={8}>
            <TextField
              fullWidth
              placeholder="Search by name or roll number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="class-filter-label">Class</InputLabel>
              <Select
                labelId="class-filter-label"
                value={classFilter}
                label="Class"
                onChange={(e) => setClassFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Classes</MenuItem>
                {classes.map(className => (
                  <MenuItem key={className} value={className}>{className}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Students Attendance Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Roll Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Present Days</TableCell>
              <TableCell>Absent Days</TableCell>
              <TableCell>Leave Days</TableCell>
              <TableCell>Total Days</TableCell>
              <TableCell>Attendance %</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const attendancePercentage = calculateAttendancePercentage(
                  student.presentDays || 0, 
                  student.totalDays || 0
                );
                
                return (
                  <TableRow key={student.id}>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.className}</TableCell>
                    <TableCell>{student.presentDays || 0}</TableCell>
                    <TableCell>{student.absentDays || 0}</TableCell>
                    <TableCell>{student.leaveDays || 0}</TableCell>
                    <TableCell>{student.totalDays || 0}</TableCell>
                    <TableCell>
                      <Typography 
                        color={getAttendanceColor(attendancePercentage)}
                        fontWeight="bold"
                      >
                        {attendancePercentage}%
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEditAttendance(student)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  {students.length === 0 
                    ? 'No students found.'
                    : 'No matching students found.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Attendance Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Attendance - {selectedStudent?.name}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Present Days"
                type="number"
                value={attendanceData.presentDays}
                onChange={(e) => handleAttendanceChange('presentDays', e.target.value)}
                InputProps={{ inputProps: { min: 0 } }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Absent Days"
                type="number"
                value={attendanceData.absentDays}
                onChange={(e) => handleAttendanceChange('absentDays', e.target.value)}
                InputProps={{ inputProps: { min: 0 } }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Leave Days"
                type="number"
                value={attendanceData.leaveDays}
                onChange={(e) => handleAttendanceChange('leaveDays', e.target.value)}
                InputProps={{ inputProps: { min: 0 } }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Days"
                type="number"
                value={attendanceData.totalDays}
                disabled
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Attendance Percentage: 
                <Typography 
                  component="span" 
                  fontWeight="bold"
                  color={getAttendanceColor(calculateAttendancePercentage(
                    attendanceData.presentDays, 
                    attendanceData.totalDays
                  ))}
                >
                  {calculateAttendancePercentage(
                    attendanceData.presentDays, 
                    attendanceData.totalDays
                  )}%
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveAttendance} 
            variant="contained" 
            color="primary"
            startIcon={<SaveIcon />}
            disabled={attendanceLoading}
          >
            {attendanceLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default AttendanceManagement;