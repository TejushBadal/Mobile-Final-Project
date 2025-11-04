import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice.js';

export default function AppHeader({
  pageTitle = null,
  showBackButton = false,
  showLogout = false
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleBack = () => {
    router.back();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <View style={styles.headerBar}>
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>
      )}

      <View style={styles.headerContent}>
        <Text style={styles.appTitle}>Pet Spot App</Text>
        {pageTitle && (
          <Text style={styles.pageTitle}>{pageTitle}</Text>
        )}
        {!pageTitle && user && (
          <Text style={styles.pageTitle}>Welcome, {user?.name || 'User'}!</Text>
        )}
      </View>

      {showLogout && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50, // Account for status bar
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
  },
  appTitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});