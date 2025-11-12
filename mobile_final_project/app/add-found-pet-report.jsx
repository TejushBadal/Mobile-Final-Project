import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { addPet } from '@/services/database';
import {
  TextInput,
  Button,
  Card,
  SegmentedButtons,
  HelperText,
  RadioButton,
  Text
} from 'react-native-paper';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AppHeader from '@/components/AppHeader';

export default function AddFoundPetReportScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    species: 'Dog',
    breed: '',
    color: '',
    size: 'Medium',
    foundLocation: '',
    foundDate: '',
    condition: 'Good',
    description: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    tempCare: 'Yes'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const speciesOptions = [
    { value: 'Dog', label: '🐕 Dog' },
    { value: 'Cat', label: '🐱 Cat' }
  ];

  const sizeOptions = [
    { value: 'Small', label: 'Small' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Large', label: 'Large' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.breed.trim()) {
      newErrors.breed = 'Breed/type is required';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'Color/markings are required';
    }

    if (!formData.foundLocation.trim()) {
      newErrors.foundLocation = 'Found location is required';
    }

    if (!formData.foundDate.trim()) {
      newErrors.foundDate = 'Found date is required';
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
        name: 'Found Pet',
        type: 'Found',
        species: formData.species,
        breed: formData.breed,
        color: formData.color,
        lastSeen: new Date().toISOString(),
        location: formData.foundLocation,
        coordinates: {
          latitude: 43.6532,
          longitude: -79.3832
        },
        description: `Found on: ${formData.foundDate}, Size: ${formData.size}, Condition: ${formData.condition}, Temporary care: ${formData.tempCare}. ${formData.description}`,
        contact: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone
        },
        imageUri: null,
        userId: 'current_user'
      };

      await addPet(petData);

      setIsSubmitting(false);
      Alert.alert(
        'Success!',
        'Your found pet report has been submitted successfully. Thank you for helping reunite pets with their families!',
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
        'Failed to submit your found pet report. Please try again.',
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
      <AppHeader pageTitle="Report Pet Found" showBackButton={true} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>

          {/* Pet Information Section */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                🐾 Found Pet Information
              </ThemedText>

              <ThemedText style={styles.label}>Species</ThemedText>
              <SegmentedButtons
                value={formData.species}
                onValueChange={(value) => updateFormData('species', value)}
                buttons={speciesOptions}
                style={styles.segmentedButtons}
              />

              <TextInput
                label="Breed/Type (if known)"
                value={formData.breed}
                onChangeText={(value) => updateFormData('breed', value)}
                mode="outlined"
                style={styles.input}
                error={!!errors.breed}
                placeholder="e.g., Golden Retriever, Mixed, Unknown"
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
                placeholder="e.g., Golden, Black collar, White paws"
              />
              <HelperText type="error" visible={!!errors.color}>
                {errors.color}
              </HelperText>

              <ThemedText style={styles.label}>Approximate Size</ThemedText>
              <SegmentedButtons
                value={formData.size}
                onValueChange={(value) => updateFormData('size', value)}
                buttons={sizeOptions}
                style={styles.segmentedButtons}
              />
            </Card.Content>
          </Card>

          {/* Found Details Section */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                📍 Found Details
              </ThemedText>

              <TextInput
                label="Where did you find this pet?"
                value={formData.foundLocation}
                onChangeText={(value) => updateFormData('foundLocation', value)}
                mode="outlined"
                style={styles.input}
                error={!!errors.foundLocation}
                placeholder="e.g., High Park near the playground"
              />
              <HelperText type="error" visible={!!errors.foundLocation}>
                {errors.foundLocation}
              </HelperText>

              <TextInput
                label="When did you find this pet?"
                value={formData.foundDate}
                onChangeText={(value) => updateFormData('foundDate', value)}
                mode="outlined"
                style={styles.input}
                error={!!errors.foundDate}
                placeholder="e.g., Today around 3pm, Yesterday morning"
              />
              <HelperText type="error" visible={!!errors.foundDate}>
                {errors.foundDate}
              </HelperText>

              <ThemedText style={styles.label}>Pet's Condition</ThemedText>
              <RadioButton.Group
                onValueChange={(value) => updateFormData('condition', value)}
                value={formData.condition}
              >
                <View style={styles.radioOption}>
                  <RadioButton value="Good" />
                  <Text style={styles.radioLabel}>Good - appears healthy</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="Injured" />
                  <Text style={styles.radioLabel}>Injured - needs medical attention</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="Scared" />
                  <Text style={styles.radioLabel}>Scared/anxious but healthy</Text>
                </View>
              </RadioButton.Group>

              <TextInput
                label="Description & Behavior"
                value={formData.description}
                onChangeText={(value) => updateFormData('description', value)}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={styles.input}
                error={!!errors.description}
                placeholder="Describe the pet's behavior, any tags/collars, distinctive features, etc."
              />
              <HelperText type="error" visible={!!errors.description}>
                {errors.description}
              </HelperText>
            </Card.Content>
          </Card>

          {/* Temporary Care Section */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                🏠 Temporary Care
              </ThemedText>

              <ThemedText style={styles.label}>Can you provide temporary care?</ThemedText>
              <RadioButton.Group
                onValueChange={(value) => updateFormData('tempCare', value)}
                value={formData.tempCare}
              >
                <View style={styles.radioOption}>
                  <RadioButton value="Yes" />
                  <Text style={styles.radioLabel}>Yes, I can keep the pet temporarily</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="Limited" />
                  <Text style={styles.radioLabel}>Limited time only (few days)</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="No" />
                  <Text style={styles.radioLabel}>No, pet needs immediate placement</Text>
                </View>
              </RadioButton.Group>
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
            {isSubmitting ? 'Submitting...' : 'Submit Found Pet Report'}
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
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    flex: 1,
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
});