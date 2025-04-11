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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { fetchLeaveRequests, updateLeaveStatus, setCurrentRequest } from '../../redux/slices/leaveSlice';

const HodManageLeaveRequests = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { requests, currentRequest, loading } = useSelector((state) => state.leave);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [actionType, setActionType] = useState('');
  const [remarks, setRemarks] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [advisorFilter, setAdvisorFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchLeaveRequests({ hodId: user?.id }));
  }, [dispatch, user]);

  const handleViewDetails = (request) => {
    dispatch(setCurrentRequest(request));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenActionDialog = (request, action) => {
    dispatch(setCurrentRequest(request));
    setActionType(action);
    setRemarks('');
    setOpenActionDialog(true);
  };

  const handleCloseActionDialog = () => {
    setOpenActionDialog(false);
  };

  const handleSubmitAction = async () => {
    if (currentRequest && actionType) {
      await dispatch(updateLeaveStatus({
        requestId: currentRequest.id,
        status: actionType,
        remarks: remarks,
        reviewedBy: user.name,
        reviewedAt: new Date().toISOString()
      }));
      
      setOpenActionDialog(false);
      // Refresh the leave requests
      dispatch(fetchLeaveRequests({ hodId: user?.id }));
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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

  // Get unique advisors from requests
  const advisors = [...new Set(requests.map(req => req.advisorName).filter(Boolean))];

  // Filter requests based on tab, search term, type filter, and advisor filter
  const getFilteredRequests = () => {
    let filtered = requests;
    
    // Filter by tab (status)
    if (tabValue === 0) {
      filtered = filtered.filter(req => req.status === 'pending');
    } else if (tabValue === 1) {
      filtered = filtered.filter(req => req.status === 'approved');
    } else if (tabValue === 2) {
      filtered = filtered.filter(req => req.status === 'rejected');
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by leave type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(req => req.leaveType === typeFilter);
    }

    // Filter by advisor
    if (advisorFilter !== 'all') {
      filtered = filtered.filter(req => req.advisorName === advisorFilter);
    }
    
    return filtered;
  };

  const filteredRequests = getFilteredRequests();

  if (loading && requests.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Leave Requests
      </Typography>

      {/* Tabs for filtering by status */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label={`Pending (${requests.filter(r => r.status === 'pending').length})`} />
          <Tab label={`Approved (${requests.filter(r => r.status === 'approved').length})`} />
          <Tab label={`Rejected (${requests.filter(r => r.status === 'rejected').length})`} />
        </Tabs>
      </Paper>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search by student name, reason or type"
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
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="type-filter-label">Leave Type</InputLabel>
              <Select
                labelId="type-filter-label"
                value={typeFilter}
                label="Leave Type"
                onChange={(e) => setTypeFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="full-day">Full Day</MenuItem>
                <MenuItem value="half-day">Half Day</MenuItem>
                <MenuItem value="on-duty">On-Duty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="advisor-filter-label">Advisor</InputLabel>
              <Select
                labelId="advisor-filter-label"
                value={advisorFilter}
                label="Advisor"
                onChange={(e) => setAdvisorFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Advisors</MenuItem>
                {advisors.map(advisor => (
                  <MenuItem key={advisor} value={advisor}>{advisor}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Leave Requests Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>From Date</TableCell>
              <TableCell>To Date</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Advisor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.studentName}</TableCell>
                  <TableCell>{request.leaveType}</TableCell>
                  <TableCell>{formatDate(request.fromDate)}</TableCell>
                  <TableCell>
                    {request.leaveType === 'half-day' 
                      ? '-' 
                      : formatDate(request.toDate)}
                  </TableCell>
                  <TableCell>
                    {request.reason.length > 30
                      ? `${request.reason.substring(0, 30)}...`
                      : request.reason}
                  </TableCell>
                  <TableCell>{request.advisorName || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={request.status} 
                      color={getStatusColor(request.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewDetails(request)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    {request.status === 'pending' && (
                      <>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenActionDialog(request, 'approved')}
                          color="success"
                        >
                          <ApproveIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenActionDialog(request, 'rejected')}
                          color="error"
                        >
                          <RejectIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  {requests.length === 0 
                    ? 'No leave requests found.'
                    : 'No matching leave requests found.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Leave Request Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Leave Request Details
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
          {currentRequest && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Student Information</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Name</Typography>
                    <Typography variant="body1">{currentRequest.studentName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Roll Number</Typography>
                    <Typography variant="body1">{currentRequest.studentRollNumber}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Department</Typography>
                    <Typography variant="body1">{currentRequest.studentDepartment}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Semester</Typography>
                    <Typography variant="body1">{currentRequest.studentSemester}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Leave Information</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Leave Type</Typography>
                    <Typography variant="body1">{currentRequest.leaveType}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip 
                      label={currentRequest.status} 
                      color={getStatusColor(currentRequest.status)} 
                      size="small" 
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">From Date</Typography>
                    <Typography variant="body1">{formatDate(currentRequest.fromDate)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">To Date</Typography>
                    <Typography variant="body1">
                      {currentRequest.leaveType === 'half-day' 
                        ? '-' 
                        : formatDate(currentRequest.toDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Reason</Typography>
                    <Typography variant="body1">{currentRequest.reason}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Review Information</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Advisor</Typography>
                    <Typography variant="body1">{currentRequest.advisorName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Advisor Status</Typography>
                    <Typography variant="body1">
                      {currentRequest.advisorStatus ? (
                        <Chip 
                          label={currentRequest.advisorStatus} 
                          color={getStatusColor(currentRequest.advisorStatus)} 
                          size="small" 
                        />
                      ) : 'Not reviewed'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Reviewed By</Typography>
                    <Typography variant="body1">{currentRequest.reviewedBy || 'Not reviewed yet'}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Reviewed On</Typography>
                    <Typography variant="body1">
                      {currentRequest.reviewedAt ? formatDate(currentRequest.reviewedAt) : 'Not reviewed yet'}
                    </Typography>
                  </Grid>
                  {currentRequest.remarks && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Remarks</Typography>
                      <Typography variant="body1">{currentRequest.remarks}</Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          {currentRequest && currentRequest.status === 'pending' && (
            <>
              <Button 
                onClick={() => {
                  handleCloseDialog();
                  handleOpenActionDialog(currentRequest, 'approved');
                }} 
                color="success" 
                variant="contained"
              >
                Approve
              </Button>
              <Button 
                onClick={() => {
                  handleCloseDialog();
                  handleOpenActionDialog(currentRequest, 'rejected');
                }} 
                color="error" 
                variant="contained"
              >
                Reject
              </Button>
            </>
          )}
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={openActionDialog} onClose={handleCloseActionDialog}>
        <DialogTitle>
          {actionType === 'approved' ? 'Approve Leave Request' : 'Reject Leave Request'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="remarks"
            label="Remarks (Optional)"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseActionDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitAction} 
            color={actionType === 'approved' ? 'success' : 'error'}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HodManageLeaveRequests;