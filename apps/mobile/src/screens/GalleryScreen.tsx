import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';

export const GalleryScreen: React.FC = () => {
  const [activePill, setActivePill] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenAlbum = (title: string) => {
    Alert.alert('Álbum Fotográfico', `Abriendo visualizador HD para: "${title}"`);
  };

  const handleDownloadSelection = () => {
    Alert.alert(
      'Descarga HD',
      'Iniciando descarga segura del paquete comprimido de fotos en alta resolución.'
    );
  };

  const handleRequestPrivacy = () => {
    Alert.alert(
      'Consentimiento Institucional',
      'Tu solicitud de permiso de difusión escolar fue enviada a la Secretaría.'
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. HERO WAVE BANNER INSTITUCIONAL (#008C45) */}
      <View style={styles.heroBanner}>
        {/* Decorative Background Elements */}
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
            <Text style={styles.heroContextIcon}>📷</Text>
            <Text style={styles.heroContextText}>
              REGISTRO PEDAGÓGICO / TALLERES
            </Text>
          </View>
          <Text style={styles.heroMainTitle}>Galería de Actividades</Text>
          <Text style={styles.heroMainSubtitle}>
            Momentos escolares, talleres biculturales y proyectos de tus hijos.
          </Text>
        </View>

        {/* Integrated Floating Search Bar */}
        <View style={styles.searchBarWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por sala, evento o fecha..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterTuneBtn} activeOpacity={0.8}>
            <Text style={styles.filterTuneIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. FILTROS RÁPIDOS POR PÍLDORA (Horizontal Scroll) */}
      <View style={styles.filterPillsSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsScroll}
        >
          {/* Todas las fotos */}
          <TouchableOpacity
            style={[
              styles.filterPill,
              activePill === 'TODAS' && styles.filterPillActive,
            ]}
            onPress={() => setActivePill('TODAS')}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterPillText,
                activePill === 'TODAS' && styles.filterPillTextActive,
              ]}
            >
              🖼️ Todas las fotos
            </Text>
          </TouchableOpacity>

          {/* Sala de 4 (Mateo) */}
          <TouchableOpacity
            style={[
              styles.filterPill,
              activePill === 'MATEO' && styles.filterPillActive,
            ]}
            onPress={() => setActivePill('MATEO')}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterPillText,
                activePill === 'MATEO' && styles.filterPillTextActive,
              ]}
            >
              🧒 Sala de 4 (Mateo)
            </Text>
          </TouchableOpacity>

          {/* 2° Grado (Sofía) */}
          <TouchableOpacity
            style={[
              styles.filterPill,
              activePill === 'SOFIA' && styles.filterPillActive,
            ]}
            onPress={() => setActivePill('SOFIA')}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterPillText,
                activePill === 'SOFIA' && styles.filterPillTextActive,
              ]}
            >
              👧 2° Grado (Sofía)
            </Text>
          </TouchableOpacity>

          {/* Talleres de Italiano */}
          <TouchableOpacity
            style={[
              styles.filterPill,
              activePill === 'ITALIANO' && styles.filterPillActive,
            ]}
            onPress={() => setActivePill('ITALIANO')}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterPillText,
                activePill === 'ITALIANO' && styles.filterPillTextActive,
              ]}
            >
              🇮🇹 Talleres de Italiano
            </Text>
          </TouchableOpacity>

          {/* Deportes */}
          <TouchableOpacity
            style={[
              styles.filterPill,
              activePill === 'DEPORTES' && styles.filterPillActive,
            ]}
            onPress={() => setActivePill('DEPORTES')}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.filterPillText,
                activePill === 'DEPORTES' && styles.filterPillTextActive,
              ]}
            >
              ⚽ Deportes
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* BODY CONTENT */}
      <View style={styles.bodyContent}>
        {/* 3. DESTACADO DE LA SEMANA (Álbum Principal) */}
        <View style={styles.featuredAlbumCard}>
          {/* Media Header / Image Box with Overlays */}
          <View style={styles.featuredMediaBox}>
            <Text style={styles.featuredEmojiPlaceholder}>🇮🇹🎨🖼️</Text>

            {/* Overlays */}
            <View style={styles.featuredTopOverlayRow}>
              <View style={styles.newAlbumBadge}>
                <Text style={styles.newAlbumBadgeText}>✨ NUEVO ÁLBUM</Text>
              </View>
              <View style={styles.mediaCountBadge}>
                <Text style={styles.mediaCountBadgeText}>24 FOTOS · 2 VIDEOS</Text>
              </View>
            </View>

            <View style={styles.featuredBottomOverlay}>
              <Text style={styles.featuredTag}>DESTACADO DE LA SEMANA</Text>
              <Text style={styles.featuredTitle}>
                Pintura y Símbolos: Fratelli d'Italia
              </Text>
            </View>
          </View>

          {/* Card Body */}
          <View style={styles.featuredBody}>
            <View style={styles.featuredMetaRow}>
              <Text style={styles.metaIcon}>👥</Text>
              <Text style={styles.metaClass}>Sala de 4 Años</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaTeacher}>Seño Valentina</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaTime}>Ayer 11:30 hs</Text>
            </View>

            <Text style={styles.featuredDesc}>
              Exploración creativa sobre los símbolos de la identidad italiana a través de témperas, acuarelas y canciones tradicionales en el aula mayor.
            </Text>

            {/* Buttons Row */}
            <View style={styles.featuredButtonsRow}>
              <TouchableOpacity
                style={styles.btnViewFullAlbum}
                activeOpacity={0.88}
                onPress={() =>
                  handleOpenAlbum("Pintura y Símbolos: Fratelli d'Italia")
                }
              >
                <Text style={styles.btnViewFullAlbumText}>Ver álbum completo</Text>
                <Text style={styles.btnViewFullAlbumArrow}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnDownloadHD}
                activeOpacity={0.85}
                onPress={handleDownloadSelection}
              >
                <Text style={styles.btnDownloadHDIcon}>⬇️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 4. SECCIÓN 'ACTIVIDADES DEL MES & PROYECTOS' */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithDot}>
              <View style={styles.greenBarIcon} />
              <Text style={styles.sectionTitle}>Actividades del Mes</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.sectionLink}>Ver histórico ›</Text>
            </TouchableOpacity>
          </View>

          {/* Grid 2 Columnas */}
          <View style={styles.gridTwoCols}>
            {/* Tarjeta 1: Huerta Escolar Bilingüe */}
            <TouchableOpacity
              style={styles.gridCard}
              activeOpacity={0.88}
              onPress={() => handleOpenAlbum('Huerta Escolar Bilingüe')}
            >
              <View style={styles.gridImageBoxGarden}>
                <Text style={styles.gridEmoji}>🌱🥕🍅</Text>

                <View style={styles.gridPhotoBadge}>
                  <Text style={styles.gridPhotoBadgeText}>📷 16</Text>
                </View>

                <TouchableOpacity
                  style={styles.favHeartBtn}
                  onPress={() => toggleFavorite('huerta')}
                >
                  <Text style={styles.favHeartText}>
                    {favorites['huerta'] ? '❤️' : '🤍'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.gridCardBody}>
                <Text style={styles.gridTagGreen}>Naturaleza & Ciencias</Text>
                <Text style={styles.gridTitle} numberOfLines={1}>
                  Huerta Escolar Bilingüe
                </Text>
                <Text style={styles.gridSub} numberOfLines={1}>
                  Siembra y vocabulario en italiano
                </Text>

                <View style={styles.gridCardFooter}>
                  <Text style={styles.gridCardTime}>Hace 3 días</Text>
                  <Text style={styles.gridArrowGreen}>›</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Tarjeta 2: Torneo de Atletismo y Básquet */}
            <TouchableOpacity
              style={styles.gridCard}
              activeOpacity={0.88}
              onPress={() => handleOpenAlbum('Torneo de Atletismo y Básquet')}
            >
              <View style={styles.gridImageBoxSports}>
                <Text style={styles.gridEmoji}>🏃‍♂️🏀🏅</Text>

                <View style={styles.gridPhotoBadgeBlue}>
                  <Text style={styles.gridPhotoBadgeText}>📷 32</Text>
                </View>

                <TouchableOpacity
                  style={styles.favHeartBtn}
                  onPress={() => toggleFavorite('torneo')}
                >
                  <Text style={styles.favHeartText}>
                    {favorites['torneo'] ? '❤️' : '🤍'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.gridCardBody}>
                <Text style={styles.gridTagBlue}>Ed. Física · 1° y 2° Ciclo</Text>
                <Text style={styles.gridTitle} numberOfLines={1}>
                  Torneo de Atletismo y Básquet
                </Text>
                <Text style={styles.gridSub} numberOfLines={1}>
                  Jornada de integración deportiva
                </Text>

                <View style={styles.gridCardFooter}>
                  <Text style={styles.gridCardTime}>Hace 5 días</Text>
                  <Text style={styles.gridArrowBlue}>›</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. POLÍTICA DE PRIVACIDAD Y DESCARGA FAMILIAR */}
        <View style={styles.privacyBanner}>
          <View style={styles.privacyTopRow}>
            <View style={styles.privacyIconCircle}>
              <Text style={styles.privacyIconEmoji}>🛡️</Text>
            </View>
            <View style={styles.privacyTextCol}>
              <Text style={styles.privacyTitle}>Privacidad Protegida</Text>
              <Text style={styles.privacyDesc}>
                Las imágenes son de uso exclusivo para las familias de la comunidad escolar bajo consentimiento institucional. Queda prohibida su reproducción pública no autorizada.
              </Text>
            </View>
          </View>

          <View style={styles.privacyActionRow}>
            <TouchableOpacity
              style={styles.privacyRequestBtn}
              activeOpacity={0.85}
              onPress={handleRequestPrivacy}
            >
              <Text style={styles.privacyLockIcon}>🔓</Text>
              <Text style={styles.privacyRequestBtnText}>
                Solicitar permiso de difusión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Espaciado de cortesía para el scroll */}
      <View style={{ height: 32 }} />
    </ScrollView>
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

  /* 2. FILTER PILLS */
  filterPillsSection: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  filterPillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
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
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },

  /* BODY */
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 20,
  },

  /* 3. FEATURED ALBUM */
  featuredAlbumCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  featuredMediaBox: {
    height: 190,
    backgroundColor: '#DAE2FD',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  featuredEmojiPlaceholder: {
    fontSize: 48,
  },
  featuredTopOverlayRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  newAlbumBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  newAlbumBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  mediaCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  mediaCountBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#131B2E',
  },
  featuredBottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: 'rgba(19, 27, 46, 0.75)',
  },
  featuredTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#89FAA5',
    letterSpacing: 0.8,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  featuredBody: {
    padding: 16,
    gap: 8,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  metaIcon: {
    fontSize: 13,
  },
  metaClass: {
    fontSize: 12,
    fontWeight: '700',
    color: '#131B2E',
  },
  metaDot: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  metaTeacher: {
    fontSize: 12,
    color: '#475569',
  },
  metaTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  featuredDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  featuredButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  btnViewFullAlbum: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 11,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  btnViewFullAlbumText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  btnViewFullAlbumArrow: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  btnDownloadHD: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDownloadHDIcon: {
    fontSize: 18,
  },

  /* 4. ACTIVIDADES DEL MES (2 Column Grid) */
  sectionBlock: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleWithDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greenBarIcon: {
    width: 5,
    height: 18,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
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
  gridTwoCols: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gridImageBoxGarden: {
    height: 110,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gridImageBoxSports: {
    height: 110,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gridEmoji: {
    fontSize: 32,
  },
  gridPhotoBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  gridPhotoBadgeBlue: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  gridPhotoBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#131B2E',
  },
  favHeartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(19, 27, 46, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favHeartText: {
    fontSize: 13,
  },
  gridCardBody: {
    padding: 10,
  },
  gridTagGreen: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  gridTagBlue: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1A73E8',
    textTransform: 'uppercase',
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#131B2E',
    marginTop: 2,
  },
  gridSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  gridCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  gridCardTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  gridArrowGreen: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  gridArrowBlue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A73E8',
  },

  /* 5. PRIVACY BANNER */
  privacyBanner: {
    backgroundColor: '#E8F7EE',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#C6F6D5',
  },
  privacyTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  privacyIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyIconEmoji: {
    fontSize: 16,
  },
  privacyTextCol: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#005F2E',
  },
  privacyDesc: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
    lineHeight: 15,
  },
  privacyActionRow: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  privacyRequestBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  privacyLockIcon: {
    fontSize: 12,
  },
  privacyRequestBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#005F2E',
  },
});
