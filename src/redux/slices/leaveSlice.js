import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const submitLeaveRequest = createAsyncThunk(
  'leave/submit',
  async (leaveData, { rejectWithValue, getState }) => {
    try {
      // For development/testing purposes, simulate a successful response
      // Remove this mock response and uncomment the actual API call when backend is ready
      const { auth } = getState();
      const mockResponse = {
        id: Math.floor(Math.random() * 1000) + 1,
        ...leaveData,
        studentId: auth.user?.id || 1,
        studentName: auth.user?.name || 'Test User',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return mockResponse;
      
      // Uncomment this when your backend is ready
      // const response = await api.post('/api/leave/request', leaveData);
      // return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to submit leave request' });
    }
  }
);

export const fetchLeaveRequests = createAsyncThunk(
  'leave/fetchAll',
  async (filters, { rejectWithValue, getState }) => {
    try {
      // For development/testing purposes, simulate a successful response
      // Remove this mock response and uncomment the actual API call when backend is ready
      const { auth } = getState();
      const role = auth.user?.role || 'student';
      
      // Generate mock leave requests based on role
      const mockLeaveRequests = [];
      
      // Create 5 sample leave requests
      for (let i = 1; i <= 5; i++) {
        const status = ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)];
        mockLeaveRequests.push({
          id: i,
          studentId: role === 'student' ? auth.user?.id || 1 : i,
          studentName: role === 'student' ? auth.user?.name || 'Test User' : `Student ${i}`,
          startDate: new Date(2023, 9, i).toISOString(),
          endDate: new Date(2023, 9, i + 2).toISOString(),
          reason: `Sample leave reason ${i}`,
          status: status,
          remarks: status !== 'pending' ? 'Sample remarks' : '',
          createdAt: new Date(2023, 9, i - 1).toISOString(),
          updatedAt: new Date(2023, 9, i - 1).toISOString()
        });
      }
      
      // Filter based on role
      if (role === 'student') {
        // Students only see their own requests
        return mockLeaveRequests.filter(req => req.studentId === (auth.user?.id || 1));
      } else {
        // Advisors and HODs see all requests
        return mockLeaveRequests;
      }
      
      // Uncomment this when your backend is ready
      // const response = await api.get('/api/leave/requests', { params: filters });
      // return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch leave requests' });
    }
  }
);

export const updateLeaveStatus = createAsyncThunk(
  'leave/updateStatus',
  async ({ requestId, status, remarks }, { rejectWithValue, getState }) => {
    try {
      // For development/testing purposes, simulate a successful response
      // Remove this mock response and uncomment the actual API call when backend is ready
      const mockResponse = {
        id: requestId,
        status,
        remarks,
        updatedAt: new Date().toISOString()
      };
      
      return mockResponse;
      
      // Uncomment this when your backend is ready
      // const response = await api.put(`/api/leave/requests/${requestId}`, {
      //   status,
      //   remarks
      // });
      // return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update leave status' });
    }
  }
);

const initialState = {
  requests: [],
  currentRequest: null,
  loading: false,
  error: null,
  stats: {
    pending: 0,
    approved: 0,
    rejected: 0
  }
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRequest: (state, action) => {
      state.currentRequest = action.payload;
    },
    updateStats: (state) => {
      state.stats = {
        pending: state.requests.filter(req => req.status === 'pending').length,
        approved: state.requests.filter(req => req.status === 'approved').length,
        rejected: state.requests.filter(req => req.status === 'rejected').length
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.unshift(action.payload);
        state.currentRequest = action.payload;
      })
      .addCase(submitLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateLeaveStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.requests.findIndex(req => req.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setCurrentRequest, updateStats } = leaveSlice.actions;
export default leaveSlice.reducer;