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

interface Teacher {
  id?: string;
  firebaseId?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  qualification: string;
  subjects: string;
  gradeLevel: string;
  preferredStudents: string;
  mode: string;
  bio: string;
  rating?: number;
  totalStudents?: number;
  createdAt?: string;
}

export default function TeacherDetailsScreen() {
  const params = useLocalSearchParams();
  const teacherId = String(params.id);

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadTeacherDetails();
  }, [teacherId]);

  const loadTeacherDetails = async () => {
    try {
      setLoading(true);

      const teachersJSON = await AsyncStorage.getItem('teachers');

      if (teachersJSON) {
        const teachers = JSON.parse(teachersJSON);
        const foundTeacher = teachers.find(
          (t: Teacher) => t.firebaseId === teacherId || t.id === teacherId
        );

        if (foundTeacher) {
          setTeacher(foundTeacher);

          const favoritesJSON = await AsyncStorage.getItem('favoriteTeachers');
          if (favoritesJSON) {
            const favorites = JSON.parse(favoritesJSON);
            setIsFavorite(favorites.some((fav: Teacher) => fav.id === teacherId));
          }
        }
      }

      // fallback sample (demo)
      if (!teacher) {
        setTeacher({
          id: teacherId,
          name: "Shreya Laxmi",
          email: "laxmi@gmail.com",
          phone: "*** *** ****",
          address: "Kathmandu",
          experience: "1 years",
          qualification: "Masters in Mathematics",
          subjects: "Math, Calculus, Algebra",
          gradeLevel: "9-12, College",
          preferredStudents: "High School, College Freshmen",
          mode: "Online & In-person",
          bio: "Passionate educator with 5+ years of experience helping students excel.",
          rating: 4.8,
          totalStudents: 47,
        });
      }

    } catch (error) {
      console.error("Error loading teacher:", error);
      Alert.alert("Error", "Could not load teacher details");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!teacher) return;

    try {
      const favoritesJSON = await AsyncStorage.getItem('favoriteTeachers');
      let favorites = favoritesJSON ? JSON.parse(favoritesJSON) : [];

      if (isFavorite) {
        favorites = favorites.filter((fav: Teacher) => fav.id !== teacherId);
        Alert.alert("Removed", "Removed from favorites");
      } else {
        // FIXED: no duplicate fields, safe clean object
        const favObj = {
          id: teacherId,
          name: teacher.name,
          subjects: teacher.subjects,
          rating: teacher.rating,
          email: teacher.email,
          phone: teacher.phone,
        };

        favorites.push(favObj);

        Alert.alert("Added", "Added to favorites");
      }

      await AsyncStorage.setItem('favoriteTeachers', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);

    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const handleContact = () => {
    if (!teacher) return;

    const options = ["Email", "Call", "Message", "Cancel"];

    Alert.alert(
      "Contact Teacher",
      "How would you like to reach this teacher?",
      options.map((option) => ({
        text: option,
        onPress: () => {
          if (option === "Email") {
            Linking.openURL(`mailto:${teacher.email}`);
          }
          if (option === "Call") {
            Linking.openURL(`tel:${teacher.phone.replace(/\D/g, "")}`);
          }
          if (option === "Message") {
            Linking.openURL(
              Platform.OS === "ios"
                ? `sms:${teacher.phone.replace(/\D/g, "")}`
                : `sms:${teacher.phone.replace(/\D/g, "")}?body=Hi ${teacher.name}, I found you on RNTutorLink`
            );
          }
        },
        style: option === "Cancel" ? "cancel" : "default",
      }))
    );
  };

  const handleBookSession = () => {
    Alert.alert(
      "Book a Session",
      `Request a session with ${teacher?.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Request",
          onPress: () => {
            Alert.alert(
              "Request Sent",
              `${teacher?.name} will contact you soon.`,
              [{ text: "OK" }]
            );
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading teacher...</Text>
      </SafeAreaView>
    );
  }

  if (!teacher) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="person-circle-outline" size={80} color="#6B7280" />
          <Text style={styles.errorTitle}>Teacher Not Found</Text>
          <Text style={styles.errorText}>This teacher profile is unavailable.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#d3c6ffff', '#f5adffff']} style={styles.headerGradient}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButtonHeader} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "#F43F5E" : "#FFFFFF"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.teacherHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  teacher.name
                )}&background=8B5CF6&color=fff&size=150`,
              }}
              style={styles.avatar}
            />

            {teacher.rating && (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#FBBF24" />
                <Text style={styles.ratingText}>{teacher.rating}</Text>
              </View>
            )}
          </View>

          <Text style={styles.teacherName}>{teacher.name}</Text>
          <Text style={styles.teacherSubjects}>{teacher.subjects}</Text>
          <Text style={styles.teacherExperience}>{teacher.experience} experience</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* ACTION BUTTONS */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#4F46E5" />
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bookButton} onPress={handleBookSession}>
            <Ionicons name="calendar" size={20} color="#FFFFFF" />
            <Text style={styles.bookButtonText}>Book Session</Text>
          </TouchableOpacity>
        </View>

        {/* ABOUT */}
        <Section title="About" icon="information-circle">
          <Text style={styles.bioText}>{teacher.bio}</Text>
        </Section>

        {/* PROFESSIONAL DETAILS */}
        <Section title="Professional Details" icon="briefcase">
          <DetailRow icon="school" label="Qualification" value={teacher.qualification} />
          <DetailRow icon="time" label="Experience" value={teacher.experience} />
          <DetailRow icon="people" label="Preferred Students" value={teacher.preferredStudents} />
          <DetailRow icon="desktop" label="Teaching Mode" value={teacher.mode} />
          <DetailRow icon="book" label="Grade Levels" value={teacher.gradeLevel} />
        </Section>

        {/* CONTACT INFO */}
        <Section title="Contact Information" icon="location">
          <DetailRow icon="mail" label="Email" value={teacher.email} isEmail />
          <DetailRow icon="call" label="Phone" value={teacher.phone} isPhone />
          <DetailRow icon="home" label="Location" value={teacher.address} />
        </Section>

        {/* STATS */}
        <View style={styles.statsContainer}>
          <Stat icon="star" color="#F59E0B" value={teacher.rating || 4.8} label="Rating" />
          <View style={styles.statDivider} />
          <Stat icon="people" color="#4F46E5" value={teacher.totalStudents || 47} label="Students" />
          <View style={styles.statDivider} />
          <Stat icon="checkmark-circle" color="#10B981" value="98%" label="Success" />
        </View>

        {/* REVIEWS */}
        <Section title="Student Reviews" icon="chatbubbles">
          <Review text="Excellent teacher! Helped me understand calculus easily." author="Sarah, Grade 11" />
          <Review text="Very patient and knowledgeable. Highly recommend!" author="Michael, College Freshman" />
        </Section>

        {/* BOTTOM BUTTON */}
        <TouchableOpacity style={styles.bottomAction} onPress={handleBookSession}>
          <Ionicons name="calendar" size={24} color="#FFFFFF" />
          <Text style={styles.bottomActionText}>Schedule a Trial Session</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------- SMALL COMPONENTS --------------------- */

const Section = ({ title, icon, children }: any) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={22} color="#4F46E5" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const Review = ({ text, author }: any) => (
  <View style={styles.reviewCard}>
    <Text style={styles.reviewText}>"{text}"</Text>
    <Text style={styles.reviewAuthor}>- {author}</Text>
  </View>
);

const Stat = ({ icon, color, value, label }: any) => (
  <View style={styles.statItem}>
    <Ionicons name={icon} size={24} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

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
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${value.replace(/\D/g, "")}`)}>
          <Text style={styles.detailLink}>{value}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.detailValue}>{value}</Text>
      )}
    </View>
  </View>
);

/* -------------------- STYLES --------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  headerGradient: {
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  backButtonHeader: { padding: 8 },
  headerActions: { flexDirection: "row" },
  favoriteButton: { padding: 8 },
  teacherHeader: { alignItems: "center", paddingHorizontal: 20 },
  avatarContainer: { position: "relative", marginBottom: 16 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  ratingBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: { marginLeft: 4, fontSize: 12, fontWeight: "bold" },
  teacherName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  teacherSubjects: { fontSize: 18, color: "#E0E7FF", textAlign: "center" },
  teacherExperience: { fontSize: 16, color: "#C7D2FE" },
  content: {
    flex: 1,
    marginTop: -20,
    paddingTop: 24,
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
  },
  actionButtons: { flexDirection: "row", gap: 12, marginBottom: 24 },
  contactButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  contactButtonText: { fontSize: 16, fontWeight: "600", color: "#4F46E5" },
  bookButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#efccfaff",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  bookButtonText: { fontSize: 16, fontWeight: "600", color: "#FFF" },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  bioText: { fontSize: 16, lineHeight: 24, color: "#374151" },
  detailRow: { flexDirection: "row", marginBottom: 16 },
  detailIcon: { width: 32, marginTop: 2 },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: 14, fontWeight: "500", color: "#6B7280", marginBottom: 4 },
  detailValue: { fontSize: 16, color: "#111827" },
  detailLink: { fontSize: 16, color: "#8B5CF6", textDecorationLine: "underline" },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "bold", marginTop: 8 },
  statLabel: { fontSize: 14, color: "#6B7280" },
  statDivider: { width: 1, backgroundColor: "#E5E7EB" },
  reviewCard: { backgroundColor: "#F9FAFB", padding: 16, borderRadius: 12, marginBottom: 12 },
  reviewText: { fontSize: 16, fontStyle: "italic", marginBottom: 8 },
  reviewAuthor: { fontSize: 14, color: "#6B7280" },
  bottomAction: {
    backgroundColor: "#fddcfaff",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 30,
    gap: 12,
  },
  bottomActionText: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
  backButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  backButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
