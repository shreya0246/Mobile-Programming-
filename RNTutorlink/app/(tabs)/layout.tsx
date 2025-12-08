import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { Platform, TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const navigation = useNavigation();
  
  // Function to open drawer
  const openDrawer = () => {
    navigation.toggleDrawer();
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity 
            onPress={openDrawer}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="menu" size={28} color="#3B82F6" />
          </TouchableOpacity>
        ),
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          height: Platform.OS === 'ios' ? 85 : 70,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 30 : 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* Student Dashboard Tab */}
      <Tabs.Screen
        name="student-dashboard"
        options={{
          title: 'Student',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'school' : 'school-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* Teacher Profile Tab */}
      <Tabs.Screen
        name="teacher-profile"
        options={{
          title: 'Teacher',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* Survey Tab */}
      <Tabs.Screen
        name="survey"
        options={{
          title: 'Survey',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'clipboard' : 'clipboard-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* Email Tab */}
      <Tabs.Screen
        name="email"
        options={{
          title: 'Email',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'mail' : 'mail-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}