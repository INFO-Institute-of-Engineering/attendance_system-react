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
  Class as ClassIcon,
  Add as AddIcon
} from '@mui/icons-material';

// This would be implemented in userSlice.js
const fetchAdvisors = () => {
  return {
    type: 'user/fetchAdvisors',
    payload: [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@info.edu',
        phone: '555-123-4567',
        department: 'Computer Science',
        assignedClass: 'CS-2023',
        joinedDate: '2020-06-15',
        studentsCount: 45,
        leaveRequestsHandled: 120,
        approvalRate: 85
      },
      {
        id: 2,
        name: 'Prof. Michael Chen',
        email: 'michael.chen@info.edu',
        phone: '555-987-6543',
        department: 'Computer Science',
        assignedClass: 'CS-2022',
        joinedDate: '2019-08-10',
        studentsCount: 42,
        leaveRequestsHandled: 98,
        approvalRate: 78
      },
      {
        id: 3,
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@info.edu',
        phone: '555-456-7890',
        department: 'Computer Science',
        assignedClass: 'CS-2024',
        joinedDate: '2021-01-05',
        studentsCount: 48,
        leaveRequestsHandled: 75,
        approvalRate: 92
      },
      {
        id: 4,
        name: 'Prof. David Kim',
        email: 'david.kim@info.edu',
        phone: '555-789-0123',
        department: 'Computer Science',
        assignedClass: 'CS-2021',
        joinedDate: '2018-07-20',
        studentsCount: 40,
        leaveRequestsHandled: 150,
        approvalRate: 80
      },
      {
        id: 5,
        name: 'Dr. Lisa Wang',
        email: 'lisa.wang@info.edu',
        phone: '555-234-5678',
        department: 'Computer Science',
        assignedClass: 'CS-2025',
        joinedDate: '2022-02-15',
        studentsCount: 46,
        leaveRequestsHandled: 45,
        approvalRate: 88
      }
    ]
  };
};

const ManageStaff = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  // This would be implemented in the Redux store
  // const { advisors, loading } = useSelector((state) => state.user);
  
  // Mock data for development
  const [loading, setLoading] = useState(true);
  const [advisors, setAdvisors] = useState([]);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      // In a real implementation, this would be:
      // await dispatch(fetchAdvisors());
      const action = fetchAdvisors();
      setAdvisors(action.payload);
      setLoading(false);
    };
    
    fetchData();
  }, [dispatch]);

  const handleViewDetails = (advisor) => {
    setSelectedAdvisor(advisor);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter advisors based on search term
  const filteredAdvisors = advisors.filter((advisor) => {
    return searchTerm === '' || 
      advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisor.assignedClass.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading && advisors.length === 0) {
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
          Manage Staff
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/hod/staff/add')}
        >
          Add New Class Advisor
        </Button>
      </Box>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name, email or class"
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

      {/* Advisors Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Assigned Class</TableCell>
              <TableCell>Students Count</TableCell>
              <TableCell>Leave Requests Handled</TableCell>
              <TableCell>Approval Rate</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdvisors.length > 0 ? (
              filteredAdvisors.map((advisor) => (
                <TableRow key={advisor.id}>
                  <TableCell>{advisor.name}</TableCell>
                  <TableCell>{advisor.email}</TableCell>
                  <TableCell>{advisor.assignedClass}</TableCell>
                  <TableCell>{advisor.studentsCount}</TableCell>
                  <TableCell>{advisor.leaveRequestsHandled}</TableCell>
                  <TableCell>
                    <Chip 
                      label={`${advisor.approvalRate}%`} 
                      color={advisor.approvalRate > 85 ? 'success' : advisor.approvalRate > 70 ? 'primary' : 'warning'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewDetails(advisor)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  {advisors.length === 0 
                    ? 'No advisors found.'
                    : 'No matching advisors found.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Advisor Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Advisor Details
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
          {selectedAdvisor && (
            <Grid container spacing={3}>
              {/* Advisor Profile Card */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar 
                      sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
                    >
                      {selectedAdvisor.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      {selectedAdvisor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {selectedAdvisor.email}
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
                          {selectedAdvisor.department}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" color="text.secondary">
                          Phone
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography variant="body2">
                          {selectedAdvisor.phone}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" color="text.secondary">
                          Joined Date
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography variant="body2">
                          {formatDate(selectedAdvisor.joinedDate)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Class Information Card */}
              <Grid item xs={12} md={8}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Class Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Card sx={{ bgcolor: 'primary.light', color: 'white', p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ClassIcon sx={{ fontSize: 40, mr: 2 }} />
                            <Box>
                              <Typography variant="body2">Assigned Class</Typography>
                              <Typography variant="h5">{selectedAdvisor.assignedClass}</Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card sx={{ bgcolor: 'success.light', color: 'white', p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ fontSize: 40, mr: 2 }} />
                            <Box>
                              <Typography variant="body2">Students</Typography>
                              <Typography variant="h5">{selectedAdvisor.studentsCount}</Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                    
                    <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                      Performance Metrics
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Card sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                          <Typography variant="body2" color="text.secondary">Leave Requests Handled</Typography>
                          <Typography variant="h4" color="primary.main" sx={{ mt: 1 }}>
                            {selectedAdvisor.leaveRequestsHandled}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                          <Typography variant="body2" color="text.secondary">Approval Rate</Typography>
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              mt: 1,
                              color: selectedAdvisor.approvalRate > 85 ? 'success.main' : 
                                    selectedAdvisor.approvalRate > 70 ? 'primary.main' : 'warning.main'
                            }}
                          >
                            {selectedAdvisor.approvalRate}%
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Recent Activity - This would be implemented with real data in a production app */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Activity
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <List>
                      <ListItem divider>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.main' }}>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Approved leave request for John Smith"
                          secondary={`${formatDate(new Date(Date.now() - 86400000))} • Medical Leave`}
                        />
                      </ListItem>
                      <ListItem divider>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'error.main' }}>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Rejected leave request for Emily Johnson"
                          secondary={`${formatDate(new Date(Date.now() - 172800000))} • Personal Leave`}
                        />
                      </ListItem>
                      <ListItem divider>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <ClassIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Updated class attendance records"
                          secondary={formatDate(new Date(Date.now() - 259200000))}
                        />
                      </ListItem>
                    </List>
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

export default ManageStaff;