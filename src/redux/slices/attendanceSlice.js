import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
// import { Attendance } from '../../utils/mongodb';

// MongoDB is initialized in the api.js file

export const fetchAttendanceData = createAsyncThunk(
  'attendance/fetchData',
  async ({ studentId, classId }, { rejectWithValue }) => {
    try {
      // For development/testing purposes, simulate a successful response
      if (process.env.NODE_ENV === 'development') {
        // Mock response for testing
        return {
          studentId,
          presentDays: Math.floor(Math.random() * 80) + 10,
          absentDays: Math.floor(Math.random() * 20),
          leaveDays: Math.floor(Math.random() * 10),
          totalDays: 100
        };
      }
      
      // Actual implementation with Astra DB
      const response = await api.get('/api/attendance', { 
        params: { studentId, classId }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch attendance data' });
    }
  }
);

export const updateAttendance = createAsyncThunk(
  'attendance/update',
  async (attendanceData, { rejectWithValue }) => {
    try {
      // For development/testing purposes, simulate a successful response
      if (process.env.NODE_ENV === 'development') {
        // Mock response for testing
        return {
          ...attendanceData,
          updatedAt: new Date().toISOString()
        };
      }
      
      // Actual implementation with Astra DB
      const response = await api.put(`/api/attendance/${attendanceData.studentId}`, attendanceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update attendance data' });
    }
  }
);

export const bulkUpdateAttendance = createAsyncThunk(
  'attendance/bulkUpdate',
  async ({ classId, date, attendanceRecords }, { rejectWithValue }) => {
    try {
      // For development/testing purposes, simulate a successful response
      if (process.env.NODE_ENV === 'development') {
        // Mock response for testing
        return {
          classId,
          date,
          updatedCount: attendanceRecords.length,
          updatedAt: new Date().toISOString()
        };
      }
      
      // Actual implementation with Astra DB
      const response = await api.post('/api/attendance/bulk', {
        classId,
        date,
        attendanceRecords
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update attendance records' });
    }
  }
);

const initialState = {
  attendanceData: [],
  currentRecord: null,
  loading: false,
  error: null
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearAttendanceError: (state) => {
      state.error = null;
    },
    setCurrentRecord: (state, action) => {
      state.currentRecord = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch attendance data
      .addCase(fetchAttendanceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceData.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceData = action.payload;
      })
      .addCase(fetchAttendanceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to fetch attendance data' };
      })
      
      // Update attendance
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        // Update the attendance data if it exists in the state
        const index = state.attendanceData.findIndex(record => record.studentId === action.payload.studentId);
        if (index !== -1) {
          state.attendanceData[index] = action.payload;
        } else {
          state.attendanceData.push(action.payload);
        }
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to update attendance data' };
      })
      
      // Bulk update attendance
      .addCase(bulkUpdateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUpdateAttendance.fulfilled, (state) => {
        state.loading = false;
        // We'll need to refetch the data after bulk update
      })
      .addCase(bulkUpdateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to update attendance records' };
      });
  }
});

export const { clearAttendanceError, setCurrentRecord } = attendanceSlice.actions;

export default attendanceSlice.reducer;