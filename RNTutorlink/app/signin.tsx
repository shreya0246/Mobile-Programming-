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

export default function SignInScreen() {
  return (
    <LinearGradient
      colors={['#bca7ee', '#ffccf1']}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Sign In or Create Account</Text>
        <Text style={styles.subtitle}>Choose your preferred sign-in method</Text>
        
        <TouchableOpacity style={[styles.button, styles.facebookButton]}>
          <Text style={styles.buttonText}>Continue with Facebook</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.emailButton]}
          onPress={() => router.push('/email')}
        >
          <Text style={styles.buttonText}>Continue with Email / Number</Text>
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
  button: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    marginBottom: 20,
  },
  facebookButton: {
    backgroundColor: '#3b5998',
  },
  emailButton: {
    backgroundColor: '#af6ff3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});