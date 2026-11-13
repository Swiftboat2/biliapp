import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StudentProvider } from './src/context/StudentContext';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';
import { StudentTabNavigator } from './src/navigation/StudentTabNavigator';
import { AppModeProvider, useAppMode } from './src/context/AppModeContext';
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

function RootNavigator() {
  const { mode } = useAppMode();
  // key fuerza un árbol de navegación limpio al cambiar de modo
  return mode === 'alumno' ? <StudentTabNavigator key="alumno" /> : <BottomTabNavigator key="familia" />;
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.rootContainer}>
      <StudentProvider initialStudents={initialStudentsMock}>
        <StatusBar style="light" />
        <AppModeProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AppModeProvider>
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
