import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import MapComponent from '@/components/MapComponent';

export default function PetDetailScreen() {
  const { petData } = useLocalSearchParams();
  const router = useRouter();

  let pet = null;
  try {
    pet = JSON.parse(petData);
  } catch (error) {
    console.error('Error parsing pet data:', error);
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <ThemedText style={styles.backButtonText}>‹ Back</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>
          Pet Details
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        {pet && pet.coordinates && (
          <>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Last Seen Location:
            </ThemedText>

            <View style={styles.mapContainer}>
              <MapComponent
                markers={[{
                  id: pet.id,
                  coordinates: pet.coordinates,
                  title: `${pet.name} - Last Seen`,
                  snippet: pet.location,
                  tintColor: '#FF6B6B'
                }]}
                initialRegion={pet.coordinates}
                style={styles.map}
                showUserLocation={true}
              />
            </View>
          </>
        )}

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Raw JSON Data:
        </ThemedText>

        <ThemedView style={styles.jsonContainer}>
          <ThemedText style={styles.jsonText}>
            {JSON.stringify(pet, null, 2)}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  jsonContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
  mapContainer: {
    marginBottom: 25,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  map: {
    height: 250,
    width: '100%',
  },
});