import React from 'react';
import { StyleSheet, View, SafeAreaView, Text, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { StudentProvider } from './src/context/StudentContext';
import { StudentCarousel } from './src/components/StudentCarousel';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';
import { colors } from './src/theme/colors';

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
        <StatusBar style="dark" />
        
        {/* App Institutional Header with Official Emblem */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('./assets/logo-colegio.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.headerTitle}>Instituto República de Italia</Text>
              <Text style={styles.headerSubtitle}>Entre Ríos · Portal de Familias</Text>
            </View>
          </View>

          <View style={styles.headerBadge}>
            <Text style={styles.badgeText}>2026</Text>
          </View>
        </View>

        {/* Dynamic Multi-Tab Content (including Home with StudentCarousel) */}
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  headerBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
  },
});
