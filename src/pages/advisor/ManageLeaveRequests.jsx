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

const ManageLeaveRequests = () => {
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

  useEffect(() => {
    dispatch(fetchLeaveRequests({ advisorId: user?.id }));
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
      dispatch(fetchLeaveRequests({ advisorId: user?.id }));
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

  // Filter requests based on tab, search term, and type filter
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
      <Paper className="glass-card" sx={{ mb: 3 }}>
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
      <Paper className="glass-card" sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={8}>
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
              className="glass-input"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small" className="glass-input">
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
        </Grid>
      </Paper>

      {/* Leave Requests Table */}
      <TableContainer component={Paper} className="glass-card">
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>From Date</TableCell>
              <TableCell>To Date</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted On</TableCell>
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
                  <TableCell>
                    <Chip 
                      label={request.status} 
                      color={getStatusColor(request.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{formatDate(request.submittedAt)}</TableCell>
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewDetails(request)}
                      title="View Details"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    
                    {request.status === 'pending' && (
                      <>
                        <IconButton 
                          size="small" 
                          color="success" 
                          onClick={() => handleOpenActionDialog(request, 'approved')}
                          title="Approve"
                        >
                          <ApproveIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleOpenActionDialog(request, 'rejected')}
                          title="Reject"
                        >
                          <RejectIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No leave requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Details Dialog */}
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
            <RejectIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {currentRequest && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Student Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {currentRequest.studentName}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Leave Type
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {currentRequest.leaveType === 'full-day' ? 'Full Day Leave' :
                   currentRequest.leaveType === 'half-day' ? 'Half Day Leave' :
                   currentRequest.leaveType === 'on-duty' ? 'On-Duty Leave' : currentRequest.leaveType}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  From Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(currentRequest.fromDate)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  To Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {currentRequest.leaveType === 'half-day' ? '-' : formatDate(currentRequest.toDate)}
                </Typography>
              </Grid>
              
              {currentRequest.session && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Session
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentRequest.session === 'morning' ? 'Morning Session' : 'Afternoon Session'}
                  </Typography>
                </Grid>
              )}
              
              {currentRequest.eventName && (
                <>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Event Name
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {currentRequest.eventName}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Event Type
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {currentRequest.eventType}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Venue
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {currentRequest.venue}
                    </Typography>
                  </Grid>
                </>
              )}
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Reason
                </Typography>
                <Typography variant="body1" paragraph>
                  {currentRequest.reason}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={currentRequest.status} 
                  color={getStatusColor(currentRequest.status)} 
                  size="small" 
                />
              </Grid>
              
              {currentRequest.remarks && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Remarks
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {currentRequest.remarks}
                  </Typography>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Submitted On
                </Typography>
                <Typography variant="body1">
                  {formatDate(currentRequest.submittedAt)}
                </Typography>
              </Grid>
              
              {currentRequest.documents && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Supporting Documents
                  </Typography>
                  <Button variant="outlined" size="small" className="glass-button">
                    View Document
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          {currentRequest && currentRequest.status === 'pending' && (
            <>
              <Button 
                onClick={() => {
                  handleCloseDialog();
                  handleOpenActionDialog(currentRequest, 'rejected');
                }}
                color="error"
                variant="outlined"
                className="glass-button"
              >
                Reject
              </Button>
              <Button 
                onClick={() => {
                  handleCloseDialog();
                  handleOpenActionDialog(currentRequest, 'approved');
                }}
                color="success"
                variant="contained"
                className="glass-button"
              >
                Approve
              </Button>
            </>
          )}
          <Button onClick={handleCloseDialog} className="glass-button">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve/Reject Dialog */}
      <Dialog open={openActionDialog} onClose={handleCloseActionDialog}>
        <DialogTitle>
          {actionType === 'approved' ? 'Approve Leave Request' : 'Reject Leave Request'}
        </DialogTitle>
        <DialogContent>
          {currentRequest && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                {actionType === 'approved' 
                  ? 'You are about to approve the leave request from:' 
                  : 'You are about to reject the leave request from:'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>{currentRequest.studentName}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {currentRequest.leaveType === 'full-day' 
                  ? `Full day leave from ${formatDate(currentRequest.fromDate)} to ${formatDate(currentRequest.toDate)}` 
                  : currentRequest.leaveType === 'half-day'
                    ? `Half day leave on ${formatDate(currentRequest.fromDate)}` 
                    : `On-duty leave from ${formatDate(currentRequest.fromDate)} to ${formatDate(currentRequest.toDate)}`}
              </Typography>
              
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
                variant="outlined"
                className="glass-input"
                sx={{ mt: 3 }}
                placeholder={actionType === 'approved' 
                  ? 'Add any additional notes or instructions for the student...' 
                  : 'Please provide a reason for rejecting this request...'}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseActionDialog} className="glass-button">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitAction} 
            color={actionType === 'approved' ? 'success' : 'error'}
            variant="contained"
            className="glass-button"
          >
            {actionType === 'approved' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageLeaveRequests;