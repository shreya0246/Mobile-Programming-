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

interface Student {
  name: string;
  subjects: string;
  goals: string;
}

interface TeacherProfile {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  experience?: string;
  qualification?: string;
  subjects?: string;
  gradeLevel?: string;
  mode?: string;
  bio?: string;
}

export default function TeacherDashboardScreen() {
  const [activeSection, setActiveSection] = useState('home');
  const [students, setStudents] = useState<Student[]>([
    { name: "Sita Thapa", subjects: "Math, Physics", goals: "Improve problem-solving skills" },
    { name: "Arjun Basnet", subjects: "English, History", goals: "Enhance writing and grammar" },
    { name: "Mina Gurung", subjects: "Biology, Chemistry", goals: "Understand concepts better" },
  ]);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<TeacherProfile>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [chatMessages, setChatMessages] = useState<{text: string, isUser: boolean}[]>([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load students from storage
      const studentsJSON = await AsyncStorage.getItem('students');
      if (studentsJSON) {
        const savedStudents = JSON.parse(studentsJSON);
        setStudents(savedStudents);
      }

      // Load teacher profile
      const profileJSON = await AsyncStorage.getItem('teacherProfile');
      if (profileJSON) {
        const profile = JSON.parse(profileJSON);
        setTeacherProfile(profile);
        setEditData(profile);
      }
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.subjects.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveProfile = async () => {
    try {
      await AsyncStorage.setItem('teacherProfile', JSON.stringify(editData));
      setTeacherProfile(editData);
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
      const reply = { text: "Thanks for your message! I appreciate your interest.", isUser: false };
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
        <NavButton section="students" label="Students" emoji="🎓" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Home Section */}
        {activeSection === 'home' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Welcome to TutorLink Teacher Dashboard</Text>
            <Text style={styles.sectionText}>
              Find students who need your expertise.
            </Text>
            
            <TextInput
              style={styles.searchBar}
              placeholder="🔍 Search students by name or subject"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            
            <Text style={styles.subtitle}>Students Looking for Tutors</Text>
            
            {filteredStudents.map((student, index) => (
              <View key={index} style={styles.listCard}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png' }}
                  style={styles.avatar}
                />
                <View style={styles.listCardContent}>
                  <Text style={styles.listCardTitle}>{student.name}</Text>
                  <Text style={styles.listCardText}>Subjects: {student.subjects}</Text>
                  <Text style={styles.listCardText}>Goals: {student.goals}</Text>
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
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' }}
                  style={styles.profileAvatar}
                />
                
                <View style={styles.profileInfo}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{teacherProfile.name || 'Not set'}</Text>
                  
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{teacherProfile.email || 'Not set'}</Text>
                  
                  <Text style={styles.label}>Phone:</Text>
                  <Text style={styles.value}>{teacherProfile.phone || 'Not set'}</Text>
                  
                  <Text style={styles.label}>Address:</Text>
                  <Text style={styles.value}>{teacherProfile.address || 'Not set'}</Text>
                  
                  <Text style={styles.label}>Experience:</Text>
                  <Text style={styles.value}>{teacherProfile.experience || 'Not set'} years</Text>
                  
                  <Text style={styles.label}>Qualification:</Text>
                  <Text style={styles.value}>{teacherProfile.qualification || 'Not set'}</Text>
                  
                  <Text style={styles.label}>Subjects:</Text>
                  <Text style={styles.value}>{teacherProfile.subjects || 'Not set'}</Text>
                  
                  <Text style={styles.label}>Teaching Mode:</Text>
                  <Text style={styles.value}>{teacherProfile.mode || 'Not set'}</Text>
                  
                  <Text style={styles.label}>Bio:</Text>
                  <Text style={styles.value}>{teacherProfile.bio || 'Not set'}</Text>
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
                  placeholder="Address"
                  value={editData.address || ''}
                  onChangeText={(text) => setEditData({...editData, address: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Experience (Years)"
                  value={editData.experience || ''}
                  onChangeText={(text) => setEditData({...editData, experience: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Qualification"
                  value={editData.qualification || ''}
                  onChangeText={(text) => setEditData({...editData, qualification: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Subjects"
                  value={editData.subjects || ''}
                  onChangeText={(text) => setEditData({...editData, subjects: text})}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Teaching Mode"
                  value={editData.mode || ''}
                  onChangeText={(text) => setEditData({...editData, mode: text})}
                  multiline
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Bio"
                  value={editData.bio || ''}
                  onChangeText={(text) => setEditData({...editData, bio: text})}
                  multiline
                />

                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.buttonText}>Save Changes 💾</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.buttonText}>Cancel ❌</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Students Section */}
        {activeSection === 'students' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>More Student Recommendations</Text>
            
            {students.map((student, index) => (
              <View key={index} style={styles.listCard}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png' }}
                  style={styles.avatar}
                />
                <View style={styles.listCardContent}>
                  <Text style={styles.listCardTitle}>{student.name}</Text>
                  <Text style={styles.listCardText}>Subjects: {student.subjects}</Text>
                  <Text style={styles.listCardText}>Goals: {student.goals}</Text>
                </View>
              </View>
            ))}
            
            <Text style={styles.subtitle}>💬 Chat with a Student</Text>
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
                      {message.isUser ? 'You: ' : 'Student: '}{message.text}
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
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
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
    backgroundColor: '#306fdd',
  },
  cancelButton: {
    backgroundColor: '#ff6b6b',
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
    backgroundColor: '#306fdd',
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