import { ScrollView, StyleSheet, View, Alert, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { addPet, updatePet } from '@/services/database';
import {
  TextInput,
  Button,
  Card,
  SegmentedButtons,
  HelperText
} from 'react-native-paper';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AppHeader from '@/components/AppHeader';

export default function AddPetReportScreen() {
  const router = useRouter();
  const { editMode, petData } = useLocalSearchParams();
  const isEditMode = editMode === 'true';
  const editPetData = petData ? JSON.parse(petData) : null;
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    color: '',
    location: '',
    description: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);

  // Populate form data in edit mode
  useEffect(() => {
    if (isEditMode && editPetData) {
      setFormData({
        name: editPetData.name || '',
        species: editPetData.species || 'Dog',
        breed: editPetData.breed || '',
        color: editPetData.color || '',
        location: editPetData.location || '',
        description: editPetData.description || '',
        contactName: editPetData.contact?.name || '',
        contactEmail: editPetData.contact?.email || '',
        contactPhone: editPetData.contact?.phone || ''
      });
      setSelectedImage(editPetData.imageUri);
    }
  }, [isEditMode, editPetData]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const speciesOptions = [
    { value: 'Dog', label: '🐕 Dog' },
    { value: 'Cat', label: '🐱 Cat' }
  ];

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to allow camera roll permissions to add photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to allow camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Add Photo',
      'Choose how to add a photo of your pet',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };


  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Pet name is required';
    }

    if (!formData.breed.trim()) {
      newErrors.breed = 'Breed is required';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'Color is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Last seen location is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Your name is required';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email';
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const petData = {
        name: formData.name.trim() || 'Unknown',
        type: 'Lost',
        species: formData.species,
        breed: formData.breed,
        color: formData.color,
        lastSeen: new Date().toISOString(),
        location: formData.location,
        coordinates: {
          latitude: 43.6532,
          longitude: -79.3832
        },
        description: formData.description,
        contact: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone
        },
        imageUri: selectedImage,
        userId: 'current_user'
      };

      if (isEditMode && editPetData) {
        await updatePet(editPetData.id, petData);
      } else {
        await addPet(petData);
      }

      setIsSubmitting(false);
      Alert.alert(
        'Success!',
        isEditMode ? 'Your pet report has been updated successfully.' : 'Your lost pet report has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/my_posts')
          }
        ]
      );

    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      Alert.alert(
        'Error',
        'Failed to submit your pet report. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader pageTitle={isEditMode ? "Edit Pet Report" : "Report Lost Pet"} showBackButton={true} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>

          {/* Pet Information Section */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                🐾 Pet Information
              </ThemedText>

              <TextInput
                label="Pet Name"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                mode="outlined"
                style={styles.input}
                error={!!errors.name}
              />
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>

              <ThemedText style={styles.label}>Species</ThemedText>
              <SegmentedButtons
                value={formData.species}
                onValueChange={(value) => updateFormData('species', value)}
                buttons={speciesOptions}
                style={styles.segmentedButtons}
              />

              <TextInput
                label="Breed"
                value={formData.breed}
                onChangeText={(value) => updateFormData('breed', value)}
                mode="outlined"
                style={styles.input}
                error={!!errors.breed}
                placeholder="e.g., Golden Retriever, Persian, Mixed"
              />
              <HelperText type="error" visible={!!errors.breed}>
                {errors.breed}
              </HelperText>

              <TextInput
                label="Color/Markings"
                value={formData.color}
                onChangeText={(value) => updateFormData('color', value)}
                mode="outlined"
                style={styles.input}
                error={!!errors.color}
                placeholder="e.g., Golden, Black and White, Orange Tabby"
              />
              <HelperText type="error" visible={!!errors.color}>
                {errors.color}
              </HelperText>
            </Card.Content>
          </Card>

          {/* Photo Section */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                📸 Pet Photo
              </ThemedText>

              {selectedImage ? (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                  <TouchableOpacity style={styles.changeImageButton} onPress={showImagePicker}>
                    <ThemedText style={styles.changeImageText}>Change Photo</ThemedText>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.addImageButton} onPress={showImagePicker}>
                  <ThemedText style={styles.addImageText}>📸 Add Photo</ThemedText>
                  <ThemedText style={styles.addImageSubtext}>Help others identify your pet</ThemedText>
                </TouchableOpacity>
              )}
            </Card.Content>
          </Card>


          {/* Location & Description Section */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                📍 Last Seen Information
              </ThemedText>

              <TextInput
                label="Last Seen Location"
                value={formData.location}
                onChangeText={(value) => updateFormData('location', value)}
                mode="outlined"
                style={styles.input}
                error={!!errors.location}
                placeholder="e.g., High Park, Toronto"
              />
              <HelperText type="error" visible={!!errors.location}>
                {errors.location}
              </HelperText>

              <TextInput
                label="Description"
                value={formData.description}
                onChangeText={(value) => updateFormData('description', value)}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={styles.input}
                error={!!errors.description}
                placeholder="Describe your pet's behavior, distinguishing features, or any other helpful details..."
              />
              <HelperText type="error" visible={!!errors.description}>
                {errors.description}
              </HelperText>
            </Card.Content>
          </Card>

          {/* Contact Information Section */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                📞 Your Contact Information
              </ThemedText>

              <TextInput
                label="Your Name"
                value={formData.contactName}
                onChangeText={(value) => updateFormData('contactName', value)}
                mode="outlined"
                style={styles.input}
                error={!!errors.contactName}
              />
              <HelperText type="error" visible={!!errors.contactName}>
                {errors.contactName}
              </HelperText>

              <TextInput
                label="Email Address"
                value={formData.contactEmail}
                onChangeText={(value) => updateFormData('contactEmail', value)}
                mode="outlined"
                style={styles.input}
                error={!!errors.contactEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <HelperText type="error" visible={!!errors.contactEmail}>
                {errors.contactEmail}
              </HelperText>

              <TextInput
                label="Phone Number"
                value={formData.contactPhone}
                onChangeText={(value) => updateFormData('contactPhone', value)}
                mode="outlined"
                style={styles.input}
                error={!!errors.contactPhone}
                keyboardType="phone-pad"
                placeholder="+1 (555) 123-4567"
              />
              <HelperText type="error" visible={!!errors.contactPhone}>
                {errors.contactPhone}
              </HelperText>
            </Card.Content>
          </Card>

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            {isSubmitting ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update Pet Report' : 'Submit Lost Pet Report')}
          </Button>

          <View style={styles.bottomSpacing} />
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
  sectionCard: {
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
    color: '#333',
  },
  input: {
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    marginTop: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  bottomSpacing: {
    height: 40,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  addImageButton: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    marginBottom: 16,
  },
  addImageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  addImageSubtext: {
    fontSize: 12,
    color: '#999',
  },
  changeImageButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  changeImageText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});