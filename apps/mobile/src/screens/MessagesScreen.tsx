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
      senderName: 'Ana Martínez',
      senderRole: 'Profesora de Lengua y Literatura',
      subject: 'Reunión del Consejo Escolar',
      excerpt: 'Estimadas familias: solicitamos confirmar la asistencia a la sesión del jueves...',
      time: '12:45 PM',
      unreadCount: 2,
      statusColor: '#10B981',
    },
    {
      id: 'm2',
      senderName: 'Carlos Gómez',
      senderRole: 'Profesor de Educación Física',
      subject: 'Evaluación del 2° Trimestre',
      excerpt: 'Buenas tardes: el próximo martes tomaremos la prueba de coordinación y resistencia...',
      time: '10:15 AM',
      unreadCount: 1,
      statusColor: '#3B82F6',
    },
    {
      id: 'm3',
      senderName: 'Lic. Raquel Rodríguez',
      senderRole: 'Gabinete Psicopedagógico',
      subject: 'Seguimiento pedagógico y evolución',
      excerpt: 'Queremos agendar una breve videollamada para compartir observaciones del progreso...',
      time: 'Ayer',
      unreadCount: 0,
      statusColor: '#F59E0B',
    },
    {
      id: 'm4',
      senderName: 'Secretaría Institucional',
      senderRole: 'Administración y Aranceles',
      subject: 'Comprobante de Apto Físico 2026',
      excerpt: 'Recordamos que el certificado médico vence próximamente. Favor de cargarlo en la app...',
      time: '28 Oct',
      unreadCount: 0,
      statusColor: '#94A3B8',
    },
  ]);

  const filtered = threads.filter(
    (t) =>
      t.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Top Title Banner */}
      <View style={styles.topBanner}>
        <Text style={styles.bannerTitle}>Comunicaciones</Text>
        <Text style={styles.bannerSubtitle}>
          Recibe mensajes y comunicados oficiales directamente en tu celular.
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Buscar conversaciones..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'RECIBIDOS' && styles.activeFilterPill]}
          onPress={() => setActiveFilter('RECIBIDOS')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterText, activeFilter === 'RECIBIDOS' && styles.activeFilterText]}>
            Recibidos (3)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'ENVIADOS' && styles.activeFilterPill]}
          onPress={() => setActiveFilter('ENVIADOS')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterText, activeFilter === 'ENVIADOS' && styles.activeFilterText]}>
            Enviados
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'PAPELERA' && styles.activeFilterPill]}
          onPress={() => setActiveFilter('PAPELERA')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterText, activeFilter === 'PAPELERA' && styles.activeFilterText]}>
            Papelera
          </Text>
        </TouchableOpacity>
      </View>

      {/* Messages Thread List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.threadItem, item.unreadCount > 0 && styles.unreadThreadItem]}
            onPress={() => setSelectedThread(item)}
            activeOpacity={0.7}
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

            {/* Content Col */}
            <View style={styles.threadContent}>
              <View style={styles.threadTopRow}>
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

      {/* Floating Action Button (Redactar) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => Alert.alert('Nuevo Mensaje', 'Selecciona el docente o directivo a contactar según la matriz institucional de comunicación.')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>✏️</Text>
      </TouchableOpacity>

      {/* Thread View Modal */}
      <Modal visible={!!selectedThread} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
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
                  Alert.alert('Respuesta Enviada', 'Tu respuesta fue enviada en el canal oficial supervisado.');
                }}
              >
                <Text style={styles.replyBtnText}>Responder al Docente</Text>
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
  topBanner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    gap: 8,
    marginVertical: 12,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
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
    paddingHorizontal: 18,
    paddingBottom: 80,
    gap: 8,
  },
  threadItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-start',
  },
  unreadThreadItem: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.primaryMuted,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetters: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  threadContent: {
    flex: 1,
  },
  threadTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  senderName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  threadTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  senderRole: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 1,
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
    backgroundColor: colors.primary,
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
    right: 20,
    bottom: 24,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalSender: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalRole: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  modalCloseText: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  modalSubject: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
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
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  replyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

