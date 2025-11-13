import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { StorageService } from '../utils/storage.js';
import { log } from '../utils/logger.js';

// Environment toggle - set to false to use dummy logic
const USE_REAL_API = false;

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isHydrated: false,
};

// Dummy user data for testing
const DUMMY_USERS = [
  { id: '1', email: 'admin@test.com', name: 'Admin User' },
  { id: '2', email: 'user@test.com', name: 'Test User' },
  { id: '3', email: 'nasim@prof.com', name: 'Demo User' },
  { id: '4', email: 'demo@test.com', name: 'Demo User' },
];

const DUMMY_TOKEN = 'dummy_jwt_token_12345';

// Dummy API simulation
const dummyAPI = {
  async login(email, password) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user by email
    const user = DUMMY_USERS.find(u => u.email === email);

    if (!user) {
      throw new Error('User not found');
    }

    // Simple password check (in real app, never do this!)
    const validPassword = (user.email === 'nasim@prof.com' && password === '12345678') ||
                          (user.email !== 'nasim@prof.com' && password === 'password');

    if (!validPassword) {
      throw new Error('Invalid password');
    }

    return {
      user,
      token: DUMMY_TOKEN,
    };
  },

  async verifyToken(token) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (token !== DUMMY_TOKEN) {
      throw new Error('Invalid token');
    }

    // Return first user for simplicity
    return DUMMY_USERS[0];
  }
};

// Real API functions
const realAPI = {
  async login(email, password) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return await response.json();
  },

  async verifyToken(token) {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Token invalid');
    }

    const data = await response.json();
    return data.user;
  }
};

// Choose API based on environment
const api = USE_REAL_API ? realAPI : dummyAPI;

// Load saved auth data when app starts
export const hydrateAuth = createAsyncThunk(
  'auth/hydrate',
  async (_, { getState }) => {
    const state = getState();
    if (state.auth.isHydrated) {
      log.debug('Already hydrated, skipping...');
      return null;
    }

    log.info('🚀 Loading saved auth data...');

    const token = await StorageService.getToken();
    const user = await StorageService.getUser();

    if (token && user) {
      log.success('Auth data found', { userName: user.name });
      return { token, user };
    }

    log.info('No saved auth data');
    return null;
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      log.auth.login(email);
      log.info(`Using ${USE_REAL_API ? 'REAL' : 'DUMMY'} API for login`);

      const data = await api.login(email, password);

      // Save to storage
      await StorageService.saveToken(data.token);
      await StorageService.saveUser(data.user);

      log.auth.loginSuccess(data.user);
      return data;
    } catch (error) {
      log.auth.loginError(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    log.auth.logout();
    await StorageService.clearAll();
    log.success('User logged out');
  }
);

// Verify token
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (token, { rejectWithValue }) => {
    try {
      log.auth.tokenVerify(token);
      log.info(`Using ${USE_REAL_API ? 'REAL' : 'DUMMY'} API for verification`);

      const user = await api.verifyToken(token);
      log.success('Token verified', { user: user.name });
      return user;
    } catch (error) {
      log.error('Token verification failed', error);
      await StorageService.clearAll();
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Hydrate auth
      .addCase(hydrateAuth.pending, (state) => {
        if (!state.isHydrated) {
          log.redux.action('auth/hydrate/pending');
        }
        state.isLoading = true;
        state.error = null;
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isHydrated = true;

        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          log.success('✅ App hydrated with user', { user: action.payload.user.name });
        } else {
          log.info('✅ App hydrated - clean slate');
        }
      })
      .addCase(hydrateAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isHydrated = true;
        state.error = action.error.message || 'Hydration failed';
        state.isAuthenticated = false;
        log.error('❌ Hydration failed', action.error);
      })

      // Login user
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Logout user
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })

      // Verify token
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyToken.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setUser, setToken } = authSlice.actions;
export default authSlice.reducer;