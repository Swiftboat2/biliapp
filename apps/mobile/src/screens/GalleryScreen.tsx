import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useActiveStudent } from '../context/StudentContext';
import { colors } from '../theme/colors';
import { Icon } from '../components/Icon';
import {
  TRAJECTORY,
  LEVEL_TITLE,
  TRAJECTORY_ALBUMS,
  type Level,
  type TrajectoryAlbum,
} from '../data/trajectoryMock';

const CURRENT_CYCLE = 2026;
const LEVELS: Level[] = ['INICIAL', 'PRIMARIA', 'SECUNDARIA'];

/**
 * Galería de trayectoria: todo el recorrido escolar del alumno,
 * desde Sala de 3 hasta el egreso de Secundaria.
 */
export const GalleryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { students, activeStudent, setActiveStudent } = useActiveStudent();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selected, setSelected] = useState<TrajectoryAlbum | null>(null);

  // Posición actual del alumno dentro del recorrido (según el nombre de su curso).
  const currentIndex = useMemo(
    () => TRAJECTORY.findIndex((y) => activeStudent?.courseName.includes(y.label)),
    [activeStudent]
  );

  const albumsOf = (label: string) =>
    (activeStudent && TRAJECTORY_ALBUMS[`${activeStudent.id}|${label}`]) || [];

  const totalPhotos = TRAJECTORY.reduce(
    (sum, y) => sum + albumsOf(y.label).reduce((s, a) => s + a.photoCount, 0),
    0
  );
  const graduationCycle = CURRENT_CYCLE + (currentIndex >= 0 ? TRAJECTORY.length - currentIndex - 1 : 0);
  const progress = currentIndex >= 0 ? (currentIndex + 1) / TRAJECTORY.length : 0;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { paddingTop: Math.max(insets.top, 24) + 10 }]}>
          <Text style={styles.heroTitle}>Galería de Trayectoria</Text>
          <Text style={styles.heroSub}>
            Todo el recorrido escolar, desde el jardín hasta el egreso.
          </Text>
        </View>

        <View style={styles.body}>
          {students.length > 1 && (
            <View style={styles.segment}>
              {students.map((s) => {
                const active = s.id === activeStudent?.id;
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                    onPress={() => {
                      setActiveStudent(s);
                      setExpanded(null);
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{s.firstName}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardLabel}>
              {activeStudent?.firstName} {activeStudent?.lastName}
            </Text>
            <Text style={styles.summary}>
              {currentIndex >= 0 ? `Año ${currentIndex + 1} de ${TRAJECTORY.length}` : 'Trayectoria'}
              <Text style={styles.summaryMuted}> · {totalPhotos} fotos guardadas</Text>
            </Text>
            <View style={styles.track}>
              <View style={[styles.trackFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.note}>Egreso estimado: ciclo {graduationCycle}</Text>
          </View>

          {LEVELS.map((level) => (
            <View key={level} style={styles.levelBlock}>
              <Text style={styles.levelTitle}>{LEVEL_TITLE[level]}</Text>
              {TRAJECTORY.map((y, i) => {
                if (y.level !== level) return null;
                const albums = albumsOf(y.label);
                const isCurrent = i === currentIndex;
                const isFuture = currentIndex >= 0 && i > currentIndex;
                const cycle = CURRENT_CYCLE + (currentIndex >= 0 ? i - currentIndex : 0);
                const photos = albums.reduce((s, a) => s + a.photoCount, 0);
                const open = expanded === y.key;
                return (
                  <View key={y.key} style={[styles.yearCard, isCurrent && styles.yearCardCurrent]}>
                    <TouchableOpacity
                      style={styles.yearRow}
                      disabled={isFuture || albums.length === 0}
                      onPress={() => setExpanded(open ? null : y.key)}
                      activeOpacity={0.85}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.yearLabel, isFuture && styles.dim]}>{y.label}</Text>
                        <Text style={styles.yearMeta}>
                          Ciclo {cycle}
                          {isFuture ? ' · Próximamente' : albums.length ? ` · ${albums.length} álbumes · ${photos} fotos` : ' · Sin álbumes'}
                        </Text>
                      </View>
                      {isCurrent && (
                        <View style={styles.currentPill}>
                          <Text style={styles.currentPillText}>AÑO ACTUAL</Text>
                        </View>
                      )}
                      {isFuture && <Icon name="candado" size={16} color={colors.textMuted} />}
                    </TouchableOpacity>

                    {open &&
                      albums.map((a) => (
                        <TouchableOpacity key={a.id} style={styles.albumRow} onPress={() => setSelected(a)} activeOpacity={0.85}>
                          <Icon name="camara" size={16} color={colors.primary} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.albumTitle} numberOfLines={1}>{a.title}</Text>
                            <Text style={styles.albumMeta}>
                              {a.date} · {a.photoCount} fotos{a.videoCount ? ` · ${a.videoCount} videos` : ''}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                  </View>
                );
              })}
            </View>
          ))}

          <View style={[styles.card, styles.graduation]}>
            <Icon name="graduacion" size={22} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.yearLabel}>Egreso</Text>
              <Text style={styles.yearMeta}>
                Álbum de la promoción {graduationCycle} · se habilita al finalizar la secundaria.
              </Text>
            </View>
            <Icon name="candado" size={16} color={colors.textMuted} />
          </View>
        </View>
      </ScrollView>

      <Modal visible={!!selected} animationType="slide" transparent onRequestClose={() => setSelected(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{selected?.title}</Text>
            <Text style={styles.albumMeta}>
              {selected?.date} · {selected?.teacher} · {selected?.photoCount} fotos
            </Text>
            <Text style={styles.modalDesc}>{selected?.description}</Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() =>
                Alert.alert('Descarga HD iniciada', `Descargando "${selected?.title}" en alta resolución.`)
              }
            >
              <Text style={styles.primaryBtnText}>Descargar fotos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
              <Text style={styles.closeBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  heroSub: { color: '#D1FAE5', fontSize: 13, marginTop: 4 },
  body: { padding: 16, paddingBottom: 32 },
  segment: { flexDirection: 'row', backgroundColor: colors.borderLight, borderRadius: 14, padding: 4, marginBottom: 12 },
  segmentBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
  segmentBtnActive: { backgroundColor: colors.cardBg },
  segmentText: { fontWeight: '700', color: colors.textSecondary },
  segmentTextActive: { color: colors.primary },
  card: { backgroundColor: colors.cardBg, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  cardLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, color: colors.textMuted, textTransform: 'uppercase' },
  summary: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginTop: 6 },
  summaryMuted: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.borderLight, marginTop: 12, overflow: 'hidden' },
  trackFill: { height: 8, borderRadius: 4, backgroundColor: colors.primary },
  note: { fontSize: 12, color: colors.textSecondary, marginTop: 8 },
  levelBlock: { marginTop: 8 },
  levelTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.3, marginBottom: 10 },
  yearCard: { backgroundColor: colors.cardBg, borderRadius: 16, marginBottom: 8, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  yearCardCurrent: { borderColor: colors.primary, borderWidth: 2 },
  yearRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14 },
  yearLabel: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  dim: { color: colors.textMuted },
  yearMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  currentPill: { backgroundColor: colors.primaryLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  currentPillText: { fontSize: 10, fontWeight: '800', color: colors.primaryDark, letterSpacing: 0.5 },
  albumRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.borderLight },
  albumTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  albumMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  graduation: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.cardBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 32 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  modalDesc: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginVertical: 12 },
  primaryBtn: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '800' },
  closeBtn: { alignItems: 'center', paddingVertical: 12 },
  closeBtnText: { color: colors.textSecondary, fontWeight: '700' },
});
