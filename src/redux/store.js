import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import leaveReducer from './slices/leaveSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    leave: leaveReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});