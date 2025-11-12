# Mobile Lost Pet Finder - Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Project Structure](#project-structure)
4. [Data Layer & Services](#data-layer--services)
5. [Navigation & Routing](#navigation--routing)
6. [Component Architecture](#component-architecture)
7. [State Management](#state-management)
8. [Authentication System](#authentication-system)
9. [Development Patterns](#development-patterns)
10. [Software Engineering Principles Applied](#software-engineering-principles-applied)

## Overview

The Mobile Lost Pet Finder is a React Native application built with Expo, designed to help users report lost pets and find found pets in their area. The application demonstrates modern mobile development practices, clean architecture, and software engineering principles.

### Tech Stack
- **Framework**: React Native with Expo Router
- **Database**: SQLite with expo-sqlite
- **State Management**: Redux Toolkit
- **UI Library**: React Native Paper
- **Maps**: React Native Maps with Google Maps
- **Navigation**: Expo Router (file-based routing)
- **Styling**: React Native StyleSheet API

## Architecture Principles

The application follows several key software engineering principles:

### 1. **Separation of Concerns**
- Clear separation between UI components, business logic, and data access
- Services handle data operations independent of UI components
- Navigation logic separated from business logic

### 2. **Single Responsibility Principle**
- Each component has a single, well-defined responsibility
- Services are focused on specific data operations
- Store slices manage specific state domains

### 3. **Dependency Injection & Inversion**
- Components receive data through props and Redux state
- Services are modular and can be easily mocked or replaced
- Database abstraction through service layer

### 4. **Modularity & Reusability**
- Reusable components (MapComponent, AppHeader, Themed components)
- Service functions that can be used across different parts of the app
- Consistent design system through themed components

## Project Structure

```
mobile_final_project/
├── app/                          # Expo Router pages
│   ├── _layout.jsx              # Root layout with auth provider
│   ├── (tabs)/                  # Tab-based navigation
│   │   ├── _layout.tsx         # Tab navigation configuration
│   │   ├── index.jsx           # Home/Explore tab
│   │   └── my_posts.jsx        # User's posts tab
│   ├── add-pet-report.jsx      # Lost pet reporting form
│   ├── add-found-pet-report.jsx # Found pet reporting form
│   └── pet-detail.jsx          # Pet detail view
├── components/                  # Reusable UI components
│   ├── MapComponent.jsx        # Google Maps integration
│   ├── AppHeader.jsx          # Application header component
│   ├── themed-text.tsx        # Themed text component
│   └── themed-view.tsx        # Themed view component
├── services/                   # Business logic & data access
│   └── database.js            # SQLite database service
├── store/                     # Redux state management
│   ├── index.js              # Store configuration
│   ├── slices/               # State slices
│   │   └── authSlice.js      # Authentication state
│   └── utils/                # Store utilities
│       ├── storage.js        # Persistent storage service
│       └── logger.js         # Logging utilities
├── hooks/                     # Custom React hooks
│   ├── use-color-scheme.ts   # Color scheme detection
│   └── use-theme-color.ts    # Theme color management
└── constants/                 # App-wide constants
    └── theme.js              # Theme configuration
```

## Data Layer & Services

### Database Service (`services/database.js`)

The database service acts as a **Data Access Layer (DAL)**, providing a clean abstraction over SQLite operations:

```javascript
// Core principles demonstrated:
// 1. Single Responsibility - handles only database operations
// 2. Interface Segregation - provides specific methods for each operation
// 3. Dependency Inversion - UI components depend on this abstraction, not SQLite directly

export const addPet = async (petData) => {
  // Handles pet creation with proper error handling
}

export const getPetsByUser = async (userId) => {
  // Retrieves user-specific pets with data transformation
}

export const getAllPets = async () => {
  // Retrieves all pets for map/search functionality
}
```

#### Key Features:
- **Connection Management**: Handles SQLite connection lifecycle
- **Data Transformation**: Converts between database schema and application models
- **Error Handling**: Comprehensive error catching and logging
- **Schema Management**: Database initialization and migration
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality

#### Database Schema Design:
```sql
CREATE TABLE pets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT CHECK(type IN ('Lost', 'Found')) NOT NULL,
  species TEXT CHECK(species IN ('Dog', 'Cat')) NOT NULL,
  breed TEXT NOT NULL,
  color TEXT NOT NULL,
  last_seen DATETIME NOT NULL,
  location TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  description TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  image_uri TEXT,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

The schema enforces data integrity through:
- **Constraints**: CHECK constraints for enum-like fields (type, species)
- **Normalization**: Proper separation of concerns in field design
- **Indexing Considerations**: Primary key and user_id for efficient queries

## Navigation & Routing

### Expo Router Implementation (`app/(tabs)/_layout.tsx`)

The navigation follows **file-based routing** principles, demonstrating:

```typescript
// Tab-based navigation with clean separation
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab, // Custom haptic feedback component
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="my_posts"
        options={{
          title: 'My Posts',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
```

### Root Layout (`app/_layout.jsx`)

Implements the **Provider Pattern** and **Authentication Guard Pattern**:

```javascript
// Demonstrates:
// 1. HOC Pattern - AppContent wraps authenticated app
// 2. Provider Pattern - Redux Provider at root level
// 3. Guard Pattern - Authentication checks before app access
// 4. State Machine Pattern - Different UI states based on auth status

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
```

#### Navigation State Management:
- **Conditional Rendering**: Different UI based on authentication state
- **Route Protection**: Authenticated routes vs public routes
- **Deep Linking Support**: Through Expo Router configuration
- **Stack Navigation**: Modal presentations and screen transitions

## Component Architecture

### MapComponent (`components/MapComponent.jsx`)

Demonstrates **Component Composition** and **Props Pattern**:

```javascript
const MapComponent = ({
  markers = [],
  style = styles.defaultMap,
  showUserLocation = true,
  initialRegion = null,
  onMapReady = null,
  onMarkerPress = null
}) => {
  // Implementation details...
};
```

#### Software Engineering Principles Applied:

1. **Single Responsibility**: Only handles map rendering and location
2. **Open/Closed Principle**: Extensible through props, closed for modification
3. **Interface Segregation**: Clean props interface with sensible defaults
4. **Dependency Inversion**: Depends on abstractions (Location API) not concretions

#### Key Features:
- **Permission Management**: Handles location permissions gracefully
- **State Management**: Internal state for location and permissions
- **Error Handling**: User-friendly error states
- **Performance**: Efficient marker rendering with keys
- **Accessibility**: Proper fallbacks for permission denied states

### Themed Components (`components/themed-*.tsx`)

Implement **Decorator Pattern** for consistent theming:

```typescript
// Wraps React Native components with theme-aware styling
export function ThemedText({ style, lightColor, darkColor, type = 'default', ...rest }) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  return <Text style={[{ color }, defaultStyles[type], style]} {...rest} />;
}
```

Benefits:
- **Consistency**: Unified theming across the app
- **Maintainability**: Single place to change theme behavior
- **Flexibility**: Override themes per component when needed
- **Type Safety**: TypeScript ensures proper usage

## State Management

### Redux Architecture (`store/`)

Implements **Flux Architecture** with **Redux Toolkit**:

#### Store Configuration (`store/index.js`)

The Redux store is the **single source of truth** for application state, following these principles:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';

// Main Redux store - this is where all app state lives
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Future expansion: pets, ui, settings, etc.
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});
```

#### Redux Store Deep Dive:

**1. Store Configuration Benefits:**
- **DevTools Integration**: Automatic Redux DevTools connection
- **Middleware Setup**: Pre-configured with essential middleware
- **Type Safety**: TypeScript support out of the box
- **Performance**: Optimized for React Native

**2. Middleware Stack:**
```javascript
getDefaultMiddleware({
  serializableCheck: {
    // Ignores persistence actions that contain non-serializable data
    ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
  },
})
```

The default middleware includes:
- **redux-thunk**: For async actions (already included in RTK)
- **Immutability Check**: Development-only immutability verification
- **Serializability Check**: Ensures actions and state are serializable
- **Action Creator Check**: Validates proper action creator usage

**3. State Shape:**
```typescript
// Global state structure
interface RootState {
  auth: AuthState;
  // Future slices would be added here
  // pets?: PetsState;
  // ui?: UIState;
  // settings?: SettingsState;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;  // App initialization flag
}
```

**4. Reducer Composition:**
The store uses **combineReducers** pattern through the `reducer` object:
```javascript
reducer: {
  auth: authReducer,  // Handles: auth/login, auth/logout, auth/hydrate
  // Each slice manages its own state domain
}
```

**5. Store Provider Integration:**
```javascript
// app/_layout.jsx
export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
```

**Benefits of this Redux Architecture:**

1. **Predictable State Updates**: All state changes go through reducers
2. **Time Travel Debugging**: Redux DevTools for state inspection
3. **Centralized State**: Single source of truth for auth state
4. **Middleware Extensibility**: Easy to add logging, analytics, etc.
5. **Performance**: Only re-renders when subscribed state changes
6. **Persistence**: Easy integration with redux-persist if needed

**State Management Flow:**
```
User Action → Dispatch → Async Thunk → API Call → Reducer → State Update → Component Re-render
```

**Why Redux Toolkit over Plain Redux:**
- **Less Boilerplate**: createSlice reduces code by 70%
- **Immer Integration**: Write "mutative" logic that's actually immutable
- **Built-in Thunks**: Async action handling out of the box
- **Best Practices**: Enforces Redux best practices automatically

### State Slices Design

#### Authentication Slice (`store/slices/authSlice.js`)

Demonstrates **Async Thunk Pattern** and **State Machine Pattern**:

```javascript
// Async actions for complex state transitions
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // API call logic
      const data = await api.login(email, password);

      // Side effects (storage)
      await StorageService.saveToken(data.token);
      await StorageService.saveUser(data.user);

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

#### State Machine Implementation:
```javascript
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isHydrated: false, // App initialization state
};
```

### Storage Service (`store/utils/storage.js`)

Implements **Adapter Pattern** for persistent storage:
- Abstracts AsyncStorage complexity
- Provides type-safe storage methods
- Handles serialization/deserialization
- Implements error recovery strategies

## Authentication System

### Multi-Environment Authentication

The auth system demonstrates **Strategy Pattern** with environment-based API switching:

```javascript
// Configurable API strategy
const USE_REAL_API = false; // Environment flag

const api = USE_REAL_API ? realAPI : dummyAPI;

// Dummy API for development
const dummyAPI = {
  async login(email, password) {
    // Simulated authentication logic
  }
};

// Production API
const realAPI = {
  async login(email, password) {
    // Real authentication logic
  }
};
```

### Authentication Flow:

1. **App Initialization** (`hydrateAuth`):
   - Checks for saved credentials
   - Validates tokens
   - Sets initial auth state

2. **Login Process** (`loginUser`):
   - Form validation
   - API authentication
   - Token storage
   - State updates

3. **Session Management**:
   - Token persistence
   - Automatic logout on token expiry
   - Secure credential storage

### Security Considerations:

- **Token Storage**: Secure storage using Expo SecureStore
- **Validation**: Both client and server-side validation
- **Error Handling**: No sensitive data in error messages
- **Session Timeout**: Automatic cleanup of expired sessions

## Development Patterns

### Form Handling Pattern

Both `add-pet-report.jsx` and `add-found-pet-report.jsx` follow consistent patterns:

```javascript
// 1. State Management
const [formData, setFormData] = useState(initialFormState);
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);

// 2. Validation Layer
const validateForm = () => {
  const newErrors = {};
  // Validation logic...
  return Object.keys(newErrors).length === 0;
};

// 3. Submission Handler
const handleSubmit = async () => {
  if (!validateForm()) return;

  setIsSubmitting(true);
  try {
    await addPet(transformFormData());
    // Success handling...
  } catch (error) {
    // Error handling...
  } finally {
    setIsSubmitting(false);
  }
};

// 4. Data Transformation
const transformFormData = () => ({
  // Transform form data to API format
});
```

### Error Handling Strategy

Comprehensive error handling at multiple levels:

1. **Form Level**: Input validation and user feedback
2. **Service Level**: API error handling and retry logic
3. **Application Level**: Global error boundaries
4. **Database Level**: Transaction rollback and data integrity

### Performance Optimizations

- **React.memo**: Preventing unnecessary re-renders
- **useCallback**: Memoizing event handlers
- **useFocusEffect**: Efficient screen focus handling
- **Lazy Loading**: Component and route-based code splitting

## Software Engineering Principles Applied

### SOLID Principles

1. **Single Responsibility Principle (SRP)**:
   - Each component has one reason to change
   - Services handle specific domains (auth, database)
   - Clear separation of concerns

2. **Open/Closed Principle (OCP)**:
   - Components extensible through props
   - Services can be extended without modification
   - Plugin architecture for different environments

3. **Liskov Substitution Principle (LSP)**:
   - Themed components can replace base components
   - API strategies are interchangeable
   - Service implementations are substitutable

4. **Interface Segregation Principle (ISP)**:
   - Components expose minimal, focused interfaces
   - Service methods are specific and targeted
   - No forced dependencies on unused functionality

5. **Dependency Inversion Principle (DIP)**:
   - Components depend on abstractions (Redux state, services)
   - High-level modules don't depend on low-level modules
   - Both depend on abstractions

### Design Patterns Used

1. **Provider Pattern**: Redux Provider, Theme Provider
2. **Observer Pattern**: Redux state subscriptions
3. **Strategy Pattern**: API environment switching
4. **Adapter Pattern**: Storage service abstraction
5. **Decorator Pattern**: Themed components
6. **Factory Pattern**: Async thunk creators
7. **Singleton Pattern**: Redux store instance
8. **Command Pattern**: Redux actions
9. **State Pattern**: Authentication state machine

### Clean Code Principles

1. **Meaningful Names**: Descriptive function and variable names
2. **Small Functions**: Each function does one thing well
3. **Consistent Formatting**: ESLint and Prettier integration
4. **Error Handling**: Comprehensive error management
5. **Comments**: Code is self-documenting, comments explain why
6. **DRY Principle**: No repeated code patterns

### Testing Considerations

While tests aren't implemented in this version, the architecture supports:

1. **Unit Testing**: Pure functions and isolated components
2. **Integration Testing**: Service layer testing
3. **End-to-End Testing**: Full user flow testing
4. **Mocking**: Service and API mocking capabilities

### Scalability Features

1. **Modular Architecture**: Easy to add new features
2. **State Management**: Centralized and predictable
3. **Component Library**: Reusable UI components
4. **Service Layer**: Extensible data operations
5. **Configuration**: Environment-based settings

## Conclusion

This mobile application demonstrates a production-ready architecture that balances:

- **Developer Experience**: Clear patterns and conventions
- **Maintainability**: Modular, testable code
- **Performance**: Optimized for mobile constraints
- **Scalability**: Architecture supports growth
- **User Experience**: Responsive, intuitive interface
- **Code Quality**: SOLID principles and clean code

The architecture serves as a strong foundation for a commercial pet-finding application while showcasing modern React Native development practices and software engineering principles.