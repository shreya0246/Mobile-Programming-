import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Teacher {
  name: string;
  subjects: string;
  experience: number;
  bio: string;
}

interface StudentProfile {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  subjects?: string;
  gradeLevel?: string;
  goals?: string;
  interests?: string;
}

export default function StudentDashboardScreen() {
  const [activeSection, setActiveSection] = useState('home');
  const [teachers, setTeachers] = useState<Teacher[]>([
    { name: "Alice Sharma", subjects: "Math, Physics", experience: 5, bio: "Passionate about simplifying complex topics." },
    { name: "Rahul Mehta", subjects: "English, History", experience: 3, bio: "Helps students improve communication skills." },
    { name: "Priya Karki", subjects: "Biology, Chemistry", experience: 4, bio: "Makes science fun and interactive." },
  ]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<StudentProfile>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [chatMessages, setChatMessages] = useState<{text: string, isUser: boolean}[]>([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load teachers from storage
      const teachersJSON = await AsyncStorage.getItem('teachers');
      if (teachersJSON) {
        const savedTeachers = JSON.parse(teachersJSON);
        setTeachers(savedTeachers);
      }

      // Load student profile
      const profileJSON = await AsyncStorage.getItem('studentProfile');
      if (profileJSON) {
        const profile = JSON.parse(profileJSON);
        setStudentProfile(profile);
        setEditData(profile);
      }
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjects.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveProfile = async () => {
    try {
      await AsyncStorage.setItem('studentProfile', JSON.stringify(editData));
      setStudentProfile(editData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage = { text: chatInput, isUser: true };
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');

    // Simulate reply
    setTimeout(() => {
      const reply = { text: "Thanks for reaching out! I'll get back to you soon.", isUser: false };
      setChatMessages(prev => [...prev, reply]);
    }, 500);
  };

  // Navigation buttons
  const NavButton = ({ section, label, emoji }: { section: string, label: string, emoji: string }) => (
    <TouchableOpacity 
      style={[styles.navButton, activeSection === section && styles.activeNavButton]}
      onPress={() => setActiveSection(section)}
    >
      <Text style={styles.navButtonText}>{emoji} {label}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#bca7ee', '#ffccf1']} style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <NavButton section="home" label="Home" emoji="🏠" />
        <NavButton section="profile" label="Profile" emoji="👤" />
        <NavButton section="teachers" label="Teachers" emoji="👩‍🏫" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Home Section */}
        {activeSection === 'home' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Welcome to TutorLink</Text>
            <Text style={styles.sectionText}>
              Find the perfect teacher for your learning journey.
            </Text>
            
            <TextInput
              style={styles.searchBar}
              placeholder="🔍 Search teachers by name or subject"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            
            <Text style={styles.subtitle}>Recommended Teachers</Text>
            
            {filteredTeachers.map((teacher, index) => (
              <View key={index} style={styles.listCard}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' }}
                  style={styles.avatar}
                />
                <View style={styles.listCardContent}>
                  <Text style={styles.listCardTitle}>{teacher.name}</Text>
                  <Text style={styles.listCardText}>Subjects: {teacher.subjects}</Text>
                  <Text style={styles.listCardText}>Experience: {teacher.experience} years</Text>
                  <Text style={styles.listCardText}>Bio: {teacher.bio}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Profile</Text>
            
            {!isEditing ? (
              <View>
                <View style={styles.profileInfo}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{studentProfile.name || 'Not set'}</Text>
                  
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{studentProfile.email || 'Not set'}</Text>
                  
                  <Text style={styles.label}>Phone:</Text>
                  <Text style={styles.value}>{studentProfile.phone || 'Not set'}</Text>
                  
                  <Text style={styles.label}>City:</Text>
                  <Text style={styles.value}>{studentProfile.city || 'Not set'}</Text>
                  
                  <Text style={styles.label}>Subjects:</Text>
                  <Text style={styles.value}>{studentProfile.subjects || 'Not set'}</Text>
                  
                  <Text style={styles.label}>Grade Level:</Text>
                  <Text style={styles.value}>{studentProfile.gradeLevel || 'Not set'}</Text>
                  
                  <Text style={styles.label}>Goals:</Text>
                  <Text style={styles.value}>{studentProfile.goals || 'Not set'}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.button}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.buttonText}>Edit Profile ✏️</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={editData.name || ''}
                  onChangeText={(text) => setEditData({...editData, name: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={editData.email || ''}
                  onChangeText={(text) => setEditData({...editData, email: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone"
                  value={editData.phone || ''}
                  onChangeText={(text) => setEditData({...editData, phone: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  value={editData.city || ''}
                  onChangeText={(text) => setEditData({...editData, city: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Subjects"
                  value={editData.subjects || ''}
                  onChangeText={(text) => setEditData({...editData, subjects: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Grade Level"
                  value={editData.gradeLevel || ''}
                  onChangeText={(text) => setEditData({...editData, gradeLevel: text})}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Goals"
                  value={editData.goals || ''}
                  onChangeText={(text) => setEditData({...editData, goals: text})}
                  multiline
                />

                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Teachers Section */}
        {activeSection === 'teachers' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>More Teacher Recommendations</Text>
            
            {teachers.map((teacher, index) => (
              <View key={index} style={styles.listCard}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' }}
                  style={styles.avatar}
                />
                <View style={styles.listCardContent}>
                  <Text style={styles.listCardTitle}>{teacher.name}</Text>
                  <Text style={styles.listCardText}>Subjects: {teacher.subjects}</Text>
                  <Text style={styles.listCardText}>Experience: {teacher.experience} years</Text>
                  <Text style={styles.listCardText}>Bio: {teacher.bio}</Text>
                </View>
              </View>
            ))}
            
            <Text style={styles.subtitle}>💬 Chat with a Teacher</Text>
            <View style={styles.chatArea}>
              <ScrollView style={styles.chatMessages}>
                {chatMessages.map((message, index) => (
                  <View
                    key={index}
                    style={[
                      styles.messageBubble,
                      message.isUser ? styles.userBubble : styles.replyBubble,
                    ]}
                  >
                    <Text style={[
                      styles.messageText,
                      message.isUser ? styles.userMessageText : styles.replyMessageText,
                    ]}>
                      {message.isUser ? 'You: ' : 'Teacher: '}{message.text}
                    </Text>
                  </View>
                ))}
              </ScrollView>
              
              <View style={styles.chatInputContainer}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Type your message..."
                  value={chatInput}
                  onChangeText={setChatInput}
                  onSubmitEditing={sendMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#d2e9fc',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  navButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeNavButton: {
    backgroundColor: 'rgba(157, 83, 233, 0.1)',
  },
  navButtonText: {
    fontSize: 14,
    color: '#9c53e9',
    fontWeight: '500',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: 'rgba(255, 237, 253, 0.95)',
    borderRadius: 20,
    padding: 25,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2d2d2d',
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#666',
    textAlign: 'center',
  },
  searchBar: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f0efc0',
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: 'white',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#72386a',
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(247, 234, 255, 0.9)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 30,
  },
  listCardContent: {
    flex: 1,
  },
  listCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  listCardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  profileInfo: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#72386a',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    paddingLeft: 10,
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f0efc0',
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#af6ff3',
    paddingVertical: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: '#c89cfaff',
  },
  cancelButton: {
    backgroundColor: '#ffb5e3ff',
  },
  buttonText: {
    color: '#fae0ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chatArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    padding: 15,
    backgroundColor: 'white',
    marginTop: 10,
  },
  chatMessages: {
    height: 200,
    marginBottom: 15,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#e1cbffff',
  },
  replyBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 14,
  },
  userMessageText: {
    color: 'white',
  },
  replyMessageText: {
    color: '#333',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: '#af6ff3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});