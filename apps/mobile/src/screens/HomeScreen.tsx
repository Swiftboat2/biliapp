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
  const [activeTab, setActiveTab] = useState<'TABLERO' | 'TIMELINE'>('TIMELINE');

  // Responsive event card width for snap carousel
  const eventCardWidth = Math.min(width * 0.8, 300);

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
      {/* 1. HERO BANNER VERDE INSTITUCIONAL (#008C45) con esquinas redondeadas 32px */}
      <View style={styles.heroHeader}>
        {/* Subtle Decorative Ambient Circles */}
        <View style={styles.heroCircleTopRight} />
        <View style={styles.heroCircleBottomLeft} />

        {/* Cabecera Institucional Superior */}
        <View style={styles.heroTopRow}>
          <View style={styles.heroBrand}>
            <Image
              source={require('../../assets/logo-colegio.png')}
              style={styles.heroLogo}
              resizeMode="contain"
            />
            <View style={styles.heroBrandTextCol}>
              <Text style={styles.heroTitle} numberOfLines={1}>
                Instituto República de Italia
              </Text>
              <Text style={styles.heroBadgeSub}>ENTRE RÍOS · CICLO 2026</Text>
            </View>
          </View>

          <View style={styles.heroActionsRow}>
            {/* Botón Notificaciones con punto rojo */}
            <TouchableOpacity
              style={styles.notifBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Mensajes')}
            >
              <Text style={styles.notifIcon}>🔔</Text>
              <View style={styles.notifRedDot} />
            </TouchableOpacity>

            {/* Avatar Familiar FL */}
            <View style={styles.familyAvatar}>
              <Text style={styles.familyAvatarText}>FL</Text>
            </View>
          </View>
        </View>

        {/* Saludo Cálido y Estudiante Actual */}
        <View style={styles.heroGreeting}>
          <Text style={styles.heroHello}>¡Hola, Familia López! 👋</Text>
          <View style={styles.heroStudentActiveRow}>
            <View style={styles.pulseDot} />
            <Text style={styles.heroStudentActive}>
              Viendo rutina de{' '}
              <Text style={styles.heroStudentNameUnderline}>
                {activeStudent.firstName}
              </Text>
            </Text>
          </View>
        </View>
      </View>

      {/* 2. SELECTOR DE ESTUDIANTES FLOTANTE (-mt-5) */}
      <View style={styles.floatingCarousel}>
        <StudentCarousel />
      </View>

      {/* 3. CONMUTADOR DE MODO (Tablero vs Línea de tiempo) */}
      <View style={styles.modeSwitcherContainer}>
        <View style={styles.modeSwitcherPill}>
          <TouchableOpacity
            style={[
              styles.modeTabBtn,
              activeTab === 'TABLERO' && styles.modeTabBtnActive,
            ]}
            onPress={() => setActiveTab('TABLERO')}
            activeOpacity={0.9}
          >
            <Text style={styles.modeTabIcon}>📊</Text>
            <Text
              style={[
                styles.modeTabText,
                activeTab === 'TABLERO' && styles.modeTabTextActive,
              ]}
            >
              Tablero
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeTabBtn,
              activeTab === 'TIMELINE' && styles.modeTabBtnActive,
            ]}
            onPress={() => setActiveTab('TIMELINE')}
            activeOpacity={0.9}
          >
            <Text style={styles.modeTabIcon}>⏳</Text>
            <Text
              style={[
                styles.modeTabText,
                activeTab === 'TIMELINE' && styles.modeTabTextActive,
              ]}
            >
              {isKindergarten ? 'Línea de tiempo' : 'Actividades'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT AREA: TOGGLED BY ACTIVE TAB */}
      {activeTab === 'TIMELINE' ? (
        <View style={styles.contentBody}>
          {/* 1. INDICADOR DE JORNADA CONTEXTUAL */}
          <View style={styles.dailyContextCard}>
            <View style={styles.dailyContextLeft}>
              <View style={styles.calendarIconBox}>
                <Text style={styles.calendarIcon}>📅</Text>
              </View>
              <View>
                <Text style={styles.dailyContextLabel}>JORNADA ESCOLAR</Text>
                <Text style={styles.dailyContextDate}>Hoy, 28 de Octubre</Text>
              </View>
            </View>
            <View style={styles.inClassBadge}>
              <View style={styles.inClassPing} />
              <Text style={styles.inClassText}>● EN CLASE AHORA</Text>
            </View>
          </View>

          {/* 2. CRONOGRAMA DEL JARDÍN (5 Momentos con Línea Continua) */}
          <View style={styles.cardSection}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleWithSub}>
                <Text style={styles.sectionTitle}>Cronograma del Jardín</Text>
                <Text style={styles.sectionSubMuted}>
                  ({isKindergarten ? 'Sala de 4' : 'Primaria'})
                </Text>
              </View>
              <View style={styles.pillCountBadge}>
                <Text style={styles.pillCountText}>5 Momentos</Text>
              </View>
            </View>

            {/* Timeline Tree */}
            <View style={styles.timelineTree}>
              <View style={styles.verticalTimelineLine} />

              {/* Hito 1: Entrada */}
              <View style={styles.timelineItem}>
                <View style={[styles.timelineNode, { backgroundColor: colors.primary }]}>
                  <Text style={styles.timelineNodeIcon}>☀️</Text>
                </View>
                <View style={styles.timelineContentBox}>
                  <View style={styles.timelineTopBadgeRow}>
                    <Text style={styles.timelineTime}>08:00 hs</Text>
                    <View style={styles.badgeSuccess}>
                      <Text style={styles.badgeSuccessText}>😊 Alegre y participativo</Text>
                    </View>
                  </View>
                  <Text style={styles.timelineEventTitle}>
                    Entrada al aula e inicio de jornada
                  </Text>
                  <Text style={styles.timelineEventDesc}>
                    Llegó puntual, dejó sus pertenencias en su casillero con entusiasmo y saludó con canciones.
                  </Text>
                </View>
              </View>

              {/* Hito 2: Colación */}
              <View style={styles.timelineItem}>
                <View style={[styles.timelineNode, { backgroundColor: '#0061a2' }]}>
                  <Text style={styles.timelineNodeIcon}>🍎</Text>
                </View>
                <View style={styles.timelineContentBox}>
                  <View style={styles.timelineTopBadgeRow}>
                    <Text style={styles.timelineTime}>10:15 hs</Text>
                    <View style={styles.badgeBlue}>
                      <Text style={styles.badgeBlueText}>⭐ Comió TODO</Text>
                    </View>
                  </View>
                  <Text style={styles.timelineEventTitle}>
                    Colación de media mañana
                  </Text>
                  <Text style={styles.timelineEventDesc}>
                    Fruta fresca y jugo natural. Compartió mesa con sus compañeros de sala con hábitos impecables.
                  </Text>
                </View>
              </View>

              {/* Hito 3: Higiene y Mudas */}
              <View style={styles.timelineItem}>
                <View style={[styles.timelineNode, { backgroundColor: '#1A73E8' }]}>
                  <Text style={styles.timelineNodeIcon}>💧</Text>
                </View>
                <View style={styles.timelineContentBox}>
                  <View style={styles.timelineTopBadgeRow}>
                    <Text style={styles.timelineTime}>12:30 hs</Text>
                    <View style={styles.badgeCeleste}>
                      <Text style={styles.badgeCelesteText}>💧 Higiene completa</Text>
                    </View>
                  </View>
                  <Text style={styles.timelineEventTitle}>
                    Higiene y mudas
                  </Text>
                  <Text style={styles.timelineEventDesc}>
                    Lavado de manos independiente y cambio de indumentaria tras el taller de expresión artística.
                  </Text>
                </View>
              </View>

              {/* Hito 4: Siesta y Descanso */}
              <View style={styles.timelineItem}>
                <View style={[styles.timelineNode, { backgroundColor: '#4da8fd' }]}>
                  <Text style={styles.timelineNodeIcon}>💤</Text>
                </View>
                <View style={styles.timelineContentBox}>
                  <View style={styles.timelineTopBadgeRow}>
                    <Text style={styles.timelineTime}>13:00 - 14:15 hs</Text>
                    <View style={styles.badgePurple}>
                      <Text style={styles.badgePurpleText}>💤 Descanso tranquilo</Text>
                    </View>
                  </View>
                  <Text style={styles.timelineEventTitle}>
                    Siesta y descanso guiado
                  </Text>
                  <Text style={styles.timelineEventDesc}>
                    Durmió plácidamente durante todo el período de reposo con música de relajación instrumental.
                  </Text>
                </View>
              </View>

              {/* Hito 5: Merienda y Preparativos */}
              <View style={styles.timelineItem}>
                <View style={[styles.timelineNode, { backgroundColor: '#94A3B8' }]}>
                  <Text style={styles.timelineNodeIcon}>🎒</Text>
                </View>
                <View style={[styles.timelineContentBox, styles.timelineNextBox]}>
                  <View style={styles.timelineTopBadgeRow}>
                    <Text style={styles.timelineTimeMuted}>15:30 hs</Text>
                    <View style={styles.badgeMuted}>
                      <Text style={styles.badgeMutedText}>⏰ Próxima actividad</Text>
                    </View>
                  </View>
                  <Text style={styles.timelineEventTitle}>
                    Merienda y preparativos de salida
                  </Text>
                  <Text style={styles.timelineEventDesc}>
                    Colación de cierre y armado de mochilas antes de la entrega por puerta principal.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 3. BITÁCORA / NOTA DE LA SEÑO VALENTINA */}
          <View style={styles.teacherNoteCard}>
            <View style={styles.teacherHeaderRow}>
              <View style={styles.teacherAvatarWrap}>
                <View style={styles.teacherAvatarBox}>
                  <Text style={styles.teacherAvatarEmoji}>👩‍🏫</Text>
                </View>
                <View style={styles.teacherHeartBadge}>
                  <Text style={styles.teacherHeartIcon}>❤️</Text>
                </View>
              </View>

              <View style={styles.teacherInfoCol}>
                <View style={styles.teacherNameRow}>
                  <Text style={styles.teacherName}>Seño Valentina</Text>
                  <Text style={styles.teacherTime}>14:20 hs</Text>
                </View>
                <Text style={styles.teacherRole}>Docente a cargo · Sala de 4</Text>
              </View>
            </View>

            <View style={styles.teacherMessageBox}>
              <Text style={styles.teacherMessageText}>
                «¡Mateo disfrutó mucho del rincón de construcciones y participó activamente en las canciones en italiano! 🇮🇹🎵»
              </Text>
            </View>

            <View style={styles.teacherActionRow}>
              <TouchableOpacity
                style={styles.replyTeacherBtn}
                activeOpacity={0.88}
                onPress={() => navigation.navigate('Mensajes')}
              >
                <Text style={styles.replyTeacherIcon}>💬</Text>
                <Text style={styles.replyTeacherBtnText}>Enviar mensaje a la Seño</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 4. CÁPSULA LINGÜÍSTICA BICULTURAL */}
          <View style={styles.linguisticCard}>
            <View style={styles.linguisticLeft}>
              <View style={styles.flagCircle}>
                <Text style={styles.flagEmoji}>🇮🇹</Text>
              </View>
              <View style={styles.linguisticTextCol}>
                <Text style={styles.linguisticTag}>PROYECTO LINGÜÍSTICO</Text>
                <Text style={styles.linguisticWord}>
                  Palabra de la semana: <Text style={styles.linguisticItalic}>"Amicizia"</Text>
                </Text>
              </View>
            </View>
            <View style={styles.linguisticLevelPill}>
              <Text style={styles.linguisticLevelText}>Nivel Inicial</Text>
            </View>
          </View>
        </View>
      ) : (
        /* TABLERO SCREEN (Screen 01) */
        <View style={styles.contentBody}>
          {/* 1. SECCIÓN PRÓXIMOS EVENTOS */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithSub}>
              <Text style={styles.sectionTitle}>Próximos eventos</Text>
              <View style={styles.greenTitleDot} />
            </View>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.sectionLinkGreen}>Ver calendario</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsScrollContainer}
            decelerationRate="fast"
            snapToInterval={eventCardWidth + 12}
          >
            {/* Card 1: Celebración */}
            <View
              style={[
                styles.eventCardCelebration,
                { width: eventCardWidth },
              ]}
            >
              <View>
                <View style={styles.eventCardTopRow}>
                  <View style={styles.celebrationPill}>
                    <Text style={styles.celebrationPillText}>CELEBRACIÓN</Text>
                  </View>
                  <View style={styles.eventIconCircleYellow}>
                    <Text style={styles.eventEmoji}>🎉</Text>
                  </View>
                </View>
                <Text style={styles.eventCardTitle} numberOfLines={2}>
                  Festa della Repubblica & Muestra de Arte
                </Text>
              </View>
              <View style={styles.eventDatePill}>
                <Text style={styles.eventDateText}>📅 Viernes, 06 Noviembre</Text>
              </View>
            </View>

            {/* Card 2: Cita Colegio */}
            <View
              style={[
                styles.eventCardMeeting,
                { width: eventCardWidth },
              ]}
            >
              <View>
                <View style={styles.eventCardTopRow}>
                  <View style={styles.meetingPill}>
                    <Text style={styles.meetingPillText}>CITA COLEGIO</Text>
                  </View>
                  <View style={styles.eventIconCircleBlue}>
                    <Text style={styles.eventEmoji}>👨‍👩‍👧</Text>
                  </View>
                </View>
                <Text style={styles.eventCardTitle} numberOfLines={2}>
                  Reunión de Padres y Madres
                </Text>
              </View>
              <View style={styles.eventDatePill}>
                <Text style={styles.eventDateText}>📅 Martes, 10 Noviembre</Text>
              </View>
            </View>
          </ScrollView>

          {/* 2. SECCIÓN "¿QUÉ HA PASADO HOY?" (Dual Cards) */}
          <View style={styles.dualSectionWrap}>
            <View>
              <Text style={styles.sectionTitle}>¿Qué ha pasado hoy?</Text>
              <Text style={styles.sectionSubtitle}>
                Estado institucional y novedades del día
              </Text>
            </View>

            <View style={styles.dualGrid}>
              {/* Card 1: Falta de asistencia / Tardanza */}
              <View style={styles.dualCardRed}>
                <View>
                  <View style={styles.dualIconBoxRed}>
                    <Text style={styles.dualIconText}>⏱️</Text>
                  </View>
                  <Text style={styles.dualCardTitle}>Falta de asistencia</Text>
                  <Text style={styles.dualCardDate}>Vie, 28 Octubre</Text>
                </View>
                <View style={styles.dualBadgeContainer}>
                  <View style={styles.dualBadgeWhiteRed}>
                    <Text style={styles.dualBadgeWhiteRedText}>Tardanza (1/4)</Text>
                  </View>
                </View>
              </View>

              {/* Card 2: Ficha Médica / Fiebre */}
              <View style={styles.dualCardBlue}>
                <View>
                  <View style={styles.dualIconBoxBlue}>
                    <Text style={styles.dualIconText}>🩺</Text>
                  </View>
                  <Text style={styles.dualCardTitle}>Fiebre / Consulta</Text>
                  <Text style={styles.dualCardDate}>Vie, 24 Octubre</Text>
                </View>
                <View style={styles.dualBadgeContainer}>
                  <View style={styles.dualBadgeWhiteBlue}>
                    <Text style={styles.dualBadgeWhiteBlueText}>Justificada ✓</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* 3. SECCIÓN "CALIFICACIONES RECIENTES" */}
          <View style={styles.gradesSectionWrap}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Calificaciones recientes</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Archivos')}
                style={styles.viewReportLink}
              >
                <Text style={styles.viewReportText}>Ver boletín</Text>
                <Text style={styles.viewReportArrow}>→</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.gradeCard}>
              <View style={styles.gradeLeft}>
                <View style={styles.gradeIconBox}>
                  <Text style={styles.gradeBookIcon}>📖</Text>
                  <Text style={styles.gradeMiniFlag}>🇮🇹</Text>
                </View>
                <View style={styles.gradeTextCol}>
                  <Text style={styles.gradeSubjectTitle} numberOfLines={1}>
                    Lengua y Cultura Italiana
                  </Text>
                  <Text style={styles.gradeAssessmentName} numberOfLines={1}>
                    Examen trimestral oral: Tradizioni e Famiglia
                  </Text>
                  <View style={styles.gradeMetaRow}>
                    <View style={styles.gradePeriodBadge}>
                      <Text style={styles.gradePeriodText}>1° INFORME</Text>
                    </View>
                    <Text style={styles.gradeMetaTime}>Ayer, 11:30</Text>
                  </View>
                </View>
              </View>

              {/* Grade Display Badge */}
              <View style={styles.gradeBadgeRight}>
                <View style={styles.gradeCircle}>
                  <Text style={styles.gradeScoreNumber}>9.8</Text>
                </View>
                <Text style={styles.gradeScoreLabel}>Sobresaliente</Text>
              </View>
            </View>
          </View>

          {/* 4. SECCIÓN "GALERÍA DE LA SEMANA" */}
          <View style={styles.gallerySectionWrap}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Galería de la semana</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Galería')}
                style={styles.viewReportLink}
              >
                <Text style={styles.galleryExploreText}>Explorar</Text>
                <Text style={styles.galleryExploreArrow}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.galleryGrid}>
              {/* Album 1 */}
              <TouchableOpacity
                style={styles.galleryCard}
                activeOpacity={0.88}
                onPress={() => navigation.navigate('Galería')}
              >
                <View style={styles.galleryImageBoxArt}>
                  <Text style={styles.galleryImagePlaceholder}>🎨🖼️</Text>
                  <View style={styles.galleryPhotoCountBadge}>
                    <Text style={styles.galleryPhotoCountText}>📷 18</Text>
                  </View>
                </View>
                <View style={styles.galleryCardBody}>
                  <Text style={styles.galleryCardTitle} numberOfLines={1}>
                    Taller Expresión Artística 🎨
                  </Text>
                  <Text style={styles.galleryCardTime}>Hace 2 días</Text>
                </View>
              </TouchableOpacity>

              {/* Album 2 */}
              <TouchableOpacity
                style={styles.galleryCard}
                activeOpacity={0.88}
                onPress={() => navigation.navigate('Galería')}
              >
                <View style={styles.galleryImageBoxGarden}>
                  <Text style={styles.galleryImagePlaceholder}>🌱🌻</Text>
                  <View style={styles.galleryPhotoCountBadge}>
                    <Text style={styles.galleryPhotoCountText}>📷 12</Text>
                  </View>
                </View>
                <View style={styles.galleryCardBody}>
                  <Text style={styles.galleryCardTitle} numberOfLines={1}>
                    Huerta Escolar y Ciencias 🌱
                  </Text>
                  <Text style={styles.galleryCardTime}>Hace 4 días</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Espaciado de cortesía para el scroll */}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
  },

  /* 1. HERO BANNER */
  heroHeader: {
    backgroundColor: colors.primary,
    paddingTop: 52,
    paddingBottom: 40,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#005F2E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  heroCircleTopRight: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroCircleBottomLeft: {
    position: 'absolute',
    bottom: -30,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(108, 221, 140, 0.1)',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  heroBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  heroLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 2,
  },
  heroBrandTextCol: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroBadgeSub: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.8,
    marginTop: 1,
  },
  heroActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifIcon: {
    fontSize: 18,
  },
  notifRedDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.coral,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  familyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  familyAvatarText: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.primary,
  },
  heroGreeting: {
    marginTop: 20,
    zIndex: 10,
  },
  heroHello: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  heroStudentActiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6cdd8c',
  },
  heroStudentActive: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  heroStudentNameUnderline: {
    fontWeight: '800',
    textDecorationLine: 'underline',
    color: '#FFFFFF',
  },

  /* 2. FLOATING STUDENT CAROUSEL */
  floatingCarousel: {
    marginTop: -20,
    zIndex: 20,
  },

  /* 3. MODE SWITCHER TABS */
  modeSwitcherContainer: {
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
  },
  modeSwitcherPill: {
    flexDirection: 'row',
    backgroundColor: '#E2E7FF',
    borderRadius: 9999,
    padding: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  modeTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 9999,
  },
  modeTabBtnActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  modeTabIcon: {
    fontSize: 15,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* BODY CONTAINER */
  contentBody: {
    paddingHorizontal: 16,
    gap: 16,
    marginTop: 10,
  },

  /* JORNADA CONTEXTUAL */
  dailyContextCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  dailyContextLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  calendarIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarIcon: {
    fontSize: 18,
  },
  dailyContextLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
  },
  dailyContextDate: {
    fontSize: 15,
    fontWeight: '800',
    color: '#131B2E',
    marginTop: 1,
  },
  inClassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  inClassPing: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.primary,
  },
  inClassText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#005F2E',
    letterSpacing: 0.5,
  },

  /* TIMELINE SECTION */
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleWithSub: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#131B2E',
  },
  sectionSubMuted: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  pillCountBadge: {
    backgroundColor: '#EAEDFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  pillCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },

  /* TIMELINE TREE */
  timelineTree: {
    position: 'relative',
    paddingLeft: 30,
    gap: 16,
  },
  verticalTimelineLine: {
    position: 'absolute',
    left: 11,
    top: 10,
    bottom: 20,
    width: 2,
    backgroundColor: '#E2E7FF',
  },
  timelineItem: {
    position: 'relative',
  },
  timelineNode: {
    position: 'absolute',
    left: -30,
    top: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  timelineNodeIcon: {
    fontSize: 12,
  },
  timelineContentBox: {
    backgroundColor: '#F2F3FF',
    borderRadius: 12,
    padding: 12,
  },
  timelineNextBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    opacity: 0.9,
  },
  timelineTopBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 6,
  },
  timelineTime: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  timelineTimeMuted: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  badgeSuccess: {
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  badgeSuccessText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#005F2E',
  },
  badgeBlue: {
    backgroundColor: '#D1E4FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  badgeBlueText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00497C',
  },
  badgeCeleste: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  badgeCelesteText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1A73E8',
  },
  badgePurple: {
    backgroundColor: '#DAE2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  badgePurpleText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#283044',
  },
  badgeMuted: {
    backgroundColor: '#E2E7FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  badgeMutedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  timelineEventTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#131B2E',
  },
  timelineEventDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 3,
    lineHeight: 17,
  },

  /* TEACHER NOTE CARD */
  teacherNoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  teacherHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  teacherAvatarWrap: {
    position: 'relative',
  },
  teacherAvatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  teacherAvatarEmoji: {
    fontSize: 26,
  },
  teacherHeartBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  teacherHeartIcon: {
    fontSize: 9,
  },
  teacherInfoCol: {
    flex: 1,
  },
  teacherNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teacherName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#131B2E',
  },
  teacherTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  teacherRole: {
    fontSize: 11,
    color: '#005F2E',
    fontWeight: '700',
    marginTop: 1,
  },
  teacherMessageBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F2F3FF',
  },
  teacherMessageText: {
    fontSize: 13,
    color: '#131B2E',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  teacherActionRow: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  replyTeacherBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  replyTeacherIcon: {
    fontSize: 14,
  },
  replyTeacherBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* LINGUISTIC CAPSULE */
  linguisticCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  linguisticLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  flagCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  flagEmoji: {
    fontSize: 18,
  },
  linguisticTextCol: {
    flex: 1,
  },
  linguisticTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1A73E8',
    letterSpacing: 0.8,
  },
  linguisticWord: {
    fontSize: 13,
    fontWeight: '600',
    color: '#131B2E',
    marginTop: 1,
  },
  linguisticItalic: {
    fontStyle: 'italic',
    fontWeight: '800',
    color: colors.primary,
  },
  linguisticLevelPill: {
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  linguisticLevelText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#005F2E',
  },

  /* TABLERO (SCREEN 01) STYLES */
  greenTitleDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.primary,
  },
  sectionLinkGreen: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  eventsScrollContainer: {
    gap: 12,
    paddingVertical: 4,
  },
  eventCardCelebration: {
    backgroundColor: '#FEF9C3',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE047',
    justifyContent: 'space-between',
    minHeight: 140,
  },
  eventCardMeeting: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    justifyContent: 'space-between',
    minHeight: 140,
  },
  eventCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  celebrationPill: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  celebrationPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#854D0E',
    letterSpacing: 0.5,
  },
  meetingPill: {
    backgroundColor: '#D1E4FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  meetingPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00497C',
    letterSpacing: 0.5,
  },
  eventIconCircleYellow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventIconCircleBlue: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventEmoji: {
    fontSize: 16,
  },
  eventCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#131B2E',
    lineHeight: 19,
  },
  eventDatePill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginTop: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  eventDateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#131B2E',
  },

  /* DUAL CARDS */
  dualSectionWrap: {
    gap: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#475569',
    marginTop: 1,
  },
  dualGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  dualCardRed: {
    flex: 1,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 16,
    padding: 14,
    justifyContent: 'space-between',
    minHeight: 130,
  },
  dualCardBlue: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 16,
    padding: 14,
    justifyContent: 'space-between',
    minHeight: 130,
  },
  dualIconBoxRed: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dualIconBoxBlue: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dualIconText: {
    fontSize: 17,
  },
  dualCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#131B2E',
  },
  dualCardDate: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  dualBadgeContainer: {
    marginTop: 8,
  },
  dualBadgeWhiteRed: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 9999,
    alignItems: 'center',
  },
  dualBadgeWhiteRedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9F1239',
  },
  dualBadgeWhiteBlue: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 9999,
    alignItems: 'center',
  },
  dualBadgeWhiteBlueText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1A73E8',
  },

  /* GRADES SECTION */
  gradesSectionWrap: {
    gap: 8,
  },
  viewReportLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewReportText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  viewReportArrow: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '800',
  },
  gradeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  gradeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  gradeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gradeBookIcon: {
    fontSize: 22,
  },
  gradeMiniFlag: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    fontSize: 11,
  },
  gradeTextCol: {
    flex: 1,
  },
  gradeSubjectTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#131B2E',
  },
  gradeAssessmentName: {
    fontSize: 12,
    color: '#475569',
    marginTop: 1,
  },
  gradeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  gradePeriodBadge: {
    backgroundColor: '#EAEDFF',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 9999,
  },
  gradePeriodText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
  },
  gradeMetaTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  gradeBadgeRight: {
    alignItems: 'center',
    paddingLeft: 8,
  },
  gradeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 140, 69, 0.2)',
  },
  gradeScoreNumber: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.primary,
  },
  gradeScoreLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#005F2E',
    textTransform: 'uppercase',
    marginTop: 2,
  },

  /* GALLERY WEEK */
  gallerySectionWrap: {
    gap: 8,
  },
  galleryExploreText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  galleryExploreArrow: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '700',
  },
  galleryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  galleryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  galleryImageBoxArt: {
    height: 100,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  galleryImageBoxGarden: {
    height: 100,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  galleryImagePlaceholder: {
    fontSize: 28,
  },
  galleryPhotoCountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(19, 27, 46, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  galleryPhotoCountText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  galleryCardBody: {
    padding: 10,
  },
  galleryCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#131B2E',
  },
  galleryCardTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
});
