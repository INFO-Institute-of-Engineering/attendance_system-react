import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks for timetable operations
export const fetchTimetable = createAsyncThunk(
  'timetable/fetchTimetable',
  async ({ classId }, { rejectWithValue }) => {
    try {
      // For development/testing purposes, simulate a successful response
      // Remove this mock response and uncomment the actual API call when backend is ready
      const mockTimetable = {
        classId,
        weekDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday'],
        timeSlots: ['9:00 AM - 9:50 AM', '9:50 AM - 10:40 AM', '10:50 AM - 11:40 AM', 
                   '11:40 AM - 12:30 PM', '1:10 PM - 2:00 PM', '2:00 PM - 2:50 PM', '3:00 PM - 3:45 PM', '3:45 PM - 4:30 PM'],
        schedule: {
          'Monday': [
            { subject: 'Database Management', teacher: 'Mr. Arocia Selvaraj', room: 'Room 301' },
            { subject: 'Physics', teacher: 'Prof. Michael Chen', room: 'Lab 201' },
            { subject: 'Computer Science', teacher: 'Dr. Emily Rodriguez', room: 'Lab 301' },
            { subject: 'English', teacher: 'Prof. David Kim', room: 'Room 102' },
            { subject: 'Chemistry', teacher: 'Dr. Lisa Wang', room: 'Lab 202' },
            { subject: 'History', teacher: 'Prof. Robert Brown', room: 'Room 103' },
            { subject: 'Chemistry', teacher: 'Dr. Lisa Wang', room: 'Lab 202' },
            { subject: 'History', teacher: 'Prof. Robert Brown', room: 'Room 103' }
          ],
          'Tuesday': [
            { subject: 'Physics', teacher: 'Prof. Michael Chen', room: 'Lab 201' },
            { subject: 'Computer Science', teacher: 'Dr. Emily Rodriguez', room: 'Lab 301' },
            { subject: 'Mathematics', teacher: 'Dr. Sarah Johnson', room: 'Room 101' },
            { subject: 'Chemistry', teacher: 'Dr. Lisa Wang', room: 'Lab 202' },
            { subject: 'History', teacher: 'Prof. Robert Brown', room: 'Room 103' },
            { subject: 'English', teacher: 'Prof. David Kim', room: 'Room 102' },
            { subject: 'Chemistry', teacher: 'Dr. Lisa Wang', room: 'Lab 202' },
            { subject: 'History', teacher: 'Prof. Robert Brown', room: 'Room 103' }
          ],
          'Wednesday': [
            { subject: 'Computer Science', teacher: 'Dr. Emily Rodriguez', room: 'Lab 301' },
            { subject: 'Mathematics', teacher: 'Dr. Sarah Johnson', room: 'Room 101' },
            { subject: 'Physics', teacher: 'Prof. Michael Chen', room: 'Lab 201' },
            { subject: 'History', teacher: 'Prof. Robert Brown', room: 'Room 103' },
            { subject: 'English', teacher: 'Prof. David Kim', room: 'Room 102' },
            { subject: 'Chemistry', teacher: 'Dr. Lisa Wang', room: 'Lab 202' },
            { subject: 'Chemistry', teacher: 'Dr. Lisa Wang', room: 'Lab 202' },
            { subject: 'History', teacher: 'Prof. Robert Brown', room: 'Room 103' }
          ],
          'Thursday': [
            { subject: 'English', teacher: 'Prof. David Kim', room: 'Room 102' },
            { subject: 'History', teacher: 'Prof. Robert Brown', room: 'Room 103' },
            { subject: 'Chemistry', teacher: 'Dr. Lisa Wang', room: 'Lab 202' },
            { subject: 'Computer Science', teacher: 'Dr. Emily Rodriguez', room: 'Lab 301' },
            { subject: 'Mathematics', teacher: 'Dr. Sarah Johnson', room: 'Room 101' },
            { subject: 'Physics', teacher: 'Prof. Michael Chen', room: 'Lab 201' },
            { subject: 'Chemistry', teacher: 'Dr. Lisa Wang', room: 'Lab 202' },
            { subject: 'History', teacher: 'Prof. Robert Brown', room: 'Room 103' }
          ],
          'Friday': [
            { subject: 'Chemistry', teacher: 'Dr. Lisa Wang', room: 'Lab 202' },
            { subject: 'English', teacher: 'Prof. David Kim', room: 'Room 102' },
            { subject: 'History', teacher: 'Prof. Robert Brown', room: 'Room 103' },
            { subject: 'Physics', teacher: 'Prof. Michael Chen', room: 'Lab 201' },
            { subject: 'Computer Science', teacher: 'Dr. Emily Rodriguez', room: 'Lab 301' },
            { subject: 'Mathematics', teacher: 'Dr. Sarah Johnson', room: 'Room 101' },
            { subject: 'Chemistry', teacher: 'Dr. Lisa Wang', room: 'Lab 202' },
            { subject: 'History', teacher: 'Prof. Robert Brown', room: 'Room 103' }
          ],
          'Saturday': [
            { subject: 'Mathematics', teacher: 'Dr. Sarah Johnson', room: 'Room 101' },
            { subject: 'Computer Science', teacher: 'Dr. Emily Rodriguez', room: 'Lab 301' },
            { subject: 'Physics', teacher: 'Prof. Michael Chen', room: 'Lab 201' },
            { subject: 'History', teacher: 'Prof. Robert Brown', room: 'Room 103' },
            { subject: 'English', teacher: 'Prof. David Kim', room: 'Room 102' },
            { subject: 'Chemistry', teacher: 'Dr. Lisa Wang', room: 'Lab 202' },
            { subject: 'Chemistry', teacher: 'Dr. Lisa Wang', room: 'Lab 202' },
            { subject: 'History', teacher: 'Prof. Robert Brown', room: 'Room 103' }
          ]
        }
      };
      
      return mockTimetable;
      
      // Uncomment this when your backend is ready
      // const response = await api.get(`/api/timetable/${classId}`);
      // return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch timetable' });
    }
  }
);

export const updateTimetable = createAsyncThunk(
  'timetable/updateTimetable',
  async ({ classId, timetableData }, { rejectWithValue }) => {
    try {
      // For development/testing purposes, simulate a successful response
      // Remove this mock response and uncomment the actual API call when backend is ready
      return { ...timetableData, classId };
      
      // Uncomment this when your backend is ready
      // const response = await api.put(`/api/timetable/${classId}`, timetableData);
      // return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update timetable' });
    }
  }
);

const initialState = {
  timetable: null,
  loading: false,
  error: null
};

const timetableSlice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateScheduleItem: (state, action) => {
      const { day, slotIndex, data } = action.payload;
      if (state.timetable && state.timetable.schedule && state.timetable.schedule[day]) {
        state.timetable.schedule[day][slotIndex] = data;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimetable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.timetable = action.payload;
      })
      .addCase(fetchTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTimetable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.timetable = action.payload;
      })
      .addCase(updateTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, updateScheduleItem } = timetableSlice.actions;
export default timetableSlice.reducer;