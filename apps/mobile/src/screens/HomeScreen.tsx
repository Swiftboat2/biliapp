import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useActiveStudent } from '../context/StudentContext';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { activeStudent } = useActiveStudent();

  if (!activeStudent) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No hay un estudiante seleccionado.</Text>
      </View>
    );
  }

  const isKindergarten = activeStudent.educationalLevel === 'INICIAL';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Student Badge Card */}
      <View style={styles.studentCard}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>
            {activeStudent.firstName.charAt(0)}
            {activeStudent.lastName.charAt(0)}
          </Text>
        </View>
        <View style={styles.studentDetails}>
          <Text style={styles.studentName}>
            {activeStudent.firstName} {activeStudent.lastName}
          </Text>
          <Text style={styles.courseBadge}>{activeStudent.courseName}</Text>
          <Text style={styles.dniText}>DNI {activeStudent.dni}</Text>
        </View>
      </View>

      {/* Kindergarten Special Quick Alert */}
      {isKindergarten && (
        <TouchableOpacity
          style={styles.kindergartenBanner}
          onPress={() => navigation.navigate('Jardín')}
          activeOpacity={0.85}
        >
          <View style={styles.kinderBannerHeader}>
            <Text style={styles.kinderBannerTitle}>🧸 Bitácora Diaria de Jardín</Text>
            <Text style={styles.kinderBannerLink}>Ver Timeline →</Text>
          </View>
          <Text style={styles.kinderBannerText}>
            Entrada con buen ánimo · Colación completa · Siesta de 13:00 a 14:15 hs.
          </Text>
        </TouchableOpacity>
      )}

      {/* Quick Summary Cards */}
      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.gridCard}
          onPress={() => navigation.navigate('Asistencia')}
          activeOpacity={0.8}
        >
          <Text style={styles.gridEmoji}>📅</Text>
          <Text style={styles.gridTitle}>Asistencia</Text>
          <Text style={styles.gridValue}>0.25 falta</Text>
          <Text style={styles.gridSub}>1 tardanza acumulada</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridCard}
          onPress={() => navigation.navigate('Retiros')}
          activeOpacity={0.8}
        >
          <Text style={styles.gridEmoji}>🛡️</Text>
          <Text style={styles.gridTitle}>Seguridad Retiro</Text>
          <Text style={styles.gridValue}>3 Personas</Text>
          <Text style={styles.gridSub}>Padrón autorizado</Text>
        </TouchableOpacity>
      </View>

      {/* Official Communications Feed */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Comunicaciones Oficiales</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Circulares')}>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.feedCard}
          onPress={() => navigation.navigate('Circulares')}
          activeOpacity={0.85}
        >
          <View style={styles.feedBadgeContainer}>
            <Text style={styles.urgentBadge}>Requiere Firma con PIN</Text>
            <Text style={styles.feedDate}>Hoy, 08:30 hs</Text>
          </View>
          <Text style={styles.feedTitle}>Autorización Salida Educativa al Bioparque</Text>
          <Text style={styles.feedExcerpt}>
            Estimadas familias: solicitamos autorizar el traslado y participación del estudiante...
          </Text>
          <View style={styles.pinPrompt}>
            <Text style={styles.pinPromptText}>🔐 Toca para firmar con tu PIN de tutor</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, gap: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#64748b', fontSize: 14 },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarLarge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarLargeText: { color: '#ffffff', fontSize: 18, fontWeight: '800' },
  studentDetails: { flex: 1 },
  studentName: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  courseBadge: { fontSize: 13, color: '#2563eb', fontWeight: '600', marginTop: 2 },
  dniText: { fontSize: 12, color: '#64748b', marginTop: 2 },
  kindergartenBanner: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 14,
    padding: 14,
  },
  kinderBannerHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  kinderBannerTitle: { fontSize: 14, fontWeight: '700', color: '#92400e' },
  kinderBannerLink: { fontSize: 12, fontWeight: '700', color: '#b45309' },
  kinderBannerText: { fontSize: 12, color: '#78350f', lineHeight: 17 },
  grid: { flexDirection: 'row', gap: 12 },
  gridCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  gridEmoji: { fontSize: 22, marginBottom: 6 },
  gridTitle: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  gridValue: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginTop: 2 },
  gridSub: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  section: { marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  seeAllText: { fontSize: 12, fontWeight: '600', color: '#2563eb' },
  feedCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  feedBadgeContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  urgentBadge: { backgroundColor: '#fee2e2', color: '#991b1b', fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  feedDate: { fontSize: 11, color: '#94a3b8' },
  feedTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  feedExcerpt: { fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 17 },
  pinPrompt: { marginTop: 10, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#f0fdf4', borderRadius: 8, borderWidth: 1, borderColor: '#bbf7d0' },
  pinPromptText: { fontSize: 12, fontWeight: '700', color: '#166534', textAlign: 'center' },
});

