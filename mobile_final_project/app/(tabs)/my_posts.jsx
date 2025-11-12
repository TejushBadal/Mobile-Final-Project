import { Image } from 'expo-image';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { FAB, Chip, IconButton } from 'react-native-paper';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AppHeader from '@/components/AppHeader';
import { getPetsByUser, deletePet, initDatabase } from '@/services/database';

export default function MyPostsScreen() {
  const router = useRouter();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user's posts from database
  const loadUserPosts = useCallback(async () => {
    try {
      setLoading(true);
      await initDatabase();
      const pets = await getPetsByUser();
      setUserPosts(pets);
    } catch (error) {
      console.error('Error loading user posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserPosts();
  }, [loadUserPosts]);

  // Refresh posts when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadUserPosts();
    }, [loadUserPosts])
  );

  const handlePetPress = (pet) => {
    router.push({
      pathname: '/pet-detail',
      params: { petData: JSON.stringify(pet) }
    });
  };

  const handleAddPost = () => {
    router.push('/add-pet-report');
  };

  const handleFoundPet = () => {
    router.push('/add-found-pet-report');
  };

  const handleEditPost = (pet) => {
    Alert.alert('Edit Post', `Edit ${pet.name}'s listing`);
  };

  const handleDeletePost = (petId) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePet(petId);
              setUserPosts(posts => posts.filter(post => post.id !== petId));
            } catch (error) {
              console.error('Error deleting pet:', error);
              Alert.alert('Error', 'Failed to delete post. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader pageTitle="My Posts" showLogout={true} />

      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.content}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            My Pet Reports
          </ThemedText>

          {loading ? (
            <View style={styles.loadingState}>
              <Text style={styles.emptyEmoji}>⏳</Text>
              <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
                Loading your posts...
              </ThemedText>
            </View>
          ) : userPosts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🐾</Text>
              <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
                No posts yet
              </ThemedText>
              <ThemedText style={styles.emptySubtitle}>
                Tap the + button to report a lost pet
              </ThemedText>
            </View>
          ) : (
            userPosts.map((pet) => {
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
                          style={[styles.speciesChip, pet.species === 'Dog' ? styles.dogChip : styles.catChip]}
                          textStyle={styles.chipText}
                        >
                          {pet.species === 'Dog' ? '🐕' : '🐱'}
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
                  <View style={styles.actionButtons}>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => handleEditPost(pet)}
                      style={styles.editButton}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => handleDeletePost(pet.id)}
                      style={styles.deleteButton}
                    />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ThemedView>
      </ScrollView>

      <View style={styles.fabContainer}>
        <FAB
          icon="plus"
          style={styles.fabPrimary}
          onPress={handleAddPost}
          label="Report Lost Pet"
        />
        <FAB
          icon="paw"
          style={styles.fabSecondary}
          onPress={handleFoundPet}
          label="Report Pet Found"
        />
      </View>
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
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
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
    alignItems: 'center',
    marginBottom: 4,
  },
  chipContainer: {
    flexDirection: 'row',
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
  typeChip: {
    height: 28,
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
    height: 28,
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
    fontSize: 13,
    fontWeight: '600',
  },
  actionButtons: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  editButton: {
    backgroundColor: '#e3f2fd',
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'column',
    gap: 12,
  },
  fabPrimary: {
    backgroundColor: '#579ee6',
  },
  fabSecondary: {
    backgroundColor: '#4CAF50',
  },
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
});
