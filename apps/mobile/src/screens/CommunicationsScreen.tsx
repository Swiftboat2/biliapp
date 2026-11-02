import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useActiveStudent } from '../context/StudentContext';

interface CircularMock {
  id: string;
  title: string;
  date: string;
  content: string;
  requiresPin: boolean;
  isPinConfirmed: boolean;
  confirmedAt?: string;
}

export const CommunicationsScreen: React.FC = () => {
  const { activeStudent } = useActiveStudent();

  const [circulars, setCirculars] = useState<CircularMock[]>([
    {
      id: 'circ-1',
      title: 'Autorización Salida Educativa al Bioparque',
      date: 'Hoy, 08:30 hs',
      content:
        'Estimadas familias: El próximo viernes 14 realizaremos la salida didáctica al Bioparque Temaikèn. Solicitamos autorización de traslado en micro y permanencia.',
      requiresPin: true,
      isPinConfirmed: false,
    },
    {
      id: 'circ-2',
      title: 'Cronograma de Exámenes Integradores 1° Trimestre',
      date: '26 de Octubre, 2026',
      content:
        'Compartimos las fechas y temarios de evaluaciones del período para las asignaturas principales. Rogamos revisar las carpetas de los alumnos.',
      requiresPin: false,
      isPinConfirmed: false,
    },
    {
      id: 'circ-3',
      title: 'Autorización de Uso de Imagen Institucional',
      date: '10 de Marzo, 2026',
      content:
        'Consentimiento para fotografías y videos pedagógicos en el anuario y redes del colegio.',
      requiresPin: true,
      isPinConfirmed: true,
      confirmedAt: 'Confirmado el 10/03/2026 a las 14:22 hs con PIN',
    },
  ]);

  const [selectedCircular, setSelectedCircular] = useState<CircularMock | null>(null);
  const [pin, setPin] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenSignModal = (item: CircularMock) => {
    setSelectedCircular(item);
    setPin('');
    setModalVisible(true);
  };

  const handleConfirmPin = () => {
    if (pin.length !== 6) {
      Alert.alert('PIN Inválido', 'El PIN de tutor debe tener exactamente 6 dígitos numéricos.');
      return;
    }

    // In demo mode or connected to backend: PIN 123456
    if (selectedCircular) {
      setCirculars((prev) =>
        prev.map((c) =>
          c.id === selectedCircular.id
            ? {
                ...c,
                isPinConfirmed: true,
                confirmedAt: `Confirmado hoy a las ${new Date().toLocaleTimeString().slice(0, 5)} hs con PIN`,
              }
            : c
        )
      );
      setModalVisible(false);
      Alert.alert('Autorización Registrada', 'Tu consentimiento digital ha sido firmado con éxito.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Circulares y Comunicados Oficiales</Text>
      <Text style={styles.subTitle}>
        Mostrando avisos para: <strong>{activeStudent?.firstName} ({activeStudent?.courseName})</strong>
      </Text>

      <FlatList
        data={circulars}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDate}>{item.date}</Text>
            </View>
            <Text style={styles.cardContent}>{item.content}</Text>

            {item.requiresPin && (
              <View style={styles.pinSection}>
                {item.isPinConfirmed ? (
                  <View style={styles.signedBadge}>
                    <Text style={styles.signedBadgeText}>✓ {item.confirmedAt}</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.signBtn}
                    onPress={() => handleOpenSignModal(item)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.signBtnText}>✍️ Firmar Autorización con PIN</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      />

      {/* Modal Firma con PIN */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirmación Digital con PIN</Text>
            <Text style={styles.modalDesc}>
              Ingresa tu PIN de tutor de 6 dígitos para autorizar:{'\n'}
              <Text style={styles.modalHighlight}>{selectedCircular?.title}</Text>
            </Text>

            <TextInput
              placeholder="••••••"
              value={pin}
              onChangeText={setPin}
              keyboardType="numeric"
              maxLength={6}
              secureTextEntry
              style={styles.pinInput}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleConfirmPin}
              >
                <Text style={styles.submitBtnText}>Autorizar</Text>
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
  title: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  subTitle: { fontSize: 12, color: '#64748b', marginTop: 2, marginBottom: 14 },
  list: { gap: 12, paddingBottom: 24 },
  card: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { marginBottom: 6 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  cardDate: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  cardContent: { fontSize: 13, color: '#475569', lineHeight: 18 },
  pinSection: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10 },
  signBtn: { backgroundColor: '#1e3a8a', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 8, alignItems: 'center' },
  signBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  signedBadge: { backgroundColor: '#dcfce7', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  signedBadgeText: { color: '#166534', fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { backgroundColor: '#ffffff', borderRadius: 18, padding: 22, width: '100%', maxWidth: 360, gap: 14, alignItems: 'center' },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  modalDesc: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 17 },
  modalHighlight: { color: '#1e3a8a', fontWeight: '700' },
  pinInput: {
    width: 160,
    height: 48,
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 10,
    fontWeight: '800',
    backgroundColor: '#eff6ff',
  },
  modalButtons: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 6 },
  cancelBtn: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1' },
  cancelBtnText: { color: '#64748b', fontWeight: '700', fontSize: 13 },
  submitBtn: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 10, backgroundColor: '#1e3a8a' },
  submitBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
});

