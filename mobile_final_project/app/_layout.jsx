import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Text, View, TouchableOpacity } from 'react-native';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';

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

  // Direct Redux selectors
  const { user, isAuthenticated, isLoading, isHydrated, error } = useSelector(state => state.auth);

  // Initialize auth on app start
  const initializeAuth = useCallback(() => {
    if (!isHydrated && !isLoading) {
      dispatch(hydrateAuth());
    }
  }, [dispatch, isHydrated, isLoading]);

  // Demo login function
  const handleDemoLogin = useCallback(() => {
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: 'bold' }}>Welcome!</Text>
        <Text style={{ fontSize: 16, marginBottom: 30, textAlign: 'center', color: '#666' }}>
          Please log in to continue
        </Text>

        {error && (
          <Text style={{ color: 'red', marginBottom: 20, textAlign: 'center' }}>
            Error: {error}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleDemoLogin}
          style={{
            backgroundColor: '#007AFF',
            paddingHorizontal: 30,
            paddingVertical: 15,
            borderRadius: 8,
            marginBottom: 15
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            Demo Login
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>
          Uses dummy auth (demo@test.com / password)
        </Text>
      </View>
    );
  }

  // 🎉 Main app content for authenticated users
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        {/* User info bar */}
        <View style={{
          backgroundColor: '#f0f0f0',
          padding: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 50 // Account for status bar
        }}>
          
          <View>
          <Text style={{ fontSize: 12, fontWeight: '400' }}>
            Pet Spot App
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>
            Welcome, {user?.name || 'User'}!
          </Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: '#ff3b30',
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderRadius: 6
            }}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
