import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useActiveStudent } from '../context/StudentContext';

interface AuthorizedPersonMock {
  id: string;
  name: string;
  dni: string;
  relationship: string;
  isPermanent: boolean;
  validUntil?: string;
}

export const PickupScreen: React.FC = () => {
  const { activeStudent } = useActiveStudent();

  const [authorizedList, setAuthorizedList] = useState<AuthorizedPersonMock[]>([
    {
      id: 'p-1',
      name: 'Mariana López',
      dni: '32.441.908',
      relationship: 'Madre (Contacto Primario)',
      isPermanent: true,
    },
    {
      id: 'p-2',
      name: 'Clara Domínguez',
      dni: '14.220.811',
      relationship: 'Abuela Materna',
      isPermanent: true,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [dni, setDni] = useState('');
  const [relationship, setRelationship] = useState('');

  const handleAddEventual = () => {
    if (!fullName || !dni || !relationship) {
      Alert.alert('Datos Incompletos', 'Por favor completa todos los campos para autorizar el retiro.');
      return;
    }

    const newPerson: AuthorizedPersonMock = {
      id: `p-${Date.now()}`,
      name: fullName,
      dni,
      relationship: `${relationship} (Autorización de Hoy)`,
      isPermanent: false,
      validUntil: 'Hoy hasta el cierre del turno',
    };

    setAuthorizedList((prev) => [newPerson, ...prev]);
    setModalVisible(false);
    setFullName('');
    setDni('');
    setRelationship('');

    Alert.alert(
      'Autorización Registrada',
      `Se ha habilitado en la puerta de salida a ${fullName} (DNI ${dni}) para retirar a ${activeStudent?.firstName} durante la jornada de hoy.`
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topNotice}>
        <Text style={styles.topNoticeTitle}>🛡️ Seguridad Física en Puerta</Text>
        <Text style={styles.topNoticeDesc}>
          El personal de puerta (preceptoría) solo permitirá el egreso de {activeStudent?.firstName} con
          las personas que figuren en este padrón verificado.
        </Text>
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Padrón de Retiro Autorizado</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>+ Autorizar por Hoy</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={authorizedList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{item.name}</Text>
              {item.isPermanent ? (
                <Text style={styles.badgePermanent}>Permanente</Text>
              ) : (
                <Text style={styles.badgeEventual}>Eventual (Hoy)</Text>
              )}
            </View>
            <Text style={styles.cardDni}>DNI: {item.dni}</Text>
            <Text style={styles.cardRel}>{item.relationship}</Text>
            {item.validUntil && (
              <Text style={styles.validUntilText}>⏰ Válido: {item.validUntil}</Text>
            )}
          </View>
        )}
      />

      {/* Modal Autorizar Eventual */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Autorizar Retiro por el Día</Text>
            <Text style={styles.modalSubtitle}>
              Para retirar a: <strong>{activeStudent?.firstName} {activeStudent?.lastName}</strong>
            </Text>

            <TextInput
              placeholder="Nombre y Apellido completo..."
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
            />
            <TextInput
              placeholder="Número de DNI (sin puntos)..."
              value={dni}
              onChangeText={setDni}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Parentesco / Vínculo (ej: Tío, Vecina, Transporte)..."
              value={relationship}
              onChangeText={setRelationship}
              style={styles.input}
            />

            <View style={styles.securityWarning}>
              <Text style={styles.securityWarningText}>
                ⚠️ Al confirmar, el sistema de puerta recibirá esta autorización de forma inmediata con tu firma digital de tutor.
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleAddEventual}
              >
                <Text style={styles.confirmBtnText}>Confirmar y Habilitar</Text>
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
  topNotice: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  topNoticeTitle: { fontSize: 13, fontWeight: '700', color: '#1e3a8a', marginBottom: 4 },
  topNoticeDesc: { fontSize: 12, color: '#1d4ed8', lineHeight: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  addBtn: { backgroundColor: '#1e3a8a', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  addBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  list: { gap: 10, paddingBottom: 24 },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardName: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  badgePermanent: { backgroundColor: '#dcfce7', color: '#166534', fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeEventual: { backgroundColor: '#fef3c7', color: '#92400e', fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  cardDni: { fontSize: 12, color: '#64748b' },
  cardRel: { fontSize: 13, fontWeight: '600', color: '#2563eb', marginTop: 2 },
  validUntilText: { fontSize: 11, color: '#b45309', fontWeight: '600', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 12 },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  modalSubtitle: { fontSize: 13, color: '#64748b', marginTop: -6, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 12, fontSize: 13 },
  securityWarning: { backgroundColor: '#fef2f2', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#fecaca' },
  securityWarningText: { fontSize: 11, color: '#991b1b', lineHeight: 15 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 6 },
  cancelBtn: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1' },
  cancelBtnText: { color: '#64748b', fontWeight: '700', fontSize: 13 },
  confirmBtn: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 10, backgroundColor: '#1e3a8a' },
  confirmBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
});

