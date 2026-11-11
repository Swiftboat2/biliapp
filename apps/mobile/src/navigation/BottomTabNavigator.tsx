import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { FilesScreen } from '../screens/FilesScreen';
import { GalleryScreen } from '../screens/GalleryScreen';
import { AttendanceScreen } from '../screens/AttendanceScreen';
import { colors } from '../theme/colors';
import { Platform } from 'react-native';
import { Icon } from '../components/Icon';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  // Dynamic bottom padding adapting to Home Bar on modern iOS/Android gesture nav
  const bottomInset = insets.bottom > 0 ? insets.bottom : 8;
  const tabHeight = (Platform.OS === 'ios' ? 56 : 60) + bottomInset;

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
          height: tabHeight,
          elevation: 8,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="home" size={22} color={color} />,
        }}
      />

      <Tab.Screen
        name="Mensajes"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="chat" size={22} color={color} />,
          tabBarBadge: 3,
          tabBarBadgeStyle: {
            backgroundColor: colors.coral,
            fontSize: 10,
            fontWeight: '800',
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            lineHeight: 14,
          },
        }}
      />

      <Tab.Screen
        name="Archivos"
        component={FilesScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="carpetas" size={22} color={color} />,
        }}
      />

      <Tab.Screen
        name="Galería"
        component={GalleryScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="galeria" size={22} color={color} />,
        }}
      />

      <Tab.Screen
        name="Asistencia"
        component={AttendanceScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="asistencia" size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
