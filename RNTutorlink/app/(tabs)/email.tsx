import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function EmailScreen() {
  const [contact, setContact] = useState('');

  const handleContinue = () => {
    if (contact.trim()) {
      router.push('/survey');
    } else {
      Alert.alert('Required', 'Please enter your email or phone number');
    }
  };

  return (
    <LinearGradient
      colors={['#bca7ee', '#ffccf1']}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Enter Your Details</Text>
        <Text style={styles.subtitle}>We'll use this to contact you</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email or Phone Number"
          placeholderTextColor="#999"
          value={contact}
          onChangeText={setContact}
          onSubmitEditing={handleContinue}
          returnKeyType="go"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
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
  input: {
    width: '100%',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f0efc0',
    marginBottom: 30,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#af6ff3',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fae0ff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});