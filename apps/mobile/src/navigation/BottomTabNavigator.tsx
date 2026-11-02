import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { FilesScreen } from '../screens/FilesScreen';
import { GalleryScreen } from '../screens/GalleryScreen';
import { PickupScreen } from '../screens/PickupScreen';
import { AttendanceScreen } from '../screens/AttendanceScreen';
import { colors } from '../theme/colors';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator: React.FC = () => {
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
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
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
