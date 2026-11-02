import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { FilesScreen } from '../screens/FilesScreen';
import { GalleryScreen } from '../screens/GalleryScreen';
import { PickupScreen } from '../screens/PickupScreen';
import { AttendanceScreen } from '../screens/AttendanceScreen';
import { colors } from '../theme/colors';
import { Text, Platform } from 'react-native';

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
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />

      <Tab.Screen
        name="Mensajes"
        component={MessagesScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>💬</Text>,
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
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📁</Text>,
        }}
      />

      <Tab.Screen
        name="Galería"
        component={GalleryScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🖼️</Text>,
        }}
      />

      <Tab.Screen
        name="Seguridad"
        component={PickupScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🛡️</Text>,
        }}
      />

      {/* Hidden route accessible via Navigation from Home */}
      <Tab.Screen
        name="Asistencia"
        component={AttendanceScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tab.Navigator>
  );
};
