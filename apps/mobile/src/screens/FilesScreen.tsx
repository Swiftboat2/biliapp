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
} from 'react-native';
import { colors } from '../theme/colors';

export const FilesScreen: React.FC = () => {
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
      <View style={styles.heroBanner}>
        {/* Subtle Decorative Background Accents */}
        <View style={styles.heroCircle1} />
        <View style={styles.heroCircle2} />

        {/* Top Identity Row */}
        <View style={styles.heroTopRow}>
          <View style={styles.heroBrandLeft}>
            <Image
              source={require('../../assets/logo-colegio.png')}
              style={styles.heroLogo}
              resizeMode="contain"
            />
            <View style={styles.brandTitleCol}>
              <Text style={styles.heroTitle} numberOfLines={1}>
                Instituto República de Italia
              </Text>
              <Text style={styles.heroSubtitle}>ENTRE RÍOS · CICLO 2026</Text>
            </View>
          </View>

          <View style={styles.heroActionsRight}>
            <View style={styles.notifBtn}>
              <Text style={styles.notifIcon}>🔔</Text>
              <View style={styles.notifRedDot} />
            </View>
            <View style={styles.familyAvatar}>
              <Text style={styles.familyAvatarText}>FL</Text>
            </View>
          </View>
        </View>

        {/* Title and Category Tag */}
        <View style={styles.heroTextSection}>
          <View style={styles.heroContextPill}>
            <Text style={styles.heroContextIcon}>📁</Text>
            <Text style={styles.heroContextText}>
              GESTIÓN DOCUMENTAL / SECRETARÍA
            </Text>
          </View>
          <Text style={styles.heroMainTitle}>Archivos y Documentos</Text>
          <Text style={styles.heroMainSubtitle}>
            Circulares oficiales, autorizaciones, boletines y constancias.
          </Text>
        </View>

        {/* Integrated Floating Search Bar */}
        <View style={styles.searchBarWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar circular, autorización o informe..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterTuneBtn} activeOpacity={0.8}>
            <Text style={styles.filterTuneIcon}>⚙️</Text>
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
                <Text style={styles.urgentAlertIcon}>⚠️</Text>
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
                  <Text style={styles.urgentIcon}>📜</Text>
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
                  <Text style={styles.signButtonIcon}>✍️</Text>
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
                  <Text style={styles.previewBtnIcon}>👁️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* 2. BOLETINES E INFORMES EVALUATIVOS */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithIcon}>
              <Text style={styles.sectionTitleIcon}>📋</Text>
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
                  <Text style={styles.pdfEmoji}>📄</Text>
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
                  <Text style={styles.btnSecondaryIcon}>👁️</Text>
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
                  <Text style={styles.btnCelesteIcon}>⬇️</Text>
                  <Text style={styles.btnCelesteText}>Descargar</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Boletín Sofía */}
            <View style={styles.reportCard}>
              <View style={styles.reportTopRow}>
                <View style={styles.pdfIconBox}>
                  <Text style={styles.pdfEmoji}>📄</Text>
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
                  <Text style={styles.reportStudent}>Sofía López · 2° Grado "A"</Text>
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
                  <Text style={styles.btnSecondaryIcon}>👁️</Text>
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
                  <Text style={styles.btnCelesteIcon}>⬇️</Text>
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
              <Text style={styles.sectionTitleIcon}>📢</Text>
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
                  <Text style={styles.docIconEmoji}>💳</Text>
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
                <Text style={styles.cloudDownloadIcon}>☁️⬇️</Text>
              </TouchableOpacity>
            </View>

            {/* Reglamento Convivencia */}
            <View style={styles.docRowCard}>
              <View style={styles.docRowLeft}>
                <View style={styles.docIconBoxGreen}>
                  <Text style={styles.docIconEmoji}>⚖️</Text>
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
                <Text style={styles.cloudDownloadIcon}>☁️⬇️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 4. SUBIR O ADJUNTAR DOCUMENTO (Módulo Familias) */}
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
              <Text style={styles.uploadActionIcon}>📷</Text>
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
              <Text style={styles.uploadActionIcon}>📎</Text>
              <Text style={styles.btnUploadPdfText}>Adjuntar PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Espaciado de cortesía para el scroll */}
      <View style={{ height: 32 }} />

      {/* MODAL: FIRMA DIGITAL CON PIN INSTITUCIONAL */}
      <Modal visible={isPinModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalSheetHeader}>
              <View>
                <Text style={styles.modalSheetTitle}>Firma Digital Institucional</Text>
                <Text style={styles.modalSheetSub}>
                  Autorización Salida Didáctica: Museo Provincial
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsPinModalOpen(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalSheetBody}>
              <Text style={styles.pinInstructions}>
                Ingresa tu PIN personal de 6 dígitos para validar la conformidad como tutor legal de Mateo López:
              </Text>

              {/* 6 Digit Inputs */}
              <View style={styles.pinDigitsRow}>
                {pinDigits.map((digit, i) => (
                  <TextInput
                    key={i}
                    style={styles.pinInputBox}
                    maxLength={1}
                    keyboardType="number-pad"
                    secureTextEntry
                    value={digit}
                    onChangeText={(v) => handleDigitChange(v, i)}
                  />
                ))}
              </View>

              <View style={styles.pinAuditNotice}>
                <Text style={styles.pinAuditText}>
                  🛡️ Esta firma genera un registro de auditoría inmutable con tu DNI, fecha, hora y hash criptográfico institucional.
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
        </View>
      </Modal>

      {/* MODAL: SUBIR DOCUMENTO / FOTO */}
      <Modal visible={isUploadModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>
                {uploadType === 'PHOTO' ? 'Tomar Foto de Certificado' : 'Adjuntar Documento PDF'}
              </Text>
              <TouchableOpacity onPress={() => setIsUploadModalOpen(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalSheetBody}>
              <Text style={styles.pinInstructions}>
                Selecciona el estudiante y tipo de comprobante (médico, apto físico natación o pago):
              </Text>

              <View style={styles.uploadStudentSelectRow}>
                <View style={styles.uploadStudentPillActive}>
                  <Text style={styles.uploadStudentPillActiveText}>🧒 Mateo López (Sala 4)</Text>
                </View>
                <View style={styles.uploadStudentPill}>
                  <Text style={styles.uploadStudentPillText}>👧 Sofía López (2° Grado)</Text>
                </View>
              </View>

              <View style={styles.uploadDropZone}>
                <Text style={styles.uploadDropIcon}>
                  {uploadType === 'PHOTO' ? '📸' : '📑'}
                </Text>
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
        </View>
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
  brandTitleCol: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
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
  heroMainSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
    fontWeight: '500',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 18,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#131B2E',
    padding: 0,
  },
  filterTuneBtn: {
    padding: 4,
  },
  filterTuneIcon: {
    fontSize: 16,
  },

  /* 2. FILTER CHIPS */
  filterChipsSection: {
    paddingTop: 12,
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
    paddingVertical: 8,
    paddingHorizontal: 14,
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
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  /* BODY */
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 20,
  },
  sectionBlock: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    paddingVertical: 3,
    borderRadius: 9999,
  },
  urgentBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9F1239',
  },

  /* URGENT CARD */
  urgentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
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
    width: 5,
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
  },
  pendingTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  pendingTag: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  pendingTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9F1239',
  },
  pendingDueText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  urgentTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#131B2E',
    lineHeight: 20,
  },
  urgentStudent: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 3,
  },
  urgentIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  urgentIcon: {
    fontSize: 20,
  },
  urgentDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginTop: 8,
    paddingLeft: 6,
  },
  urgentButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    paddingLeft: 6,
  },
  signButton: {
    flex: 1,
    backgroundColor: colors.coral,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: colors.coral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  signButtonIcon: {
    fontSize: 14,
  },
  signButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  previewBtnSmall: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBtnIcon: {
    fontSize: 18,
  },

  /* REPORT CARDS */
  cardsStack: {
    gap: 12,
  },
  reportCard: {
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
  },
  reportTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pdfIconBox: {
    width: 44,
    height: 44,
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
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  officialBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#005F2E',
  },
  reportSizeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#131B2E',
    marginTop: 2,
  },
  reportStudent: {
    fontSize: 12,
    color: '#475569',
    marginTop: 1,
    fontWeight: '600',
  },
  reportDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  reportBottomButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  btnSecondaryIcon: {
    fontSize: 13,
  },
  btnSecondaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  btnPrimaryCeleste: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnCelesteIcon: {
    fontSize: 13,
  },
  btnCelesteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A73E8',
  },

  /* DOC ROW CARDS (Circulares) */
  docRowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
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
    gap: 12,
    flex: 1,
  },
  docIconBoxCeleste: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconBoxGreen: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconEmoji: {
    fontSize: 18,
  },
  docTextCol: {
    flex: 1,
  },
  docTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#131B2E',
  },
  docMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  docMetaDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  docMetaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  docMetaSize: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  cloudDownloadBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  cloudDownloadIcon: {
    fontSize: 14,
  },

  /* 4. UPLOAD MODULE */
  uploadSectionBanner: {
    backgroundColor: '#E8F7EE',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C6F6D5',
    shadowColor: '#005F2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  uploadTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  uploadIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconEmoji: {
    fontSize: 18,
  },
  uploadTextCol: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#131B2E',
  },
  uploadDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    lineHeight: 16,
  },
  uploadActionsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  btnUploadPhoto: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  btnUploadPhotoText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#131B2E',
  },
  btnUploadPdf: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  btnUploadPdfText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  uploadActionIcon: {
    fontSize: 14,
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
    padding: 20,
    maxHeight: '85%',
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
    paddingVertical: 16,
  },
  pinInstructions: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  pinDigitsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 20,
  },
  pinInputBox: {
    width: 44,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  pinAuditNotice: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 20,
  },
  pinAuditText: {
    fontSize: 11,
    color: '#0369A1',
    lineHeight: 16,
  },
  confirmPinBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmPinBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  /* Upload Modal Options */
  uploadStudentSelectRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 14,
  },
  uploadStudentPillActive: {
    backgroundColor: '#E8F7EE',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  uploadStudentPillActiveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#005F2E',
  },
  uploadStudentPill: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 9999,
  },
  uploadStudentPillText: {
    fontSize: 11,
    color: '#64748B',
  },
  uploadDropZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    marginBottom: 20,
  },
  uploadDropIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  uploadDropTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#131B2E',
  },
  uploadDropSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 3,
  },
});
