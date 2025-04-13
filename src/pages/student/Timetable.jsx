import { useEffect } from 'react';
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
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import { fetchTimetable } from '../../redux/slices/timetableSlice';

const Timetable = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { timetable, loading } = useSelector((state) => state.timetable);

  useEffect(() => {
    // Fetch timetable for the student's class
    // In a real implementation, the classId would come from the user's profile
    dispatch(fetchTimetable({ classId: user?.classId || 'CS-2023' }));
  }, [dispatch, user]);

  if (loading && !timetable) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Weekly Timetable
      </Typography>
      
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
                {user?.className || 'CS-2023'}
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
                Semester
              </Typography>
              <Typography variant="body1" gutterBottom>
                {user?.semester || '5'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {timetable ? (
        <TableContainer component={Paper} className="modern-table">
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Time Slot</TableCell>
                {timetable.weekDays.map((day) => (
                  <TableCell key={day} align="center">{day}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {timetable.timeSlots.map((timeSlot, index) => (
                <TableRow key={timeSlot}>
                  <TableCell component="th" scope="row">
                    {timeSlot}
                  </TableCell>
                  {timetable.weekDays.map((day) => {
                    const classInfo = timetable.schedule[day][index];
                    return (
                      <TableCell key={`${day}-${index}`} align="center">
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {classInfo.subject}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {classInfo.teacher}
                          </Typography>
                          <Chip 
                            label={classInfo.room} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
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
            No timetable available for your class. Please contact your class advisor.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Timetable;