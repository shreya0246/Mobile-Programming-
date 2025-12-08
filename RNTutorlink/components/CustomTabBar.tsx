import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const icons: Record<string, [string, string]> = {
    index: ['home', 'home-outline'],
    'student-dashboard': ['school', 'school-outline'],
    'teacher-profile': ['person', 'person-outline'],
    survey: ['clipboard', 'clipboard-outline'],
    email: ['mail', 'mail-outline'],
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;
        const isFocused = state.index === index;
        const [focusedIcon, outlineIcon] = icons[route.name] || ['help-circle', 'help-circle-outline'];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={styles.tabButton}
          >
            <View style={[styles.tabContent, isFocused && styles.tabContentFocused]}>
              <Ionicons
                name={isFocused ? focusedIcon : outlineIcon}
                size={24}
                color={isFocused ? '#4F46E5' : '#6B7280'}
              />
              <Text style={[styles.label, isFocused && styles.labelFocused]}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  tabContentFocused: {
    backgroundColor: '#F3F4F6',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    color: '#6B7280',
  },
  labelFocused: {
    color: '#4F46E5',
  },
});