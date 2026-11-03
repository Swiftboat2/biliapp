import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { Icon } from '../components/Icon';

export const FilesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;
  const topInsetPadding = Math.max(insets.top, 24) + 10;
  const pinBoxWidth = Math.min((width - 96) / 6, 42);

  const [activeCategory, setActiveCategory] = useState<
    'TODOS' | 'BOLETINES' | 'AUTORIZACIONES' | 'CIRCULARES' | 'FICHAS'
  >('TODOS');
  const [searchQuery, setSearchQuery] = useState('');

  // PIN Signing Modal state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinDigits, setPinDigits] = useState(['', '', '', '', '', '']);
  const [isSigned, setIsSigned] = useState(false);

  // Upload Document Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'PHOTO' | 'PDF'>('PHOTO');

  const handleDigitChange = (val: string, index: number) => {
    const clean = val.replace(/[^0-9]/g, '');
    const newDigits = [...pinDigits];
    newDigits[index] = clean;
    setPinDigits(newDigits);
  };

  const handleConfirmPinSign = () => {
    const code = pinDigits.join('');
    if (code.length < 6) {
      Alert.alert('PIN incompleto', 'Debes ingresar los 6 dígitos de tu firma institucional.');
      return;
    }
    setIsSigned(true);
    setIsPinModalOpen(false);
    Alert.alert(
      'Documento firmado con éxito',
      'La autorización para la salida didáctica al Museo Provincial fue firmada digitalmente y remitida a Dirección.'
    );
  };

  const handleSimulateDownload = (title: string) => {
    Alert.alert('Descargando documento', `${title}\nEl archivo PDF se guardará en tu dispositivo.`);
  };

  const handleSimulatePreview = (title: string) => {
    Alert.alert('Vista previa del documento', `${title}\nDocumento oficial verificado con código QR.`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. HERO WAVE BANNER INSTITUCIONAL */}
      <View style={[styles.heroBanner, { paddingTop: topInsetPadding }]}>
        <View style={styles.heroCircle1} />
        <View style={styles.heroCircle2} />

        {/* Top Identity Row */}
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

        {/* Title and Category Tag */}
        <View style={styles.heroTextSection}>
          <View style={styles.heroContextPill}>
            <Icon name="carpetas" size={12} color="#FFFFFF" />
            <Text style={styles.heroContextText}>
              GESTIÓN DOCUMENTAL / SECRETARÍA
            </Text>
          </View>
          <Text style={[styles.heroMainTitle, isSmallScreen && styles.heroMainTitleSmall]}>
            Archivos y Documentos
          </Text>
          <Text style={styles.heroMainSubtitle} numberOfLines={1}>
            Circulares oficiales, autorizaciones, boletines y constancias.
          </Text>
        </View>

        {/* Integrated Floating Search Bar */}
        <View style={styles.searchBarWrapper}>
          <Icon name="buscar" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar circular, autorización o informe..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterTuneBtn} activeOpacity={0.8}>
            <Icon name="filtros" size={16} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. FILTROS DE CATEGORÍAS EN PÍLDORAS DESLIZABLES */}
      <View style={styles.filterChipsSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsScroll}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              activeCategory === 'TODOS' && styles.filterChipActive,
            ]}
            onPress={() => setActiveCategory('TODOS')}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterChipText,
                activeCategory === 'TODOS' && styles.filterChipTextActive,
              ]}
            >
              📊 Todos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              activeCategory === 'BOLETINES' && styles.filterChipActive,
            ]}
            onPress={() => setActiveCategory('BOLETINES')}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterChipText,
                activeCategory === 'BOLETINES' && styles.filterChipTextActive,
              ]}
            >
              🏫 Boletines
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              activeCategory === 'AUTORIZACIONES' && styles.filterChipActive,
            ]}
            onPress={() => setActiveCategory('AUTORIZACIONES')}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterChipText,
                activeCategory === 'AUTORIZACIONES' && styles.filterChipTextActive,
              ]}
            >
              ✍️ Autorizaciones
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              activeCategory === 'CIRCULARES' && styles.filterChipActive,
            ]}
            onPress={() => setActiveCategory('CIRCULARES')}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterChipText,
                activeCategory === 'CIRCULARES' && styles.filterChipTextActive,
              ]}
            >
              📢 Circulares
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              activeCategory === 'FICHAS' && styles.filterChipActive,
            ]}
            onPress={() => setActiveCategory('FICHAS')}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterChipText,
                activeCategory === 'FICHAS' && styles.filterChipTextActive,
              ]}
            >
              🩺 Fichas Médicas
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* BODY CONTENT */}
      <View style={styles.bodyContent}>
        {/* 1. SECCIÓN: ACCIÓN REQUERIDA / FIRMA URGENTE */}
        {!isSigned && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleWithIcon}>
                <Icon name="firma-digital" size={18} color={colors.coral} />
                <Text style={styles.sectionTitle}>Acción Requerida</Text>
              </View>
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentBadgeText}>1 PENDIENTE</Text>
              </View>
            </View>

            <View style={styles.urgentCard}>
              <View style={styles.urgentRedBorderLine} />

              <View style={styles.urgentCardTop}>
                <View style={styles.urgentCardInfo}>
                  <View style={styles.pendingTagRow}>
                    <View style={styles.pendingTag}>
                      <Text style={styles.pendingTagText}>FIRMA PENDIENTE</Text>
                    </View>
                    <Text style={styles.pendingDueText}>Vence en 48 hs</Text>
                  </View>
                  <Text style={styles.urgentTitle}>
                    Autorización Salida Didáctica: Museo Provincial
                  </Text>
                  <Text style={styles.urgentStudent}>
                    🧒 Mateo López · Sala de 4 Años
                  </Text>
                </View>

                <View style={styles.urgentIconBox}>
                  <Icon name="firma-digital" size={24} color={colors.coral} />
                </View>
              </View>

              <Text style={styles.urgentDesc}>
                Visita educativa prevista para el 28 de Octubre. Se requiere confirmación de tutor legal y aceptación del protocolo de traslado escolar.
              </Text>

              <View style={styles.urgentButtonsRow}>
                <TouchableOpacity
                  style={styles.signButton}
                  activeOpacity={0.88}
                  onPress={() => setIsPinModalOpen(true)}
                >
                  <Icon name="firma-digital" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.signButtonText}>Revisar y Firmar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.previewBtnSmall}
                  activeOpacity={0.85}
                  onPress={() =>
                    handleSimulatePreview(
                      'Autorización Salida Didáctica: Museo Provincial'
                    )
                  }
                >
                  <Icon name="buscar" size={16} color="#1E40AF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* 2. BOLETINES E INFORMES EVALUATIVOS */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithIcon}>
              <Icon name="boletin" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Boletines e Informes</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.sectionLink}>Ver Histórico</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsStack}>
            {/* Boletín Mateo */}
            <View style={styles.reportCard}>
              <View style={styles.reportTopRow}>
                <View style={styles.pdfIconBox}>
                  <Icon name="boletin" size={20} color={colors.primary} />
                  <Text style={styles.pdfBadgeText}>PDF</Text>
                </View>

                <View style={styles.reportInfoCol}>
                  <View style={styles.reportBadgeRow}>
                    <View style={styles.officialBadge}>
                      <Text style={styles.officialBadgeText}>OFICIAL</Text>
                    </View>
                    <Text style={styles.reportSizeText}>1.8 MB</Text>
                  </View>
                  <Text style={styles.reportTitle}>Informe Cualitativo Bimestral</Text>
                  <Text style={styles.reportStudent}>Mateo López · Sala de 4 Años</Text>
                  <Text style={styles.reportDate}>Ciclo Lectivo 2026 · Emitido: 15 Oct</Text>
                </View>
              </View>

              <View style={styles.reportBottomButtonsRow}>
                <TouchableOpacity
                  style={styles.btnSecondary}
                  activeOpacity={0.85}
                  onPress={() =>
                    handleSimulatePreview(
                      'Informe Cualitativo Bimestral - Mateo López'
                    )
                  }
                >
                  <Icon name="buscar" size={14} color="#475569" style={{ marginRight: 4 }} />
                  <Text style={styles.btnSecondaryText}>Vista previa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnPrimaryCeleste}
                  activeOpacity={0.85}
                  onPress={() =>
                    handleSimulateDownload(
                      'Informe Cualitativo Bimestral - Mateo López.pdf'
                    )
                  }
                >
                  <Icon name="descargar-pdf" size={15} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.btnCelesteText}>Descargar</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Boletín Sofía */}
            <View style={styles.reportCard}>
              <View style={styles.reportTopRow}>
                <View style={styles.pdfIconBox}>
                  <Icon name="certificado" size={20} color="#1A73E8" />
                  <Text style={styles.pdfBadgeText}>PDF</Text>
                </View>

                <View style={styles.reportInfoCol}>
                  <View style={styles.reportBadgeRow}>
                    <View style={styles.officialBadge}>
                      <Text style={styles.officialBadgeText}>OFICIAL</Text>
                    </View>
                    <Text style={styles.reportSizeText}>2.4 MB</Text>
                  </View>
                  <Text style={styles.reportTitle}>Boletín Calificaciones 1° Ciclo</Text>
                  <Text style={styles.reportStudent}>Sofía López · 4° Grado "B"</Text>
                  <Text style={styles.reportDate}>2° Trimestre · Emitido: 08 Oct</Text>
                </View>
              </View>

              <View style={styles.reportBottomButtonsRow}>
                <TouchableOpacity
                  style={styles.btnSecondary}
                  activeOpacity={0.85}
                  onPress={() =>
                    handleSimulatePreview(
                      'Boletín Calificaciones 1° Ciclo - Sofía López'
                    )
                  }
                >
                  <Icon name="buscar" size={14} color="#475569" style={{ marginRight: 4 }} />
                  <Text style={styles.btnSecondaryText}>Vista previa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnPrimaryCeleste}
                  activeOpacity={0.85}
                  onPress={() =>
                    handleSimulateDownload(
                      'Boletín Calificaciones 1° Ciclo - Sofía López.pdf'
                    )
                  }
                >
                  <Icon name="descargar-pdf" size={15} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.btnCelesteText}>Descargar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* 3. CIRCULARES & REGLAMENTOS */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithIcon}>
              <Icon name="novedades" size={18} color="#854D0E" />
              <Text style={styles.sectionTitle}>Circulares & Reglamentos</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.sectionLinkBlue}>Ver todas (6)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsStack}>
            {/* Circular 14 */}
            <View style={styles.docRowCard}>
              <View style={styles.docRowLeft}>
                <View style={styles.docIconBoxCeleste}>
                  <Icon name="novedades" size={18} color="#1A73E8" />
                </View>
                <View style={styles.docTextCol}>
                  <Text style={styles.docTitle} numberOfLines={1}>
                    Circular N° 14: Cuotas y Rematriculación 2027
                  </Text>
                  <View style={styles.docMetaRow}>
                    <Text style={styles.docMetaDate}>22 Oct 2026</Text>
                    <View style={styles.docMetaDot} />
                    <Text style={styles.docMetaSize}>850 KB · PDF</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.cloudDownloadBtn}
                activeOpacity={0.8}
                onPress={() =>
                  handleSimulateDownload('Circular N° 14 - Rematriculación 2027.pdf')
                }
              >
                <Icon name="descargar-pdf" size={18} color="#1A73E8" />
              </TouchableOpacity>
            </View>

            {/* Reglamento Convivencia */}
            <View style={styles.docRowCard}>
              <View style={styles.docRowLeft}>
                <View style={styles.docIconBoxGreen}>
                  <Icon name="carpetas" size={18} color={colors.primary} />
                </View>
                <View style={styles.docTextCol}>
                  <Text style={styles.docTitle} numberOfLines={1}>
                    Reglamento Convivencia & Uniformes 2026
                  </Text>
                  <View style={styles.docMetaRow}>
                    <Text style={styles.docMetaDate}>Vigente</Text>
                    <View style={styles.docMetaDot} />
                    <Text style={styles.docMetaSize}>3.1 MB · PDF</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.cloudDownloadBtn}
                activeOpacity={0.8}
                onPress={() =>
                  handleSimulateDownload('Reglamento Convivencia & Uniformes 2026.pdf')
                }
              >
                <Icon name="descargar-pdf" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 4. SUBIR O ADJUNTAR DOCUMENTO */}
        <View style={styles.uploadSectionBanner}>
          <View style={styles.uploadTopRow}>
            <View style={styles.uploadIconCircle}>
              <Text style={styles.uploadIconEmoji}>📤</Text>
            </View>
            <View style={styles.uploadTextCol}>
              <Text style={styles.uploadTitle}>
                ¿Necesitas enviar documentación?
              </Text>
              <Text style={styles.uploadDesc}>
                Adjunta certificados médicos, aptos físicos de educación física o comprobantes de pago de forma directa a Secretaría.
              </Text>
            </View>
          </View>

          <View style={styles.uploadActionsGrid}>
            <TouchableOpacity
              style={styles.btnUploadPhoto}
              activeOpacity={0.85}
              onPress={() => {
                setUploadType('PHOTO');
                setIsUploadModalOpen(true);
              }}
            >
              <Icon name="camara" size={16} color="#1A73E8" style={{ marginRight: 6 }} />
              <Text style={styles.btnUploadPhotoText}>Tomar Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnUploadPdf}
              activeOpacity={0.85}
              onPress={() => {
                setUploadType('PDF');
                setIsUploadModalOpen(true);
              }}
            >
              <Icon name="adjunto" size={16} color="#475569" style={{ marginRight: 6 }} />
              <Text style={styles.btnUploadPdfText}>Adjuntar PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Espaciado de cortesía para el scroll */}
      <View style={{ height: 36 }} />

      {/* MODAL: FIRMA DIGITAL CON PIN */}
      <Modal visible={isPinModalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalSheetHeader}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.modalSheetTitle}>Firma Digital Institucional</Text>
                <Text style={styles.modalSheetSub}>
                  Autorización Salida Didáctica: Museo Provincial
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsPinModalOpen(false)}>
                <Icon name="cerrar" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalSheetBody}>
              <Text style={styles.pinInstructions}>
                Ingresa tu PIN personal de 6 dígitos para validar la conformidad como tutor legal de Mateo López:
              </Text>

              {/* 6 Responsive Digit Inputs */}
              <View style={styles.pinDigitsRow}>
                {pinDigits.map((digit, i) => (
                  <TextInput
                    key={i}
                    style={[styles.pinInputBox, { width: pinBoxWidth }]}
                    maxLength={1}
                    keyboardType="number-pad"
                    secureTextEntry
                    value={digit}
                    onChangeText={(v) => handleDigitChange(v, i)}
                  />
                ))}
              </View>

              <View style={styles.pinAuditNotice}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <Icon name="candado" size={14} color="#92400E" />
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#92400E' }}>Seguridad Criptográfica</Text>
                </View>
                <Text style={styles.pinAuditText}>
                  Esta firma genera un registro de auditoría inmutable con tu DNI, fecha, hora y hash criptográfico institucional.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.confirmPinBtn}
                activeOpacity={0.88}
                onPress={handleConfirmPinSign}
              >
                <Text style={styles.confirmPinBtnText}>Confirmar y Firmar Documento</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL: SUBIR DOCUMENTO / FOTO */}
      <Modal visible={isUploadModalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>
                {uploadType === 'PHOTO' ? 'Tomar Foto de Certificado' : 'Adjuntar Documento PDF'}
              </Text>
              <TouchableOpacity onPress={() => setIsUploadModalOpen(false)}>
                <Icon name="cerrar" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalSheetBody}>
              <Text style={styles.pinInstructions}>
                Selecciona el estudiante y tipo de comprobante:
              </Text>

              <View style={styles.uploadStudentSelectRow}>
                <View style={styles.uploadStudentPillActive}>
                  <Text style={styles.uploadStudentPillActiveText}>🧒 Mateo López (Sala 4)</Text>
                </View>
                <View style={styles.uploadStudentPill}>
                  <Text style={styles.uploadStudentPillText}>👧 Sofía López (4° Grado)</Text>
                </View>
              </View>

              <View style={styles.uploadDropZone}>
                <Icon
                  name={uploadType === 'PHOTO' ? 'camara' : 'descargar-pdf'}
                  size={36}
                  color={colors.primary}
                  style={{ marginBottom: 6 }}
                />
                <Text style={styles.uploadDropTitle}>
                  {uploadType === 'PHOTO'
                    ? 'Toca para abrir la cámara'
                    : 'Toca para seleccionar archivo del móvil'}
                </Text>
                <Text style={styles.uploadDropSubtitle}>
                  Formatos admitidos: JPG, PNG, PDF (Máx 10 MB)
                </Text>
              </View>

              <TouchableOpacity
                style={styles.confirmPinBtn}
                onPress={() => {
                  setIsUploadModalOpen(false);
                  Alert.alert(
                    'Documento enviado',
                    'Tu certificado fue remitido a la Preceptoría para su aprobación.'
                  );
                }}
              >
                <Text style={styles.confirmPinBtnText}>Enviar a Preceptoría / Secretaría</Text>
              </TouchableOpacity>
            </View>
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

  /* 1. HERO BANNER */
  heroBanner: {
    backgroundColor: colors.primary,
    paddingBottom: 22,
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
    gap: 8,
  },
  heroBrandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    justifyContent: 'center',
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
    fontSize: 9.5,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.8,
  },
  heroActionsRight: {
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
  },
  familyAvatarText: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.primary,
  },
  heroTextSection: {
    marginTop: 16,
    zIndex: 10,
  },
  heroContextPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  heroContextIcon: {
    fontSize: 11,
  },
  heroContextText: {
    fontSize: 9.5,
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
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
    fontWeight: '500',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 10,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#131B2E',
    padding: 0,
  },
  filterTuneBtn: {
    padding: 4,
  },
  filterTuneIcon: {
    fontSize: 15,
  },

  /* 2. FILTER CHIPS */
  filterChipsSection: {
    paddingTop: 10,
    paddingBottom: 4,
  },
  filterChipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  /* BODY */
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 18,
  },
  sectionBlock: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  urgentAlertIcon: {
    fontSize: 16,
  },
  sectionTitleIcon: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#131B2E',
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  sectionLinkBlue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0061a2',
  },
  urgentBadge: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 9999,
  },
  urgentBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#9F1239',
  },

  /* URGENT CARD */
  urgentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  urgentRedBorderLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.coral,
  },
  urgentCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingLeft: 6,
  },
  urgentCardInfo: {
    flex: 1,
    marginRight: 6,
  },
  pendingTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  pendingTag: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  pendingTagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#9F1239',
  },
  pendingDueText: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  urgentTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#131B2E',
    lineHeight: 19,
  },
  urgentStudent: {
    fontSize: 11.5,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  urgentIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgentIcon: {
    fontSize: 18,
  },
  urgentDesc: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
    marginTop: 6,
    paddingLeft: 6,
  },
  urgentButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingLeft: 6,
  },
  signButton: {
    flex: 1,
    backgroundColor: colors.coral,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 11,
    shadowColor: colors.coral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  signButtonIcon: {
    fontSize: 13,
  },
  signButtonText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  previewBtnSmall: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBtnIcon: {
    fontSize: 16,
  },

  /* REPORT CARDS */
  cardsStack: {
    gap: 10,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  reportTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  pdfIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfEmoji: {
    fontSize: 18,
  },
  pdfBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#9F1239',
    marginTop: -2,
  },
  reportInfoCol: {
    flex: 1,
  },
  reportBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  officialBadge: {
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 9999,
  },
  officialBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#005F2E',
  },
  reportSizeText: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  reportTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#131B2E',
    marginTop: 2,
  },
  reportStudent: {
    fontSize: 11.5,
    color: '#475569',
    marginTop: 1,
    fontWeight: '600',
  },
  reportDate: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  reportBottomButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  btnSecondaryIcon: {
    fontSize: 12,
  },
  btnSecondaryText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
  btnPrimaryCeleste: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  btnCelesteIcon: {
    fontSize: 12,
  },
  btnCelesteText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1A73E8',
  },

  /* DOC ROW CARDS (Circulares) */
  docRowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
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
  docRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  docIconBoxCeleste: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconBoxGreen: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconEmoji: {
    fontSize: 17,
  },
  docTextCol: {
    flex: 1,
  },
  docTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#131B2E',
  },
  docMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  docMetaDate: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  docMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CBD5E1',
  },
  docMetaSize: {
    fontSize: 10.5,
    color: '#475569',
    fontWeight: '500',
  },
  cloudDownloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudDownloadIcon: {
    fontSize: 13,
  },

  /* 4. UPLOAD MODULE */
  uploadSectionBanner: {
    backgroundColor: '#E8F7EE',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#C6F6D5',
  },
  uploadTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  uploadIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconEmoji: {
    fontSize: 17,
  },
  uploadTextCol: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#131B2E',
  },
  uploadDesc: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
    lineHeight: 15,
  },
  uploadActionsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  btnUploadPhoto: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  btnUploadPhotoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#131B2E',
  },
  btnUploadPdf: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 9,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  btnUploadPdfText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  uploadActionIcon: {
    fontSize: 13,
  },

  /* PIN MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    maxHeight: '85%',
  },
  modalSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalSheetTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#131B2E',
  },
  modalSheetSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseText: {
    fontSize: 18,
    color: '#94A3B8',
    padding: 4,
    fontWeight: '700',
  },
  modalSheetBody: {
    paddingVertical: 14,
  },
  pinInstructions: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  pinDigitsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 18,
  },
  pinInputBox: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  pinAuditNotice: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 16,
  },
  pinAuditText: {
    fontSize: 10.5,
    color: '#0369A1',
    lineHeight: 15,
  },
  confirmPinBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmPinBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
  },

  /* Upload Modal Options */
  uploadStudentSelectRow: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 12,
  },
  uploadStudentPillActive: {
    backgroundColor: '#E8F7EE',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  uploadStudentPillActiveText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#005F2E',
  },
  uploadStudentPill: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 9999,
  },
  uploadStudentPillText: {
    fontSize: 10.5,
    color: '#64748B',
  },
  uploadDropZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    marginBottom: 16,
  },
  uploadDropIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  uploadDropTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#131B2E',
  },
  uploadDropSubtitle: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 2,
  },
});
