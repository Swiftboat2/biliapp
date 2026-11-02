import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { AttendanceScreen } from '../screens/AttendanceScreen';
import { KindergartenScreen } from '../screens/KindergartenScreen';
import { PickupScreen } from '../screens/PickupScreen';
import { CommunicationsScreen } from '../screens/CommunicationsScreen';
import { useActiveStudent } from '../context/StudentContext';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator: React.FC = () => {
  const { activeStudent } = useActiveStudent();
  const isKindergarten = activeStudent?.educationalLevel === 'INICIAL';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1e3a8a',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
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
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>🏠</Text>,
        }}
      />

      {isKindergarten && (
        <Tab.Screen
          name="Jardín"
          component={KindergartenScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>🧸</Text>,
            tabBarBadge: 'Hoy',
          }}
        />
      )}

      <Tab.Screen
        name="Asistencia"
        component={AttendanceScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>📋</Text>,
        }}
      />

      <Tab.Screen
        name="Retiros"
        component={PickupScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>🛡️</Text>,
        }}
      />

      <Tab.Screen
        name="Circulares"
        component={CommunicationsScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>📢</Text>,
          tabBarBadge: 1,
        }}
      />
    </Tab.Navigator>
  );
};

