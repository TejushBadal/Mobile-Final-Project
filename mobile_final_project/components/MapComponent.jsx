import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
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
  const [locationPermission, setLocationPermission] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (showUserLocation && locationPermission === 'granted') {
      getCurrentLocation();
    }
  }, [locationPermission, showUserLocation]);

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
    } catch (error) {
      console.error('Permission request error:', error);
      setLocationPermission('denied');
    }
  };

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

  const getInitialRegion = () => {
    if (initialRegion) {
      return {
        ...initialRegion,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      };
    }

    if (markers.length > 0) {
      return {
        ...markers[0].coordinates,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      };
    }

    if (currentLocation) {
      return {
        ...currentLocation,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      };
    }

    // Default to Toronto downtown
    return {
      latitude: 43.6532,
      longitude: -79.3832,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  };

  // Handle permission not granted
  if (!locationPermission || locationPermission !== 'granted') {
    return (
      <View style={[style, styles.permissionContainer]}>
        <ThemedText style={styles.permissionText}>
          Location permission required for map functionality
        </ThemedText>
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      style={style}
      provider={PROVIDER_GOOGLE}
      initialRegion={getInitialRegion()}
      showsUserLocation={showUserLocation && locationPermission === 'granted'}
      showsMyLocationButton={true}
      onMapReady={onMapReady}
    >
      {markers.map((marker, index) => (
        <Marker
          key={marker.id || index}
          coordinate={marker.coordinates}
          title={marker.title}
          description={marker.snippet}
          pinColor={marker.tintColor}
          onPress={() => onMarkerPress && onMarkerPress(marker)}
        />
      ))}
    </MapView>
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
});

export default MapComponent;