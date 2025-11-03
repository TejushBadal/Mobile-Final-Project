import React, { useEffect, useState, useRef } from 'react';
import { Platform, View, StyleSheet, Alert } from 'react-native';
import { AppleMaps, GoogleMaps, useLocationPermissions } from 'expo-maps';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/themed-text';

const MapComponent = ({
  markers = [],
  style = styles.defaultMap,
  showUserLocation = true,
  initialRegion = null,
  onMapReady = null,
  onMarkerPress = null
}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationStatus, requestLocationPermission] = useLocationPermissions();
  const mapRef = useRef(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (showUserLocation && locationStatus?.granted) {
      getCurrentLocation();
    }
  }, [locationStatus, showUserLocation]);

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(coords);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Unable to get your current location');
    }
  };

  const getInitialCamera = () => {
    if (initialRegion) {
      return {
        coordinates: initialRegion,
        zoom: 14
      };
    }

    if (markers.length > 0) {
      return {
        coordinates: markers[0].coordinates,
        zoom: 14
      };
    }

    if (currentLocation) {
      return {
        coordinates: currentLocation,
        zoom: 14
      };
    }

    // Default to Toronto downtown
    return {
      coordinates: { latitude: 43.6532, longitude: -79.3832 },
      zoom: 12
    };
  };

  const allMarkers = [
    ...markers,
    ...(currentLocation && showUserLocation ? [{
      id: 'current-location',
      coordinates: currentLocation,
      title: 'Your Location',
      snippet: 'You are here',
      tintColor: '#007AFF'
    }] : [])
  ];

  const commonProps = {
    ref: mapRef,
    style: style,
    cameraPosition: getInitialCamera(),
    markers: allMarkers,
    properties: {
      isMyLocationEnabled: showUserLocation && locationStatus?.granted,
      isTrafficEnabled: false,
    },
    onMarkerClick: onMarkerPress,
    onMapLoaded: onMapReady,
  };

  // Handle permission not granted
  if (!locationStatus?.granted && showUserLocation) {
    return (
      <View style={[style, styles.permissionContainer]}>
        <ThemedText style={styles.permissionText}>
          Location permission required for map functionality
        </ThemedText>
      </View>
    );
  }

  // Platform-specific rendering
  if (Platform.OS === 'ios') {
    return (
      <AppleMaps.View
        {...commonProps}
        properties={{
          ...commonProps.properties,
          mapType: 'STANDARD',
          emphasis: 'AUTOMATIC'
        }}
      />
    );
  }

  if (Platform.OS === 'android') {
    try {
      return (
        <GoogleMaps.View
          {...commonProps}
          properties={{
            ...commonProps.properties,
            mapType: 'NORMAL'
          }}
          colorScheme="FOLLOW_SYSTEM"
        />
      );
    } catch (error) {
      console.error('GoogleMaps error:', error);
      // Fallback to simple view with coordinates
      return (
        <View style={[style, styles.fallbackContainer]}>
          <ThemedText style={styles.fallbackText}>
            Map unavailable - API key required{'\n'}
            {markers.length > 0 && `Location: ${markers[0].coordinates.latitude.toFixed(4)}, ${markers[0].coordinates.longitude.toFixed(4)}`}
          </ThemedText>
        </View>
      );
    }
  }

  // Fallback for web or other platforms
  return (
    <View style={[style, styles.fallbackContainer]}>
      <ThemedText style={styles.fallbackText}>
        Maps are only available on iOS and Android
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  defaultMap: {
    flex: 1,
    minHeight: 300,
  },
  permissionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  permissionText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  fallbackText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
});

export default MapComponent;