import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';

interface ConversationItem {
  id: string;
  senderName: string;
  senderRole: string;
  subject: string;
  excerpt: string;
  time: string;
  tag: string;
  tagType: 'INICIAL' | 'DEPORTE' | 'GABINETE' | 'SECRETARIA';
  unreadCount: number;
  onlineDotColor?: string;
  hasAttachment?: boolean;
  isRead?: boolean;
}

export const MessagesScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<
    'TODOS' | 'NO_LEIDOS' | 'INSTITUCIONAL' | 'ENVIADOS' | 'PAPELERA'
  >('TODOS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<ConversationItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState('Seño Valentina (Sala de 4)');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const [conversations, setConversations] = useState<ConversationItem[]>([
    {
      id: 'c1',
      senderName: 'Seño Valentina · Sala de 4',
      senderRole: 'Docente Nivel Inicial',
      subject: 'Resumen semanal y taller bicultural de arte 🎨🇮🇹',
      excerpt:
        '¡Hola familia! Les comparto que Mateo participó con entusiasmo cantando en italiano y preparando su propia obra con témperas...',
      time: '12:45 PM',
      tag: 'NIVEL INICIAL',
      tagType: 'INICIAL',
      unreadCount: 2,
      onlineDotColor: colors.primary,
      isRead: false,
    },
    {
      id: 'c2',
      senderName: 'Prof. Carlos Gómez · Ed. Física',
      senderRole: 'Educación Física',
      subject: '🏊 Ficha médica y apto físico para natación',
      excerpt:
        'Recordamos enviar el apto médico actualizado antes del viernes para habilitar el ingreso al natatorio del club...',
      time: 'Ayer',
      tag: 'DEPORTE ESCOLAR',
      tagType: 'DEPORTE',
      unreadCount: 1,
      onlineDotColor: '#1A73E8',
      isRead: false,
    },
    {
      id: 'c3',
      senderName: 'Lic. Andrea Paz · Psicopedagogía',
      senderRole: 'Gabinete Psicopedagógico',
      subject: 'Devolución de observación evolutiva',
      excerpt:
        'Coordinamos una breve reunión virtual para repasar los avances de adaptación y dinámicas de socialización observadas...',
      time: '26 Oct',
      tag: 'SEGUIMIENTO PERSONAL',
      tagType: 'GABINETE',
      unreadCount: 0,
      onlineDotColor: '#F59E0B',
      isRead: true,
    },
    {
      id: 'c4',
      senderName: 'Secretaría Administrativa',
      senderRole: 'Administración y Aranceles',
      subject: '📢 Circular N° 14: Cuotas y rematriculación 2027',
      excerpt:
        'Se encuentra disponible en la sección Archivos la planilla de confirmación de vacante y aranceles para el próximo ciclo lectivo...',
      time: '22 Oct',
      tag: 'INSTITUCIONAL',
      tagType: 'SECRETARIA',
      unreadCount: 0,
      onlineDotColor: colors.primary,
      hasAttachment: true,
      isRead: true,
    },
  ]);

  // Filter logic
  const filteredList = conversations.filter((c) => {
    // Search query
    const matchQuery =
      c.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchQuery) return false;

    if (activeFilter === 'NO_LEIDOS') return c.unreadCount > 0;
    if (activeFilter === 'INSTITUCIONAL') return c.tagType === 'SECRETARIA';
    if (activeFilter === 'ENVIADOS') return false; // Demo empty
    if (activeFilter === 'PAPELERA') return false; // Demo empty
    return true;
  });

  const handleMarkAllRead = () => {
    setConversations((prev) =>
      prev.map((c) => ({ ...c, unreadCount: 0, isRead: true }))
    );
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    Alert.alert('Mensaje enviado', 'Tu consulta fue entregada a la institución.');
    setReplyText('');
    setSelectedChat(null);
  };

  const handleSendNewMessage = () => {
    if (!composeSubject.trim() || !composeBody.trim()) {
      Alert.alert('Campos incompletos', 'Ingresa asunto y mensaje antes de enviar.');
      return;
    }
    Alert.alert('Mensaje enviado con éxito', `Destinatario: ${composeTo}`);
    setIsComposeOpen(false);
    setComposeSubject('');
    setComposeBody('');
  };

  return (
    <View style={styles.container}>
      {/* 1. HERO WAVE BANNER INSTITUCIONAL (#008C45) */}
      <View style={styles.heroBanner}>
        {/* Decorative subtle ambient circles */}
        <View style={styles.heroCircle1} />
        <View style={styles.heroCircle2} />

        {/* Top Header Row */}
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

        {/* Title and Context Tag */}
        <View style={styles.heroTextSection}>
          <View style={styles.heroContextPill}>
            <Text style={styles.heroContextIcon}>💬</Text>
            <Text style={styles.heroContextText}>COMUNIDAD EDUCATIVA</Text>
          </View>
          <Text style={styles.heroMainTitle}>Comunicaciones</Text>
          <Text style={styles.heroMainSubtitle}>
            Canal directo con docentes, secretaría y directivos
          </Text>
        </View>

        {/* Integrated Floating Search Bar */}
        <View style={styles.searchBarWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar mensajes, docentes o avisos..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterTuneBtn} activeOpacity={0.8}>
            <Text style={styles.filterTuneIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. FILTROS / PESTAÑAS HORIZONTALES (Pill chips deslizables) */}
      <View style={styles.filterChipsSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsScroll}
        >
          {/* Chip Recibidos */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              activeFilter === 'TODOS' && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter('TODOS')}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === 'TODOS' && styles.filterChipTextActive,
              ]}
            >
              📥 Recibidos
            </Text>
            <View style={styles.chipRedBadge}>
              <Text style={styles.chipRedBadgeText}>3</Text>
            </View>
          </TouchableOpacity>

          {/* Chip No Leídos */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              activeFilter === 'NO_LEIDOS' && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter('NO_LEIDOS')}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === 'NO_LEIDOS' && styles.filterChipTextActive,
              ]}
            >
              ✉️ No leídos
            </Text>
            <View style={styles.chipLightRedBadge}>
              <Text style={styles.chipLightRedBadgeText}>3</Text>
            </View>
          </TouchableOpacity>

          {/* Chip Institucionales */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              activeFilter === 'INSTITUCIONAL' && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter('INSTITUCIONAL')}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === 'INSTITUCIONAL' && styles.filterChipTextActive,
              ]}
            >
              🏛️ Institucionales
            </Text>
          </TouchableOpacity>

          {/* Chip Enviados */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              activeFilter === 'ENVIADOS' && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter('ENVIADOS')}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === 'ENVIADOS' && styles.filterChipTextActive,
              ]}
            >
              📤 Enviados
            </Text>
          </TouchableOpacity>

          {/* Chip Papelera */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              activeFilter === 'PAPELERA' && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter('PAPELERA')}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === 'PAPELERA' && styles.filterChipTextActive,
              ]}
            >
              🗑️ Papelera
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 3. LISTADO DE CONVERSACIONES */}
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeaderRow}>
            <View style={styles.listHeaderLeft}>
              <Text style={styles.listHeaderCategory}>BANDEJA PRINCIPAL</Text>
              <View style={styles.listHeaderDot} />
              <Text style={styles.listHeaderCount}>
                {filteredList.length} conversaciones
              </Text>
            </View>
            <TouchableOpacity onPress={handleMarkAllRead}>
              <Text style={styles.markReadLink}>Marcar leídos ✓✓</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          const isUnread = item.unreadCount > 0;

          return (
            <TouchableOpacity
              style={[
                styles.conversationCard,
                isUnread && styles.conversationCardUnread,
              ]}
              onPress={() => setSelectedChat(item)}
              activeOpacity={0.88}
            >
              <View style={styles.cardFlexRow}>
                {/* Avatar with Online/Role dot */}
                <View style={styles.avatarBoxWrap}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarEmoji}>
                      {item.tagType === 'INICIAL'
                        ? '👩‍🏫'
                        : item.tagType === 'DEPORTE'
                        ? '⚽'
                        : item.tagType === 'GABINETE'
                        ? '🧠'
                        : '🏛️'}
                    </Text>
                  </View>
                  {item.onlineDotColor && (
                    <View
                      style={[
                        styles.onlineDot,
                        { backgroundColor: item.onlineDotColor },
                      ]}
                    />
                  )}
                </View>

                {/* Content Col */}
                <View style={styles.cardContentCol}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardSenderName} numberOfLines={1}>
                      {item.senderName}
                    </Text>
                    <Text
                      style={[
                        styles.cardTimeText,
                        isUnread && styles.cardTimeTextUnread,
                      ]}
                    >
                      {item.time}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.cardSubject,
                      isUnread && styles.cardSubjectUnread,
                    ]}
                    numberOfLines={1}
                  >
                    {item.subject}
                  </Text>

                  <Text style={styles.cardExcerpt} numberOfLines={2}>
                    {item.excerpt}
                  </Text>

                  {/* Bottom Tag & Badges Row */}
                  <View style={styles.cardBottomRow}>
                    <View
                      style={[
                        styles.tagPill,
                        item.tagType === 'INICIAL' && styles.tagPillGreen,
                        item.tagType === 'DEPORTE' && styles.tagPillBlue,
                        item.tagType === 'GABINETE' && styles.tagPillAmber,
                        item.tagType === 'SECRETARIA' && styles.tagPillCeleste,
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagPillText,
                          item.tagType === 'INICIAL' && styles.tagPillTextGreen,
                          item.tagType === 'DEPORTE' && styles.tagPillTextBlue,
                          item.tagType === 'GABINETE' && styles.tagPillTextAmber,
                          item.tagType === 'SECRETARIA' && styles.tagPillTextCeleste,
                        ]}
                      >
                        {item.tag}
                      </Text>
                    </View>

                    {item.unreadCount > 0 ? (
                      <View style={styles.unreadCounterBadge}>
                        <Text style={styles.unreadCounterText}>
                          {item.unreadCount}
                        </Text>
                      </View>
                    ) : item.hasAttachment ? (
                      <Text style={styles.attachmentIcon}>📎</Text>
                    ) : item.isRead ? (
                      <Text style={styles.doubleCheckRead}>✓✓</Text>
                    ) : null}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          /* Banner Horario de Atención de Mensajería */
          <View style={styles.scheduleInfoBanner}>
            <View style={styles.scheduleIconCircle}>
              <Text style={styles.scheduleIconEmoji}>⏰</Text>
            </View>
            <View style={styles.scheduleTextCol}>
              <Text style={styles.scheduleTitle}>
                Horario de Atención de Mensajería
              </Text>
              <Text style={styles.scheduleDesc}>
                Lunes a Viernes de 7:30 a 17:30 hs. Las consultas fuera de término se responden a la mañana siguiente.
              </Text>
            </View>
          </View>
        }
      />

      {/* 4. BOTÓN FLOTANTE DE ACCIÓN (FAB) */}
      <TouchableOpacity
        style={styles.composeFab}
        activeOpacity={0.85}
        onPress={() => setIsComposeOpen(true)}
      >
        <Text style={styles.composeFabIcon}>✏️</Text>
        <Text style={styles.composeFabText}>Nuevo mensaje</Text>
      </TouchableOpacity>

      {/* MODAL: VER MENSAJE Y RESPONDER */}
      <Modal visible={!!selectedChat} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalSender}>{selectedChat?.senderName}</Text>
                <Text style={styles.modalRole}>{selectedChat?.senderRole}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedChat(null)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalSubject}>{selectedChat?.subject}</Text>
              <Text style={styles.modalExcerpt}>{selectedChat?.excerpt}</Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TextInput
                style={styles.replyInput}
                placeholder="Escribe tu respuesta a la institución..."
                placeholderTextColor="#94A3B8"
                value={replyText}
                onChangeText={setReplyText}
              />
              <TouchableOpacity
                style={styles.sendReplyBtn}
                onPress={handleSendReply}
              >
                <Text style={styles.sendReplyBtnText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: REDACTAR NUEVO MENSAJE */}
      <Modal visible={isComposeOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalSender}>Nuevo Mensaje Institucional</Text>
              <TouchableOpacity onPress={() => setIsComposeOpen(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.composeLabel}>Destinatario:</Text>
              <View style={styles.composeInputBox}>
                <Text style={styles.composeDestText}>{composeTo}</Text>
              </View>

              <Text style={styles.composeLabel}>Asunto:</Text>
              <TextInput
                style={styles.composeSubjectInput}
                placeholder="Ej: Consulta por retiro anticipado o tarea..."
                placeholderTextColor="#94A3B8"
                value={composeSubject}
                onChangeText={setComposeSubject}
              />

              <Text style={styles.composeLabel}>Mensaje:</Text>
              <TextInput
                style={styles.composeBodyInput}
                placeholder="Escribe aquí el detalle de tu comunicación..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={5}
                value={composeBody}
                onChangeText={setComposeBody}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.sendNewBtn}
                onPress={handleSendNewMessage}
              >
                <Text style={styles.sendNewBtnText}>Enviar a Dirección / Docente</Text>
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
    backgroundColor: 'rgba(56, 152, 236, 0.12)',
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
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  familyAvatarText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1A73E8',
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

  /* Search Bar */
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
    paddingBottom: 6,
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
  chipRedBadge: {
    backgroundColor: colors.coral,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 9999,
  },
  chipRedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  chipLightRedBadge: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 9999,
  },
  chipLightRedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9F1239',
  },

  /* 3. CONVERSATIONS LIST */
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 90,
    gap: 12,
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  listHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listHeaderCategory: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },
  listHeaderDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
  },
  listHeaderCount: {
    fontSize: 12,
    color: '#94A3B8',
  },
  markReadLink: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A73E8',
  },

  conversationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  conversationCardUnread: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  cardFlexRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarBoxWrap: {
    position: 'relative',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cardContentCol: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  cardSenderName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#131B2E',
    flex: 1,
  },
  cardTimeText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  cardTimeTextUnread: {
    color: colors.primary,
    fontWeight: '800',
  },
  cardSubject: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginTop: 1,
  },
  cardSubjectUnread: {
    fontWeight: '800',
    color: '#0F172A',
  },
  cardExcerpt: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 6,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 9999,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  tagPillGreen: {
    backgroundColor: '#E8F7EE',
  },
  tagPillTextGreen: {
    color: '#005F2E',
    fontSize: 10,
    fontWeight: '800',
  },
  tagPillBlue: {
    backgroundColor: '#EFF6FF',
  },
  tagPillTextBlue: {
    color: '#1A73E8',
    fontSize: 10,
    fontWeight: '800',
  },
  tagPillAmber: {
    backgroundColor: '#FEF3C7',
  },
  tagPillTextAmber: {
    color: '#B45309',
    fontSize: 10,
    fontWeight: '800',
  },
  tagPillCeleste: {
    backgroundColor: '#E0F2FE',
  },
  tagPillTextCeleste: {
    color: '#0369A1',
    fontSize: 10,
    fontWeight: '800',
  },
  unreadCounterBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.coral,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadCounterText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  attachmentIcon: {
    fontSize: 14,
    color: '#94A3B8',
  },
  doubleCheckRead: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.primary,
  },

  /* Banner Horario de Atención */
  scheduleInfoBanner: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scheduleIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleIconEmoji: {
    fontSize: 18,
  },
  scheduleTextCol: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#131B2E',
  },
  scheduleDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },

  /* 4. FAB FLOTANTE */
  composeFab: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 9999,
    shadowColor: '#005F2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  composeFabIcon: {
    fontSize: 16,
  },
  composeFabText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  /* MODAL STYLES */
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalSender: {
    fontSize: 16,
    fontWeight: '900',
    color: '#131B2E',
  },
  modalRole: {
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
  modalBody: {
    paddingVertical: 14,
  },
  modalSubject: {
    fontSize: 15,
    fontWeight: '800',
    color: '#131B2E',
    marginBottom: 8,
  },
  modalExcerpt: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  replyInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#131B2E',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sendReplyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
  },
  sendReplyBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },

  /* Compose Modal */
  composeLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginTop: 10,
    marginBottom: 4,
  },
  composeInputBox: {
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 10,
  },
  composeDestText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  composeSubjectInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    borderRadius: 10,
    fontSize: 13,
    color: '#131B2E',
  },
  composeBodyInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    borderRadius: 10,
    fontSize: 13,
    color: '#131B2E',
    textAlignVertical: 'top',
    height: 100,
  },
  sendNewBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  sendNewBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
});
