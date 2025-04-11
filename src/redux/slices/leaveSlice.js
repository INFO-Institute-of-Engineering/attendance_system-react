import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const submitLeaveRequest = createAsyncThunk(
  'leave/submit',
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/leave/request', leaveData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchLeaveRequests = createAsyncThunk(
  'leave/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/leave/requests', { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateLeaveStatus = createAsyncThunk(
  'leave/updateStatus',
  async ({ requestId, status, remarks }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/leave/requests/${requestId}`, {
        status,
        remarks
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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