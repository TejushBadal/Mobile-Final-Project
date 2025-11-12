import { Image } from 'expo-image';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useMemo } from 'react';
import { Searchbar, Chip } from 'react-native-paper';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AppHeader from '@/components/AppHeader';
import { getAllPets, initDatabase } from '@/services/database';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize database and load pets
  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoading(true);
        await initDatabase();
        const pets = await getAllPets();
        setAllPets(pets);
      } catch (error) {
        console.error('Error loading pets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter pets based on search query
  const filteredPets = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return allPets;
    }

    const query = debouncedSearchQuery.toLowerCase();
    return allPets.filter(pet =>
      pet.name.toLowerCase().includes(query) ||
      pet.species.toLowerCase().includes(query) ||
      pet.breed.toLowerCase().includes(query) ||
      pet.location.toLowerCase().includes(query) ||
      pet.type.toLowerCase().includes(query)
    );
  }, [debouncedSearchQuery, allPets]);

  const handlePetPress = (pet) => {
    router.push({
      pathname: '/pet-detail',
      params: { petData: JSON.stringify(pet) }
    });
  };

  const handleFoundPetPress = () => {
    router.push('/add-pet-report');
  };

  return (
    <View style={styles.container}>
      <AppHeader pageTitle="Lost Pets" showLogout={true} />

      <ScrollView style={styles.scrollView}>
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

        <Searchbar
          placeholder="Search by name, species, breed, location..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
        />

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Recent Pet Reports
        </ThemedText>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ThemedText>Loading pets...</ThemedText>
          </View>
        ) : filteredPets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText>No pets found</ThemedText>
          </View>
        ) : (
          filteredPets.map((pet) => {
          const lastSeenDate = new Date(pet.lastSeen);
          const formattedDate = lastSeenDate.toLocaleDateString();
          const formattedTime = lastSeenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
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
                <View style={styles.petHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.petName}>
                    {pet.name}
                  </ThemedText>
                  <View style={styles.chipContainer}>
                    <Chip
                      mode="outlined"
                      style={[styles.typeChip, pet.type === 'Lost' ? styles.lostChip : styles.foundChip]}
                      textStyle={styles.chipText}
                    >
                      {pet.type === 'Lost' ? '🔍 Lost' : '🏠 Found'}
                    </Chip>
                    <Chip
                      mode="outlined"
                      style={[styles.speciesChip]}
                      textStyle={styles.chipText}
                    >
                      {pet.species === 'Dog' ? '🐕 Dog' : '🐱 Cat'}
                    </Chip>
                  </View>
                </View>
                <ThemedText style={styles.petBreed}>
                  {pet.breed} • {pet.color}
                </ThemedText>
                <ThemedText style={styles.petLocation}>
                  📍 {pet.location}
                </ThemedText>
                <ThemedText style={styles.petDate}>
                  Last seen: {formattedDate} at {formattedTime}
                </ThemedText>
              </View>
              <View style={styles.arrow}>
                <ThemedText style={styles.arrowText}>›</ThemedText>
              </View>
            </TouchableOpacity>
          );
          })
        )}
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  petHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  chipContainer: {
    flexDirection: 'column',
    gap: 4,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
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
  searchBar: {
    backgroundColor: '#f8f9fa',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    fontSize: 16,
  },
  typeChip: {
    height: 32,
    marginBottom: 2,
  },
  lostChip: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  foundChip: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
  },
  speciesChip: {
    height: 32,
  },
  dogChip: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  catChip: {
    backgroundColor: '#fce4ec',
    borderColor: '#e91e63',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});