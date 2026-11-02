import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useActiveStudent } from '../context/StudentContext';
import { StudentCarousel } from '../components/StudentCarousel';
import { colors } from '../theme/colors';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { activeStudent } = useActiveStudent();
  const [activeTab, setActiveTab] = useState<'TABLERO' | 'TIMELINE'>('TABLERO');

  if (!activeStudent) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No hay estudiante activo.</Text>
      </View>
    );
  }

  const isKindergarten = activeStudent.educationalLevel === 'INICIAL';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top School Header */}
      <View style={styles.topHeader}>
        <View style={styles.schoolBrand}>
          <View style={styles.schoolLogo}>
            <Text style={styles.schoolLogoText}>🏛️</Text>
          </View>
          <View>
            <Text style={styles.schoolName}>Colegio Bilingüe</Text>
            <Text style={styles.schoolSub}>San Martín</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.profileBtn} activeOpacity={0.8}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>ML</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Multi-Student Selection Carousel */}
      <StudentCarousel />

      {/* Mode Switcher Tabs (Línea de tiempo / Tablero) */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'TABLERO' && styles.activeTabBtn]}
          onPress={() => setActiveTab('TABLERO')}
          activeOpacity={0.85}
        >
          <Text style={[styles.tabBtnText, activeTab === 'TABLERO' && styles.activeTabBtnText]}>
            Tablero
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'TIMELINE' && styles.activeTabBtn]}
          onPress={() => setActiveTab('TIMELINE')}
          activeOpacity={0.85}
        >
          <Text style={[styles.tabBtnText, activeTab === 'TIMELINE' && styles.activeTabBtnText]}>
            {isKindergarten ? 'Línea de tiempo (Jardín)' : 'Bitácora Académica'}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'TABLERO' ? (
        <View style={styles.sectionBody}>
          {/* Section: Próximos eventos importantes */}
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Próximos eventos importantes</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.eventsScroll}>
              {/* Event Card 1: Celebration */}
              <View style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventIcon}>🎂</Text>
                  <View style={styles.celebrationBadge}>
                    <Text style={styles.celebrationText}>CELEBRACIÓN</Text>
                  </View>
                </View>
                <Text style={styles.eventTitle}>Cumpleaños en Sala</Text>
                <Text style={styles.eventDesc}>
                  El viernes festejaremos los cumpleaños del mes. Traer merienda especial.
                </Text>
                <View style={styles.eventDatePill}>
                  <Text style={styles.eventDateText}>📅 Viernes, 06 Noviembre</Text>
                </View>
              </View>

              {/* Event Card 2: Cita con el colegio */}
              <View style={[styles.eventCard, styles.eventCardAlt]}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventIcon}>🤝</Text>
                  <View style={styles.meetingBadge}>
                    <Text style={styles.meetingText}>CITA COLEGIO</Text>
                  </View>
                </View>
                <Text style={styles.eventTitle}>Entrevista de Familias</Text>
                <Text style={styles.eventDesc}>
                  Reunión semestral con directivos y gabinete psicopedagógico.
                </Text>
                <View style={styles.eventDatePill}>
                  <Text style={styles.eventDateText}>⏰ Jueves, 10:30 hs</Text>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Section: ¿Qué ha pasado? */}
          <View style={styles.block}>
            <Text style={styles.blockTitle}>¿Qué ha pasado?</Text>

            <View style={styles.historyGrid}>
              {/* Card Falta de asistencia */}
              <TouchableOpacity
                style={styles.alertCardRed}
                onPress={() => navigation.navigate('Asistencia')}
                activeOpacity={0.85}
              >
                <Text style={styles.alertTitleRed}>Falta de asistencia</Text>
                <Text style={styles.alertDateRed}>Vie, 28 Octubre</Text>
                <View style={styles.alertBadgeRed}>
                  <Text style={styles.alertBadgeRedText}>Tardanza (1/4 falta)</Text>
                </View>
              </TouchableOpacity>

              {/* Card Incidente de salud */}
              <TouchableOpacity
                style={styles.alertCardBlue}
                onPress={() => navigation.navigate('Asistencia')}
                activeOpacity={0.85}
              >
                <Text style={styles.alertTitleBlue}>Ficha médica</Text>
                <Text style={styles.alertDateBlue}>Apto Físico</Text>
                <View style={styles.alertBadgeBlue}>
                  <Text style={styles.alertBadgeBlueText}>Vence en 18 días</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section: Calificaciones */}
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Calificaciones y Rendimiento</Text>

            <View style={styles.gradeCard}>
              <View style={styles.gradeLeft}>
                <View style={styles.gradeSubjectIcon}>
                  <Text style={styles.gradeSubjectEmoji}>📐</Text>
                </View>
                <View style={styles.gradeInfo}>
                  <Text style={styles.gradeSubjectName}>
                    {isKindergarten ? 'Área Cognitiva y Lenguaje' : 'Matemáticas'}
                  </Text>
                  <Text style={styles.gradeExamDesc}>
                    {isKindergarten ? 'Informe conceptual 1° cuatrimestre' : 'Examen de resolución y cálculo'}
                  </Text>
                </View>
              </View>

              <View style={styles.gradeScoreBadge}>
                <Text style={styles.gradeScoreNumber}>
                  {isKindergarten ? 'Sobresaliente' : '9.5'}
                </Text>
              </View>
            </View>
          </View>

          {/* Section: Galería de Actividades */}
          <View style={styles.block}>
            <View style={styles.blockHeaderRow}>
              <Text style={styles.blockTitle}>Galería de Actividades</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Galería')}>
                <Text style={styles.seeAllLink}>Ver álbum →</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScroll}>
              <View style={[styles.galleryThumb, { backgroundColor: '#FEE2E2' }]}>
                <Text style={styles.galleryEmoji}>🎨</Text>
                <Text style={styles.galleryLabel}>Taller de Arte</Text>
              </View>
              <View style={[styles.galleryThumb, { backgroundColor: '#DBEAFE' }]}>
                <Text style={styles.galleryEmoji}>⚽</Text>
                <Text style={styles.galleryLabel}>Educación Física</Text>
              </View>
              <View style={[styles.galleryThumb, { backgroundColor: '#DCFCE7' }]}>
                <Text style={styles.galleryEmoji}>🌱</Text>
                <Text style={styles.galleryLabel}>Proyecto Huerta</Text>
              </View>
              <View style={[styles.galleryThumb, { backgroundColor: '#FEF3C7' }]}>
                <Text style={styles.galleryEmoji}>📚</Text>
                <Text style={styles.galleryLabel}>Rincón de Lectura</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      ) : (
        /* Timeline View */
        <View style={styles.timelineContainer}>
          <Text style={styles.blockTitle}>
            Novedades del día: {activeStudent.firstName}
          </Text>

          {/* Timeline Moment 1 */}
          <View style={styles.timelineRow}>
            <View style={styles.timelineTimeCol}>
              <Text style={styles.timeLabel}>08:00</Text>
              <View style={styles.timeDotActive} />
              <View style={styles.timeLine} />
            </View>
            <View style={styles.timelineBodyCard}>
              <Text style={styles.momentTitle}>🚪 Ingreso al aula</Text>
              <Text style={styles.momentText}>Entró contento con saludo a sus compañeros.</Text>
              <View style={styles.tagPillYellow}>
                <Text style={styles.tagPillYellowText}>😊 Estado: Alegre</Text>
              </View>
            </View>
          </View>

          {/* Timeline Moment 2 */}
          <View style={styles.timelineRow}>
            <View style={styles.timelineTimeCol}>
              <Text style={styles.timeLabel}>10:15</Text>
              <View style={styles.timeDot} />
              <View style={styles.timeLine} />
            </View>
            <View style={styles.timelineBodyCard}>
              <Text style={styles.momentTitle}>🍎 Colación de la Mañana</Text>
              <Text style={styles.momentText}>Yogur con cereales y frutas cortadas.</Text>
              <View style={styles.tagPillGreen}>
                <Text style={styles.tagPillGreenText}>⭐ Ingesta: Comió TODO</Text>
              </View>
            </View>
          </View>

          {/* Timeline Moment 3 */}
          <View style={styles.timelineRow}>
            <View style={styles.timelineTimeCol}>
              <Text style={styles.timeLabel}>12:30</Text>
              <View style={styles.timeDot} />
            </View>
            <View style={styles.timelineBodyCard}>
              <Text style={styles.momentTitle}>🧷 Mudas e Higiene</Text>
              <Text style={styles.momentText}>Cambio de pañal realizado. Higiene y lavado de manos.</Text>
              <View style={styles.tagPillBlue}>
                <Text style={styles.tagPillBlueText}>💧 Pañal cambiado (húmedo)</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 6,
  },
  schoolBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  schoolLogo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  schoolLogoText: {
    fontSize: 18,
  },
  schoolName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  schoolSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  profileBtn: {},
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    marginHorizontal: 18,
    marginVertical: 10,
    borderRadius: 24,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 22,
    alignItems: 'center',
  },
  activeTabBtn: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  activeTabBtnText: {
    color: '#FFFFFF',
  },
  sectionBody: {
    paddingHorizontal: 18,
    gap: 18,
  },
  block: {
    gap: 10,
  },
  blockHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  seeAllLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  eventsScroll: {
    gap: 12,
    paddingRight: 10,
  },
  eventCard: {
    width: 250,
    backgroundColor: '#EFF6FF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  eventCardAlt: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventIcon: {
    fontSize: 22,
  },
  celebrationBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  celebrationText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E40AF',
  },
  meetingBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  meetingText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  eventDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  eventDatePill: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventDateText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  historyGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  alertCardRed: {
    flex: 1,
    backgroundColor: colors.coralLight,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    justifyContent: 'space-between',
    minHeight: 105,
  },
  alertTitleRed: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.coralDark,
  },
  alertDateRed: {
    fontSize: 11,
    color: '#7F1D1D',
    marginTop: 2,
  },
  alertBadgeRed: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  alertBadgeRedText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.coralDark,
  },
  alertCardBlue: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    justifyContent: 'space-between',
    minHeight: 105,
  },
  alertTitleBlue: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  alertDateBlue: {
    fontSize: 11,
    color: '#1E3A8A',
    marginTop: 2,
  },
  alertBadgeBlue: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  alertBadgeBlueText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  gradeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gradeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  gradeSubjectIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeSubjectEmoji: {
    fontSize: 20,
  },
  gradeInfo: {
    flex: 1,
  },
  gradeSubjectName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  gradeExamDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  gradeScoreBadge: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeScoreNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  galleryScroll: {
    gap: 12,
  },
  galleryThumb: {
    width: 120,
    height: 90,
    borderRadius: 14,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  galleryEmoji: {
    fontSize: 28,
  },
  galleryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  timelineContainer: {
    paddingHorizontal: 18,
    gap: 14,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineTimeCol: {
    width: 50,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  timeDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  timeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  timeLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 2,
  },
  timelineBodyCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  momentTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  momentText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },
  tagPillYellow: {
    backgroundColor: colors.amberLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  tagPillYellowText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.amberDark,
  },
  tagPillGreen: {
    backgroundColor: colors.emeraldLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  tagPillGreenText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.emeraldDark,
  },
  tagPillBlue: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  tagPillBlueText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});
