import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Student {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  interests?: string;
  gradeLevel?: string;
  subjects?: string;
  bio?: string;
  goals?: string;
  createdAt?: string;
}

export default function StudentDetailsScreen() {
  const params = useLocalSearchParams();
  const studentId = params.id as string;
  const studentName = params.name as string;
  
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentDetails();
  }, [studentId]);

  const loadStudentDetails = async () => {
    try {
      setLoading(true);
      
      // Try to load from AsyncStorage
      const studentsJSON = await AsyncStorage.getItem('students');
      if (studentsJSON) {
        const students = JSON.parse(studentsJSON);
        const foundStudent = students.find((s: any) => s.firebaseId === studentId || s.id === studentId);
        
        if (foundStudent) {
          setStudent(foundStudent);
          return;
        }
      }
      
      // If not found, show sample data
      setStudent({
        name: studentName || "Sample Student",
        email: "student@example.com",
        phone: "+1 (234) 567-8900",
        city: "New York, USA",
        gradeLevel: "11th Grade",
        subjects: "Math, Physics, Computer Science",
        interests: "Robotics, Programming, AI",
        bio: "Dedicated student with a passion for technology and problem-solving. Always eager to learn new concepts and apply them in practical projects.",
        goals: "To pursue a degree in Computer Science and contribute to innovative tech solutions.",
      });
    } catch (error) {
      console.error('Error loading student details:', error);
      Alert.alert('Error', 'Could not load student details');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (!student) return;
    
    const options = ['Email', 'Call', 'Message', 'Cancel'];
    
    Alert.alert(
      'Contact Student',
      'How would you like to contact this student?',
      options.map((option) => ({
        text: option,
        onPress: () => {
          if (option === 'Email' && student.email) {
            Linking.openURL(`mailto:${student.email}`);
          } else if (option === 'Call' && student.phone) {
            Linking.openURL(`tel:${student.phone.replace(/\D/g, '')}`);
          } else if (option === 'Message' && student.phone) {
            if (Platform.OS === 'ios') {
              Linking.openURL(`sms:${student.phone.replace(/\D/g, '')}`);
            } else {
              Linking.openURL(`sms:${student.phone.replace(/\D/g, '')}?body=Hi ${student.name}, this is regarding your tutoring sessions`);
            }
          }
        },
        style: option === 'Cancel' ? 'cancel' : 'default',
      })),
      { cancelable: true }
    );
  };

  const handleAssignTask = () => {
    Alert.alert(
      'Assign Task',
      `Assign a learning task to ${student?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Assign', 
          onPress: () => {
            Alert.alert('Task Assigned', 'Task has been assigned successfully.');
          }
        },
      ]
    );
  };

  const handleScheduleSession = () => {
    Alert.alert(
      'Schedule Session',
      `Schedule a tutoring session with ${student?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Schedule', 
          onPress: () => {
            Alert.alert('Scheduled', 'Session has been scheduled. Student will be notified.');
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading student details...</Text>
      </SafeAreaView>
    );
  }

  if (!student) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="person-circle-outline" size={80} color="#6B7280" />
          <Text style={styles.errorTitle}>Student Not Found</Text>
          <Text style={styles.errorText}>This student profile is no longer available</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.headerGradient}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButtonHeader}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.studentHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=8B5CF6&color=fff&size=150` }}
              style={styles.avatar}
            />
          </View>
          
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentGrade}>{student.gradeLevel}</Text>
          <Text style={styles.studentSubjects}>{student.subjects}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#4F46E5" />
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.taskButton} onPress={handleAssignTask}>
            <Ionicons name="document-text" size={20} color="#FFFFFF" />
            <Text style={styles.taskButtonText}>Assign Task</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle" size={22} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          
          <DetailRow icon="mail" label="Email" value={student.email} isEmail />
          {student.phone && <DetailRow icon="call" label="Phone" value={student.phone} isPhone />}
          {student.city && <DetailRow icon="location" label="City" value={student.city} />}
          {student.interests && <DetailRow icon="heart" label="Interests" value={student.interests} />}
        </View>

        {/* Academic Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school" size={22} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Academic Information</Text>
          </View>
          
          {student.gradeLevel && <DetailRow icon="graduation" label="Grade Level" value={student.gradeLevel} />}
          {student.subjects && <DetailRow icon="book" label="Subjects" value={student.subjects} />}
          
          {student.bio && (
            <View style={styles.infoRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="document-text" size={18} color="#6B7280" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Bio</Text>
                <Text style={styles.bioText}>{student.bio}</Text>
              </View>
            </View>
          )}
          
          {student.goals && (
            <View style={styles.infoRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="flag" size={18} color="#6B7280" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Learning Goals</Text>
                <Text style={styles.goalsText}>{student.goals}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Progress Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Attendance</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Ionicons name="trending-up" size={24} color="#4F46E5" />
            <Text style={styles.statValue}>+12%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Ionicons name="time" size={24} color="#F59E0B" />
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={22} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          
          <ActivityRow 
            icon="checkmark-circle" 
            color="#10B981"
            title="Completed Assignment" 
            description="Algebra Homework - 95%" 
            time="2 hours ago"
          />
          
          <ActivityRow 
            icon="videocam" 
            color="#4F46E5"
            title="Attended Session" 
            description="Calculus - Limits & Derivatives" 
            time="Yesterday"
          />
          
          <ActivityRow 
            icon="document-text" 
            color="#F59E0B"
            title="Submitted Quiz" 
            description="Physics - Newton's Laws" 
            time="2 days ago"
          />
        </View>

        {/* Bottom Action */}
        <TouchableOpacity style={styles.bottomAction} onPress={handleScheduleSession}>
          <Ionicons name="calendar" size={24} color="#FFFFFF" />
          <Text style={styles.bottomActionText}>Schedule Next Session</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const DetailRow = ({ icon, label, value, isEmail = false, isPhone = false }: any) => (
  <View style={styles.detailRow}>
    <View style={styles.detailIcon}>
      <Ionicons name={icon} size={18} color="#6B7280" />
    </View>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      {isEmail ? (
        <TouchableOpacity onPress={() => Linking.openURL(`mailto:${value}`)}>
          <Text style={styles.detailLink}>{value}</Text>
        </TouchableOpacity>
      ) : isPhone ? (
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${value.replace(/\D/g, '')}`)}>
          <Text style={styles.detailLink}>{value}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.detailValue}>{value}</Text>
      )}
    </View>
  </View>
);

const ActivityRow = ({ icon, color, title, description, time }: any) => (
  <View style={styles.activityRow}>
    <View style={[styles.activityIcon, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityDescription}>{description}</Text>
    </View>
    <Text style={styles.activityTime}>{time}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  headerGradient: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  backButtonHeader: {
    padding: 8,
  },
  studentHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  studentName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  studentGrade: {
    fontSize: 18,
    color: '#E0E7FF',
    marginBottom: 4,
  },
  studentSubjects: {
    fontSize: 16,
    color: '#C7D2FE',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f798dfff',
  },
  taskButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d27ce7ff',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailIcon: {
    width: 32,
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#111827',
  },
  detailLink: {
    fontSize: 16,
    color: '#fc37caff',
    textDecorationLine: 'underline',
  },
  bioText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
  },
  goalsText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  bottomAction: {
    backgroundColor: '#fca6ffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 30,
    marginTop: 8,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomActionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backButton: {
    backgroundColor: '#e7caffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});