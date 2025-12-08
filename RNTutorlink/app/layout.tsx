import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Drawer Navigator */}
        <Stack.Screen name="(drawer)" />
        
        {/* Screens outside drawer */}
        <Stack.Screen 
          name="signin" 
          options={{ 
            headerShown: true,
            title: 'Sign In'
          }} 
        />
        <Stack.Screen 
          name="student-profile" 
          options={{ 
            headerShown: true,
            title: 'Student Profile'
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}