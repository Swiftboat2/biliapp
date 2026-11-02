import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { StudentProvider } from './src/context/StudentContext';
import { StudentSelector } from './src/components/StudentSelector';

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
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>BiliAPP Escolar</Text>
          <Text style={styles.headerSubtitle}>Portal Familiar</Text>
        </View>

        {/* Multi-Child Selector */}
        <StudentSelector />

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Muro del Estudiante</Text>
            <Text style={styles.cardBody}>
              Cambia entre tus hijos desde la barra superior para ver su asistencia, comunicaciones,
              autorizaciones de retiro y boletines correspondientes a su nivel.
            </Text>
          </View>

          <View style={styles.actionGrid}>
            <View style={styles.actionCard}>
              <Text style={styles.actionCardTitle}>📋 Asistencia</Text>
              <Text style={styles.actionCardDesc}>0 faltas acumuladas este mes</Text>
            </View>
            <View style={styles.actionCard}>
              <Text style={styles.actionCardTitle}>🚪 Retiros Seguros</Text>
              <Text style={styles.actionCardDesc}>3 personas autorizadas</Text>
            </View>
            <View style={styles.actionCard}>
              <Text style={styles.actionCardTitle}>📢 Comunicados</Text>
              <Text style={styles.actionCardDesc}>1 circular para firmar con PIN</Text>
            </View>
            <View style={styles.actionCard}>
              <Text style={styles.actionCardTitle}>📊 Boletín</Text>
              <Text style={styles.actionCardDesc}>1° Trimestre en curso</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </StudentProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  actionCardDesc: {
    fontSize: 12,
    color: '#64748b',
  },
});

