# Redux Store - Simplified JavaScript Implementation

## 🎯 What's Changed

- **Converted all TypeScript to JavaScript** - Clean, human-readable code
- **Simplified Redux logic** - No more complex types, just straightforward state management
- **Added dummy authentication** - Easy testing with switchable real/dummy API
- **Direct Redux hooks** - No more App wrapper, uses `useSelector` and `useDispatch` directly
- **Environment toggle** - Switch between dummy and real API easily

## 🏗️ File Structure

```
store/
├── index.js              # Main store configuration
├── slices/
│   └── authSlice.js      # Auth state with dummy/real API toggle
└── utils/
    ├── storage.js        # AsyncStorage wrapper
    └── logger.js         # Dev-friendly logging
```

## 🔑 Authentication Features

### Dummy Authentication (Default)
- **Users**: `admin@test.com`, `user@test.com`, `demo@test.com`
- **Password**: `password` (for all users)
- **Token**: Static dummy token for testing
- **Network Simulation**: 1-second delay for realistic feel

### Real API Toggle
Change `USE_REAL_API` to `true` in `authSlice.js` to use real endpoints:
- `POST /api/auth/login`
- `POST /api/auth/verify`

## 🚀 Usage in Components

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '@/store/slices/authSlice.js';

function MyComponent() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector(state => state.auth);

  const handleLogin = () => {
    dispatch(loginUser({ email: 'demo@test.com', password: 'password' }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    // Your component JSX
  );
}
```

## 🎮 Demo Login

The app now includes a "Demo Login" button that automatically logs in with:
- **Email**: `demo@test.com`
- **Password**: `password`

## 🛠️ Available Actions

- `hydrateAuth()` - Load saved auth data on app start
- `loginUser({ email, password })` - Login user
- `logoutUser()` - Logout and clear data
- `verifyToken(token)` - Verify JWT token
- `clearError()` - Clear error messages
- `setUser(user)` - Manually set user
- `setToken(token)` - Manually set token

## 🎯 Benefits

1. **Human-Friendly**: Clean JavaScript that's easy to read and modify
2. **No Type Complexity**: Focus on logic, not TypeScript gymnastics
3. **Easy Testing**: Dummy auth works out of the box
4. **Direct Redux**: No wrapper hooks, use Redux directly
5. **Environment Aware**: Switch between dummy/real API with one variable
6. **Robust Logging**: Detailed logs help with debugging
7. **Persistent Storage**: Auth data survives app restarts

## 🔄 Switching to Real API

1. Open `store/slices/authSlice.js`
2. Change `USE_REAL_API` from `false` to `true`
3. Implement your real API endpoints
4. That's it! The same Redux actions work with real endpoints

The code is now much cleaner, more maintainable, and easier for humans to work with! 🎉