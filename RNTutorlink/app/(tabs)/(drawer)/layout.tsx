import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DrawerLayout() {
  const menuItems = [
    { name: 'Home', icon: 'home', screen: '(tabs)' },
    { name: 'Student Dashboard', icon: 'school', screen: '(tabs)/student-dashboard' },
    { name: 'Teacher Profile', icon: 'person', screen: '(tabs)/teacher-profile' },
    { name: 'Survey', icon: 'clipboard', screen: '(tabs)/survey' },
    { name: 'Email', icon: 'mail', screen: '(tabs)/email' },
    { name: 'Student Profile', icon: 'person-circle', screen: 'student-profile' },
    { name: 'Sign In', icon: 'log-in', screen: 'signin' },
    { name: 'Settings', icon: 'settings', screen: 'settings' },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={({ navigation }) => (
          <View style={styles.drawerContainer}>
            {/* Drawer Header */}
            <View style={styles.drawerHeader}>
              <Ionicons name="school" size={48} color="#3B82F6" />
              <Text style={styles.appName}>RNTutorLink</Text>
              <Text style={styles.appSubtitle}>Learning Platform</Text>
            </View>

            {/* Drawer Menu Items */}
            <View style={styles.menuItems}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    navigation.closeDrawer();
                    router.push(item.screen);
                  }}
                >
                  <Ionicons 
                    name={item.icon as any} 
                    size={24} 
                    color="#4B5563" 
                    style={styles.menuIcon}
                  />
                  <Text style={styles.menuText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Drawer Footer */}
            <View style={styles.drawerFooter}>
              <Text style={styles.footerText}>Version 1.0.0</Text>
              <Text style={styles.footerText}>© 2024 RNTutorLink</Text>
            </View>
          </View>
        )}
        screenOptions={{
          headerShown: false,
          drawerPosition: 'left',
          drawerType: 'front',
          drawerStyle: {
            width: 280,
          },
        }}
      >
        <Drawer.Screen 
          name="(tabs)" 
          options={{ 
            drawerLabel: 'Main Tabs',
            title: 'Main Tabs'
          }} 
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 10,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  menuItems: {
    flex: 1,
    paddingVertical: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuIcon: {
    marginRight: 16,
    width: 24,
  },
  menuText: {
    fontSize: 16,
    color: '#374151',
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
});