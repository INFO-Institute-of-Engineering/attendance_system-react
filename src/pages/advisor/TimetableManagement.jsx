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
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { fetchTimetable, updateTimetable } from '../../redux/slices/timetableSlice';

const TimetableManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { timetable, loading } = useSelector((state) => state.timetable);
  
  const [editMode, setEditMode] = useState(false);
  const [editedTimetable, setEditedTimetable] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({
    day: '',
    timeSlotIndex: -1,
    subject: '',
    teacher: '',
    room: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  useEffect(() => {
    // Fetch timetable for the advisor's class
    dispatch(fetchTimetable({ classId: user?.assignedClass || 'CS-2023' }));
  }, [dispatch, user]);
  
  useEffect(() => {
    if (timetable) {
      setEditedTimetable(JSON.parse(JSON.stringify(timetable)));
    }
  }, [timetable]);
  
  const handleEditClick = () => {
    setEditMode(true);
  };
  
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedTimetable(JSON.parse(JSON.stringify(timetable)));
  };
  
  const handleSaveChanges = async () => {
    try {
      await dispatch(updateTimetable({
        classId: user?.assignedClass || 'CS-2023',
        timetableData: editedTimetable
      })).unwrap();
      
      setEditMode(false);
      setSnackbar({
        open: true,
        message: 'Timetable updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update timetable',
        severity: 'error'
      });
    }
  };
  
  const handleCellClick = (day, timeSlotIndex) => {
    if (!editMode) return;
    
    const classInfo = editedTimetable.schedule[day][timeSlotIndex];
    setCurrentEdit({
      day,
      timeSlotIndex,
      subject: classInfo.subject,
      teacher: classInfo.teacher,
      room: classInfo.room
    });
    setOpenDialog(true);
  };
  
  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEdit({
      ...currentEdit,
      [name]: value
    });
  };
  
  const handleUpdateCell = () => {
    const { day, timeSlotIndex, subject, teacher, room } = currentEdit;
    
    // Create a deep copy of the edited timetable
    const updatedTimetable = JSON.parse(JSON.stringify(editedTimetable));
    
    // Update the specific cell
    updatedTimetable.schedule[day][timeSlotIndex] = {
      subject,
      teacher,
      room
    };
    
    setEditedTimetable(updatedTimetable);
    setOpenDialog(false);
  };
  
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  // Mock data for teachers
  const teachers = [
    'Dr. G. Selvavinayagam',
    'Mrs. A. Saranya',
    'Mrs. P. Gokila',
    'Mr. Arocia Selvaraj',
    'Dr. Saravanaraja',
    'Mrs. Sundari'
  ];
  
  // Mock data for subjects
  const subjects = [
    'Compiler Design',
    'Cryptography and Cyber Security',
    'Computer Environmental Sciences and Sustainability',
    'Distributed Computing',
    'Embedded Systems and IoT',
    'History',
    'Human Values and Ethics',
    'Database Management Systems',
    'Object Oriented Programming',
    'Foundations of Data Science'
  ];
  
  // Mock data for rooms
  const rooms = [
    'Room 301',
    'Room 201',
    'Room 302',
    'Lab 321',
    'Lab CSE-1',
    'Lab IT-1',
    'Lab CSE-2',
    'Seminar Hall - Ground Floor'
  ];
  
  if (loading && !timetable) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Timetable Management
        </Typography>
        
        <Box>
          {!editMode ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEditClick}
            >
              Edit Timetable
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      
      <Card className="glass-card" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Class Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ minWidth: 200 }}>
              <Typography variant="body2" color="text.secondary">
                Class
              </Typography>
              <Typography variant="body1" gutterBottom>
                {user?.assignedClass || 'CS-2023'}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 200 }}>
              <Typography variant="body2" color="text.secondary">
                Department
              </Typography>
              <Typography variant="body1" gutterBottom>
                {user?.department || 'Computer Science'}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 200 }}>
              <Typography variant="body2" color="text.secondary">
                Advisor
              </Typography>
              <Typography variant="body1" gutterBottom>
                {user?.name || 'Not available'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {editedTimetable ? (
        <TableContainer component={Paper} className="modern-table">
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Time Slot</TableCell>
                {editedTimetable.weekDays.map((day) => (
                  <TableCell key={day} align="center">{day}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {editedTimetable.timeSlots.map((timeSlot, index) => (
                <TableRow key={timeSlot}>
                  <TableCell component="th" scope="row">
                    {timeSlot}
                  </TableCell>
                  {editedTimetable.weekDays.map((day) => {
                    const classInfo = editedTimetable.schedule[day][index];
                    return (
                      <TableCell key={`${day}-${index}`} align="center" 
                        onClick={() => handleCellClick(day, index)}
                        sx={{ 
                          cursor: editMode ? 'pointer' : 'default',
                          '&:hover': editMode ? { bgcolor: 'action.hover' } : {}
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {classInfo.subject}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {classInfo.teacher}
                          </Typography>
                          <Typography variant="body2" color="primary" sx={{ fontSize: '0.75rem' }}>
                            {classInfo.room}
                          </Typography>
                          {editMode && (
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCellClick(day, index);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No timetable available for your class. Please create a new timetable.
          </Typography>
        </Paper>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Class Schedule</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="subject-label">Subject</InputLabel>
              <Select
                labelId="subject-label"
                name="subject"
                value={currentEdit.subject}
                onChange={handleInputChange}
                label="Subject"
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="teacher-label">Teacher</InputLabel>
              <Select
                labelId="teacher-label"
                name="teacher"
                value={currentEdit.teacher}
                onChange={handleInputChange}
                label="Teacher"
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher} value={teacher}>{teacher}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="room-label">Room</InputLabel>
              <Select
                labelId="room-label"
                name="room"
                value={currentEdit.room}
                onChange={handleInputChange}
                label="Room"
              >
                {rooms.map((room) => (
                  <MenuItem key={room} value={room}>{room}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="error">Cancel</Button>
          <Button onClick={handleUpdateCell} color="primary" variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TimetableManagement;