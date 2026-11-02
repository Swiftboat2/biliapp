import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StudentProvider } from './src/context/StudentContext';
import { StudentSelector } from './src/components/StudentSelector';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';

// Mock initial data demonstrating multi-child support (e.g. 1 in Kindergarten, 1 in Primary)
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
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        {/* App Institutional Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>B</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>BiliAPP Escolar</Text>
              <Text style={styles.headerSubtitle}>Portal de Familias y Tutores</Text>
            </View>
          </View>
        </View>

        {/* Global Multi-Child Selector */}
        <StudentSelector />

        {/* Dynamic Multi-Tab Content */}
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
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748b',
  },
});
