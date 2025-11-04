import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { TextInput, Button, Card, HelperText } from 'react-native-paper';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { store } from '@/store';
import { hydrateAuth, loginUser, logoutUser } from '@/store/slices/authSlice.js';
import React from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Direct Redux selectors
  const { user, isAuthenticated, isLoading, isHydrated, error } = useSelector(state => state.auth);

  // Initialize auth on app start
  const initializeAuth = useCallback(() => {
    if (!isHydrated && !isLoading) {
      dispatch(hydrateAuth());
    }
  }, [dispatch, isHydrated, isLoading]);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 3) {
      errors.password = 'Password must be at least 3 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Login function
  const handleLogin = useCallback(() => {
    if (validateForm()) {
      dispatch(loginUser({ email, password }));
    }
  }, [dispatch, email, password]);

  // Demo login function (pre-fill and submit)
  const handleDemoLogin = useCallback(() => {
    setEmail('demo@test.com');
    setPassword('password');
    dispatch(loginUser({ email: 'demo@test.com', password: 'password' }));
  }, [dispatch]);

  // Logout function
  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // 🚀 Show hydration progress
  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>🚀 Initializing app...</Text>
        <Text style={{ color: '#666' }}>Loading saved data</Text>
      </View>
    );
  }

  // 📱 Show loading for other operations
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Loading...</Text>
        <Text style={{ color: '#666' }}>Please wait</Text>
      </View>
    );
  }

  // 🔐 Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <View style={styles.loginContainer}>
        <View style={styles.loginContent}>
          <Text style={styles.welcomeTitle}>Welcome to Pet Lost and Found!</Text>
          <Text style={styles.welcomeSubtitle}>
            Please log in to continue
          </Text>

          <Card style={styles.loginCard}>
            <Card.Content>
              <TextInput
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (formErrors.email) {
                    setFormErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                mode="outlined"
                style={styles.input}
                error={!!formErrors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
              />
              <HelperText type="error" visible={!!formErrors.email}>
                {formErrors.email}
              </HelperText>

              <TextInput
                label="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (formErrors.password) {
                    setFormErrors(prev => ({ ...prev, password: '' }));
                  }
                }}
                mode="outlined"
                style={styles.input}
                error={!!formErrors.password}
                secureTextEntry
                placeholder="Enter your password"
              />
              <HelperText type="error" visible={!!formErrors.password}>
                {formErrors.password}
              </HelperText>

              {error && (
                <Text style={styles.errorText}>
                  Error: {error}
                </Text>
              )}

              <Button
                mode="contained"
                onPress={handleDemoLogin}
                style={styles.loginButton}
                loading={isLoading}
                disabled={isLoading}
              >
                Login
              </Button>

              <Text style={styles.demoText}>
                Demo credentials: demo@test.com / password
              </Text>
            </Card.Content>
          </Card>
        </View>
      </View>
    );
  }

  // 🎉 Main app content for authenticated users
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="pet-detail" options={{ headerShown: false }} />
          <Stack.Screen name="add-pet-report" options={{ headerShown: false }} />
          <Stack.Screen name="add-found-pet-report" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loginContent: {
    width: '100%',
    maxWidth: 400,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  loginCard: {
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  loginButton: {
    marginTop: 16,
    marginBottom: 12,
    backgroundColor: '#579ee6',
  },
  demoButton: {
    marginBottom: 16,
    borderColor: '#579ee6',
  },
  demoText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    color: '#f44336',
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
