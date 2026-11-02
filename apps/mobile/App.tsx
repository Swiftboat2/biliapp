import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StudentProvider } from './src/context/StudentContext';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';
import { colors } from './src/theme/colors';

// Initial Mock Data: Mateo in Kindergarten and Sofía in Primary
const initialStudentsMock = [
  {
    id: 'student-1',
    dni: '52144889',
    firstName: 'Mateo',
    lastName: 'González',
    educationalLevel: 'INICIAL' as const,
    courseName: 'Sala de 4 - Turno Tarde',
    relationship: 'Hijo',
  },
  {
    id: 'student-2',
    dni: '48332110',
    firstName: 'Sofía',
    lastName: 'González',
    educationalLevel: 'PRIMARIA' as const,
    courseName: '4° Grado "B" - Turno Mañana',
    relationship: 'Hija',
  },
];

export default function App() {
  return (
    <SafeAreaProvider style={styles.rootContainer}>
      <StudentProvider initialStudents={initialStudentsMock}>
        <StatusBar style="light" />
        <NavigationContainer>
          <BottomTabNavigator />
        </NavigationContainer>
      </StudentProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.primary,
  },
});
