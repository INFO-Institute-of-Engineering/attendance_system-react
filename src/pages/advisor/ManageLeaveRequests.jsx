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
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
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
              <TableCell>Status</TableCell>
              <TableCell>Submitted On</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.studentName || 'Unknown'}</TableCell>
                  <TableCell>{request.leaveType}</TableCell>
                  <TableCell>{formatDate(request.fromDate)}</TableCell>
                  <TableCell>
                    {request.leaveType === 'half-day' 
                      ? '-' 
                      : formatDate(request.toDate)}
                  </TableCell>
                  <TableCell>
                    {request.reason.length > 20
                      ? `${request.reason.substring(0, 20)}...`
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
                      color="primary"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    
                    {request.status === 'pending' && (
                      <>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenActionDialog(request, 'approved')}
                          color="success"
                        >
                          <ApproveIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenActionDialog(request, 'rejected')}
                          color="error"
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Student Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {currentRequest.studentName || 'Unknown'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Leave Type
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {currentRequest.leaveType}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={currentRequest.status} 
                  color={getStatusColor(currentRequest.status)} 
                  size="small" 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  From Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(currentRequest.fromDate)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  To Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {currentRequest.leaveType === 'half-day' 
                    ? '-' 
                    : formatDate(currentRequest.toDate)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Reason
                </Typography>
                <Typography variant="body1" paragraph>
                  {currentRequest.reason}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Submitted On
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(currentRequest.submittedAt)}
                </Typography>
              </Grid>
              {currentRequest.status !== 'pending' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Reviewed By
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {currentRequest.reviewedBy || 'Not available'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Reviewed On
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {currentRequest.reviewedAt 
                        ? formatDate(currentRequest.reviewedAt) 
                        : 'Not available'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Remarks
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {currentRequest.remarks || 'No remarks provided'}
                    </Typography>
                  </Grid>
                </>
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
                  handleOpenActionDialog(currentRequest, 'approved');
                }} 
                color="success"
              >
                Approve
              </Button>
              <Button 
                onClick={() => {
                  handleCloseDialog();
                  handleOpenActionDialog(currentRequest, 'rejected');
                }} 
                color="error"
              >
                Reject
              </Button>
            </>
          )}
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Approve/Reject Action Dialog */}
      <Dialog open={openActionDialog} onClose={handleCloseActionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'approved' ? 'Approve Leave Request' : 'Reject Leave Request'}
        </DialogTitle>
        <DialogContent dividers>
          {currentRequest && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {actionType === 'approved' 
                  ? 'You are about to approve this leave request.' 
                  : 'You are about to reject this leave request.'}
              </Typography>
              <Typography variant="body2" paragraph>
                Student: {currentRequest.studentName || 'Unknown'}<br />
                Leave Type: {currentRequest.leaveType}<br />
                Date: {formatDate(currentRequest.fromDate)}
                {currentRequest.leaveType !== 'half-day' && currentRequest.toDate !== currentRequest.fromDate && 
                  ` to ${formatDate(currentRequest.toDate)}`}
              </Typography>
              <TextField
                fullWidth
                label="Remarks (Optional)"
                multiline
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add any comments or notes about this decision"
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseActionDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitAction} 
            variant="contained" 
            color={actionType === 'approved' ? 'success' : 'error'}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : actionType === 'approved' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageLeaveRequests;