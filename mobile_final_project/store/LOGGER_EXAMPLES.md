# 🚀 Logger Usage Examples

Your new logger is super easy to use! Here are examples for your team.

## 📦 Basic Import

```typescript
// Option 1: Import specific logger (recommended)
import { log } from './store/utils/logger';

// Option 2: Import specific loggers for different areas
import { authLogger, storeLogger, apiLogger } from './store/utils/logger';

// Option 3: Import everything
import logger, { log, logControls } from './store/utils/logger';
```

## 🎯 Quick Logging (Super Easy!)

```typescript
// Basic logs with colors and timestamps
log.debug('Debug info', { userId: 123 });
log.info('Something happened', { data: 'important' });
log.warn('Be careful!', { reason: 'memory low' });
log.error('Something broke!', new Error('API failed'));
log.success('All good!', { user: 'John' });
```

## 🔐 Auth Logging (Ready-made helpers)

```typescript
// In your login component
const handleLogin = async (email, password) => {
  // This logs: "⏳ Starting async operation: User Login"
  log.auth.login(email);

  try {
    const result = await dispatch(loginUser({ email, password }));
    // This logs: "✨ Async operation completed: User Login"
    log.auth.loginSuccess(result.user);
  } catch (error) {
    // This logs: "💥 Async operation failed: User Login"
    log.auth.loginError(error);
  }
};

// Token verification
log.auth.tokenVerify(token);

// Logout
log.auth.logout();
```

## 🌐 API Logging

```typescript
// Before API call
log.api.request('/api/users', 'GET', { page: 1 });

// After successful response
log.api.response('/api/users', 200, { users: userData });

// After error
log.api.error('/api/users', error);
```

## 🏪 Redux Logging (Already built-in!)

The Redux logging is already added to your auth slice! You'll see logs like:

```
🏪 REDUX 🎬 Action Dispatched: auth/login/pending
🏪 REDUX 🔄 State Changed: auth.isLoading { from: false, to: true }
🏪 REDUX 🎬 Action Dispatched: auth/login/fulfilled
🏪 REDUX 🔄 State Changed: auth.user { from: null, to: { name: "John" } }
```

## 🎛️ Controls (Turn things on/off)

```typescript
import { logControls } from './store/utils/logger';

// Turn off LogBox popups (but keep console logs)
logControls.disableLogBox();

// Turn off colors (for production or testing)
logControls.disableColors();

// Turn them back on
logControls.enableLogBox();
logControls.enableColors();
```

## 🎨 What You'll See

### In Development Console:
```
[09:23:15] 🏪 STORE ℹ️  INFO Starting app initialization
[09:23:16] 🔐 AUTH ⏳ Starting async operation: User Login { email: "test@example.com" }
[09:23:17] 🌐 API ⏳ Starting async operation: POST /api/auth/login { email: "test@example.com" }
[09:23:18] 🌐 API ✨ Async operation completed: API Response 200 { url: "/api/auth/login", user: "John" }
[09:23:18] 🔐 AUTH ✨ Async operation completed: User Login { user: "John" }
[09:23:18] 🏪 REDUX 🎬 Action Dispatched: auth/login/fulfilled { user: "John" }
```

### Colors:
- 🔍 **Debug**: Gray (only in dev)
- ℹ️ **Info**: Blue
- ⚠️ **Warn**: Yellow
- ❌ **Error**: Red
- ✅ **Success**: Green

## 💡 Pro Tips

1. **Use the right logger**: `log.auth.login()` instead of `log.info()` for auth stuff
2. **Don't log sensitive data**: Passwords, full tokens, etc.
3. **Use debug for verbose stuff**: It's hidden in production
4. **Add context data**: Always include relevant data objects

## 🚫 Quick Disable

If logs get too noisy during development:

```typescript
// At the top of your app
import { logControls } from './store/utils/logger';
logControls.disableLogBox(); // Stops LogBox popups
```

That's it! Your logging is now set up with colors, timestamps, and easy controls. 🎉