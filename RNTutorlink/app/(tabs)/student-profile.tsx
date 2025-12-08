import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { studentService } from '@/services/firebaseService';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function StudentProfile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    interests: '',
    gradeLevel: '',
    subjects: '',
    bio: '',
    goals: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear error when user types
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Form',
      'Are you sure you want to clear all fields?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setFormData({
              name: '',
              email: '',
              phone: '',
              city: '',
              interests: '',
              gradeLevel: '',
              subjects: '',
              bio: '',
              goals: '',
            });
            setError(null);
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    console.log('🔄 Starting save process...');
    setLoading(true);
    setError(null);

    try {
      console.log('📤 Sending to Firebase...');
      
      // Save to Firebase
      const savedStudent = await studentService.saveStudentProfile(formData);
      console.log('✅ Firebase save successful! ID:', savedStudent.id);

      // Save to AsyncStorage as backup
      const profileWithId = { 
        ...formData, 
        firebaseId: savedStudent.id,
        savedAt: new Date().toISOString()
      };
      
      await AsyncStorage.setItem('studentProfile', JSON.stringify(profileWithId));
      
      // Save to students list
      const studentsJSON = await AsyncStorage.getItem('students');
      const students = studentsJSON ? JSON.parse(studentsJSON) : [];
      students.push(profileWithId);
      await AsyncStorage.setItem('students', JSON.stringify(students));

      console.log('💾 Saved to local storage');
      
      // Show success and navigate
      Alert.alert(
        'Success ✅', 
        'Your profile has been saved successfully!',
        [
          {
            text: 'Go to Dashboard',
            onPress: () => {
              console.log('🚀 Navigating to dashboard...');
              router.push('/(tabs)/student-dashboard');
            },
          },
        ]
      );

    } catch (error: any) {
      console.error('❌ Save error:', error);
      
      // If Firebase fails, save locally only
      try {
        await AsyncStorage.setItem('studentProfile', JSON.stringify(formData));
        console.log('💾 Saved locally as fallback');
        
        Alert.alert(
          'Saved Locally ⚠️',
          'Could not connect to cloud. Profile saved locally.',
          [
            {
              text: 'Continue Anyway',
              onPress: () => {
                router.push('/(tabs)/student-dashboard');
              },
            },
          ]
        );
      } catch (localError) {
        console.error('❌ Local save also failed:', localError);
        setError('Failed to save profile. Please try again.');
        Alert.alert('Error', 'Failed to save profile. Please try again.');
      }
    } finally {
      console.log('🏁 Save process complete');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle" size={70} color="#9123d1" />
            </View>

            <Text style={styles.title}>Student Profile</Text>
            <Text style={styles.subtitle}>Complete your profile information</Text>
            
            {error && (
              <View style={styles.errorBox}>
                <Ionicons name="warning" size={16} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            <View style={styles.cloudNote}>
              <Ionicons name="cloud" size={14} color="#9123d1" />
              <Text style={styles.cloudNoteText}> Your data will sync with Firebase</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            {/* Name */}
            <Text style={styles.label}>
              <Text style={styles.required}>* </Text>
              Full Name
            </Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
            />

            {/* Email */}
            <Text style={styles.label}>
              <Text style={styles.required}>* </Text>
              Email Address
            </Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Phone */}
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />

            {/* City */}
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={formData.city}
              onChangeText={(text) => handleChange('city', text)}
              placeholder="Enter your city"
              placeholderTextColor="#9CA3AF"
            />

            {/* Grade Level */}
            <Text style={styles.label}>Grade Level</Text>
            <TextInput
              style={styles.input}
              value={formData.gradeLevel}
              onChangeText={(text) => handleChange('gradeLevel', text)}
              placeholder="e.g., 10th Grade, College Freshman"
              placeholderTextColor="#9CA3AF"
            />

            {/* Interests */}
            <Text style={styles.label}>Interests</Text>
            <TextInput
              style={styles.input}
              value={formData.interests}
              onChangeText={(text) => handleChange('interests', text)}
              placeholder="e.g., Science, Math, Programming"
              placeholderTextColor="#9CA3AF"
            />

            {/* Subjects */}
            <Text style={styles.label}>Subjects</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.subjects}
              onChangeText={(text) => handleChange('subjects', text)}
              placeholder="Subjects you need help with"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />

            {/* Bio */}
            <Text style={styles.label}>Bio / About Me</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.bio}
              onChangeText={(text) => handleChange('bio', text)}
              placeholder="Tell us about yourself..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
            />

            {/* Goals */}
            <Text style={styles.label}>Learning Goals</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.goals}
              onChangeText={(text) => handleChange('goals', text)}
              placeholder="What do you hope to achieve?"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
              disabled={loading}
            >
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.resetButtonText}> Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={20} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}> Save & Continue</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Status Message */}
          <View style={styles.statusContainer}>
            <Ionicons name="information-circle" size={16} color="#6B7280" />
            <Text style={styles.statusText}>
              Required fields are marked with *
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0b7f8',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 8,
  },
  cloudNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
  },
  cloudNoteText: {
    fontSize: 14,
    color: '#6B46C1',
    marginLeft: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    marginLeft: 8,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
    minHeight: 48,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9F7AEA',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flex: 1,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9123d1',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flex: 2,
  },
  saveButtonDisabled: {
    backgroundColor: '#A78BFA',
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
});