import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StudentHomeScreen } from '../screens/student/StudentHomeScreen';
import { StudentGradesScreen } from '../screens/student/StudentGradesScreen';
import { StudentAttendanceScreen } from '../screens/student/StudentAttendanceScreen';
import { Icon } from '../components/Icon';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

/** Navegación reducida del alumno: solo su información individual. */
export const StudentTabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom > 0 ? insets.bottom : 8;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: bottomInset,
          paddingTop: 8,
          height: (Platform.OS === 'ios' ? 56 : 60) + bottomInset,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginTop: 2 },
      }}
    >
      <Tab.Screen name="Inicio" component={StudentHomeScreen}
        options={{ tabBarIcon: ({ color }) => <Icon name="home" size={22} color={color} /> }} />
      <Tab.Screen name="Notas" component={StudentGradesScreen}
        options={{ tabBarIcon: ({ color }) => <Icon name="nota-parcial" size={22} color={color} /> }} />
      <Tab.Screen name="Asistencia" component={StudentAttendanceScreen}
        options={{ tabBarIcon: ({ color }) => <Icon name="asistencia" size={22} color={color} /> }} />
    </Tab.Navigator>
  );
};
