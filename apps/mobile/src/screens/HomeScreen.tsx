import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useActiveStudent } from '../context/StudentContext';
import { colors } from '../theme/colors';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { students, setActiveStudent } = useActiveStudent();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Dynamic responsive dimensions
  const isSmallScreen = width < 380;
  const topInsetPadding = Math.max(insets.top, 24) + 10;
  const eventCardWidth = Math.min(width * 0.78, 290);
  const studentCardWidth = Math.min(width * 0.74, 275);

  const mateo = students.find((s) => s.educationalLevel === 'INICIAL') || students[0];
  const sofia = students.find((s) => s.educationalLevel === 'PRIMARIA') || students[1] || students[0];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      {/* 1. HERO BANNER INSTITUCIONAL VERDE (#008C45) */}
      <View style={[styles.heroHeader, { paddingTop: topInsetPadding }]}>
        {/* Luces sutiles de fondo */}
        <View style={styles.heroCircleTopRight} />
        <View style={styles.heroCircleBottomLeft} />

        {/* Cabecera Superior: Escudo + Título + Notificaciones y Avatar Familiar */}
        <View style={styles.heroTopRow}>
          <View style={styles.heroBrand}>
            <Image
              source={require('../../assets/logo-colegio.png')}
              style={[styles.heroLogo, isSmallScreen && styles.heroLogoSmall]}
              resizeMode="contain"
            />
            <View style={styles.heroBrandTextCol}>
              <Text
                style={[styles.heroTitle, isSmallScreen && styles.heroTitleSmall]}
                numberOfLines={1}
              >
                Instituto República de Italia
              </Text>
              <Text style={styles.heroBadgeSub}>ENTRE RÍOS · CICLO 2026</Text>
            </View>
          </View>

          <View style={styles.heroActionsRow}>
            {/* Botón Notificaciones con badge rojo */}
            <TouchableOpacity
              style={[styles.notifBtn, isSmallScreen && styles.actionBtnSmall]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Mensajes')}
            >
              <Text style={styles.notifIcon}>🔔</Text>
              <View style={styles.notifRedDot} />
            </TouchableOpacity>

            {/* Avatar Familia López */}
            <View style={[styles.familyAvatar, isSmallScreen && styles.actionBtnSmall]}>
              <Text style={styles.familyAvatarText}>FL</Text>
            </View>
          </View>
        </View>

        {/* Saludo Cálido y Resumen Familiar Multi-Hijo */}
        <View style={styles.heroGreeting}>
          <Text style={[styles.heroHello, isSmallScreen && styles.heroHelloSmall]}>
            ¡Hola, Familia López! 👋
          </Text>
          <View style={styles.heroChildrenSummaryRow}>
            <View style={styles.childPillHeader}>
              <Text style={styles.childPillEmoji}>🧒</Text>
              <Text style={styles.childPillText}>Mateo (Sala 4)</Text>
            </View>
            <View style={styles.childPillHeader}>
              <Text style={styles.childPillEmoji}>👧</Text>
              <Text style={styles.childPillText}>Sofía (4° Grado)</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 2. ESTUDIANTES A CARGO (Tarjetas de Mateo y Sofía en el Tablero) */}
      <View style={styles.floatingStudentsSection}>
        <View style={styles.studentsHeaderRow}>
          <View style={styles.studentsHeaderLeft}>
            <Text style={styles.studentsHeaderTitle}>Estudiantes a cargo</Text>
            <View style={styles.badgeTwoKids}>
              <Text style={styles.badgeTwoKidsText}>2 hijos</Text>
            </View>
          </View>
          <Text style={styles.studentsHeaderHint}>Resumen diario unificado</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.studentsScrollContainer}
          decelerationRate="fast"
          snapToInterval={studentCardWidth + 12}
        >
          {/* Tarjeta Mateo López */}
          <TouchableOpacity
            style={[styles.studentCard, { width: studentCardWidth }]}
            activeOpacity={0.9}
            onPress={() => {
              if (mateo) setActiveStudent(mateo);
            }}
          >
            <View style={styles.studentCardAccentGreen} />

            <View style={styles.studentCardTopRow}>
              <View style={styles.studentAvatarWrap}>
                <View style={styles.studentAvatarCircleGreen}>
                  <Text style={styles.studentAvatarEmoji}>🧒</Text>
                </View>
                <View style={styles.checkBadge}>
                  <Text style={styles.checkBadgeText}>✓</Text>
                </View>
              </View>

              <View style={styles.studentDetailsCol}>
                <View style={styles.studentNameAndRateRow}>
                  <Text style={styles.studentNameText} numberOfLines={1}>
                    Mateo López
                  </Text>
                  <View style={styles.asistBadgeGreen}>
                    <Text style={styles.asistBadgeTextGreen}>96% ASIST.</Text>
                  </View>
                </View>
                <Text style={styles.studentLevelText} numberOfLines={1}>
                  Sala de 4 · Nivel Inicial
                </Text>
              </View>
            </View>

            <View style={styles.studentStatusStrip}>
              <View style={styles.studentStatusLeft}>
                <Text style={styles.statusShiftEmoji}>🏫</Text>
                <Text style={styles.statusShiftText}>Turno Tarde</Text>
              </View>
              <Text style={styles.statusPresentGreen}>PRESENTE HOY</Text>
            </View>
          </TouchableOpacity>

          {/* Tarjeta Sofía López */}
          <TouchableOpacity
            style={[styles.studentCard, { width: studentCardWidth }]}
            activeOpacity={0.9}
            onPress={() => {
              if (sofia) setActiveStudent(sofia);
            }}
          >
            <View style={styles.studentCardAccentCeleste} />

            <View style={styles.studentCardTopRow}>
              <View style={styles.studentAvatarWrap}>
                <View style={styles.studentAvatarCircleCeleste}>
                  <Text style={styles.studentAvatarEmoji}>👧</Text>
                </View>
                <View style={styles.checkBadge}>
                  <Text style={styles.checkBadgeText}>✓</Text>
                </View>
              </View>

              <View style={styles.studentDetailsCol}>
                <View style={styles.studentNameAndRateRow}>
                  <Text style={styles.studentNameText} numberOfLines={1}>
                    Sofía López
                  </Text>
                  <View style={styles.asistBadgeCeleste}>
                    <Text style={styles.asistBadgeTextCeleste}>98% ASIST.</Text>
                  </View>
                </View>
                <Text style={styles.studentLevelText} numberOfLines={1}>
                  4° Grado "B" · Primaria
                </Text>
              </View>
            </View>

            <View style={styles.studentStatusStrip}>
              <View style={styles.studentStatusLeft}>
                <Text style={styles.statusShiftEmoji}>🏫</Text>
                <Text style={styles.statusShiftText}>Turno Mañana</Text>
              </View>
              <Text style={styles.statusPresentGreen}>PRESENTE HOY</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 3. CONTENIDO DEL TABLERO UNIFICADO */}
      <View style={styles.contentBody}>
        {/* SECCIÓN 1: PRÓXIMOS EVENTOS (Distinguidos por hijo) */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithDot}>
              <Text style={styles.sectionTitle}>Próximos eventos</Text>
              <View style={styles.greenTitleDot} />
            </View>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.sectionLinkGreen}>Ver calendario ›</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsScrollContainer}
            decelerationRate="fast"
            snapToInterval={eventCardWidth + 12}
          >
            {/* Evento 1: Para Mateo (Jardín) */}
            <View style={[styles.eventCardCelebration, { width: eventCardWidth }]}>
              <View>
                <View style={styles.eventCardTopRow}>
                  <View style={styles.eventChildBadgeMateo}>
                    <Text style={styles.eventChildTextMateo}>🧒 Mateo · Sala de 4</Text>
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

            {/* Evento 2: Para Sofía (Primaria) */}
            <View style={[styles.eventCardMeeting, { width: eventCardWidth }]}>
              <View>
                <View style={styles.eventCardTopRow}>
                  <View style={styles.eventChildBadgeSofia}>
                    <Text style={styles.eventChildTextSofia}>👧 Sofía · 4° Grado</Text>
                  </View>
                  <View style={styles.eventIconCircleBlue}>
                    <Text style={styles.eventEmoji}>🏃‍♀️</Text>
                  </View>
                </View>
                <Text style={styles.eventCardTitle} numberOfLines={2}>
                  Torneo Intercolegial de Atletismo y Postas
                </Text>
              </View>
              <View style={styles.eventDatePill}>
                <Text style={styles.eventDateText}>📅 Jueves, 12 Noviembre</Text>
              </View>
            </View>

            {/* Evento 3: Toda la Familia */}
            <View style={[styles.eventCardGeneral, { width: eventCardWidth }]}>
              <View>
                <View style={styles.eventCardTopRow}>
                  <View style={styles.eventChildBadgeFamily}>
                    <Text style={styles.eventChildTextFamily}>👨‍👩‍👧‍👦 Toda la Familia</Text>
                  </View>
                  <View style={styles.eventIconCircleGreen}>
                    <Text style={styles.eventEmoji}>🏫</Text>
                  </View>
                </View>
                <Text style={styles.eventCardTitle} numberOfLines={2}>
                  Reunión de Padres y Balance Pedagógico
                </Text>
              </View>
              <View style={styles.eventDatePill}>
                <Text style={styles.eventDateText}>📅 Martes, 17 Noviembre</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* SECCIÓN 2: "¿QUÉ HA PASADO HOY?" (Estado de ambos chicos con flexWrap) */}
        <View style={styles.sectionWrap}>
          <View>
            <Text style={styles.sectionTitle}>¿Qué ha pasado hoy?</Text>
            <Text style={styles.sectionSubtitle}>
              Asistencia y novedades del día para Mateo y Sofía
            </Text>
          </View>

          <View style={styles.dualGrid}>
            {/* Card Mateo: Tardanza */}
            <View style={styles.dualCardMateo}>
              <View>
                <View style={styles.dualCardHeaderChild}>
                  <View style={styles.kidTagMateo}>
                    <Text style={styles.kidTagTextMateo}>🧒 Mateo</Text>
                  </View>
                  <Text style={styles.dualDateText}>13:10 hs</Text>
                </View>
                <Text style={styles.dualCardTitle}>Falta parcial</Text>
                <Text style={styles.dualCardSub} numberOfLines={2}>
                  Ingreso posterior al horario
                </Text>
              </View>
              <View style={styles.dualBadgeContainer}>
                <View style={styles.badgeTardanza}>
                  <Text style={styles.badgeTardanzaText}>Tardanza (1/4)</Text>
                </View>
              </View>
            </View>

            {/* Card Sofía: Asistencia Completa */}
            <View style={styles.dualCardSofia}>
              <View>
                <View style={styles.dualCardHeaderChild}>
                  <View style={styles.kidTagSofia}>
                    <Text style={styles.kidTagTextSofia}>👧 Sofía</Text>
                  </View>
                  <Text style={styles.dualDateText}>07:45 hs</Text>
                </View>
                <Text style={styles.dualCardTitle}>Puntual</Text>
                <Text style={styles.dualCardSub} numberOfLines={2}>
                  Ingreso registrado en puerta
                </Text>
              </View>
              <View style={styles.dualBadgeContainer}>
                <View style={styles.badgePresentePuntual}>
                  <Text style={styles.badgePresentePuntualText}>Presente ✓</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* SECCIÓN 3: CALIFICACIONES Y BOLETINES RECIENTES */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Calificaciones y Boletines</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Archivos')}
              style={styles.viewReportLink}
            >
              <Text style={styles.viewReportText}>Ver boletines</Text>
              <Text style={styles.viewReportArrow}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gradesStack}>
            {/* Calificación Mateo: Lengua Italiana */}
            <View style={styles.gradeCard}>
              <View style={styles.gradeLeft}>
                <View style={styles.gradeIconBoxGreen}>
                  <Text style={styles.gradeBookEmoji}>📖</Text>
                  <Text style={styles.gradeFlagEmoji}>🇮🇹</Text>
                </View>
                <View style={styles.gradeTextCol}>
                  <View style={styles.gradeChildTagRow}>
                    <View style={styles.kidTagMateo}>
                      <Text style={styles.kidTagTextMateo}>🧒 Mateo · Sala de 4</Text>
                    </View>
                    <Text style={styles.gradeTimeText}>Ayer, 11:30</Text>
                  </View>
                  <Text style={styles.gradeSubjectTitle} numberOfLines={1}>
                    Lengua y Cultura Italiana
                  </Text>
                  <Text style={styles.gradeAssessmentName} numberOfLines={1}>
                    Examen trimestral oral: Tradizioni e Famiglia
                  </Text>
                </View>
              </View>

              <View style={styles.gradeScoreBadgeCol}>
                <View style={styles.gradeScoreCircleGreen}>
                  <Text style={styles.gradeScoreNum}>9.8</Text>
                </View>
                <Text style={styles.gradeScoreLabelGreen}>Sobresaliente</Text>
              </View>
            </View>

            {/* Calificación Sofía: Matemática */}
            <View style={styles.gradeCard}>
              <View style={styles.gradeLeft}>
                <View style={styles.gradeIconBoxBlue}>
                  <Text style={styles.gradeBookEmoji}>📐</Text>
                  <Text style={styles.gradeFlagEmoji}>🇦🇷</Text>
                </View>
                <View style={styles.gradeTextCol}>
                  <View style={styles.gradeChildTagRow}>
                    <View style={styles.kidTagSofia}>
                      <Text style={styles.kidTagTextSofia}>👧 Sofía · 4° Grado "B"</Text>
                    </View>
                    <Text style={styles.gradeTimeText}>Hace 2 días</Text>
                  </View>
                  <Text style={styles.gradeSubjectTitle} numberOfLines={1}>
                    Matemática y Geometría
                  </Text>
                  <Text style={styles.gradeAssessmentName} numberOfLines={1}>
                    Evaluación Escrita: Fracciones y Ángulos
                  </Text>
                </View>
              </View>

              <View style={styles.gradeScoreBadgeCol}>
                <View style={styles.gradeScoreCircleBlue}>
                  <Text style={styles.gradeScoreNumBlue}>9.5</Text>
                </View>
                <Text style={styles.gradeScoreLabelBlue}>Distinguido</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECCIÓN 4: GALERÍA DE LA SEMANA */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Galería de la semana</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Galería')}
              style={styles.viewReportLink}
            >
              <Text style={styles.galleryExploreText}>Explorar todas</Text>
              <Text style={styles.galleryExploreArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.galleryGrid}>
            {/* Album Mateo */}
            <TouchableOpacity
              style={styles.galleryCard}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('Galería')}
            >
              <View style={styles.galleryImageBoxArt}>
                <Text style={styles.galleryPlaceholderEmoji}>🎨🖼️</Text>
                <View style={styles.galleryPhotoBadge}>
                  <Text style={styles.galleryPhotoBadgeText}>📷 18</Text>
                </View>
                <View style={styles.galleryChildPill}>
                  <Text style={styles.galleryChildPillText}>🧒 Mateo</Text>
                </View>
              </View>
              <View style={styles.galleryCardBody}>
                <Text style={styles.galleryCardTitle} numberOfLines={1}>
                  Taller Expresión Artística
                </Text>
                <Text style={styles.galleryCardSubtitle}>Sala de 4 · Hace 2 días</Text>
              </View>
            </TouchableOpacity>

            {/* Album Sofía */}
            <TouchableOpacity
              style={styles.galleryCard}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('Galería')}
            >
              <View style={styles.galleryImageBoxGarden}>
                <Text style={styles.galleryPlaceholderEmoji}>🌱🌻</Text>
                <View style={styles.galleryPhotoBadge}>
                  <Text style={styles.galleryPhotoBadgeText}>📷 24</Text>
                </View>
                <View style={styles.galleryChildPill}>
                  <Text style={styles.galleryChildPillText}>👧 Sofía</Text>
                </View>
              </View>
              <View style={styles.galleryCardBody}>
                <Text style={styles.galleryCardTitle} numberOfLines={1}>
                  Huerta Escolar y Ciencias
                </Text>
                <Text style={styles.galleryCardSubtitle}>4° Grado · Hace 3 días</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECCIÓN 5: ACCESOS RÁPIDOS INSTITUCIONALES */}
        <View style={styles.quickAccessSection}>
          <TouchableOpacity
            style={styles.quickActionBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Seguridad')}
          >
            <View style={styles.quickActionIconCircleGreen}>
              <Text style={styles.quickActionEmoji}>🛡️</Text>
            </View>
            <View style={styles.quickActionTextCol}>
              <Text style={styles.quickActionTitle}>Pases QR de Puerta</Text>
              <Text style={styles.quickActionSub}>
                Habilitar retiros para Mateo o Sofía
              </Text>
            </View>
            <Text style={styles.quickActionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Archivos')}
          >
            <View style={styles.quickActionIconCircleRed}>
              <Text style={styles.quickActionEmoji}>✍️</Text>
            </View>
            <View style={styles.quickActionTextCol}>
              <Text style={styles.quickActionTitle}>Autorización Pendiente</Text>
              <Text style={styles.quickActionSubRed}>
                Salida Museo Provincial (Firma PIN)
              </Text>
            </View>
            <Text style={styles.quickActionArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Espaciado de cortesía para el scroll */}
      <View style={{ height: 36 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },

  /* 1. HERO BANNER */
  heroHeader: {
    backgroundColor: colors.primary,
    paddingBottom: 36,
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
    gap: 8,
  },
  heroBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  heroLogo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 2,
  },
  heroLogoSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  heroBrandTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroTitleSmall: {
    fontSize: 13,
  },
  heroBadgeSub: {
    fontSize: 9.5,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.8,
    marginTop: 1,
  },
  heroActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notifBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  actionBtnSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  notifIcon: {
    fontSize: 16,
  },
  notifRedDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.coral,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  familyAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    fontSize: 12,
    fontWeight: '900',
    color: colors.primary,
  },
  heroGreeting: {
    marginTop: 16,
    zIndex: 10,
  },
  heroHello: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  heroHelloSmall: {
    fontSize: 19,
  },
  heroChildrenSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  childPillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  childPillEmoji: {
    fontSize: 13,
  },
  childPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* 2. ESTUDIANTES A CARGO */
  floatingStudentsSection: {
    marginTop: -22,
    zIndex: 20,
  },
  studentsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 4,
  },
  studentsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  studentsHeaderTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#131B2E',
  },
  badgeTwoKids: {
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  badgeTwoKidsText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#005F2E',
  },
  studentsHeaderHint: {
    fontSize: 11,
    color: '#64748B',
  },
  studentsScrollContainer: {
    paddingHorizontal: 16,
    gap: 12,
    paddingVertical: 2,
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  studentCardAccentGreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.primary,
  },
  studentCardAccentCeleste: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#1A73E8',
  },
  studentCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  studentAvatarWrap: {
    position: 'relative',
  },
  studentAvatarCircleGreen: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  studentAvatarCircleCeleste: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  studentAvatarEmoji: {
    fontSize: 22,
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  checkBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  studentDetailsCol: {
    flex: 1,
  },
  studentNameAndRateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  studentNameText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#131B2E',
    flexShrink: 1,
  },
  asistBadgeGreen: {
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  asistBadgeTextGreen: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#005F2E',
  },
  asistBadgeCeleste: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  asistBadgeTextCeleste: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1A73E8',
  },
  studentLevelText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  studentStatusStrip: {
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusShiftEmoji: {
    fontSize: 12,
  },
  statusShiftText: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '500',
  },
  statusPresentGreen: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#005F2E',
    letterSpacing: 0.5,
  },

  /* 3. CONTENT BODY */
  contentBody: {
    paddingHorizontal: 16,
    gap: 18,
    marginTop: 16,
  },
  sectionWrap: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleWithDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#131B2E',
  },
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
  sectionSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },

  /* EVENT CARDS */
  eventsScrollContainer: {
    gap: 12,
    paddingVertical: 2,
  },
  eventCardCelebration: {
    backgroundColor: '#FEF9C3',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE047',
    justifyContent: 'space-between',
    minHeight: 140,
  },
  eventCardMeeting: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    justifyContent: 'space-between',
    minHeight: 140,
  },
  eventCardGeneral: {
    backgroundColor: '#E8F7EE',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    justifyContent: 'space-between',
    minHeight: 140,
  },
  eventCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventChildBadgeMateo: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 9999,
  },
  eventChildTextMateo: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#854D0E',
  },
  eventChildBadgeSofia: {
    backgroundColor: '#D1E4FF',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 9999,
  },
  eventChildTextSofia: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#00497C',
  },
  eventChildBadgeFamily: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 9999,
  },
  eventChildTextFamily: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#065F46',
  },
  eventIconCircleYellow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventIconCircleBlue: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventIconCircleGreen: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventEmoji: {
    fontSize: 15,
  },
  eventCardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#131B2E',
    lineHeight: 18,
  },
  eventDatePill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  eventDateText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#131B2E',
  },

  /* DUAL CARDS (HOY) */
  dualGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  dualCardMateo: {
    flex: 1,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 16,
    padding: 12,
    justifyContent: 'space-between',
    minHeight: 135,
  },
  dualCardSofia: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 16,
    padding: 12,
    justifyContent: 'space-between',
    minHeight: 135,
  },
  dualCardHeaderChild: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    flexWrap: 'wrap',
    gap: 4,
  },
  kidTagMateo: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  kidTagTextMateo: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#9F1239',
  },
  kidTagSofia: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  kidTagTextSofia: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1E40AF',
  },
  dualDateText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  dualCardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#131B2E',
  },
  dualCardSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 14,
  },
  dualBadgeContainer: {
    marginTop: 8,
  },
  badgeTardanza: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 9999,
    alignItems: 'center',
  },
  badgeTardanzaText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#9F1239',
  },
  badgePresentePuntual: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 9999,
    alignItems: 'center',
  },
  badgePresentePuntualText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1A73E8',
  },

  /* GRADES STACK */
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
  gradesStack: {
    gap: 10,
  },
  gradeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
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
    marginRight: 6,
  },
  gradeIconBoxGreen: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gradeIconBoxBlue: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gradeBookEmoji: {
    fontSize: 20,
  },
  gradeFlagEmoji: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    fontSize: 10,
  },
  gradeTextCol: {
    flex: 1,
  },
  gradeChildTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  gradeTimeText: {
    fontSize: 9.5,
    color: '#94A3B8',
  },
  gradeSubjectTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#131B2E',
  },
  gradeAssessmentName: {
    fontSize: 11.5,
    color: '#475569',
    marginTop: 1,
  },
  gradeScoreBadgeCol: {
    alignItems: 'center',
    minWidth: 50,
  },
  gradeScoreCircleGreen: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 140, 69, 0.2)',
  },
  gradeScoreCircleBlue: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(26, 115, 232, 0.2)',
  },
  gradeScoreNum: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.primary,
  },
  gradeScoreNumBlue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1A73E8',
  },
  gradeScoreLabelGreen: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#005F2E',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  gradeScoreLabelBlue: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#1E40AF',
    textTransform: 'uppercase',
    marginTop: 2,
  },

  /* GALLERY SECTION */
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
    gap: 10,
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
  galleryPlaceholderEmoji: {
    fontSize: 26,
  },
  galleryPhotoBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(19, 27, 46, 0.7)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 9999,
  },
  galleryPhotoBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  galleryChildPill: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 9999,
  },
  galleryChildPillText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#131B2E',
  },
  galleryCardBody: {
    padding: 10,
  },
  galleryCardTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#131B2E',
  },
  galleryCardSubtitle: {
    fontSize: 9.5,
    color: '#94A3B8',
    marginTop: 2,
  },

  /* QUICK ACCESS */
  quickAccessSection: {
    gap: 10,
  },
  quickActionBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  quickActionIconCircleGreen: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  quickActionIconCircleRed: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  quickActionEmoji: {
    fontSize: 17,
  },
  quickActionTextCol: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#131B2E',
  },
  quickActionSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  quickActionSubRed: {
    fontSize: 11,
    color: '#9F1239',
    fontWeight: '600',
    marginTop: 1,
  },
  quickActionArrow: {
    fontSize: 18,
    color: '#94A3B8',
    fontWeight: '700',
    marginLeft: 6,
  },
});
