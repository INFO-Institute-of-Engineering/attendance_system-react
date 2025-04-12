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
  Chip,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const Attendance = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, loading } = useSelector((state) => state.user);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');

  // Mock attendance data - replace with actual API call when backend is ready
  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      date: '2023-10-01',
      subject: 'Data Structures',
      status: 'present',
      time: '09:00 AM - 10:00 AM'
    },
    {
      id: 2,
      date: '2023-10-01',
      subject: 'Database Management',
      status: 'present',
      time: '10:00 AM - 11:00 AM'
    },
    {
      id: 3,
      date: '2023-10-01',
      subject: 'Computer Networks',
      status: 'absent',
      time: '11:00 AM - 12:00 PM'
    },
    {
      id: 4,
      date: '2023-10-02',
      subject: 'Data Structures',
      status: 'present',
      time: '09:00 AM - 10:00 AM'
    },
    {
      id: 5,
      date: '2023-10-02',
      subject: 'Database Management',
      status: 'present',
      time: '10:00 AM - 11:00 AM'
    },
    {
      id: 6,
      date: '2023-10-02',
      subject: 'Computer Networks',
      status: 'present',
      time: '11:00 AM - 12:00 PM'
    },
    {
      id: 7,
      date: '2023-10-03',
      subject: 'Data Structures',
      status: 'od',
      time: '09:00 AM - 10:00 AM'
    },
    {
      id: 8,
      date: '2023-10-03',
      subject: 'Database Management',
      status: 'od',
      time: '10:00 AM - 11:00 AM'
    },
    {
      id: 9,
      date: '2023-10-03',
      subject: 'Computer Networks',
      status: 'od',
      time: '11:00 AM - 12:00 PM'
    },
    {
      id: 10,
      date: '2023-10-04',
      subject: 'Data Structures',
      status: 'half-day',
      time: '09:00 AM - 10:00 AM'
    }
  ]);

  // Get unique subjects from attendance data
  const subjects = [...new Set(attendanceData.map(item => item.subject))];

  // Get unique months from attendance data
  const months = [...new Set(attendanceData.map(item => {
    const date = new Date(item.date);
    return `${date.getMonth() + 1}-${date.getFullYear()}`;
  }))];

  // Calculate attendance statistics
  const calculateStats = () => {
    const total = attendanceData.length;
    const present = attendanceData.filter(item => item.status === 'present').length;
    const absent = attendanceData.filter(item => item.status === 'absent').length;
    const od = attendanceData.filter(item => item.status === 'od').length;
    const halfDay = attendanceData.filter(item => item.status === 'half-day').length;
    
    const presentPercentage = Math.round((present / total) * 100);
    
    return {
      total,
      present,
      absent,
      od,
      halfDay,
      presentPercentage
    };
  };

  const stats = calculateStats();

  // Filter attendance data based on search term, subject filter, and month filter
  const filteredAttendance = attendanceData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === 'all' || item.subject === subjectFilter;
    
    const itemDate = new Date(item.date);
    const itemMonth = `${itemDate.getMonth() + 1}-${itemDate.getFullYear()}`;
    const matchesMonth = monthFilter === 'all' || itemMonth === monthFilter;
    
    return matchesSearch && matchesSubject && matchesMonth;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'od':
        return 'info';
      case 'half-day':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Attendance
      </Typography>

      {/* Attendance Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card className="glass-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" className="gradient-text">{stats.presentPercentage}%</Typography>
              <Typography variant="body1">Overall Attendance</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card className="glass-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="success.main">{stats.present}</Typography>
              <Typography variant="body2">Present</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card className="glass-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="error.main">{stats.absent}</Typography>
              <Typography variant="body2">Absent</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card className="glass-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="info.main">{stats.od}</Typography>
              <Typography variant="body2">OD</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card className="glass-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="warning.main">{stats.halfDay}</Typography>
              <Typography variant="body2">Half Day</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }} className="glass">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Search by subject"
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
              className="glass-input"
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth size="small" className="glass-input">
              <InputLabel id="subject-filter-label">Subject</InputLabel>
              <Select
                labelId="subject-filter-label"
                value={subjectFilter}
                label="Subject"
                onChange={(e) => setSubjectFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Subjects</MenuItem>
                {subjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth size="small" className="glass-input">
              <InputLabel id="month-filter-label">Month</InputLabel>
              <Select
                labelId="month-filter-label"
                value={monthFilter}
                label="Month"
                onChange={(e) => setMonthFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <CalendarIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Months</MenuItem>
                {months.map((month) => {
                  const [m, y] = month.split('-');
                  const monthName = new Date(y, m - 1).toLocaleString('default', { month: 'long' });
                  return (
                    <MenuItem key={month} value={month}>{`${monthName} ${y}`}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Attendance Table */}
      <TableContainer component={Paper} className="modern-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAttendance.length > 0 ? (
              filteredAttendance.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>{item.subject}</TableCell>
                  <TableCell>{item.time}</TableCell>
                  <TableCell>
                    <Chip 
                      label={item.status.toUpperCase()} 
                      color={getStatusColor(item.status)} 
                      size="small" 
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No attendance records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Attendance;