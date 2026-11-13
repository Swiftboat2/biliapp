import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StudentHeader } from '../../components/StudentHeader';
import { colors } from '../../theme/colors';
import { nextThreshold, THRESHOLDS_TEXT } from '../../config/attendance';
import { studentAttendance } from '../../data/studentMock';

export const StudentAttendanceScreen: React.FC = () => {
  const faltas = studentAttendance.reduce((acc, r) => acc + r.fraction, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StudentHeader title="Mi Asistencia" subtitle="Tus faltas y tardanzas del ciclo" />
      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.label}>FALTAS COMPUTADAS</Text>
          <Text style={styles.big}>
            {faltas} <Text style={styles.muted}>/ {nextThreshold(faltas).value}</Text>
          </Text>
          <Text style={styles.note}>
            {THRESHOLDS_TEXT}. Tardanza = 1/4 falta · Retiro anticipado = 1/2 falta. Las justificaciones las gestiona tu familia.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Historial</Text>
        {studentAttendance.map((r) => (
          <View key={r.id} style={[styles.card, styles.row]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.state}>{r.state}</Text>
              <Text style={styles.date}>{r.date} · {r.time}</Text>
              {r.justified === 'APPROVED' ? <Text style={styles.ok}>Justificada</Text> : null}
            </View>
            <Text style={styles.fraction}>{r.fraction === 0 ? '—' : `+${r.fraction}`}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { padding: 16, paddingBottom: 32 },
  card: { backgroundColor: colors.cardBg, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  label: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, color: colors.textMuted },
  big: { fontSize: 34, fontWeight: '800', color: colors.textPrimary, marginTop: 6 },
  muted: { fontSize: 18, color: colors.textSecondary, fontWeight: '600' },
  note: { fontSize: 12, color: colors.textSecondary, marginTop: 8, lineHeight: 18 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, marginVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  state: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  date: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  ok: { fontSize: 11, fontWeight: '800', color: colors.emeraldDark, marginTop: 4 },
  fraction: { fontSize: 16, fontWeight: '800', color: colors.accentRed },
});
