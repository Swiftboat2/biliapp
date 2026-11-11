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

interface DocumentItem {
  id: string;
  category: 'BOLETINES' | 'AUTORIZACIONES' | 'CIRCULARES' | 'FICHAS';
  title: string;
  subtitle: string;
  studentName?: string;
  date: string;
  fileSize: string;
  isOfficial?: boolean;
  isUrgent?: boolean;
  isSigned?: boolean;
}

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

  // Documents Database
  const documents: DocumentItem[] = [
    // 1. AUTORIZACIONES
    {
      id: 'doc-auth-1',
      category: 'AUTORIZACIONES',
      title: 'Autorización Salida Didáctica: Museo Provincial',
      subtitle: 'Visita pedagógica y traslado escolar. Confirmación de tutor legal.',
      studentName: 'Mateo López · Sala de 4 Años',
      date: 'Vence en 48 hs',
      fileSize: '1.2 MB · PDF',
      isUrgent: true,
      isSigned: isSigned,
    },
    {
      id: 'doc-auth-2',
      category: 'AUTORIZACIONES',
      title: 'Consentimiento Uso de Imagen y Medios Digitales 2026',
      subtitle: 'Autorización para publicación en boletín institucional y galería escolar.',
      studentName: 'Sofía López · 4° Grado "B"',
      date: 'Firmado el 12 Mar 2026',
      fileSize: '950 KB · PDF',
      isOfficial: true,
      isSigned: true,
    },

    // 2. NOTAS PARCIALES / BOLETINES
    {
      id: 'doc-rep-1',
      category: 'BOLETINES',
      title: 'Informe Cualitativo Bimestral',
      subtitle: 'Evolución pedagógica, socialización y hábitos de sala.',
      studentName: 'Mateo López · Sala de 4 Años',
      date: 'Ciclo 2026 · Emitido: 15 Oct',
      fileSize: '1.8 MB · PDF',
      isOfficial: true,
    },
    {
      id: 'doc-rep-2',
      category: 'BOLETINES',
      title: 'Notas Parciales 1° Ciclo',
      subtitle: 'Calificaciones trimestrales por área, lengua italiana y conducta.',
      studentName: 'Sofía López · 4° Grado "B"',
      date: '2° Trimestre · Emitido: 08 Oct',
      fileSize: '2.4 MB · PDF',
      isOfficial: true,
    },
    {
      id: 'doc-rep-3',
      category: 'BOLETINES',
      title: 'Planilla Evaluativa Bicultural Italiano',
      subtitle: 'Rendimiento en fonética, vocabulario e historia bicultural.',
      studentName: 'Mateo & Sofía López',
      date: '1° Semestre · Emitido: 01 Jul',
      fileSize: '1.5 MB · PDF',
      isOfficial: true,
    },

    // 3. CIRCULARES
    {
      id: 'doc-circ-1',
      category: 'CIRCULARES',
      title: 'Circular N° 14: Cuotas y Rematriculación 2027',
      subtitle: 'Aranceles, cronograma de reserva de vacante y beneficios por hermano.',
      studentName: 'Toda la Familia',
      date: '22 Oct 2026',
      fileSize: '850 KB · PDF',
      isOfficial: true,
    },
    {
      id: 'doc-circ-2',
      category: 'CIRCULARES',
      title: 'Reglamento Convivencia & Uniformes 2026',
      subtitle: 'Normativa institucional sobre asistencia, código de vestimenta y convivencia.',
      studentName: 'Nivel Inicial y Primario',
      date: 'Vigente Ciclo 2026',
      fileSize: '3.1 MB · PDF',
      isOfficial: true,
    },
    {
      id: 'doc-circ-3',
      category: 'CIRCULARES',
      title: 'Protocolo de Seguridad en Puerta y Retiros QR',
      subtitle: 'Guía práctica para tutores sobre validación de identidad en portería.',
      studentName: 'Comunidad Educativa',
      date: 'Actualizado: 18 Ago 2026',
      fileSize: '620 KB · PDF',
      isOfficial: true,
    },

    // 4. FICHAS MÉDICAS
    {
      id: 'doc-fich-1',
      category: 'FICHAS',
      title: 'Ficha Médica y Esquema de Vacunación 2026',
      subtitle: 'Registro de vacunas obligatorias, alergias y contactos de emergencia.',
      studentName: 'Mateo López · Sala de 4 Años',
      date: 'Presentada: 10 Mar 2026 · Válida',
      fileSize: '1.1 MB · PDF',
      isOfficial: true,
    },
    {
      id: 'doc-fich-2',
      category: 'FICHAS',
      title: 'Certificado Apto Médico y Natación Escolar',
      subtitle: 'Evaluación cardiológica y aptitud para actividades físicas y club.',
      studentName: 'Sofía López · 4° Grado "B"',
      date: 'Presentada: 15 Abr 2026 · Válida',
      fileSize: '1.4 MB · PDF',
      isOfficial: true,
    },
  ];

  // Counts
  const totalCount = documents.length;
  const boletinesCount = documents.filter((d) => d.category === 'BOLETINES').length;
  const authCount = documents.filter((d) => d.category === 'AUTORIZACIONES').length;
  const circularesCount = documents.filter((d) => d.category === 'CIRCULARES').length;
  const fichasCount = documents.filter((d) => d.category === 'FICHAS').length;

  // Filtered documents
  const filteredDocuments = documents.filter((doc) => {
    // Category match
    if (activeCategory !== 'TODOS' && doc.category !== activeCategory) {
      return false;
    }
    // Search query match
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchSub = doc.subtitle.toLowerCase().includes(q);
      const matchStudent = doc.studentName?.toLowerCase().includes(q) || false;
      return matchTitle || matchSub || matchStudent;
    }
    return true;
  });

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

  // Group by section for clean UI
  const urgentAuth = filteredDocuments.find((d) => d.id === 'doc-auth-1');
  const otherAuth = filteredDocuments.filter((d) => d.category === 'AUTORIZACIONES' && d.id !== 'doc-auth-1');
  const boletinesList = filteredDocuments.filter((d) => d.category === 'BOLETINES');
  const circularesList = filteredDocuments.filter((d) => d.category === 'CIRCULARES');
  const fichasList = filteredDocuments.filter((d) => d.category === 'FICHAS');

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
            Circulares oficiales, autorizaciones, notas parciales y fichas médicas.
          </Text>
        </View>

        {/* Integrated Floating Search Bar with Clear Button */}
        <View style={styles.searchBarWrapper}>
          <Icon name="buscar" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar circular, autorización o informe..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={{ padding: 4, marginRight: 6 }}
              activeOpacity={0.7}
            >
              <Icon name="cerrar" size={15} color="#64748B" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.filterTuneBtn}
            activeOpacity={0.8}
            onPress={() => setActiveCategory('TODOS')}
          >
            <Icon name="filtros" size={16} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. FILTROS DE CATEGORÍAS EN PÍLDORAS DESLIZABLES CON CONTADORES */}
      <View style={styles.filterChipsSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsScroll}
        >
          {/* Todos */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              activeCategory === 'TODOS' && styles.filterChipActive,
            ]}
            onPress={() => setActiveCategory('TODOS')}
            activeOpacity={0.85}
          >
            <Icon
              name="carpetas"
              size={13}
              color={activeCategory === 'TODOS' ? '#FFFFFF' : '#475569'}
            />
            <Text
              style={[
                styles.filterChipText,
                activeCategory === 'TODOS' && styles.filterChipTextActive,
              ]}
            >
              Todos
            </Text>
            <View style={[styles.chipBadge, activeCategory === 'TODOS' && styles.chipBadgeActive]}>
              <Text style={[styles.chipBadgeText, activeCategory === 'TODOS' && styles.chipBadgeTextActive]}>
                {totalCount}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Notas Parciales */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              activeCategory === 'BOLETINES' && styles.filterChipActive,
            ]}
            onPress={() => setActiveCategory('BOLETINES')}
            activeOpacity={0.85}
          >
            <Icon
              name="boletin"
              size={13}
              color={activeCategory === 'BOLETINES' ? '#FFFFFF' : '#475569'}
            />
            <Text
              style={[
                styles.filterChipText,
                activeCategory === 'BOLETINES' && styles.filterChipTextActive,
              ]}
            >
              Notas Parciales
            </Text>
            <View style={[styles.chipBadge, activeCategory === 'BOLETINES' && styles.chipBadgeActive]}>
              <Text style={[styles.chipBadgeText, activeCategory === 'BOLETINES' && styles.chipBadgeTextActive]}>
                {boletinesCount}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Autorizaciones */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              activeCategory === 'AUTORIZACIONES' && styles.filterChipActive,
            ]}
            onPress={() => setActiveCategory('AUTORIZACIONES')}
            activeOpacity={0.85}
          >
            <Icon
              name="firma-digital"
              size={13}
              color={activeCategory === 'AUTORIZACIONES' ? '#FFFFFF' : '#475569'}
            />
            <Text
              style={[
                styles.filterChipText,
                activeCategory === 'AUTORIZACIONES' && styles.filterChipTextActive,
              ]}
            >
              Autorizaciones
            </Text>
            <View style={[styles.chipBadge, activeCategory === 'AUTORIZACIONES' && styles.chipBadgeActive]}>
              <Text style={[styles.chipBadgeText, activeCategory === 'AUTORIZACIONES' && styles.chipBadgeTextActive]}>
                {authCount}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Circulares */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              activeCategory === 'CIRCULARES' && styles.filterChipActive,
            ]}
            onPress={() => setActiveCategory('CIRCULARES')}
            activeOpacity={0.85}
          >
            <Icon
              name="novedades"
              size={13}
              color={activeCategory === 'CIRCULARES' ? '#FFFFFF' : '#475569'}
            />
            <Text
              style={[
                styles.filterChipText,
                activeCategory === 'CIRCULARES' && styles.filterChipTextActive,
              ]}
            >
              Circulares
            </Text>
            <View style={[styles.chipBadge, activeCategory === 'CIRCULARES' && styles.chipBadgeActive]}>
              <Text style={[styles.chipBadgeText, activeCategory === 'CIRCULARES' && styles.chipBadgeTextActive]}>
                {circularesCount}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Fichas Médicas */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              activeCategory === 'FICHAS' && styles.filterChipActive,
            ]}
            onPress={() => setActiveCategory('FICHAS')}
            activeOpacity={0.85}
          >
            <Icon
              name="primeros-auxilios"
              size={13}
              color={activeCategory === 'FICHAS' ? '#FFFFFF' : '#475569'}
            />
            <Text
              style={[
                styles.filterChipText,
                activeCategory === 'FICHAS' && styles.filterChipTextActive,
              ]}
            >
              Fichas Médicas
            </Text>
            <View style={[styles.chipBadge, activeCategory === 'FICHAS' && styles.chipBadgeActive]}>
              <Text style={[styles.chipBadgeText, activeCategory === 'FICHAS' && styles.chipBadgeTextActive]}>
                {fichasCount}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* BODY CONTENT */}
      <View style={styles.bodyContent}>
        {/* EMPTY STATE IF NO MATCHES */}
        {filteredDocuments.length === 0 && (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Icon name="buscar" size={26} color="#94A3B8" />
            </View>
            <Text style={styles.emptyTitle}>Sin documentos encontrados</Text>
            <Text style={styles.emptySubtitle}>
              No hay archivos que coincidan con "{searchQuery}".
            </Text>
            <TouchableOpacity
              style={styles.clearSearchBtn}
              onPress={() => {
                setSearchQuery('');
                setActiveCategory('TODOS');
              }}
            >
              <Text style={styles.clearSearchBtnText}>Ver todos los documentos</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 1. SECCIÓN: ACCIÓN REQUERIDA / AUTORIZACIONES */}
        {(activeCategory === 'TODOS' || activeCategory === 'AUTORIZACIONES') && urgentAuth && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleWithIcon}>
                <Icon name="firma-digital" size={18} color={isSigned ? colors.primary : colors.coral} />
                <Text style={styles.sectionTitle}>
                  {isSigned ? 'Autorizaciones Digitales' : 'Acción Requerida'}
                </Text>
              </View>
              <View style={isSigned ? styles.signedBadge : styles.urgentBadge}>
                <Text style={isSigned ? styles.signedBadgeText : styles.urgentBadgeText}>
                  {isSigned ? 'FIRMADO ✓' : '1 PENDIENTE'}
                </Text>
              </View>
            </View>

            <View style={styles.urgentCard}>
              <View style={isSigned ? styles.urgentGreenBorderLine : styles.urgentRedBorderLine} />

              <View style={styles.urgentCardTop}>
                <View style={styles.urgentCardInfo}>
                  <View style={styles.pendingTagRow}>
                    <View style={isSigned ? styles.signedTag : styles.pendingTag}>
                      <Text style={isSigned ? styles.signedTagText : styles.pendingTagText}>
                        {isSigned ? 'FIRMADO DIGITALMENTE' : 'FIRMA PENDIENTE'}
                      </Text>
                    </View>
                    <Text style={styles.pendingDueText}>
                      {isSigned ? 'Constancia archivada' : 'Vence en 48 hs'}
                    </Text>
                  </View>
                  <Text style={styles.urgentTitle}>
                    {urgentAuth.title}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 }}>
                    <Icon name="graduacion" size={13} color="#005F2E" />
                    <Text style={styles.urgentStudent}>
                      {urgentAuth.studentName}
                    </Text>
                  </View>
                </View>

                <View style={[styles.urgentIconBox, isSigned && styles.signedIconBox]}>
                  <Icon
                    name={isSigned ? 'check' : 'firma-digital'}
                    size={24}
                    color={isSigned ? colors.primary : colors.coral}
                  />
                </View>
              </View>

              <Text style={styles.urgentDesc}>
                {urgentAuth.subtitle}
              </Text>

              <View style={styles.urgentButtonsRow}>
                {!isSigned ? (
                  <TouchableOpacity
                    style={styles.signButton}
                    activeOpacity={0.88}
                    onPress={() => setIsPinModalOpen(true)}
                  >
                    <Icon name="firma-digital" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.signButtonText}>Revisar y Firmar</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.signedConfirmedBox}>
                    <Icon name="check" size={14} color="#005F2E" />
                    <Text style={styles.signedConfirmedText}>Firma registrada con PIN seguro</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.previewBtnSmall}
                  activeOpacity={0.85}
                  onPress={() => handleSimulatePreview(urgentAuth.title)}
                >
                  <Icon name="buscar" size={16} color="#1E40AF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* OTRAS AUTORIZACIONES */}
        {(activeCategory === 'TODOS' || activeCategory === 'AUTORIZACIONES') && otherAuth.length > 0 && (
          <View style={styles.cardsStack}>
            {otherAuth.map((item) => (
              <View key={item.id} style={styles.docRowCard}>
                <View style={styles.docRowLeft}>
                  <View style={styles.docIconBoxGreen}>
                    <Icon name="firma-digital" size={18} color={colors.primary} />
                  </View>
                  <View style={styles.docTextCol}>
                    <Text style={styles.docTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.docSub}>{item.studentName}</Text>
                    <View style={styles.docMetaRow}>
                      <Text style={styles.docMetaDate}>{item.date}</Text>
                      <View style={styles.docMetaDot} />
                      <Text style={styles.docMetaSize}>{item.fileSize}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.cloudDownloadBtn}
                  activeOpacity={0.8}
                  onPress={() => handleSimulateDownload(`${item.title}.pdf`)}
                >
                  <Icon name="descargar-pdf" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* 2. NOTAS PARCIALES E INFORMES EVALUATIVOS */}
        {(activeCategory === 'TODOS' || activeCategory === 'BOLETINES') && boletinesList.length > 0 && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleWithIcon}>
                <Icon name="boletin" size={18} color={colors.primary} />
                <Text style={styles.sectionTitle}>Notas Parciales e Informes</Text>
              </View>
              <Text style={styles.sectionLink}>Oficiales ({boletinesList.length})</Text>
            </View>

            <View style={styles.cardsStack}>
              {boletinesList.map((item) => (
                <View key={item.id} style={styles.reportCard}>
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
                        <Text style={styles.reportSizeText}>{item.fileSize}</Text>
                      </View>
                      <Text style={styles.reportTitle}>{item.title}</Text>
                      <Text style={styles.reportStudent}>{item.studentName}</Text>
                      <Text style={styles.reportDate}>{item.date}</Text>
                    </View>
                  </View>

                  <View style={styles.reportBottomButtonsRow}>
                    <TouchableOpacity
                      style={styles.btnSecondary}
                      activeOpacity={0.85}
                      onPress={() => handleSimulatePreview(item.title)}
                    >
                      <Icon name="buscar" size={14} color="#475569" style={{ marginRight: 4 }} />
                      <Text style={styles.btnSecondaryText}>Vista previa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnPrimaryCeleste}
                      activeOpacity={0.85}
                      onPress={() => handleSimulateDownload(`${item.title}.pdf`)}
                    >
                      <Icon name="descargar-pdf" size={15} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.btnCelesteText}>Descargar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 3. CIRCULARES & REGLAMENTOS */}
        {(activeCategory === 'TODOS' || activeCategory === 'CIRCULARES') && circularesList.length > 0 && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleWithIcon}>
                <Icon name="novedades" size={18} color="#854D0E" />
                <Text style={styles.sectionTitle}>Circulares & Reglamentos</Text>
              </View>
              <Text style={styles.sectionLinkBlue}>Institucional ({circularesList.length})</Text>
            </View>

            <View style={styles.cardsStack}>
              {circularesList.map((item) => (
                <View key={item.id} style={styles.docRowCard}>
                  <View style={styles.docRowLeft}>
                    <View style={styles.docIconBoxCeleste}>
                      <Icon name="novedades" size={18} color="#1A73E8" />
                    </View>
                    <View style={styles.docTextCol}>
                      <Text style={styles.docTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.docSub}>{item.subtitle}</Text>
                      <View style={styles.docMetaRow}>
                        <Text style={styles.docMetaDate}>{item.date}</Text>
                        <View style={styles.docMetaDot} />
                        <Text style={styles.docMetaSize}>{item.fileSize}</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.cloudDownloadBtn}
                    activeOpacity={0.8}
                    onPress={() => handleSimulateDownload(`${item.title}.pdf`)}
                  >
                    <Icon name="descargar-pdf" size={18} color="#1A73E8" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 4. FICHAS MÉDICAS Y APTOS FÍSICOS */}
        {(activeCategory === 'TODOS' || activeCategory === 'FICHAS') && fichasList.length > 0 && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleWithIcon}>
                <Icon name="primeros-auxilios" size={18} color="#005F2E" />
                <Text style={styles.sectionTitle}>Fichas Médicas & Aptos</Text>
              </View>
              <Text style={styles.sectionLink}>Vigentes ({fichasList.length})</Text>
            </View>

            <View style={styles.cardsStack}>
              {fichasList.map((item) => (
                <View key={item.id} style={styles.docRowCard}>
                  <View style={styles.docRowLeft}>
                    <View style={styles.docIconBoxGreen}>
                      <Icon name="primeros-auxilios" size={18} color="#005F2E" />
                    </View>
                    <View style={styles.docTextCol}>
                      <Text style={styles.docTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.docSub}>{item.studentName}</Text>
                      <View style={styles.docMetaRow}>
                        <Text style={styles.docMetaDate}>{item.date}</Text>
                        <View style={styles.docMetaDot} />
                        <Text style={styles.docMetaSize}>{item.fileSize}</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.cloudDownloadBtn}
                    activeOpacity={0.8}
                    onPress={() => handleSimulateDownload(`${item.title}.pdf`)}
                  >
                    <Icon name="descargar-pdf" size={18} color="#005F2E" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 5. SUBIR O ADJUNTAR DOCUMENTO */}
        <View style={styles.uploadSectionBanner}>
          <View style={styles.uploadTopRow}>
            <View style={styles.uploadIconCircle}>
              <Icon name="subir" size={20} color={colors.primary} />
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
                Selecciona el tipo de comprobante y destinatario en el Instituto:
              </Text>

              <TouchableOpacity
                style={styles.uploadModalDropzone}
                activeOpacity={0.8}
                onPress={() =>
                  Alert.alert(
                    'Documento Adjuntado',
                    'Archivo seleccionado con éxito. Listo para remitir.'
                  )
                }
              >
                <Icon
                  name={uploadType === 'PHOTO' ? 'camara' : 'adjunto'}
                  size={32}
                  color={colors.primary}
                />
                <Text style={styles.uploadModalDropzoneTitle}>
                  {uploadType === 'PHOTO' ? 'Abrir Cámara' : 'Seleccionar Archivo PDF'}
                </Text>
                <Text style={styles.uploadModalDropzoneHint}>
                  Formatos aceptados: JPG, PNG, PDF (hasta 5 MB)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmPinBtn}
                activeOpacity={0.88}
                onPress={() => {
                  setIsUploadModalOpen(false);
                  Alert.alert(
                    'Documento Enviado',
                    'Tu archivo fue remitido con éxito a la Secretaría Institucional.'
                  );
                }}
              >
                <Text style={styles.confirmPinBtnText}>Remitir a Secretaría</Text>
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

  /* 1. HERO WAVE BANNER */
  heroBanner: {
    backgroundColor: colors.primary,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroCircle2: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroBrandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  heroLogo: {
    width: 36,
    height: 36,
    marginRight: 10,
  },
  heroLogoSmall: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  brandTitleCol: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  heroTitleSmall: {
    fontSize: 13,
  },
  heroSubtitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 0.6,
    marginTop: 1,
  },
  heroActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notifBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  actionBtnSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
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
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#131B2E',
    padding: 0,
  },
  filterTuneBtn: {
    padding: 4,
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
    paddingHorizontal: 12,
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
  chipBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  chipBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  chipBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
  },
  chipBadgeTextActive: {
    color: '#FFFFFF',
  },

  /* BODY */
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 18,
  },

  /* EMPTY STATE */
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#131B2E',
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  clearSearchBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  clearSearchBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
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
  signedBadge: {
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 9999,
  },
  signedBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#005F2E',
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
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  urgentRedBorderLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.coral,
  },
  urgentGreenBorderLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.primary,
  },
  urgentCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 8,
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
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pendingTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.coral,
    letterSpacing: 0.4,
  },
  signedTag: {
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  signedTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#005F2E',
    letterSpacing: 0.4,
  },
  pendingDueText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  urgentTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#131B2E',
    lineHeight: 19,
  },
  urgentStudent: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#005F2E',
  },
  urgentIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signedIconBox: {
    backgroundColor: '#E8F7EE',
  },
  urgentDesc: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginTop: 8,
  },
  urgentButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  signButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.coral,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  signButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  signedConfirmedBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F7EE',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  signedConfirmedText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#005F2E',
  },
  previewBtnSmall: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },

  /* REPORT CARD */
  cardsStack: {
    gap: 10,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
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
    height: 48,
    borderRadius: 10,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: colors.primary,
    marginTop: 1,
  },
  reportInfoCol: {
    flex: 1,
  },
  reportBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  officialBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  officialBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#475569',
  },
  reportSizeText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  reportTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#131B2E',
  },
  reportStudent: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 1,
  },
  reportDate: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  reportBottomButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  btnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnSecondaryText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  btnPrimaryCeleste: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A73E8',
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnCelesteText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* DOC ROW CARD (Circulares / Fichas / Autorizaciones) */
  docRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  docRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  docIconBoxCeleste: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconBoxGreen: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docTextCol: {
    flex: 1,
  },
  docTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#131B2E',
  },
  docSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  docMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  docMetaDate: {
    fontSize: 10,
    color: '#94A3B8',
  },
  docMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CBD5E1',
  },
  docMetaSize: {
    fontSize: 10,
    color: '#94A3B8',
  },
  cloudDownloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  /* UPLOAD SECTION BANNER */
  uploadSectionBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  uploadTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  uploadIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTextCol: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#131B2E',
  },
  uploadDesc: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginTop: 3,
  },
  uploadActionsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  btnUploadPhoto: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  btnUploadPhotoText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1A73E8',
  },
  btnUploadPdf: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  btnUploadPdfText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#475569',
  },

  /* MODALS */
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
    paddingBottom: 34,
  },
  modalSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalSheetTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#131B2E',
  },
  modalSheetSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalSheetBody: {
    gap: 12,
  },
  pinInstructions: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 17,
  },
  pinDigitsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 10,
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
    color: '#131B2E',
  },
  pinAuditNotice: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  pinAuditText: {
    fontSize: 10.5,
    color: '#92400E',
    lineHeight: 14,
  },
  confirmPinBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  confirmPinBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  uploadModalDropzone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginVertical: 10,
  },
  uploadModalDropzoneTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#131B2E',
    marginTop: 8,
  },
  uploadModalDropzoneHint: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});
