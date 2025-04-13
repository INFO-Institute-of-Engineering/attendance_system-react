import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import leaveReducer from './slices/leaveSlice';
import timetableReducer from './slices/timetableSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    leave: leaveReducer,
    timetable: timetableReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});