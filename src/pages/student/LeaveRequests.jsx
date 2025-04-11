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
  InputLabel
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { fetchLeaveRequests, setCurrentRequest } from '../../redux/slices/leaveSlice';

const LeaveRequests = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { requests, currentRequest, loading } = useSelector((state) => state.leave);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchLeaveRequests({ studentId: user?.id }));
  }, [dispatch, user]);

  const handleViewDetails = (request) => {
    dispatch(setCurrentRequest(request));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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

  // Filter and search functionality
  const filteredRequests = requests.filter((request) => {
    const matchesSearch = searchTerm === '' || 
      request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesType = typeFilter === 'all' || request.leaveType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

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
        My Leave Requests
      </Typography>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Search by reason or type"
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
          <Grid item xs={6} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
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
                  {requests.length === 0 
                    ? 'No leave requests found. Submit your first leave request.'
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
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveRequests;