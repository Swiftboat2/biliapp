import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useActiveStudent } from '../context/StudentContext';

interface AttendanceDetailMock {
  id: string;
  date: string;
  state: string;
  fractionValue: number;
  justificationStatus: 'APPROVED' | 'PENDING' | 'NOT_APPLICABLE' | 'REJECTED';
  notes?: string;
}

export const AttendanceScreen: React.FC = () => {
  const { activeStudent } = useActiveStudent();

  const [history, setHistory] = useState<AttendanceDetailMock[]>([
    {
      id: 'att-1',
      date: '28 de Octubre, 2026',
      state: 'Tardanza (Ingreso 08:25 hs)',
      fractionValue: 0.25,
      justificationStatus: 'NOT_APPLICABLE',
    },
    {
      id: 'att-2',
      date: '15 de Octubre, 2026',
      state: 'Inasistencia Jornada Completa',
      fractionValue: 1.0,
      justificationStatus: 'APPROVED',
      notes: 'Certificado Pediatra presentado y aprobado',
    },
    {
      id: 'att-3',
      date: '02 de Octubre, 2026',
      state: 'Retiro Anticipado (11:30 hs)',
      fractionValue: 0.5,
      justificationStatus: 'PENDING',
      notes: 'Certificado Odontológico en revisión por Preceptoría',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceDetailMock | null>(null);
  const [certNotes, setCertNotes] = useState('');

  const totalAbsences = history.reduce((sum, item) => sum + item.fractionValue, 0);

  const handleOpenJustifyModal = (record: AttendanceDetailMock) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleSaveJustification = () => {
    if (!selectedRecord) return;
    setHistory((prev) =>
      prev.map((item) =>
        item.id === selectedRecord.id
          ? { ...item, justificationStatus: 'PENDING', notes: certNotes || 'Certificado adjuntado' }
          : item
      )
    );
    setModalVisible(false);
    setCertNotes('');
    Alert.alert('Certificado Enviado', 'El comprobante fue enviado a Preceptoría para su aprobación.');
  };

  return (
    <View style={styles.container}>
      {/* Header Metric Card */}
      <View style={styles.metricBanner}>
        <View>
          <Text style={styles.metricLabel}>Total Faltas Acumuladas</Text>
          <Text style={styles.metricTotal}>{totalAbsences} faltas</Text>
          <Text style={styles.metricNotice}>Límite institucional de alerta: 15 faltas</Text>
        </View>
        <View style={styles.statusCircle}>
          <Text style={styles.statusCircleText}>Regular</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Historial de Inasistencias y Faltas</Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Text style={styles.cardFraction}>+{item.fractionValue} falta</Text>
            </View>
            <Text style={styles.cardState}>{item.state}</Text>

            {item.notes && <Text style={styles.cardNotes}>📝 {item.notes}</Text>}

            <View style={styles.cardFooter}>
              {item.justificationStatus === 'APPROVED' && (
                <Text style={styles.badgeApproved}>✓ Justificada</Text>
              )}
              {item.justificationStatus === 'PENDING' && (
                <Text style={styles.badgePending}>⏳ En revisión por Preceptoría</Text>
              )}
              {item.justificationStatus === 'NOT_APPLICABLE' && (
                <TouchableOpacity
                  style={styles.justifyBtn}
                  onPress={() => handleOpenJustifyModal(item)}
                >
                  <Text style={styles.justifyBtnText}>📎 Subir Certificado Médico</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />

      {/* Modal Subir Certificado */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adjuntar Justificación Médica</Text>
            <Text style={styles.modalSubtitle}>
              Para: {activeStudent?.firstName} ({selectedRecord?.date})
            </Text>

            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8}>
              <Text style={styles.uploadEmoji}>📷</Text>
              <Text style={styles.uploadText}>Tomar foto o subir PDF del certificado</Text>
              <Text style={styles.uploadHint}>Formatos admitidos: JPG, PNG o PDF (hasta 5MB)</Text>
            </TouchableOpacity>

            <TextInput
              placeholder="Diagnóstico o motivo (ej: Cuadro febril 48hs)..."
              value={certNotes}
              onChangeText={setCertNotes}
              style={styles.textInput}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSaveJustification}
              >
                <Text style={styles.submitBtnText}>Enviar a Preceptoría</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  metricBanner: {
    backgroundColor: '#1e3a8a',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricLabel: { color: '#93c5fd', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  metricTotal: { color: '#ffffff', fontSize: 26, fontWeight: '800', marginVertical: 2 },
  metricNotice: { color: '#bfdbfe', fontSize: 11 },
  statusCircle: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusCircleText: { color: '#ffffff', fontWeight: '700', fontSize: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  list: { gap: 12, paddingBottom: 24 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  cardDate: { fontSize: 13, fontWeight: '700', color: '#334155' },
  cardFraction: { fontSize: 13, fontWeight: '800', color: '#dc2626' },
  cardState: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  cardNotes: { fontSize: 12, color: '#64748b', marginTop: 6, fontStyle: 'italic' },
  cardFooter: { marginTop: 12, flexDirection: 'row' },
  badgeApproved: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgePending: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  justifyBtn: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  justifyBtnText: { color: '#1d4ed8', fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 14,
  },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  modalSubtitle: { fontSize: 13, color: '#64748b', marginTop: -8 },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  uploadEmoji: { fontSize: 32, marginBottom: 6 },
  uploadText: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  uploadHint: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  textInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1' },
  cancelBtnText: { color: '#64748b', fontWeight: '700', fontSize: 13 },
  submitBtn: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 10, backgroundColor: '#1e3a8a' },
  submitBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
});

