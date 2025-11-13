import { ScrollView, StyleSheet, View, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image } from 'expo-image';
import { Chip, Card, Divider, Button, IconButton } from 'react-native-paper';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import MapComponent from '@/components/MapComponent';
import AppHeader from '@/components/AppHeader';
import { AppleMaps, GoogleMaps, useLocationPermissions } from 'expo-maps';

export default function PetDetailScreen() {
  const { petData } = useLocalSearchParams();
  const [showContactInfo, setShowContactInfo] = useState(false);

  let pet = null;
  try {
    pet = JSON.parse(petData);
  } catch (error) {
    console.error('Error parsing pet data:', error);
  }

  if (!pet) {
    return (
      <View style={styles.container}>
        <AppHeader pageTitle="Pet Details" showBackButton={true} />
        <ThemedView style={styles.content}>
          <ThemedText>Error loading pet details</ThemedText>
        </ThemedView>
      </View>
    );
  }

  const lastSeenDate = new Date(pet.lastSeen);
  const formattedDate = lastSeenDate.toLocaleDateString();
  const formattedTime = lastSeenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleCall = () => {
    if (pet.contact?.phone) {
      Linking.openURL(`tel:${pet.contact.phone}`);
    }
  };

  const handleEmail = () => {
    if (pet.contact?.email) {
      Linking.openURL(`mailto:${pet.contact.email}`);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader pageTitle="Pet Details" showBackButton={true} />

      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.content}>

          {/* Pet Image */}
          <View style={styles.imageContainer}>
            <Image
              source={
                pet.imageUri && pet.imageUri.startsWith('file://')
                  ? { uri: pet.imageUri }
                  : require('@/assets/demo_images/ASSET_1.jpg')
              }
              style={styles.petImage}
            />
          </View>

          {/* Pet Basic Info */}
          <Card style={styles.infoCard}>
            <Card.Content>
              <View style={styles.petHeader}>
                <ThemedText type="title" style={styles.petName}>
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
                    {pet.species === 'Dog' ? '🐕 Dog' : '🐱 Cat'}
                  </Chip>
                </View>
              </View>

              <ThemedText style={styles.breedText}>
                {pet.breed} • {pet.color}
              </ThemedText>

              <Divider style={styles.divider} />

              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>
                  📍 {pet.type === 'Lost' ? 'Last Seen:' : 'Found At:'}
                </ThemedText>
                <ThemedText style={styles.detailValue}>{pet.location}</ThemedText>
              </View>

              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabelWide}>🕒 Date & Time:</ThemedText>
                <ThemedText style={styles.detailValueWide}>{formattedDate} at {formattedTime}</ThemedText>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.descriptionSection}>
                <ThemedText style={styles.detailLabel}>📝 Description:</ThemedText>
                <ThemedText style={styles.descriptionText}>{pet.description}</ThemedText>
              </View>
            </Card.Content>
          </Card>

          {/* Contact Button */}
          {!showContactInfo ? (
            <Button
              mode="contained"
              onPress={() => setShowContactInfo(true)}
              style={styles.foundPetButton}
              icon="paw"
              contentStyle={styles.foundPetButtonContent}
            >
              {pet.type === 'Lost' ? '🐾 I Found This Pet!' : '👀 I Know This Pet!'}
            </Button>
          ) : (
            /* Contact Information */
            <Card style={styles.contactCard}>
              <Card.Content>
                <ThemedText type="subtitle" style={styles.contactTitle}>
                  📞 Contact Information
                </ThemedText>

                <View style={styles.contactRow}>
                  <ThemedText style={styles.contactLabel}>Name:</ThemedText>
                  <ThemedText style={styles.contactValue}>Jason M</ThemedText>
                </View>

                <View style={styles.contactRow}>
                  <ThemedText style={styles.contactLabel}>Email:</ThemedText>
                  <TouchableOpacity onPress={handleEmail}>
                    <ThemedText style={[styles.contactValue, styles.contactLink]}>
                      jayjay123@gmail.com
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                <View style={styles.contactRow}>
                  <ThemedText style={styles.contactLabel}>Phone:</ThemedText>
                  <TouchableOpacity onPress={handleCall}>
                    <ThemedText style={[styles.contactValue, styles.contactLink]}>
                      +1 (555) 123-4567
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                <View style={styles.contactButtons}>
                  <Button
                    mode="contained"
                    onPress={handleCall}
                    style={styles.contactButton}
                    icon="phone"
                  >
                    Call
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={handleEmail}
                    style={styles.contactButton}
                    icon="email"
                  >
                    Email
                  </Button>
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Map */}
          {pet.coordinates && (
            <>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                📍 Last Seen Location
              </ThemedText>
              <View style={styles.mapContainer}>
                <MapComponent />
              </View>
            </>
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
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  petImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  infoCard: {
    marginBottom: 20,
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
  contactCard: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  petHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'column',
    gap: 4,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  breedText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  divider: {
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 100,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
    color: '#333',
  },
  detailLabelWide: {
    fontSize: 14,
    fontWeight: '600',
    width: 120,
    marginRight: 8,
  },
  detailValueWide: {
    fontSize: 14,
    flex: 1,
    color: '#333',
  },
  descriptionSection: {
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginTop: 4,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#2196f3',
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 60,
    marginRight: 12,
  },
  contactValue: {
    fontSize: 14,
    flex: 1,
    color: '#333',
  },
  contactLink: {
    color: '#2196f3',
    textDecorationLine: 'underline',
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  contactButton: {
    flex: 1,
  },
  typeChip: {
    height: 32,
    marginBottom: 4,
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
    fontSize: 13,
    fontWeight: '600',
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
  foundPetButton: {
    marginBottom: 20,
    backgroundColor: '#4CAF50',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  foundPetButtonContent: {
    paddingVertical: 8,
  },
});