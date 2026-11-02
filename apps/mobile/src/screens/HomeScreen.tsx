import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useActiveStudent } from '../context/StudentContext';
import { StudentCarousel } from '../components/StudentCarousel';
import { colors } from '../theme/colors';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { activeStudent } = useActiveStudent();
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<'TABLERO' | 'TIMELINE'>('TABLERO');

  // Responsive event card width
  const eventCardWidth = Math.min(width * 0.78, 320);

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
      {/* 1. CURVED HERO HEADER (Brand Wave) */}
      <View style={styles.heroHeader}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroBrand}>
            <Image
              source={require('../../assets/logo-colegio.png')}
              style={styles.heroLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.heroTitle}>Instituto República de Italia</Text>
              <Text style={styles.heroSubtitle}>Entre Ríos · Ciclo 2026</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.heroProfileBtn} activeOpacity={0.85}>
            <View style={styles.heroAvatar}>
              <Text style={styles.heroAvatarText}>ML</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.heroGreeting}>
          <Text style={styles.heroHello}>Hola, Familia López 👋</Text>
          <Text style={styles.heroStudentActive}>
            Viendo información de <Text style={styles.heroBold}>{activeStudent.firstName}</Text>
          </Text>
        </View>
      </View>

      {/* 2. MULTI-STUDENT CAROUSEL (Floating) */}
      <View style={styles.carouselContainer}>
        <StudentCarousel />
      </View>

      {/* 3. MODE SWITCHER TABS (Tablero / Línea de tiempo) */}
      <View style={styles.tabContainer}>
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
              {isKindergarten ? 'Línea de tiempo' : 'Actividades'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'TABLERO' ? (
        <View style={styles.contentBody}>
          {/* SECTION: PRÓXIMOS EVENTOS IMPORTANTES */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Próximos eventos importantes</Text>
              <Text style={styles.sectionBadgeCount}>2 pendientes</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.eventsScroll}
              decelerationRate="fast"
              snapToInterval={eventCardWidth + 12}
            >
              {/* Event Card 1: Festejo */}
              <View style={[styles.eventCard, { width: eventCardWidth }]}>
                <View style={styles.eventCardTop}>
                  <View style={styles.eventIconBox}>
                    <Text style={styles.eventEmoji}>🎂</Text>
                  </View>
                  <View style={styles.celebrationPill}>
                    <Text style={styles.celebrationPillText}>CELEBRACIÓN</Text>
                  </View>
                </View>

                <Text style={styles.eventTitle}>Cumpleaños en Sala</Text>
                <Text style={styles.eventDesc} numberOfLines={2}>
                  El viernes festejaremos los cumpleaños del mes. Traer merienda compartida.
                </Text>

                <View style={styles.eventFooterRow}>
                  <View style={styles.dateBadgePill}>
                    <Text style={styles.dateBadgeText}>📅 Viernes, 06 Noviembre</Text>
                  </View>
                </View>
              </View>

              {/* Event Card 2: Cita con el colegio */}
              <View style={[styles.eventCard, styles.eventCardAlt, { width: eventCardWidth }]}>
                <View style={styles.eventCardTop}>
                  <View style={[styles.eventIconBox, { backgroundColor: '#E0F2FE' }]}>
                    <Text style={styles.eventEmoji}>🤝</Text>
                  </View>
                  <View style={[styles.celebrationPill, { backgroundColor: '#BAE6FD' }]}>
                    <Text style={[styles.celebrationPillText, { color: '#0369A1' }]}>
                      CITA COLEGIO
                    </Text>
                  </View>
                </View>

                <Text style={styles.eventTitle}>Reunión Institucional</Text>
                <Text style={styles.eventDesc} numberOfLines={2}>
                  Entrevista de seguimiento pedagógico con docentes de grado y preceptoría.
                </Text>

                <View style={styles.eventFooterRow}>
                  <View style={styles.dateBadgePill}>
                    <Text style={styles.dateBadgeText}>⏰ Jueves, 10:30 hs</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* SECTION: ¿QUÉ HA PASADO? (Responsive Dual Cards) */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>¿Qué ha pasado?</Text>

            <View style={styles.dualGrid}>
              {/* Card Inasistencia (Coral/Rojo) */}
              <TouchableOpacity
                style={styles.statusCardRed}
                onPress={() => navigation.navigate('Asistencia')}
                activeOpacity={0.88}
              >
                <View>
                  <Text style={styles.statusCardTitleRed}>Falta de asistencia</Text>
                  <Text style={styles.statusCardDateRed}>Vie, 28 Octubre</Text>
                </View>

                <View style={styles.whitePillRed}>
                  <Text style={styles.whitePillTextRed}>Tardanza (1/4)</Text>
                </View>
              </TouchableOpacity>

              {/* Card Salud (Celeste/Azul) */}
              <TouchableOpacity
                style={styles.statusCardBlue}
                onPress={() => navigation.navigate('Asistencia')}
                activeOpacity={0.88}
              >
                <View>
                  <Text style={styles.statusCardTitleBlue}>Fiebre / Consulta</Text>
                  <Text style={styles.statusCardDateBlue}>Vie, 24 Octubre</Text>
                </View>

                <View style={styles.whitePillBlue}>
                  <Text style={styles.whitePillTextBlue}>Justificada ✓</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* SECTION: CALIFICACIONES (Score Card) */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Calificaciones y Evaluación</Text>
              <Text style={styles.seeAllLink}>1° Período</Text>
            </View>

            <View style={styles.gradeCard}>
              <View style={styles.gradeLeft}>
                <View style={styles.gradeIconContainer}>
                  <Text style={styles.gradeEmoji}>🇮🇹</Text>
                </View>
                <View style={styles.gradeDetails}>
                  <Text style={styles.gradeSubject}>
                    {isKindergarten ? 'Área Expresiva y Lengua Italiana' : 'Lengua y Cultura Italiana'}
                  </Text>
                  <Text style={styles.gradeTopic}>
                    {isKindergarten ? 'Informe conceptual del cuatrimestre' : 'Examen oral de vocabulario y conversación'}
                  </Text>
                </View>
              </View>

              <View style={styles.gradeScoreCircle}>
                <Text style={styles.gradeScoreText}>
                  {isKindergarten ? '★' : '9.8'}
                </Text>
                <Text style={styles.gradeScoreSub}>
                  {isKindergarten ? 'Sobresal.' : '/ 10'}
                </Text>
              </View>
            </View>
          </View>

          {/* SECTION: GALERÍA DE ACTIVIDADES */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Galería de Actividades</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Galería')}>
                <Text style={styles.seeAllLink}>Ver álbum completo →</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryScroll}
            >
              <View style={[styles.galleryCard, { backgroundColor: '#FEE2E2' }]}>
                <Text style={styles.galleryEmoji}>🎨</Text>
                <Text style={styles.galleryLabel}>Taller de Arte</Text>
                <Text style={styles.gallerySub}>18 fotos</Text>
              </View>
              <View style={[styles.galleryCard, { backgroundColor: '#EFF6FF' }]}>
                <Text style={styles.galleryEmoji}>⚽</Text>
                <Text style={styles.galleryLabel}>Deportes</Text>
                <Text style={styles.gallerySub}>32 fotos</Text>
              </View>
              <View style={[styles.galleryCard, { backgroundColor: '#E8F7EE' }]}>
                <Text style={styles.galleryEmoji}>🌱</Text>
                <Text style={styles.galleryLabel}>Huerta Escolar</Text>
                <Text style={styles.gallerySub}>24 fotos</Text>
              </View>
              <View style={[styles.galleryCard, { backgroundColor: '#FEF3C7' }]}>
                <Text style={styles.galleryEmoji}>📚</Text>
                <Text style={styles.galleryLabel}>Biblioteca</Text>
                <Text style={styles.gallerySub}>15 fotos</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      ) : (
        /* TIMELINE VIEW (NIVEL INICIAL RUTINA) */
        <View style={styles.timelineBody}>
          <Text style={styles.sectionTitle}>
            Rutina diaria: {activeStudent.firstName} ({activeStudent.courseName})
          </Text>

          <View style={styles.timelineCard}>
            <View style={styles.timelineItem}>
              <View style={styles.timeBullet} />
              <View style={styles.timeContent}>
                <Text style={styles.timeTag}>08:00 hs · Entrada</Text>
                <Text style={styles.timeTitle}>Ingreso con ánimo alegre</Text>
                <Text style={styles.timeSub}>Saludó afectuosamente a la maestra y a sus pares.</Text>
                <View style={styles.moodPill}>
                  <Text style={styles.moodPillText}>😊 Alegre y participativo</Text>
                </View>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={[styles.timeBullet, { backgroundColor: colors.celeste }]} />
              <View style={styles.timeContent}>
                <Text style={styles.timeTag}>10:15 hs · Colación</Text>
                <Text style={styles.timeTitle}>Colación de media mañana</Text>
                <Text style={styles.timeSub}>Fruta cortada y galletitas de avena caseras.</Text>
                <View style={[styles.moodPill, { backgroundColor: colors.celesteLight }]}>
                  <Text style={[styles.moodPillText, { color: colors.celesteDark }]}>
                    ⭐ Ingesta: Comió TODO
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={[styles.timeBullet, { backgroundColor: colors.amber }]} />
              <View style={styles.timeContent}>
                <Text style={styles.timeTag}>12:30 hs · Higiene</Text>
                <Text style={styles.timeTitle}>Muda de pañal e higiene de manos</Text>
                <Text style={styles.timeSub}>Muda realizada a tiempo. Quedó limpio y cómodo.</Text>
                <View style={[styles.moodPill, { backgroundColor: colors.amberLight }]}>
                  <Text style={[styles.moodPillText, { color: colors.amberDark }]}>
                    💧 Pañal cambiado (húmedo)
                  </Text>
                </View>
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

  /* 1. CURVED HERO HEADER */
  heroHeader: {
    backgroundColor: colors.primary,
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  heroSubtitle: {
    fontSize: 12,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  heroProfileBtn: {},
  heroAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  heroGreeting: {
    marginTop: 14,
  },
  heroHello: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  heroStudentActive: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  heroBold: {
    fontWeight: '800',
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },

  /* 2. CAROUSEL WRAPPER */
  carouselContainer: {
    marginTop: -8,
  },

  /* 3. TAB SWITCHER */
  tabContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 24,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: 'center',
  },
  activeTabBtn: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  activeTabBtnText: {
    color: '#FFFFFF',
  },

  /* 4. CONTENT BODY */
  contentBody: {
    paddingHorizontal: 20,
    gap: 20,
    marginTop: 6,
  },
  sectionBlock: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionBadgeCount: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  seeAllLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },

  /* EVENTS CAROUSEL */
  eventsScroll: {
    gap: 12,
    paddingRight: 10,
  },
  eventCard: {
    backgroundColor: '#FEF9C3',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#FDE047',
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  eventCardAlt: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  eventCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FEF08A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventEmoji: {
    fontSize: 20,
  },
  celebrationPill: {
    backgroundColor: '#FDE047',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  celebrationPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#854D0E',
    letterSpacing: 0.5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  eventDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 17,
  },
  eventFooterRow: {
    marginTop: 14,
    flexDirection: 'row',
  },
  dateBadgePill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  dateBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  /* RESPONSIVE DUAL GRID (¿Qué ha pasado?) */
  dualGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statusCardRed: {
    flex: 1,
    backgroundColor: '#FFF1F2',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    justifyContent: 'space-between',
    minHeight: 120,
    shadowColor: colors.shadowColor,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statusCardTitleRed: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9F1239',
  },
  statusCardDateRed: {
    fontSize: 12,
    color: '#BE123C',
    marginTop: 2,
  },
  whitePillRed: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  whitePillTextRed: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E11D48',
  },

  statusCardBlue: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    justifyContent: 'space-between',
    minHeight: 120,
    shadowColor: colors.shadowColor,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statusCardTitleBlue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E40AF',
  },
  statusCardDateBlue: {
    fontSize: 12,
    color: '#2563EB',
    marginTop: 2,
  },
  whitePillBlue: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  whitePillTextBlue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },

  /* GRADES (Prominent score) */
  gradeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.shadowColor,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  gradeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  gradeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeEmoji: {
    fontSize: 22,
  },
  gradeDetails: {
    flex: 1,
  },
  gradeSubject: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  gradeTopic: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  gradeScoreCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeScoreText: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  gradeScoreSub: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
    marginTop: -2,
  },

  /* GALLERY CARDS */
  galleryScroll: {
    gap: 12,
  },
  galleryCard: {
    width: 130,
    height: 100,
    borderRadius: 18,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  galleryEmoji: {
    fontSize: 30,
  },
  galleryLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  gallerySub: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  /* TIMELINE BODY */
  timelineBody: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 6,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 14,
  },
  timeBullet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  timeContent: {
    flex: 1,
  },
  timeTag: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  timeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  timeSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  moodPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  moodPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});
