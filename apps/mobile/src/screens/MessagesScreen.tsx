import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';

interface MessageThread {
  id: string;
  senderName: string;
  senderRole: string;
  subject: string;
  excerpt: string;
  time: string;
  unreadCount: number;
  statusColor: string;
}

export const MessagesScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'RECIBIDOS' | 'ENVIADOS' | 'PAPELERA'>('RECIBIDOS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);

  const [threads, setThreads] = useState<MessageThread[]>([
    {
      id: 'm1',
      senderName: 'Prof. Ana Martínez',
      senderRole: 'Lengua y Literatura',
      subject: 'Reunión del Consejo Asesor Escolar',
      excerpt: 'Estimadas familias: solicitamos confirmar la asistencia a la sesión del jueves...',
      time: '12:45 PM',
      unreadCount: 2,
      statusColor: '#10B981',
    },
    {
      id: 'm2',
      senderName: 'Prof. Carlos Gómez',
      senderRole: 'Educación Física y Deportes',
      subject: 'Evaluación de Coordinación - 2° Trimestre',
      excerpt: 'Buenas tardes: el próximo martes tomaremos la prueba de coordinación y postas...',
      time: '10:15 AM',
      unreadCount: 1,
      statusColor: '#3898EC',
    },
    {
      id: 'm3',
      senderName: 'Lic. Raquel Rodríguez',
      senderRole: 'Gabinete Psicopedagógico',
      subject: 'Seguimiento de evolución semestral',
      excerpt: 'Queremos agendar una breve entrevista para compartir observaciones del progreso...',
      time: 'Ayer',
      unreadCount: 0,
      statusColor: '#F59E0B',
    },
    {
      id: 'm4',
      senderName: 'Secretaría Académica',
      senderRole: 'Dirección del Nivel',
      subject: 'Vencimiento de Apto Físico 2026',
      excerpt: 'Recordamos que el certificado médico vence próximamente. Favor de cargarlo en la app...',
      time: '28 Oct',
      unreadCount: 0,
      statusColor: '#9CA3AF',
    },
  ]);

  const filtered = threads.filter(
    (t) =>
      t.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* 1. CURVED HERO BANNER */}
      <View style={styles.heroBanner}>
        <Text style={styles.heroTitle}>Comunicaciones</Text>
        <Text style={styles.heroSubtitle}>
          Recibe mensajes y comunicados oficiales directamente a tu celular.
        </Text>
      </View>

      {/* 2. FLOATING SEARCH BAR */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Buscar en mensajes o remitentes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor={colors.textMuted}
          />
        </View>
      </View>

      {/* 3. FILTER PILLS */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'RECIBIDOS' && styles.activeFilterPill]}
          onPress={() => setActiveFilter('RECIBIDOS')}
          activeOpacity={0.85}
        >
          <Text style={[styles.filterText, activeFilter === 'RECIBIDOS' && styles.activeFilterText]}>
            Recibidos (3)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'ENVIADOS' && styles.activeFilterPill]}
          onPress={() => setActiveFilter('ENVIADOS')}
          activeOpacity={0.85}
        >
          <Text style={[styles.filterText, activeFilter === 'ENVIADOS' && styles.activeFilterText]}>
            Enviados
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'PAPELERA' && styles.activeFilterPill]}
          onPress={() => setActiveFilter('PAPELERA')}
          activeOpacity={0.85}
        >
          <Text style={[styles.filterText, activeFilter === 'PAPELERA' && styles.activeFilterText]}>
            Papelera
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. MESSAGES LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.threadCard, item.unreadCount > 0 && styles.unreadThreadCard]}
            onPress={() => setSelectedThread(item)}
            activeOpacity={0.8}
          >
            {/* Avatar with Status Dot */}
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarLetters}>
                  {item.senderName.charAt(0)}
                  {item.senderName.split(' ')[1]?.charAt(0) || ''}
                </Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: item.statusColor }]} />
            </View>

            {/* Content Details */}
            <View style={styles.threadDetails}>
              <View style={styles.topRow}>
                <Text style={styles.senderName} numberOfLines={1}>
                  {item.senderName}
                </Text>
                <Text style={styles.threadTime}>{item.time}</Text>
              </View>

              <Text style={styles.senderRole} numberOfLines={1}>
                {item.senderRole}
              </Text>

              <Text style={styles.threadSubject} numberOfLines={1}>
                {item.subject}
              </Text>

              <Text style={styles.threadExcerpt} numberOfLines={2}>
                {item.excerpt}
              </Text>
            </View>

            {/* Unread Pill */}
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      {/* FAB (Redactar) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          Alert.alert(
            'Nuevo Mensaje',
            'Selecciona el docente o directivo a contactar dentro de la matriz de comunicación.'
          )
        }
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>✏️</Text>
      </TouchableOpacity>

      {/* Thread View Modal */}
      <Modal visible={!!selectedThread} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalSender}>{selectedThread?.senderName}</Text>
                <Text style={styles.modalRole}>{selectedThread?.senderRole}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedThread(null)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubject}>{selectedThread?.subject}</Text>
            <Text style={styles.modalBodyText}>{selectedThread?.excerpt}</Text>

            <View style={styles.modalFooterActions}>
              <TouchableOpacity
                style={styles.replyBtn}
                onPress={() => {
                  setSelectedThread(null);
                  Alert.alert(
                    'Respuesta Enviada',
                    'Tu mensaje fue transmitido en el canal oficial supervisado.'
                  );
                }}
              >
                <Text style={styles.replyBtnText}>Responder al Remitente</Text>
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
    backgroundColor: colors.background,
  },
  heroBanner: {
    backgroundColor: colors.primary,
    paddingTop: 18,
    paddingBottom: 34,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    lineHeight: 18,
  },
  searchWrapper: {
    paddingHorizontal: 20,
    marginTop: -20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginVertical: 14,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  activeFilterPill: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 90,
    gap: 10,
  },
  threadCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'flex-start',
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  unreadThreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderColor: colors.borderFocus,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetters: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  threadDetails: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  senderName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  threadTime: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  senderRole: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  threadSubject: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  threadExcerpt: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  unreadBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accentRed,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  fab: {
    position: 'absolute',
    right: 22,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  fabIcon: {
    fontSize: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalSender: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalRole: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  modalCloseText: {
    fontSize: 22,
    color: colors.textSecondary,
    padding: 4,
  },
  modalSubject: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalBodyText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  modalFooterActions: {
    marginTop: 14,
  },
  replyBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  replyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
