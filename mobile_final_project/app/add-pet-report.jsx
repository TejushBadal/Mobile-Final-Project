import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const speciesOptions = [
    { value: 'Dog', label: '🐕 Dog' },
    { value: 'Cat', label: '🐱 Cat' }
  ];

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

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Success!',
        'Your lost pet report has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    }, 1500);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader pageTitle="Report Lost Pet" showBackButton={true} />

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
            {isSubmitting ? 'Submitting...' : 'Submit Lost Pet Report'}
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
});