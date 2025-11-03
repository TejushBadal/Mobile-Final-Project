import { Image } from 'expo-image';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const DEMO_PETS = [
  {
    id: '1',
    name: 'Buddy',
    species: 'Dog',
    breed: 'Pomeranian',
    color: 'Orange and White',
    lastSeen: '2025-11-01',
    location: 'High Park, Toronto',
    coordinates: { latitude: 43.6465, longitude: -79.4637 },
    description: 'Very friendly small dog, answers to Buddy. Has a small scar on left ear.',
    contact: 'john.doe@email.com',
    imageUri: '@/assets/demo_images/ASSET_1.jpg'
  },
  {
    id: '2',
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Maine Coon',
    color: 'Gray and White',
    lastSeen: '2025-10-30',
    location: 'Distillery District, Toronto',
    coordinates: { latitude: 43.6503, longitude: -79.3592 },
    description: 'Large fluffy cat with distinctive white chest marking.',
    contact: 'jane.smith@email.com',
    imageUri: '@/assets/demo_images/ASSET_1.jpg'
  },
  {
    id: '3',
    name: 'Charlie',
    species: 'Dog',
    breed: 'Golden Retriever',
    color: 'Golden',
    lastSeen: '2025-11-02',
    location: 'Queen\'s Park, Toronto',
    coordinates: { latitude: 43.6596, longitude: -79.3925 },
    description: 'Medium-sized golden retriever, very energetic and friendly.',
    contact: 'mike.johnson@email.com',
    imageUri: '@/assets/demo_images/ASSET_1.jpg'
  },
  {
    id: '4',
    name: 'Luna',
    species: 'Cat',
    breed: 'Siamese',
    color: 'Cream and Brown',
    lastSeen: '2025-10-29',
    location: 'Kensington Market, Toronto',
    coordinates: { latitude: 43.6542, longitude: -79.4006 },
    description: 'Siamese cat with blue eyes, wearing a red collar.',
    contact: 'sarah.wilson@email.com',
    imageUri: '@/assets/demo_images/ASSET_1.jpg'
  },
  {
    id: '5',
    name: 'Max',
    species: 'Dog',
    breed: 'German Shepherd',
    color: 'Black and Tan',
    lastSeen: '2025-11-01',
    location: 'Harbourfront, Toronto',
    coordinates: { latitude: 43.6426, longitude: -79.3780 },
    description: 'Large German Shepherd, well-trained but may be scared.',
    contact: 'robert.brown@email.com',
    imageUri: '@/assets/demo_images/ASSET_1.jpg'
  }
];

export default function HomeScreen() {
  const router = useRouter();

  const handlePetPress = (pet) => {
    router.push({
      pathname: '/pet-detail',
      params: { petData: JSON.stringify(pet) }
    });
  };

  const handleFoundPetPress = () => {
    console.log('Report found pet pressed');
  };

  return (
    <ScrollView style={styles.container}>

      <ThemedView style={styles.content}>
        <TouchableOpacity style={styles.foundPetCard} onPress={handleFoundPetPress}>
          <View style={styles.foundPetContent}>
            <Text style={styles.foundPetEmoji}>🐾</Text>
            <View style={styles.foundPetText}>
              <ThemedText type="defaultSemiBold" style={styles.foundPetTitle}>
                Found someone's pet?
              </ThemedText>
              <ThemedText style={styles.foundPetSubtitle}>
                Help reunite them with their family
              </ThemedText>
            </View>
            <View style={styles.arrow}>
              <ThemedText style={styles.arrowText}>›</ThemedText>
            </View>
          </View>
        </TouchableOpacity>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Recent Lost Pet Reports
        </ThemedText>

        {DEMO_PETS.map((pet) => (
          <TouchableOpacity
            key={pet.id}
            style={styles.petCard}
            onPress={() => handlePetPress(pet)}
          >
            <Image
              source={require('@/assets/demo_images/ASSET_1.jpg')}
              style={styles.petImage}
            />
            <View style={styles.petInfo}>
              <ThemedText type="defaultSemiBold" style={styles.petName}>
                {pet.name}
              </ThemedText>
              <ThemedText style={styles.petBreed}>
                {pet.breed} • {pet.color}
              </ThemedText>
              <ThemedText style={styles.petLocation}>
                📍 {pet.location}
              </ThemedText>
              <ThemedText style={styles.petDate}>
                Last seen: {pet.lastSeen}
              </ThemedText>
            </View>
            <View style={styles.arrow}>
              <ThemedText style={styles.arrowText}>›</ThemedText>
            </View>
          </TouchableOpacity>
        ))}
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: 16,
    opacity: 0.7,
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  petCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  petInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  petLocation: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  petDate: {
    fontSize: 12,
    color: '#888',
  },
  arrow: {
    justifyContent: 'center',
    paddingLeft: 10,
  },
  arrowText: {
    fontSize: 24,
    color: '#ccc',
  },
  foundPetCard: {
    backgroundColor: '#579ee6',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  foundPetContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foundPetEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  foundPetText: {
    flex: 1,
  },
  foundPetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  foundPetSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});