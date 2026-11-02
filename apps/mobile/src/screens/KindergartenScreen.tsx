import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useActiveStudent } from '../context/StudentContext';

export const KindergartenScreen: React.FC = () => {
  const { activeStudent } = useActiveStudent();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.dateHeader}>
        <Text style={styles.dateTitle}>Bitácora de Hoy</Text>
        <Text style={styles.dateSub}>02 de Noviembre, 2026</Text>
      </View>

      {/* Moment 1: Entrada & Ánimo */}
      <View style={styles.timelineItem}>
        <View style={styles.timelineDotActive} />
        <View style={styles.timelineCard}>
          <View style={styles.momentHeader}>
            <Text style={styles.momentTitle}>🚪 Ingreso al Jardín</Text>
            <Text style={styles.momentTime}>08:00 hs</Text>
          </View>
          <View style={styles.tagRow}>
            <Text style={styles.tagMood}>😊 Alegre y participativo</Text>
            <Text style={styles.tagInfo}>Docente: Seño Laura</Text>
          </View>
        </View>
      </View>

      {/* Moment 2: Colación de la Mañana */}
      <View style={styles.timelineItem}>
        <View style={styles.timelineDot} />
        <View style={styles.timelineCard}>
          <View style={styles.momentHeader}>
            <Text style={styles.momentTitle}>🍎 Colación de Media Mañana</Text>
            <Text style={styles.momentTime}>09:45 hs</Text>
          </View>
          <Text style={styles.momentDesc}>Frutas de estación y galletitas de avena</Text>
          <View style={styles.intakeBadge}>
            <Text style={styles.intakeBadgeText}>Ingesta: Comió TODO ⭐</Text>
          </View>
        </View>
      </View>

      {/* Moment 3: Higiene y Pañales */}
      <View style={styles.timelineItem}>
        <View style={styles.timelineDot} />
        <View style={styles.timelineCard}>
          <View style={styles.momentHeader}>
            <Text style={styles.momentTitle}>🧷 Higiene & Mudas</Text>
            <Text style={styles.momentTime}>11:00 hs</Text>
          </View>
          <View style={styles.diaperList}>
            <View style={styles.diaperItem}>
              <Text style={styles.diaperTime}>11:00 hs</Text>
              <Text style={styles.diaperTag}>Pañal Húmedo (Cambiado)</Text>
            </View>
            <View style={styles.diaperItem}>
              <Text style={styles.diaperTime}>13:45 hs</Text>
              <Text style={styles.diaperTagSuccess}>Limpio y seco</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Moment 4: Almuerzo */}
      <View style={styles.timelineItem}>
        <View style={styles.timelineDot} />
        <View style={styles.timelineCard}>
          <View style={styles.momentHeader}>
            <Text style={styles.momentTitle}>🍲 Almuerzo</Text>
            <Text style={styles.momentTime}>12:15 hs</Text>
          </View>
          <Text style={styles.momentDesc}>Polenta cremosa con bolognesa casera</Text>
          <View style={styles.intakeBadge}>
            <Text style={styles.intakeBadgeText}>Ingesta: Comió la MITAD</Text>
          </View>
        </View>
      </View>

      {/* Moment 5: Siesta & Descanso */}
      <View style={styles.timelineItem}>
        <View style={styles.timelineDot} />
        <View style={styles.timelineCard}>
          <View style={styles.momentHeader}>
            <Text style={styles.momentTitle}>💤 Siesta y Descanso</Text>
            <Text style={styles.momentTime}>13:00 - 14:15 hs</Text>
          </View>
          <Text style={styles.momentDesc}>Durmió 1 hora y 15 minutos de forma tranquila.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingLeft: 20 },
  dateHeader: { marginBottom: 16 },
  dateTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  dateSub: { fontSize: 13, color: '#64748b' },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#cbd5e1',
    paddingLeft: 14,
    position: 'relative',
  },
  timelineDotActive: {
    position: 'absolute',
    left: -7,
    top: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  timelineDot: {
    position: 'absolute',
    left: -6,
    top: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#94a3b8',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  timelineCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  momentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  momentTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  momentTime: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  momentDesc: { fontSize: 12, color: '#475569', marginBottom: 6 },
  tagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tagMood: { backgroundColor: '#fef08a', color: '#854d0e', fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagInfo: { backgroundColor: '#f1f5f9', color: '#475569', fontSize: 11, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  intakeBadge: { alignSelf: 'flex-start', backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  intakeBadgeText: { color: '#166534', fontSize: 11, fontWeight: '700' },
  diaperList: { gap: 6, marginTop: 4 },
  diaperItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: 6, borderRadius: 6 },
  diaperTime: { fontSize: 11, color: '#64748b', fontWeight: '600' },
  diaperTag: { fontSize: 11, color: '#b45309', fontWeight: '700' },
  diaperTagSuccess: { fontSize: 11, color: '#166534', fontWeight: '700' },
});

