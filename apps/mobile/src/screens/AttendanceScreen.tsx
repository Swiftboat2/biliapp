import React, { useState } from 'react';
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
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useActiveStudent } from '../context/StudentContext';
import { colors } from '../theme/colors';
import { Icon } from '../components/Icon';
import { nextThreshold } from '../config/attendance';

interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  state: string;
  fractionValue: number;
  justificationStatus: 'APPROVED' | 'PENDING' | 'NOT_APPLICABLE' | 'REJECTED';
  notes?: string;
  time: string;
}

export const AttendanceScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { students, activeStudent, setActiveStudent } = useActiveStudent();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;
  const topInsetPadding = Math.max(insets.top, 24) + 10;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [certNotes, setCertNotes] = useState('');

  const [records, setRecords] = useState<AttendanceRecord[]>([
    {
      id: 'att-1',
      studentId: 'student-1', // Mateo
      date: 'Hoy, 04 Noviembre 2026',
      time: '13:10 hs',
      state: 'Tardanza (Ingreso posterior al horario)',
      fractionValue: 0.25,
      justificationStatus: 'NOT_APPLICABLE',
    },
    {
      id: 'att-2',
      studentId: 'student-1', // Mateo
      date: '28 de Octubre, 2026',
      time: '13:00 hs',
      state: 'Presente Puntual',
      fractionValue: 0,
      justificationStatus: 'APPROVED',
      notes: 'Asistencia completa y actividades en sala',
    },
    {
      id: 'att-3',
      studentId: 'student-1', // Mateo
      date: '15 de Octubre, 2026',
      time: 'Jornada Completa',
      state: 'Inasistencia con Certificado',
      fractionValue: 1.0,
      justificationStatus: 'APPROVED',
      notes: 'Certificado Pediatra presentado y homologado por Secretaría',
    },
    {
      id: 'att-4',
      studentId: 'student-2', // Sofía
      date: 'Hoy, 04 Noviembre 2026',
      time: '07:45 hs',
      state: 'Presente Puntual (Puerta Principal)',
      fractionValue: 0,
      justificationStatus: 'APPROVED',
      notes: 'Ingreso puntual registrado con credencial digital',
    },
    {
      id: 'att-5',
      studentId: 'student-2', // Sofía
      date: '02 de Octubre, 2026',
      time: '11:30 hs',
      state: 'Retiro Anticipado Justificado',
      fractionValue: 0.5,
      justificationStatus: 'PENDING',
      notes: 'Certificado Odontológico presentado — En revisión por Preceptoría',
    },
    {
      id: 'att-6',
      studentId: 'student-2', // Sofía
      date: '22 de Septiembre, 2026',
      time: '07:50 hs',
      state: 'Presente Puntual',
      fractionValue: 0,
      justificationStatus: 'APPROVED',
      notes: 'Día regular de clases y educación física',
    },
  ]);

  const currentStudent = activeStudent || students[0];
  const isKinder = currentStudent?.educationalLevel === 'INICIAL';
  const studentRecords = records.filter((r) => r.studentId === currentStudent?.id);

  const totalAbsences = studentRecords.reduce((sum, item) => sum + item.fractionValue, 0);
  const attendanceRate = isKinder ? '96%' : '98%';

  const handleOpenJustifyModal = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleSaveJustification = () => {
    if (!selectedRecord) return;
    setRecords((prev) =>
      prev.map((item) =>
        item.id === selectedRecord.id
          ? { ...item, justificationStatus: 'PENDING', notes: certNotes || 'Certificado adjuntado por la familia' }
          : item
      )
    );
    setModalVisible(false);
    setCertNotes('');
    Alert.alert('Certificado Enviado', 'El comprobante médico fue remitido a Preceptoría para su validación oficial.');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 1. HERO WAVE BANNER INSTITUCIONAL CON BOTÓN VOLVER */}
        <View style={[styles.heroBanner, { paddingTop: topInsetPadding }]}>
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />

          {/* Top Bar with Back Button and Brand */}
          <View style={styles.heroTopRow}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.8}
              onPress={() => navigation?.goBack?.() || navigation?.navigate?.('Inicio')}
            >
              <Icon name="volver" size={20} color="#FFFFFF" />
            </TouchableOpacity>

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
                <Text style={styles.heroSubtitle}>ENTRE RÍOS · ASISTENCIA 2026</Text>
              </View>
            </View>
          </View>

          {/* Title & Context */}
          <View style={styles.heroTextSection}>
            <View style={styles.heroContextPill}>
              <Icon name="graduacion" size={12} color="#FFFFFF" />
              <Text style={styles.heroContextText}>REGISTRO DE ASISTENCIA DIARIA</Text>
            </View>
            <Text style={[styles.heroMainTitle, isSmallScreen && styles.heroMainTitleSmall]}>
              Control de Asistencia
            </Text>
            <Text style={styles.heroMainSubtitle} numberOfLines={1}>
              Cómputo de faltas, fracciones de tardanza y justificaciones médicas.
            </Text>
          </View>
        </View>

        {/* BODY CONTENT */}
        <View style={styles.bodyContent}>
          {/* 2. SELECTOR DE ESTUDIANTE SEGMENTADO */}
          <View style={styles.segmentContainer}>
            <View style={styles.segmentBackground}>
              {students.map((student) => {
                const isSelected = currentStudent?.id === student.id;
                const studentIsKinder = student.educationalLevel === 'INICIAL';
                return (
                  <TouchableOpacity
                    key={student.id}
                    style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
                    onPress={() => setActiveStudent(student)}
                    activeOpacity={0.88}
                  >
                    <Icon
                      name="usuario"
                      size={15}
                      color={isSelected ? colors.primary : '#64748B'}
                    />
                    <Text
                      style={[styles.segmentText, isSelected && styles.segmentTextActive]}
                      numberOfLines={1}
                    >
                      {student.firstName} ({studentIsKinder ? 'Sala 4' : '4° Grado "B"'})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 3. RESUMEN MÉTRICO INSTITUCIONAL */}
          <View style={styles.metricCard}>
            <View style={styles.metricCardAccent} />
            <View style={styles.metricContentRow}>
              <View style={styles.metricTextCol}>
                <Text style={styles.metricStudentName}>
                  {currentStudent?.firstName} {currentStudent?.lastName}
                </Text>
                <Text style={styles.metricCourse}>
                  {currentStudent?.courseName} · {isKinder ? 'Turno Tarde' : 'Turno Mañana'}
                </Text>

                <View style={styles.metricAbsencesRow}>
                  <View style={styles.metricAbsenceItem}>
                    <Text style={styles.metricAbsenceNum}>{totalAbsences}</Text>
                    <Text style={styles.metricAbsenceLabel}>Faltas computadas</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricAbsenceItem}>
                    <Text style={styles.metricAbsenceLimit}>{nextThreshold(totalAbsences).value}</Text>
                    <Text style={styles.metricAbsenceLabel}>{nextThreshold(totalAbsences).label}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.metricCircleBadge}>
                <Text style={styles.metricRateNum}>{attendanceRate}</Text>
                <Text style={styles.metricRateLabel}>ASISTENCIA</Text>
                <View style={styles.regularPill}>
                  <Text style={styles.regularPillText}>Regular</Text>
                </View>
              </View>
            </View>

            <View style={styles.metricNoticeBox}>
              <Icon name="novedades" size={13} color="#005F2E" />
              <Text style={styles.metricNoticeText}>
                El cómputo de 1/4 falta corresponde a tardanzas y 1/2 falta a retiros anticipados.
              </Text>
            </View>
          </View>

          {/* 4. HISTORIAL DE REGISTROS */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithDot}>
              <View style={styles.greenBar} />
              <Text style={styles.sectionTitle}>Historial del Período</Text>
            </View>
            <Text style={styles.sectionCountText}>{studentRecords.length} registros</Text>
          </View>

          <View style={styles.recordsList}>
            {studentRecords.map((item) => {
              const isApproved = item.justificationStatus === 'APPROVED';
              const isPending = item.justificationStatus === 'PENDING';
              const isUnjustified = item.justificationStatus === 'NOT_APPLICABLE' && item.fractionValue > 0;

              return (
                <View key={item.id} style={styles.recordCard}>
                  <View style={styles.recordHeaderRow}>
                    <View style={styles.recordDateWrap}>
                      <Icon name="calendario" size={13} color="#64748B" />
                      <Text style={styles.recordDateText}>{item.date}</Text>
                      <Text style={styles.recordTimeText}>• {item.time}</Text>
                    </View>
                    <View
                      style={[
                        styles.fractionBadge,
                        item.fractionValue === 0 && styles.fractionBadgeZero,
                        item.fractionValue > 0 && styles.fractionBadgeWarning,
                      ]}
                    >
                      <Text
                        style={[
                          styles.fractionBadgeText,
                          item.fractionValue === 0 && styles.fractionBadgeTextZero,
                          item.fractionValue > 0 && styles.fractionBadgeTextWarning,
                        ]}
                      >
                        {item.fractionValue === 0 ? 'Sin cómputo' : `+${item.fractionValue} falta`}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.recordStateText}>{item.state}</Text>

                  {item.notes && (
                    <View style={styles.recordNotesBox}>
                      <Icon name="archivo" size={13} color="#005F2E" />
                      <Text style={styles.recordNotesText}>{item.notes}</Text>
                    </View>
                  )}

                  <View style={styles.recordFooterRow}>
                    {isApproved && (
                      <View style={styles.statusBadgeApproved}>
                        <Icon name="check" size={11} color="#005F2E" />
                        <Text style={styles.statusBadgeTextApproved}>Regularizada</Text>
                      </View>
                    )}

                    {isPending && (
                      <View style={styles.statusBadgePending}>
                        <Icon name="historial" size={11} color="#B45309" />
                        <Text style={styles.statusBadgeTextPending}>En revisión por Preceptoría</Text>
                      </View>
                    )}

                    {isUnjustified && (
                      <TouchableOpacity
                        style={styles.justifyActionBtn}
                        activeOpacity={0.85}
                        onPress={() => handleOpenJustifyModal(item)}
                      >
                        <Icon name="subir" size={13} color="#FFFFFF" />
                        <Text style={styles.justifyActionBtnText}>Subir Certificado Médico</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      {/* MODAL ADJUNTAR JUSTIFICACIÓN MÉDICA */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Adjuntar Justificación Médica</Text>
                <Text style={styles.modalSubtitle}>
                  {currentStudent?.firstName} ({selectedRecord?.date})
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Icon name="cerrar" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.uploadBox}
              activeOpacity={0.85}
              onPress={() => Alert.alert('Selección de Archivo', 'Cámara y selector de PDF habilitados.')}
            >
              <View style={styles.uploadIconCircle}>
                <Icon name="camara" size={24} color={colors.primary} />
              </View>
              <Text style={styles.uploadTitle}>Tomar foto o subir comprobante PDF</Text>
              <Text style={styles.uploadHint}>Formatos admitidos: JPG, PNG o PDF firmado (máx. 5 MB)</Text>
            </TouchableOpacity>

            <Text style={styles.inputLabel}>Diagnóstico médico o motivo:</Text>
            <TextInput
              placeholder="Ej: Cuadro febril 48 hs con reposo indicado por pediatra..."
              placeholderTextColor="#94A3B8"
              value={certNotes}
              onChangeText={setCertNotes}
              style={styles.textInput}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleSaveJustification}
              >
                <Icon name="firma-digital" size={16} color="#FFFFFF" />
                <Text style={styles.modalSubmitText}>Enviar a Preceptoría</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  heroTitleSmall: {
    fontSize: 13,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginTop: 1,
  },
  heroTextSection: {
    marginTop: 18,
  },
  heroContextPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    gap: 5,
    marginBottom: 8,
  },
  heroContextText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroMainTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  heroMainTitleSmall: {
    fontSize: 19,
  },
  heroMainSubtitle: {
    color: 'rgba(255, 255, 255, 0.88)',
    fontSize: 12.5,
    fontWeight: '500',
    marginTop: 4,
    lineHeight: 17,
  },

  /* BODY */
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  /* SEGMENT SELECTOR */
  segmentContainer: {
    marginBottom: 16,
  },
  segmentBackground: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 9,
    gap: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  segmentTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },

  /* METRIC CARD */
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    overflow: 'hidden',
  },
  metricCardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.primary,
  },
  metricContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  metricTextCol: {
    flex: 1,
    marginRight: 12,
  },
  metricStudentName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#131B2E',
  },
  metricCourse: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  metricAbsencesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  metricAbsenceItem: {
    alignItems: 'flex-start',
  },
  metricAbsenceNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#B45309',
  },
  metricAbsenceLimit: {
    fontSize: 18,
    fontWeight: '900',
    color: '#64748B',
  },
  metricAbsenceLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  metricCircleBadge: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  metricRateNum: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.primary,
  },
  metricRateLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  regularPill: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    marginTop: 2,
  },
  regularPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  metricNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginTop: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricNoticeText: {
    fontSize: 11,
    color: '#475569',
    flex: 1,
    lineHeight: 15,
  },

  /* SECTION HEADER */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleWithDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greenBar: {
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#131B2E',
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },

  /* RECORDS LIST */
  recordsList: {
    gap: 12,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  recordHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recordDateWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recordDateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#131B2E',
  },
  recordTimeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  fractionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  fractionBadgeZero: {
    backgroundColor: '#E8F7EE',
  },
  fractionBadgeWarning: {
    backgroundColor: '#FEF3C7',
  },
  fractionBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  fractionBadgeTextZero: {
    color: '#005F2E',
  },
  fractionBadgeTextWarning: {
    color: '#92400E',
  },
  recordStateText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#131B2E',
    marginBottom: 6,
  },
  recordNotesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
    gap: 6,
    marginBottom: 8,
  },
  recordNotesText: {
    fontSize: 11.5,
    color: '#166534',
    flex: 1,
  },
  recordFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 4,
  },
  statusBadgeApproved: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeTextApproved: {
    fontSize: 11,
    fontWeight: '800',
    color: '#005F2E',
  },
  statusBadgePending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeTextPending: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  justifyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 6,
  },
  justifyActionBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* MODAL */
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
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#131B2E',
  },
  modalSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginBottom: 14,
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#131B2E',
  },
  uploadHint: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 3,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#131B2E',
    textAlignVertical: 'top',
    height: 75,
    marginBottom: 16,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  modalSubmitBtn: {
    flex: 1.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.primary,
    gap: 6,
    paddingVertical: 12,
  },
  modalSubmitText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
