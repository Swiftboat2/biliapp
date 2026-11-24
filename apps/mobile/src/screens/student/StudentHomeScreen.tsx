import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useActiveStudent } from '../../context/StudentContext';
import { useAppMode } from '../../context/AppModeContext';
import { StudentHeader } from '../../components/StudentHeader';
import { Icon } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { ABSENCE_LIMIT } from '../../config/attendance';
import { studentAttendance, studentSubjects, studentSchedulePreview } from '../../data/studentMock';
import { conceptStyle } from './conceptStyle';

export const StudentHomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { students } = useActiveStudent();
  const { setMode } = useAppMode();
  // La cuenta del alumno es individual: se muestra su propio perfil (no el de sus hermanos).
  const me = students.find((s) => s.educationalLevel !== 'INICIAL') ?? students[0];
  const faltas = studentAttendance.reduce((acc, r) => acc + r.fraction, 0);
  const latest = studentSubjects
    .flatMap((s) => s.partials.slice(0, 1).map((p) => ({ ...p, subject: s.name })))
    .slice(0, 3);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StudentHeader
        title={`¡Hola, ${me?.firstName ?? 'alumno'}! 👋`}
        subtitle={me?.courseName}
      />

      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>MIS FALTAS</Text>
          <View style={styles.row}>
            <Text style={styles.big}>{faltas}</Text>
            <Text style={styles.muted}> de {ABSENCE_LIMIT} permitidas</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Asistencia')}>
            <Text style={styles.link}>Ver mi asistencia →</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Hoy en clase</Text>
        <View style={styles.card}>
          {studentSchedulePreview.map((c) => (
            <View key={c.time} style={styles.classRow}>
              <Text style={styles.classTime}>{c.time}</Text>
              <Text style={styles.className}>{c.subject}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimas notas parciales</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Notas')}>
            <Text style={styles.link}>Ver todas →</Text>
          </TouchableOpacity>
        </View>
        {latest.map((n) => {
          const cs = conceptStyle[n.concept];
          return (
            <View key={n.id} style={[styles.card, styles.noteRow]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.noteSubject}>{n.subject}</Text>
                <Text style={styles.noteTitle} numberOfLines={1}>{n.title}</Text>
              </View>
              <View style={[styles.pill, { backgroundColor: cs.bg }]}>
                <Text style={[styles.pillText, { color: cs.fg }]}>{n.concept}</Text>
              </View>
            </View>
          );
        })}

        <TouchableOpacity style={styles.switchBtn} onPress={() => setMode('familia')} activeOpacity={0.85}>
          <Icon name="usuario" size={16} color={colors.primary} />
          <Text style={styles.switchText}>Cambiar a vista Familia</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { padding: 16, paddingBottom: 32 },
  card: { backgroundColor: colors.cardBg, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  cardLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, color: colors.textMuted },
  row: { flexDirection: 'row', alignItems: 'baseline', marginTop: 6 },
  big: { fontSize: 34, fontWeight: '800', color: colors.textPrimary },
  muted: { fontSize: 14, color: colors.textSecondary },
  link: { fontSize: 13, fontWeight: '700', color: colors.primary, marginTop: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.3, marginTop: 8, marginBottom: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  classRow: { flexDirection: 'row', paddingVertical: 6 },
  classTime: { width: 56, fontWeight: '800', color: colors.primary },
  className: { flex: 1, color: colors.textPrimary, fontWeight: '600' },
  noteRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  noteSubject: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  noteTitle: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  pill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  pillText: { fontSize: 11, fontWeight: '800' },
  switchBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, padding: 12 },
  switchText: { color: colors.primary, fontWeight: '700' },
});
