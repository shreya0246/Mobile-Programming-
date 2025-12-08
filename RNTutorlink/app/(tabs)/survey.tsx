import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SurveyScreen() {
  
  const selectRole = async (role: string) => {
    // Store the selected role
    await AsyncStorage.setItem('userRole', role);
    
    if (role === 'student') {
      router.push('/student-profile');
    } else {
      router.push('/teacher-profile');
    }
  };

  return (
    <LinearGradient
      colors={['#bca7ee', '#ffccf1']}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Tell us who you are</Text>
        <Text style={styles.subtitle}>Select your role:</Text>
        
        <View style={styles.choiceButtons}>
          <TouchableOpacity 
            style={[styles.button, styles.studentButton]}
            onPress={() => selectRole('student')}
          >
            <Text style={styles.buttonText}>🎓 I'm a Student</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.teacherButton]}
            onPress={() => selectRole('teacher')}
          >
            <Text style={styles.buttonText}>👩‍🏫 I'm a Teacher</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 237, 253, 0.95)',
    borderRadius: 20,
    padding: 30,
    width: width * 0.9,
    maxWidth: 450,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2d2d2d',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 35,
    color: '#666',
    textAlign: 'center',
  },
  choiceButtons: {
    width: '100%',
    gap: 20,
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  studentButton: {
    backgroundColor: '#af6ff3',
  },
  teacherButton: {
    backgroundColor: '#306fdd',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});