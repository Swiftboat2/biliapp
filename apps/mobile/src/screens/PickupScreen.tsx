import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useActiveStudent } from '../context/StudentContext';
import { Icon } from '../components/Icon';

interface AuthorizedPerson {
  id: string;
  name: string;
  role: string;
  dni: string;
  phone: string;
  badge: 'PERMANENTE' | 'HABILITADA' | 'EVENTUAL';
  avatarEmoji: string;
}

export const PickupScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;
  const topInsetPadding = Math.max(insets.top, 24) + 10;
  const qrSize = Math.min(width * 0.44, 160);

  const { students, activeStudent, setActiveStudent } = useActiveStudent();

  // Dynamic QR countdown timer
  const [secondsLeft, setSecondsLeft] = useState(58);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Modal for Exceptional Pickup Authorization
  const [modalVisible, setModalVisible] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authDni, setAuthDni] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authRelationship, setAuthRelationship] = useState('');

  const [authorizedPeople, setAuthorizedPeople] = useState<AuthorizedPerson[]>([
    {
      id: 'p1',
      name: 'Laura Gómez',
      role: 'Madre',
      dni: '34.567.890',
      phone: '343-5123984',
      badge: 'PERMANENTE',
      avatarEmoji: '👩',
    },
    {
      id: 'p2',
      name: 'Martín López',
      role: 'Padre',
      dni: '33.123.456',
      phone: '343-4902111',
      badge: 'PERMANENTE',
      avatarEmoji: '👨',
    },
    {
      id: 'p3',
      name: 'Beatriz Rossi',
      role: 'Abuela',
      dni: '14.890.123',
      phone: '343-4567890',
      badge: 'HABILITADA',
      avatarEmoji: '👵',
    },
  ]);

  const handleCreateExceptionalAuth = () => {
    if (!authName || !authDni || !authRelationship) {
      Alert.alert(
        'Datos incompletos',
        'Por favor completa nombre, DNI y parentesco para autorizar el retiro excepcional.'
      );
      return;
    }

    const newPerson: AuthorizedPerson = {
      id: `p-${Date.now()}`,
      name: authName,
      role: authRelationship,
      dni: authDni,
      phone: authPhone || 'Sin teléfono',
      badge: 'EVENTUAL',
      avatarEmoji: '👤',
    };

    setAuthorizedPeople((prev) => [newPerson, ...prev]);
    setModalVisible(false);
    setAuthName('');
    setAuthDni('');
    setAuthPhone('');
    setAuthRelationship('');

    Alert.alert(
      'Autorización generada con éxito',
      `Se habilitó a ${authName} para el retiro de hoy con DNI ${authDni}. Portería ya tiene la credencial en su terminal.`
    );
  };

  const isMateo = activeStudent?.educationalLevel === 'INICIAL';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. HERO BANNER INSTITUCIONAL (#008C45) */}
      <View style={[styles.heroBanner, { paddingTop: topInsetPadding }]}>
        {/* Decorative Circles */}
        <View style={styles.heroCircle1} />
        <View style={styles.heroCircle2} />

        {/* Top Header Row */}
        <View style={styles.heroTopRow}>
          <View style={styles.heroBrandLeft}>
            <Image
              source={require('../../assets/logo-colegio.png')}
              style={[styles.heroLogo, isSmallScreen && styles.heroLogoSmall]}
              resizeMode="contain"
            />
            <View style={styles.brandTitleCol}>
              <Text
                style={[styles.heroTitle, isSmallScreen && styles.heroTitleSmall]}
                numberOfLines={1}
              >
                Instituto República de Italia
              </Text>
              <Text style={styles.heroSubtitle}>ENTRE RÍOS · CICLO 2026</Text>
            </View>
          </View>

          <View style={styles.heroActionsRight}>
            <View style={[styles.notifBtn, isSmallScreen && styles.actionBtnSmall]}>
              <Icon name="notificaciones" size={19} color="#FFFFFF" />
              <View style={styles.notifRedDot} />
            </View>
            <View style={[styles.familyAvatar, isSmallScreen && styles.actionBtnSmall]}>
              <Text style={styles.familyAvatarText}>FL</Text>
            </View>
          </View>
        </View>

        {/* Title and Context Tag */}
        <View style={styles.heroTextSection}>
          <View style={styles.heroContextPill}>
            <Icon name="candado" size={12} color="#FFFFFF" />
            <Text style={styles.heroContextText}>
              CONTROL DE ACCESO Y PUERTA
            </Text>
          </View>
          <Text style={[styles.heroMainTitle, isSmallScreen && styles.heroMainTitleSmall]}>
            Seguridad y Retiros
          </Text>
          <Text style={styles.heroMainSubtitle}>
            Credenciales digitales, autorizaciones extraordinarias y registro de puerta.
          </Text>
        </View>
      </View>

      {/* BODY CONTENT */}
      <View style={styles.bodyContent}>
        {/* 2. SELECTOR DE ESTUDIANTE SEGMENTADO */}
        <View style={styles.segmentContainer}>
          <View style={styles.segmentBackground}>
            {students.map((student) => {
              const isSelected = activeStudent?.id === student.id;
              const isKinder = student.educationalLevel === 'INICIAL';
              return (
                <TouchableOpacity
                  key={student.id}
                  style={[
                    styles.segmentBtn,
                    isSelected && styles.segmentBtnActive,
                  ]}
                  onPress={() => setActiveStudent(student)}
                  activeOpacity={0.88}
                >
                  <Text style={styles.segmentIcon}>
                    {isKinder ? '🧒' : '👧'}
                  </Text>
                  <Text
                    style={[
                      styles.segmentText,
                      isSelected && styles.segmentTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {student.firstName} ({isKinder ? 'Sala 4' : '2° "A"'})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 3. TARJETA PRINCIPAL: PASE DIGITAL DE RETIRO / QR SEGURO */}
        <View style={styles.qrCard}>
          {/* Top Accent Gradient Bar */}
          <View style={styles.qrTopAccent} />

          {/* Student Header */}
          <View style={styles.qrStudentHeader}>
            <View style={styles.qrStudentLeft}>
              <View style={styles.qrAvatarBox}>
                <Text style={styles.qrAvatarEmoji}>
                  {isMateo ? '🧒' : '👧'}
                </Text>
                <View style={styles.qrAvatarCheck}>
                  <Icon name="check" size={9} color="#FFFFFF" />
                </View>
              </View>

              <View style={styles.qrStudentDetails}>
                <View style={styles.qrStudentNameRow}>
                  <Text style={styles.qrStudentName}>
                    {activeStudent?.firstName} {activeStudent?.lastName}
                  </Text>
                  <View style={styles.qrActiveBadge}>
                    <Text style={styles.qrActiveBadgeText}>ACTIVO</Text>
                  </View>
                </View>
                <Text style={styles.qrStudentMatricula}>
                  Matrícula: {isMateo ? '2026-INI-0428' : '2026-PRI-0891'} • Turno{' '}
                  {isMateo ? 'Tarde' : 'Mañana'}
                </Text>
              </View>
            </View>

            <View style={styles.qrStatusRight}>
              <Text style={styles.qrPassLabel}>Pase QR</Text>
              <View style={styles.pulseContainer}>
                <View style={styles.pingCircle} />
                <View style={styles.dotCircle} />
              </View>
            </View>
          </View>

          {/* ÁREA GRÁFICA DEL CÓDIGO QR DINÁMICO */}
          <View style={styles.qrGraphicContainer}>
            <View style={styles.qrGraphicWhiteBox}>
              {/* QR Code Mockup with Corner Positioners & Center Crest */}
              <View style={[styles.qrCodeMatrix, { width: qrSize, height: qrSize }]}>
                <View style={styles.qrCornerTL}>
                  <View style={styles.qrCornerInner} />
                </View>
                <View style={styles.qrCornerTR}>
                  <View style={styles.qrCornerInner} />
                </View>
                <View style={styles.qrCornerBL}>
                  <View style={styles.qrCornerInner} />
                </View>

                {/* Central Emblem Badge */}
                <View style={styles.qrCenterBadge}>
                  <Icon name="pase-qr" size={20} color={colors.primary} />
                </View>

                {/* Simulated Data Dots */}
                <View style={styles.qrDotsGrid}>
                  <Text style={styles.qrDotsSymbol}>▚ ▞ ▚ ▞ ▚</Text>
                  <Text style={styles.qrDotsSymbol}>▞ ▚ ▞ ▚ ▞</Text>
                  <Text style={styles.qrDotsSymbol}>▚ ▞ ▚ ▞ ▚</Text>
                </View>
              </View>

              <View style={styles.qrHashRow}>
                <Icon name="candado" size={12} color="#64748B" />
                <Text style={styles.qrHashText}>
                  TOKEN CRIPTOGRÁFICO SHA-256 SEGURO
                </Text>
              </View>
            </View>

            {/* Timer and Expiration */}
            <View style={styles.qrTimerRow}>
              <View style={styles.qrValidUntilCol}>
                <Icon name="historial" size={13} color="#475569" />
                <Text style={styles.qrValidText}>
                  Válido hasta: <Text style={styles.qrValidBold}>17:45 hs</Text>
                </Text>
              </View>

              <View style={styles.qrRefreshCol}>
                <Icon name="historial" size={12} color="#94A3B8" />
                <Text style={styles.qrRefreshText}>
                  Actualiza en {secondsLeft}s
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons: Compartir y Pantalla Completa */}
          <View style={styles.qrActionButtonsRow}>
            <TouchableOpacity
              style={styles.btnShareQr}
              activeOpacity={0.85}
              onPress={() =>
                Alert.alert(
                  'Compartir Código QR',
                  'Se generó el enlace temporal cifrado para enviar por WhatsApp a la persona de confianza.'
                )
              }
            >
              <Icon name="compartir" size={14} color="#1A73E8" />
              <Text style={styles.btnShareText}>Compartir código</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnFullscreenQr}
              activeOpacity={0.85}
              onPress={() =>
                Alert.alert(
                  'Pantalla Completa',
                  'Brillo de pantalla al 100% para escaneo rápido en la barrera de salida.'
                )
              }
            >
              <Icon name="pantalla-completa" size={14} color="#334155" />
              <Text style={styles.btnFullscreenText}>Pantalla completa</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. BOTÓN DE ACCIÓN DESTACADO: AUTORIZAR RETIRO EXCEPCIONAL */}
        <TouchableOpacity
          style={styles.exceptionalActionCard}
          activeOpacity={0.88}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.exceptionalLeftRow}>
            <View style={styles.exceptionalIconCircle}>
              <Icon name="guardia" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.exceptionalTextCol}>
              <Text style={styles.exceptionalTitle}>
                Autorizar retiro excepcional
              </Text>
              <Text style={styles.exceptionalSubtitle}>
                Habilita a una persona puntual solo por el día de hoy
              </Text>
            </View>
          </View>
          <Text style={styles.exceptionalArrow}>›</Text>
        </TouchableOpacity>

        {/* 5. AUTORIZADOS HABITUALES (Nómina) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithCount}>
              <Text style={styles.sectionTitle}>Autorizados Habituales</Text>
              <View style={styles.peopleCountBadge}>
                <Text style={styles.peopleCountText}>
                  {authorizedPeople.length} personas
                </Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert(
                  'Gestión de Nómina',
                  'Para modificar tutores permanentes o medidas de tenencia legal, contacte a Dirección.'
                )
              }
            >
              <Text style={styles.sectionLinkBlue}>Gestionar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.peopleList}>
            {authorizedPeople.map((person) => (
              <View key={person.id} style={styles.personRowCard}>
                <View style={styles.personLeft}>
                  <View style={styles.personAvatarBox}>
                    <Text style={styles.personAvatarEmoji}>
                      {person.avatarEmoji}
                    </Text>
                  </View>
                  <View style={styles.personTextCol}>
                    <View style={styles.personNameRow}>
                      <Text style={styles.personName}>{person.name}</Text>
                      <View style={styles.personRolePill}>
                        <Text style={styles.personRolePillText}>
                          {person.role}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.personDni}>
                      DNI {person.dni} • Tel: {person.phone}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.personBadge,
                    person.badge === 'PERMANENTE'
                      ? styles.personBadgeGreen
                      : styles.personBadgeAmber,
                  ]}
                >
                  <Text
                    style={[
                      styles.personBadgeText,
                      person.badge === 'PERMANENTE'
                        ? styles.personBadgeTextGreen
                        : styles.personBadgeTextAmber,
                    ]}
                  >
                    {person.badge}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 6. HISTORIAL DE PUERTA (TIMELINE VERTICAL) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithCount}>
              <Icon name="historial" size={17} color="#131B2E" />
              <Text style={styles.sectionTitle}>Historial de Puerta</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert(
                  'Historial Completo',
                  'Mostrando todos los registros de ingreso y egreso con verificación biométrica y QR.'
                )
              }
            >
              <Text style={styles.sectionLinkBlue}>Ver histórico</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.historyTimeline}>
            <View style={styles.historyVerticalLine} />

            {/* Evento 1: Ingreso Hoy */}
            <View style={styles.historyItem}>
              <View style={styles.historyEntryNode}>
                <Text style={styles.historyNodeArrow}>⬇️</Text>
              </View>
              <View style={styles.historyContent}>
                <View style={styles.historyTitleRow}>
                  <Text style={styles.historyActionTitle}>
                    Ingreso registrado en portería
                  </Text>
                  <Text style={styles.historyTimeText}>Hoy, 12:45 hs</Text>
                </View>
                <Text style={styles.historyDetailText}>
                  Acceso por Entrada Principal • Registrado por Preceptor Carlos M.
                </Text>
              </View>
            </View>

            {/* Evento 2: Retiro Ayer */}
            <View style={styles.historyItem}>
              <View style={styles.historyExitNode}>
                <Text style={styles.historyNodeArrow}>⬆️</Text>
              </View>
              <View style={styles.historyContent}>
                <View style={styles.historyTitleRow}>
                  <Text style={styles.historyActionTitle}>Retiro efectuado</Text>
                  <Text style={styles.historyTimeText}>Ayer, 16:30 hs</Text>
                </View>
                <Text style={styles.historyDetailText}>
                  Retiró Laura Gómez (Madre) • Puerta Nivel Inicial con escaneo QR.
                </Text>
              </View>
            </View>

            {/* Evento 3: Retiro 24 Octubre */}
            <View style={styles.historyItem}>
              <View style={styles.historyExitNode}>
                <Text style={styles.historyNodeArrow}>⬆️</Text>
              </View>
              <View style={styles.historyContent}>
                <View style={styles.historyTitleRow}>
                  <Text style={styles.historyActionTitle}>
                    Retiro puntual confirmado
                  </Text>
                  <Text style={styles.historyTimeText}>24 Oct, 16:32 hs</Text>
                </View>
                <Text style={styles.historyDetailText}>
                  Retiró Beatriz Rossi (Abuela) • Acreditación DNI y firma conforme.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 7. BANNER DE SEGURIDAD INSTITUCIONAL Y PROTOCOLO */}
        <View style={styles.safetyProtocolCard}>
          <View style={styles.safetyProtocolTop}>
            <View style={styles.safetyShieldCircle}>
              <Icon name="seguridad" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.safetyTextCol}>
              <Text style={styles.safetyProtocolTitle}>
                Protocolo de Seguridad Escolar
              </Text>
              <Text style={styles.safetyProtocolDesc}>
                Ningún menor de edad será entregado sin validación previa del DNI y acreditación en el sistema institucional. En caso de fuerza mayor o dudas de puerta, comuníquese directamente a Portería Central.
              </Text>
            </View>
          </View>

          <View style={styles.safetyActionRow}>
            <TouchableOpacity
              style={styles.callPorteriaBtn}
              activeOpacity={0.85}
              onPress={() =>
                Alert.alert(
                  'Portería Central',
                  'Llamando al interno institucional 104...'
                )
              }
            >
              <Text style={styles.callPhoneIcon}>📞</Text>
              <Text style={styles.callPorteriaBtnText}>
                Llamar a Portería (Int. 104)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Espaciado inferior de cortesía para el scroll */}
      <View style={{ height: 32 }} />

      {/* MODAL: FORMULARIO DE RETIRO EXCEPCIONAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalSheetHeader}>
              <View>
                <Text style={styles.modalSheetTitle}>
                  Autorizar Retiro Excepcional
                </Text>
                <Text style={styles.modalSheetSub}>
                  Válido exclusivamente para la salida del día de hoy
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="cerrar" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalSheetBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>Nombre y Apellido Autorizado:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej: Marcelo Fernández"
                placeholderTextColor="#94A3B8"
                value={authName}
                onChangeText={setAuthName}
              />

              <Text style={styles.fieldLabel}>Número de DNI:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej: 30.123.456"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={authDni}
                onChangeText={setAuthDni}
              />

              <Text style={styles.fieldLabel}>Teléfono de Contacto:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej: 343-5881234"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={authPhone}
                onChangeText={setAuthPhone}
              />

              <Text style={styles.fieldLabel}>Parentesco o Vínculo:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej: Tío / Transporte / Vecino de confianza"
                placeholderTextColor="#94A3B8"
                value={authRelationship}
                onChangeText={setAuthRelationship}
              />

              <View style={styles.legalNoticeBox}>
                <Text style={styles.legalNoticeText}>
                  ⚖️ Como tutor legal de {activeStudent?.firstName}, manifiesto bajo declaración jurada que la persona autorizada cuenta con facultades para el retiro físico y portará su DNI físico.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.btnSubmitExceptional}
                activeOpacity={0.88}
                onPress={handleCreateExceptionalAuth}
              >
                <Text style={styles.btnSubmitExceptionalText}>
                  Emitir Autorización en Portería
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },

  /* HERO BANNER */
  heroBanner: {
    backgroundColor: colors.primary,
    paddingTop: 52,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#005F2E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  heroCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(56, 152, 236, 0.15)',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  heroBrandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  heroLogo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 2,
  },
  heroLogoSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  brandTitleCol: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  heroTitleSmall: {
    fontSize: 13,
  },
  heroSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.8,
  },
  heroActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    fontSize: 17,
  },
  notifRedDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 9,
    height: 9,
    borderRadius: 4.5,
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
  },
  familyAvatarText: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.primary,
  },
  heroTextSection: {
    marginTop: 18,
    zIndex: 10,
  },
  heroContextPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  heroContextIcon: {
    fontSize: 11,
  },
  heroContextText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  heroMainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroMainTitleSmall: {
    fontSize: 19,
  },
  heroMainSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
    fontWeight: '500',
  },

  /* BODY */
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16,
  },

  /* 2. SEGMENTED CONTROL */
  segmentContainer: {
    backgroundColor: '#FFFFFF',
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  segmentBackground: {
    flexDirection: 'row',
    backgroundColor: '#EAEDFF',
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentIcon: {
    fontSize: 15,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  segmentTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },

  /* 3. QR CARD */
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  qrTopAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: colors.primary,
  },
  qrStudentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  qrStudentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  qrAvatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  qrAvatarEmoji: {
    fontSize: 26,
  },
  qrAvatarCheck: {
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
  qrAvatarCheckText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  qrStudentDetails: {
    flex: 1,
  },
  qrStudentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qrStudentName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#131B2E',
  },
  qrActiveBadge: {
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 9999,
  },
  qrActiveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#005F2E',
  },
  qrStudentMatricula: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  qrStatusRight: {
    alignItems: 'flex-end',
  },
  qrPassLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  pulseContainer: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    position: 'relative',
  },
  pingCircle: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(0, 140, 69, 0.3)',
  },
  dotCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },

  /* QR GRAPHIC */
  qrGraphicContainer: {
    marginTop: 16,
    backgroundColor: '#FAF8FF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qrGraphicWhiteBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  qrCodeMatrix: {
    width: 160,
    height: 160,
    borderWidth: 2,
    borderColor: '#131B2E',
    borderRadius: 12,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  qrCornerTL: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 34,
    height: 34,
    borderWidth: 3,
    borderColor: '#131B2E',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCornerTR: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 34,
    height: 34,
    borderWidth: 3,
    borderColor: '#131B2E',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCornerBL: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 34,
    height: 34,
    borderWidth: 3,
    borderColor: '#131B2E',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCornerInner: {
    width: 14,
    height: 14,
    backgroundColor: '#131B2E',
    borderRadius: 2,
  },
  qrCenterBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    zIndex: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  qrCenterBadgeText: {
    fontSize: 16,
  },
  qrDotsGrid: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.45,
  },
  qrDotsSymbol: {
    fontSize: 16,
    color: '#131B2E',
    letterSpacing: 2,
  },
  qrHashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  qrHashIcon: {
    fontSize: 11,
  },
  qrHashText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  qrTimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
    paddingHorizontal: 8,
  },
  qrValidUntilCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  qrTimerIcon: {
    fontSize: 14,
  },
  qrValidText: {
    fontSize: 12,
    color: '#475569',
  },
  qrValidBold: {
    fontWeight: '800',
    color: '#131B2E',
  },
  qrRefreshCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  qrSyncIcon: {
    fontSize: 12,
  },
  qrRefreshText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },

  /* QR Action Buttons */
  qrActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  btnShareQr: {
    flex: 1,
    minWidth: 130,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnShareIcon: {
    fontSize: 14,
  },
  btnShareText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A73E8',
  },
  btnFullscreenQr: {
    flex: 1,
    minWidth: 130,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnFullscreenIcon: {
    fontSize: 14,
  },
  btnFullscreenText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },

  /* 4. EXCEPTIONAL ACTION CARD */
  exceptionalActionCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#005F2E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  exceptionalLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  exceptionalIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exceptionalIconText: {
    fontSize: 18,
  },
  exceptionalTextCol: {
    flex: 1,
  },
  exceptionalTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  exceptionalSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  exceptionalArrow: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  /* 5. NÓMINA AUTORIZADOS */
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleWithCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#131B2E',
  },
  peopleCountBadge: {
    backgroundColor: '#EAEDFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  peopleCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  sectionLinkBlue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A73E8',
  },
  peopleList: {
    gap: 10,
  },
  personRowCard: {
    backgroundColor: '#FAF8FF',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  personLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  personAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  personAvatarEmoji: {
    fontSize: 20,
  },
  personTextCol: {
    flex: 1,
  },
  personNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  personName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#131B2E',
  },
  personRolePill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 9999,
  },
  personRolePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1A73E8',
  },
  personDni: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  personBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    marginLeft: 6,
  },
  personBadgeGreen: {
    backgroundColor: '#E8F7EE',
  },
  personBadgeAmber: {
    backgroundColor: '#FEF3C7',
  },
  personBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  personBadgeTextGreen: {
    color: '#005F2E',
  },
  personBadgeTextAmber: {
    color: '#B45309',
  },

  /* 6. HISTORIAL DE PUERTA */
  historyIcon: {
    fontSize: 16,
  },
  historyTimeline: {
    position: 'relative',
    paddingLeft: 24,
    gap: 16,
    marginTop: 6,
  },
  historyVerticalLine: {
    position: 'absolute',
    left: 9,
    top: 8,
    bottom: 8,
    width: 2,
    backgroundColor: '#E2E8F0',
  },
  historyItem: {
    position: 'relative',
  },
  historyEntryNode: {
    position: 'absolute',
    left: -24,
    top: 1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyExitNode: {
    position: 'absolute',
    left: -24,
    top: 1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyNodeArrow: {
    fontSize: 10,
  },
  historyContent: {
    flex: 1,
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyActionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#131B2E',
  },
  historyTimeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  historyDetailText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },

  /* 7. SAFETY PROTOCOL */
  safetyProtocolCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  safetyProtocolTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  safetyShieldCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A73E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyShieldEmoji: {
    fontSize: 18,
  },
  safetyTextCol: {
    flex: 1,
  },
  safetyProtocolTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A73E8',
  },
  safetyProtocolDesc: {
    fontSize: 11,
    color: '#475569',
    marginTop: 3,
    lineHeight: 15,
  },
  safetyActionRow: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  callPorteriaBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  callPhoneIcon: {
    fontSize: 13,
  },
  callPorteriaBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A73E8',
  },

  /* MODAL RETIRO EXCEPCIONAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '88%',
  },
  modalSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalSheetTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#131B2E',
  },
  modalSheetSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseText: {
    fontSize: 20,
    color: '#94A3B8',
    padding: 4,
    fontWeight: '700',
  },
  modalSheetBody: {
    paddingVertical: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginTop: 10,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#131B2E',
  },
  legalNoticeBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  legalNoticeText: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
  },
  btnSubmitExceptional: {
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 20,
  },
  btnSubmitExceptionalText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});
