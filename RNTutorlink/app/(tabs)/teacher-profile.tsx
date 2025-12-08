import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { teacherService } from '@/services/firebaseService';

const { width } = Dimensions.get('window');

export default function TeacherProfileScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    qualification: '',
    subjects: '',
    gradeLevel: '',
    preferredStudents: '',
    mode: '',
    bio: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Required', 'Please fill in Name and Email');
      return;
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // 🔹 Save to Firebase
      const savedTeacher = await teacherService.saveTeacherProfile(formData);

      // 🔹 Save to AsyncStorage
      const teachersJSON = await AsyncStorage.getItem('teachers');
      const teachers = teachersJSON ? JSON.parse(teachersJSON) : [];

      const finalData = {
        ...formData,
        firebaseId: savedTeacher.id,
      };

      teachers.push(finalData);

      await AsyncStorage.setItem('teachers', JSON.stringify(teachers));
      await AsyncStorage.setItem('teacherProfile', JSON.stringify(finalData));

      Alert.alert(
        'Success ✅',
        'Profile saved to cloud',
        [{ text: 'Go to Dashboard', onPress: () => router.push('/teacher-dashboard') }]
      );

    } catch (error) {
      console.error('Firebase Error:', error);

      // 🔸 Fallback to local storage
      const teachersJSON = await AsyncStorage.getItem('teachers');
      const teachers = teachersJSON ? JSON.parse(teachersJSON) : [];

      teachers.push(formData);

      await AsyncStorage.setItem('teachers', JSON.stringify(teachers));
      await AsyncStorage.setItem('teacherProfile', JSON.stringify(formData));

      Alert.alert(
        'Saved Locally ⚠️',
        'Internet problem. Data saved locally.',
        [{ text: 'Go to Dashboard', onPress: () => router.push('/teacher-dashboard') }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Form',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            experience: '',
            qualification: '',
            subjects: '',
            gradeLevel: '',
            preferredStudents: '',
            mode: '',
            bio: '',
          })
        }
      ]
    );
  };

  return (
    <LinearGradient colors={['#bca7ee', '#ffccf1']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>

            <View style={styles.card}>

              {/* HEADER */}
              <View style={styles.header}>
                <Ionicons name="school" size={70} color="#af6ff3" />
                <Text style={styles.title}>Teacher Profile Setup</Text>
              </View>

              {/* INPUTS */}
              {[
                { label: "Full Name", field: "name" },
                { label: "Email", field: "email" },
                { label: "Phone", field: "phone" },
                { label: "Address", field: "address" },
                { label: "Experience", field: "experience" },
                { label: "Qualification", field: "qualification" },
                { label: "Subjects", field: "subjects" },
                { label: "Grade Level", field: "gradeLevel" },
                { label: "Preferred Students", field: "preferredStudents" },
                { label: "Mode", field: "mode" },
                { label: "Bio", field: "bio", multiline: true },
              ].map((item, index) => (
                <View style={styles.inputGroup} key={index}>
                  <Text style={styles.label}>{item.label}</Text>
                  <TextInput
                    style={[styles.input, item.multiline && styles.textArea]}
                    value={formData[item.field]}
                    onChangeText={(text) => handleChange(item.field, text)}
                    multiline={item.multiline}
                  />
                </View>
              ))}

              {/* BUTTONS */}
              <View style={styles.buttonContainer}>

                <TouchableOpacity
                  style={[styles.button, styles.resetButton]}
                  onPress={handleReset}
                >
                  <Ionicons name="refresh" size={18} color="#fff" />
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.submitButton]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="cloud-upload" size={18} color="#fff" />
                      <Text style={styles.submitButtonText}>Save</Text>
                    </>
                  )}
                </TouchableOpacity>

              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardAvoid: { flex: 1 },
  scrollContent: { padding: 20, alignItems: 'center' },
  card: {
    backgroundColor: '#ffe6fc',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 500,
  },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  inputGroup: { marginBottom: 14 },
  label: { marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#e1bee7',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },
  textArea: { height: 100, textAlignVertical: 'top' },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 14,
    width: '48%'
  },

  resetButton: { backgroundColor: '#cd81ff' },
  submitButton: { backgroundColor: '#7b2cff' },

  resetButtonText: { color: '#fff', marginLeft: 6 },
  submitButtonText: { color: '#fff', marginLeft: 6, fontWeight: 'bold' }
});
