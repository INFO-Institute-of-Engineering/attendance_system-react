import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      // For development/testing purposes, simulate a successful response
      // Remove this mock response and uncomment the actual API call when backend is ready
      const { auth } = getState();
      const mockResponse = {
        id: 1,
        username: auth.user?.username || 'testuser',
        name: auth.user?.name || 'Test User',
        email: 'testuser@example.com',
        role: auth.user?.role || 'student',
        department: 'Computer Science'
      };
      
      return mockResponse;
      
      // Uncomment this when your backend is ready
      // const response = await api.get('/api/users/profile');
      // return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch profile' });
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue, getState }) => {
    try {
      // For development/testing purposes, simulate a successful response
      // Remove this mock response and uncomment the actual API call when backend is ready
      const { auth } = getState();
      const mockResponse = {
        ...userData,
        id: 1,
        username: auth.user?.username || 'testuser',
        role: auth.user?.role || 'student'
      };
      
      return mockResponse;
      
      // Uncomment this when your backend is ready
      // const response = await api.put('/api/users/profile', userData);
      // return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update profile' });
    }
  }
);

export const fetchStudents = createAsyncThunk(
  'user/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      // For development/testing purposes, simulate a successful response
      // Remove this mock response and uncomment the actual API call when backend is ready
      const mockStudents = [
        { id: 1, name: 'John Doe', regNo: 'CS2001', department: 'Computer Science', semester: 5 },
        { id: 2, name: 'Jane Smith', regNo: 'CS2002', department: 'Computer Science', semester: 5 },
        { id: 3, name: 'Bob Johnson', regNo: 'CS2003', department: 'Computer Science', semester: 5 },
        { id: 4, name: 'Alice Brown', regNo: 'CS2004', department: 'Computer Science', semester: 5 },
        { id: 5, name: 'Charlie Wilson', regNo: 'CS2005', department: 'Computer Science', semester: 5 }
      ];
      
      return mockStudents;
      
      // Uncomment this when your backend is ready
      // const response = await api.get('/api/users/students');
      // return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch students' });
    }
  }
);

const initialState = {
  profile: null,
  students: [],
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;