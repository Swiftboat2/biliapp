import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
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
    <StudentProvider initialStudents={initialStudentsMock}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        
        {/* Dynamic Multi-Tab Content with Seamless Curved Hero Headers */}
        <NavigationContainer>
          <BottomTabNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </StudentProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary, // Matches top curved hero smoothly
  },
});
