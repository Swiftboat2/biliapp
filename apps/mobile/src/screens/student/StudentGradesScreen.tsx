import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StudentHeader } from '../../components/StudentHeader';
import { colors } from '../../theme/colors';
import { studentSubjects } from '../../data/studentMock';
import { conceptStyle } from './conceptStyle';

type Tab = 'parciales' | 'trimestre';

export const StudentGradesScreen: React.FC = () => {
  const [tab, setTab] = useState<Tab>('parciales');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StudentHeader title="Mis Notas" subtitle="Notas parciales y nota de trimestre" />

      <View style={styles.body}>
        <View style={styles.segment}>
          {(['parciales', 'trimestre'] as Tab[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.segmentBtn, tab === t && styles.segmentBtnActive]}
              onPress={() => setTab(t)}
              activeOpacity={0.85}
            >
              <Text style={[styles.segmentText, tab === t && styles.segmentTextActive]}>
                {t === 'parciales' ? 'Parciales' : 'Trimestre'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'parciales' ? (
          <>
            <Text style={styles.hint}>Las notas parciales son de concepto.</Text>
            {studentSubjects.map((subj) => (
              <View key={subj.id} style={styles.card}>
                <Text style={styles.subject}>{subj.name}</Text>
                {subj.partials.map((p) => {
                  const cs = conceptStyle[p.concept];
                  return (
                    <View key={p.id} style={styles.partialRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.partialTitle}>{p.title}</Text>
                        <Text style={styles.partialDate}>{p.date}</Text>
                        {p.observation ? <Text style={styles.obs}>“{p.observation}”</Text> : null}
                      </View>
                      <View style={[styles.pill, { backgroundColor: cs.bg }]}>
                        <Text style={[styles.pillText, { color: cs.fg }]}>{p.concept}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.hint}>
              La nota de trimestre la carga cada docente. No es un promedio de las notas parciales.
            </Text>
            {studentSubjects.map((subj) => (
              <View key={subj.id} style={styles.card}>
                <Text style={styles.subject}>{subj.name}</Text>
                <View style={styles.trimRow}>
                  {([1, 2, 3] as const).map((n) => {
                    const g = subj.trimester[n];
                    return (
                      <View key={n} style={styles.trimBox}>
                        <Text style={styles.trimLabel}>{n}° Trimestre</Text>
                        {g === null ? (
                          <Text style={styles.trimPending}>Sin cargar</Text>
                        ) : (
                          <Text style={styles.trimGrade}>{g}</Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { padding: 16, paddingBottom: 32 },
  segment: { flexDirection: 'row', backgroundColor: colors.borderLight, borderRadius: 14, padding: 4, marginBottom: 12 },
  segmentBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
  segmentBtnActive: { backgroundColor: colors.cardBg },
  segmentText: { fontWeight: '700', color: colors.textSecondary },
  segmentTextActive: { color: colors.primary },
  hint: { fontSize: 12, color: colors.textSecondary, marginBottom: 12, lineHeight: 18 },
  card: { backgroundColor: colors.cardBg, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  subject: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  partialRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.borderLight },
  partialTitle: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  partialDate: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  obs: { fontSize: 12, color: colors.textSecondary, marginTop: 4, fontStyle: 'italic' },
  pill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  pillText: { fontSize: 11, fontWeight: '800' },
  trimRow: { flexDirection: 'row', gap: 8 },
  trimBox: { flex: 1, alignItems: 'center', backgroundColor: colors.surfaceHover, borderRadius: 14, paddingVertical: 10 },
  trimLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted },
  trimGrade: { fontSize: 24, fontWeight: '800', color: colors.primary, marginTop: 4 },
  trimPending: { fontSize: 11, color: colors.textMuted, marginTop: 10 },
});
