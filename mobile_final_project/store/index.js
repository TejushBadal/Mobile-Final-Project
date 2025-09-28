import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';

// Main Redux store - this is where all app state lives
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});