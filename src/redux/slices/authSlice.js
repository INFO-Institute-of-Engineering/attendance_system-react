import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password, role }, { rejectWithValue }) => {
    try {
      // Using MongoDB Atlas for authentication
      const response = await api.post('/api/auth/login', { username, password, role });
      localStorage.setItem('token', response.data.token);
      return response.data;
      
      // Fallback to mock data if API is not available
      // const mockResponse = {
      //   user: {
      //     id: 1,
      //     username,
      //     role,
      //     name: 'Test User'
      //   },
      //   token: 'mock-jwt-token'
      // };
      // 
      // localStorage.setItem('token', mockResponse.token);
      // return mockResponse;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Login failed. Please check your credentials.' });
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  return null;
});

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
  role: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.role = action.payload.user.role;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.role = null;
      });
  }
});

export const { clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;