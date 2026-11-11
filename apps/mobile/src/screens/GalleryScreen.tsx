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
  Modal,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { Icon } from '../components/Icon';

interface AlbumItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  categoryTag: string;
  childScope: 'MATEO' | 'SOFIA' | 'AMBOS';
  tags: Array<'MATEO' | 'SOFIA' | 'ITALIANO' | 'DEPORTES'>;
  classGrade: string;
  teacher: string;
  timeAgo: string;
  photoCount: number;
  videoCount?: number;
  isFeatured?: boolean;
  accentColor: string;
}

export const GalleryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;
  const topInsetPadding = Math.max(insets.top, 24) + 10;
  const mediaBoxHeight = Math.min(width * 0.48, 200);
  const gridBoxHeight = Math.min(width * 0.28, 115);

  const [activePill, setActivePill] = useState<'TODAS' | 'MATEO' | 'SOFIA' | 'ITALIANO' | 'DEPORTES'>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({
    'album-1': true,
  });
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumItem | null>(null);

  const albums: AlbumItem[] = [
    {
      id: 'album-1',
      title: "Pintura y Símbolos: Fratelli d'Italia",
      subtitle: 'Exploración de la bandera, mapa y canciones tradicionales.',
      description:
        'Exploración creativa sobre los símbolos de la identidad italiana a través de témperas, acuarelas y canciones tradicionales en el aula mayor.',
      categoryTag: 'DESTACADO DE LA SEMANA',
      childScope: 'MATEO',
      tags: ['MATEO', 'ITALIANO'],
      classGrade: 'Sala de 4 Años',
      teacher: 'Seño Valentina',
      timeAgo: 'Ayer 11:30 hs',
      photoCount: 24,
      videoCount: 2,
      isFeatured: true,
      accentColor: colors.primary,
    },
    {
      id: 'album-2',
      title: 'Huerta Escolar Bilingüe',
      subtitle: 'Siembra y vocabulario en lengua italiana.',
      description:
        'Los niños de Nivel Inicial plantaron semillas aromáticas aprendiendo los nombres de hierbas en italiano (basilico, rosmarino, timo).',
      categoryTag: 'Naturaleza & Ciencias',
      childScope: 'MATEO',
      tags: ['MATEO', 'ITALIANO'],
      classGrade: 'Sala de 4 Años',
      teacher: 'Seño Valentina',
      timeAgo: 'Hace 3 días',
      photoCount: 16,
      accentColor: colors.primary,
    },
    {
      id: 'album-3',
      title: 'Torneo Intercolegial de Atletismo',
      subtitle: 'Postas de velocidad y salto en largo.',
      description:
        'Sofía y sus compañeros de 4° Grado participaron en la pista de atletismo escolar en carreras de velocidad de 60m y relevos mixtos.',
      categoryTag: 'Ed. Física · Primaria',
      childScope: 'SOFIA',
      tags: ['SOFIA', 'DEPORTES'],
      classGrade: '4° Grado "B"',
      teacher: 'Prof. Carlos Gómez',
      timeAgo: 'Hace 5 días',
      photoCount: 32,
      accentColor: '#1A73E8',
    },
    {
      id: 'album-4',
      title: 'Taller de Teatro: Le Avventure di Pinocchio',
      subtitle: 'Lectura dramatizada y títeres de marioneta.',
      description:
        'Proyecto interdisciplinario entre Lengua Italiana y Expresión Artística sobre el clásico de Carlo Collodi.',
      categoryTag: 'Cultura Italiana',
      childScope: 'SOFIA',
      tags: ['SOFIA', 'ITALIANO'],
      classGrade: '4° Grado "B"',
      teacher: 'Prof. Giulia Bianchi',
      timeAgo: 'Hace 1 semana',
      photoCount: 20,
      accentColor: '#854D0E',
    },
    {
      id: 'album-5',
      title: 'Mini Básquet y Coordinación Motriz',
      subtitle: 'Circuitos motrices y trabajo en equipo.',
      description:
        'Jornada de destreza motriz y fundamentos de mini básquet en el polideportivo cubierto.',
      categoryTag: 'Deporte Escolar',
      childScope: 'SOFIA',
      tags: ['SOFIA', 'DEPORTES'],
      classGrade: '4° Grado "B"',
      teacher: 'Prof. Carlos Gómez',
      timeAgo: 'Hace 2 semanas',
      photoCount: 18,
      accentColor: '#1A73E8',
    },
    {
      id: 'album-6',
      title: 'Festa della Repubblica: Cocina Italiana',
      subtitle: 'Amasado de pasta fresca y degustación familiar.',
      description:
        'Taller gastronómico tradicional donde los alumnos aprendieron la receta tradicional de tagliatelle artesanales.',
      categoryTag: 'Tradiciones & Familia',
      childScope: 'AMBOS',
      tags: ['MATEO', 'SOFIA', 'ITALIANO'],
      classGrade: 'Toda la Escuela',
      teacher: 'Equipo Bicultural',
      timeAgo: 'Hace 3 semanas',
      photoCount: 42,
      accentColor: colors.primary,
    },
  ];

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenAlbum = (album: AlbumItem) => {
    setSelectedAlbum(album);
  };

  const handleDownloadSelection = (albumTitle: string) => {
    Alert.alert(
      'Descarga HD Iniciada',
      `Descargando paquete de fotos en alta resolución de "${albumTitle}". Se guardará en la galería de tu teléfono.`
    );
  };

  const handleRequestPrivacy = () => {
    Alert.alert(
      'Consentimiento Institucional',
      'Tu consulta sobre los permisos de difusión y consentimiento de imagen escolar fue recibida por la Secretaría.'
    );
  };

  // Filtered albums
  const filteredAlbums = albums.filter((album) => {
    if (activePill !== 'TODAS') {
      if (!album.tags.includes(activePill)) {
        return false;
      }
    }
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchTitle = album.title.toLowerCase().includes(q);
      const matchDesc = album.description.toLowerCase().includes(q);
      const matchClass = album.classGrade.toLowerCase().includes(q);
      const matchTeacher = album.teacher.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchClass || matchTeacher;
    }
    return true;
  });

  const featuredAlbum = filteredAlbums.find((a) => a.isFeatured) || (filteredAlbums.length > 0 ? filteredAlbums[0] : null);
  const otherAlbums = filteredAlbums.filter((a) => a.id !== featuredAlbum?.id);

  const mateoCount = albums.filter((a) => a.tags.includes('MATEO')).length;
  const sofiaCount = albums.filter((a) => a.tags.includes('SOFIA')).length;
  const italianoCount = albums.filter((a) => a.tags.includes('ITALIANO')).length;
  const deportesCount = albums.filter((a) => a.tags.includes('DEPORTES')).length;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 1. HERO WAVE BANNER INSTITUCIONAL (#008C45) */}
        <View style={[styles.heroBanner, { paddingTop: topInsetPadding }]}>
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />

          {/* Top Header Row */}
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

          {/* Title and Context Tag */}
          <View style={styles.heroTextSection}>
            <View style={styles.heroContextPill}>
              <Icon name="camara" size={12} color="#FFFFFF" />
              <Text style={styles.heroContextText}>REGISTRO PEDAGÓGICO / TALLERES</Text>
            </View>
            <Text style={[styles.heroMainTitle, isSmallScreen && styles.heroMainTitleSmall]}>
              Galería de Actividades
            </Text>
            <Text style={styles.heroMainSubtitle}>
              Momentos escolares, talleres biculturales y proyectos de tus hijos.
            </Text>
          </View>

          {/* Integrated Floating Search Bar with Clear Button */}
          <View style={styles.searchBarWrapper}>
            <Icon name="buscar" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por sala, taller o evento..."
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
              onPress={() => setActivePill('TODAS')}
            >
              <Icon name="filtros" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. FILTROS RÁPIDOS POR PÍLDORA CON CONTADORES DINÁMICOS */}
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
              <Icon
                name="galeria"
                size={13}
                color={activePill === 'TODAS' ? '#FFFFFF' : '#475569'}
              />
              <Text
                style={[
                  styles.filterPillText,
                  activePill === 'TODAS' && styles.filterPillTextActive,
                ]}
              >
                Todas
              </Text>
              <View style={[styles.pillBadge, activePill === 'TODAS' && styles.pillBadgeActive]}>
                <Text style={[styles.pillBadgeText, activePill === 'TODAS' && styles.pillBadgeTextActive]}>
                  {albums.length}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Mateo */}
            <TouchableOpacity
              style={[
                styles.filterPill,
                activePill === 'MATEO' && styles.filterPillActiveGreen,
              ]}
              onPress={() => setActivePill('MATEO')}
              activeOpacity={0.85}
            >
              <Icon
                name="graduacion"
                size={13}
                color={activePill === 'MATEO' ? '#FFFFFF' : '#005F2E'}
              />
              <Text
                style={[
                  styles.filterPillText,
                  activePill === 'MATEO' && styles.filterPillTextActive,
                ]}
              >
                Mateo
              </Text>
              <View style={[styles.pillBadge, activePill === 'MATEO' && styles.pillBadgeActive]}>
                <Text style={[styles.pillBadgeText, activePill === 'MATEO' && styles.pillBadgeTextActive]}>
                  {mateoCount}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Sofía */}
            <TouchableOpacity
              style={[
                styles.filterPill,
                activePill === 'SOFIA' && styles.filterPillActiveBlue,
              ]}
              onPress={() => setActivePill('SOFIA')}
              activeOpacity={0.85}
            >
              <Icon
                name="graduacion"
                size={13}
                color={activePill === 'SOFIA' ? '#FFFFFF' : '#1A73E8'}
              />
              <Text
                style={[
                  styles.filterPillText,
                  activePill === 'SOFIA' && styles.filterPillTextActive,
                ]}
              >
                Sofía
              </Text>
              <View style={[styles.pillBadge, activePill === 'SOFIA' && styles.pillBadgeActive]}>
                <Text style={[styles.pillBadgeText, activePill === 'SOFIA' && styles.pillBadgeTextActive]}>
                  {sofiaCount}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Italiano */}
            <TouchableOpacity
              style={[
                styles.filterPill,
                activePill === 'ITALIANO' && styles.filterPillActive,
              ]}
              onPress={() => setActivePill('ITALIANO')}
              activeOpacity={0.85}
            >
              <Icon
                name="boletin"
                size={13}
                color={activePill === 'ITALIANO' ? '#FFFFFF' : '#475569'}
              />
              <Text
                style={[
                  styles.filterPillText,
                  activePill === 'ITALIANO' && styles.filterPillTextActive,
                ]}
              >
                Italiano
              </Text>
              <View style={[styles.pillBadge, activePill === 'ITALIANO' && styles.pillBadgeActive]}>
                <Text style={[styles.pillBadgeText, activePill === 'ITALIANO' && styles.pillBadgeTextActive]}>
                  {italianoCount}
                </Text>
              </View>
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
              <Icon
                name="deportes"
                size={13}
                color={activePill === 'DEPORTES' ? '#FFFFFF' : '#475569'}
              />
              <Text
                style={[
                  styles.filterPillText,
                  activePill === 'DEPORTES' && styles.filterPillTextActive,
                ]}
              >
                Deportes
              </Text>
              <View style={[styles.pillBadge, activePill === 'DEPORTES' && styles.pillBadgeActive]}>
                <Text style={[styles.pillBadgeText, activePill === 'DEPORTES' && styles.pillBadgeTextActive]}>
                  {deportesCount}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* BODY CONTENT */}
        <View style={styles.bodyContent}>
          {/* EMPTY STATE */}
          {filteredAlbums.length === 0 && (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconCircle}>
                <Icon name="galeria" size={26} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No se encontraron fotos</Text>
              <Text style={styles.emptySubtitle}>
                No hay álbumes que coincidan con tu búsqueda actual.
              </Text>
              <TouchableOpacity
                style={styles.clearSearchBtn}
                onPress={() => {
                  setSearchQuery('');
                  setActivePill('TODAS');
                }}
              >
                <Text style={styles.clearSearchBtnText}>Ver toda la galería</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 3. DESTACADO DE LA SEMANA */}
          {featuredAlbum && (
            <View style={styles.featuredAlbumCard}>
              <TouchableOpacity
                activeOpacity={0.92}
                onPress={() => handleOpenAlbum(featuredAlbum)}
              >
                <View style={[styles.featuredMediaBox, { height: mediaBoxHeight }]}>
                  <Icon name="camara" size={42} color="rgba(255, 255, 255, 0.45)" />

                  <View style={styles.featuredTopOverlayRow}>
                    <View style={styles.newAlbumBadge}>
                      <Text style={styles.newAlbumBadgeText}>{featuredAlbum.categoryTag}</Text>
                    </View>
                    <View style={styles.mediaCountBadge}>
                      <Text style={styles.mediaCountBadgeText}>
                        {featuredAlbum.photoCount} FOTOS
                        {featuredAlbum.videoCount ? ` · ${featuredAlbum.videoCount} VIDEOS` : ''}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.featuredBottomOverlay}>
                    <Text style={styles.featuredTag}>ACTIVIDAD BILINGÜE</Text>
                    <Text style={styles.featuredTitle}>{featuredAlbum.title}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.featuredBody}>
                <View style={styles.featuredMetaRow}>
                  <Icon name="usuario" size={13} color="#64748B" style={{ marginRight: 4 }} />
                  <Text style={styles.metaClass}>{featuredAlbum.classGrade}</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaTeacher}>{featuredAlbum.teacher}</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaTime}>{featuredAlbum.timeAgo}</Text>
                </View>

                <Text style={styles.featuredDesc}>{featuredAlbum.description}</Text>

                <View style={styles.featuredButtonsRow}>
                  <TouchableOpacity
                    style={styles.btnViewFullAlbum}
                    activeOpacity={0.88}
                    onPress={() => handleOpenAlbum(featuredAlbum)}
                  >
                    <Text style={styles.btnViewFullAlbumText}>Ver álbum completo</Text>
                    <Text style={styles.btnViewFullAlbumArrow}>→</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnDownloadHD}
                    activeOpacity={0.85}
                    onPress={() => handleDownloadSelection(featuredAlbum.title)}
                  >
                    <Icon name="descargar-pdf" size={18} color="#1A73E8" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* 4. SECCIÓN 'ACTIVIDADES DEL MES & PROYECTOS' */}
          {otherAlbums.length > 0 && (
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleWithDot}>
                  <View style={styles.greenBarIcon} />
                  <Text style={styles.sectionTitle}>Actividades del Mes</Text>
                </View>
                <Text style={styles.sectionCountText}>{otherAlbums.length} álbumes</Text>
              </View>

              <View style={styles.gridTwoCols}>
                {otherAlbums.map((album) => {
                  const isFav = !!favorites[album.id];
                  const isMateo = album.childScope === 'MATEO';

                  return (
                    <TouchableOpacity
                      key={album.id}
                      style={styles.gridCard}
                      activeOpacity={0.88}
                      onPress={() => handleOpenAlbum(album)}
                    >
                      <View
                        style={[
                          styles.gridImageBox,
                          { height: gridBoxHeight, backgroundColor: isMateo ? '#E8F7EE' : '#EFF6FF' },
                        ]}
                      >
                        <Icon
                          name={album.tags.includes('DEPORTES') ? 'deportes' : 'galeria'}
                          size={32}
                          color={isMateo ? 'rgba(0, 140, 69, 0.45)' : 'rgba(26, 115, 232, 0.45)'}
                        />

                        <View style={styles.gridPhotoBadge}>
                          <Icon name="camara" size={11} color="#131B2E" style={{ marginRight: 3 }} />
                          <Text style={styles.gridPhotoBadgeText}>{album.photoCount}</Text>
                        </View>

                        <TouchableOpacity
                          style={styles.favHeartBtn}
                          onPress={() => toggleFavorite(album.id)}
                          activeOpacity={0.8}
                        >
                          <Icon
                            name={isFav ? 'favorito-fill' : 'favorito'}
                            size={15}
                            color={isFav ? colors.coral : '#FFFFFF'}
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.gridCardBody}>
                        <Text style={isMateo ? styles.gridTagGreen : styles.gridTagBlue}>
                          {album.categoryTag}
                        </Text>
                        <Text style={styles.gridTitle} numberOfLines={1}>
                          {album.title}
                        </Text>
                        <Text style={styles.gridSub} numberOfLines={1}>
                          {album.subtitle}
                        </Text>

                        <View style={styles.gridCardFooter}>
                          <Text style={styles.gridCardTime}>{album.timeAgo}</Text>
                          <Text style={isMateo ? styles.gridArrowGreen : styles.gridArrowBlue}>›</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* 5. POLÍTICA DE PRIVACIDAD INSTITUCIONAL */}
          <View style={styles.privacyBanner}>
            <View style={styles.privacyTopRow}>
              <View style={styles.privacyIconCircle}>
                <Icon name="seguridad" size={18} color="#FFFFFF" />
              </View>
              <View style={styles.privacyTextCol}>
                <Text style={styles.privacyTitle}>Privacidad Institucional Protegida</Text>
                <Text style={styles.privacyDesc}>
                  Las imágenes son de uso pedagógico exclusivo para las familias de la comunidad escolar bajo consentimiento informado.
                </Text>
              </View>
            </View>

            <View style={styles.privacyActionRow}>
              <TouchableOpacity
                style={styles.privacyRequestBtn}
                activeOpacity={0.85}
                onPress={handleRequestPrivacy}
              >
                <Icon name="candado" size={12} color="#005F2E" style={{ marginRight: 4 }} />
                <Text style={styles.privacyRequestBtnText}>
                  Consultar autorización de difusión
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 36 }} />
      </ScrollView>

      {/* MODAL LIGHTBOX / VISOR DE ÁLBUM COMPLETO */}
      <Modal visible={!!selectedAlbum} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalSheetHeader}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.modalSheetTitle} numberOfLines={1}>
                  {selectedAlbum?.title}
                </Text>
                <Text style={styles.modalSheetSub}>
                  {selectedAlbum?.classGrade} · {selectedAlbum?.photoCount} fotografías oficiales
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedAlbum(null)}>
                <Icon name="cerrar" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalSheetBody}>
              <View style={styles.lightboxBigPreview}>
                <Icon name="galeria" size={48} color="rgba(0, 140, 69, 0.4)" />
                <View style={styles.lightboxBadge}>
                  <Text style={styles.lightboxBadgeText}>FOTO 1 DE {selectedAlbum?.photoCount}</Text>
                </View>
              </View>

              <Text style={styles.lightboxDesc}>{selectedAlbum?.description}</Text>

              <Text style={styles.lightboxGridTitle}>Miniaturas del Álbum:</Text>
              <View style={styles.lightboxThumbGrid}>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <View key={num} style={styles.lightboxThumb}>
                    <Icon name="camara" size={18} color="#94A3B8" />
                    <Text style={styles.lightboxThumbNum}>{num}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooterRow}>
              <TouchableOpacity
                style={styles.modalDownloadAllBtn}
                activeOpacity={0.88}
                onPress={() => {
                  if (selectedAlbum) handleDownloadSelection(selectedAlbum.title);
                  setSelectedAlbum(null);
                }}
              >
                <Icon name="descargar-pdf" size={16} color="#FFFFFF" />
                <Text style={styles.modalDownloadAllText}>Descargar Paquete HD</Text>
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
    bottom: -60,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginBottom: 6,
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

  /* 2. FILTER PILLS */
  filterPillsSection: {
    paddingTop: 10,
    paddingBottom: 4,
  },
  filterPillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
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
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillActiveGreen: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillActiveBlue: {
    backgroundColor: '#1A73E8',
    borderColor: '#1A73E8',
  },
  filterPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  pillBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  pillBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  pillBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
  },
  pillBadgeTextActive: {
    color: '#FFFFFF',
  },

  /* BODY */
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 16,
  },

  /* EMPTY STATE */
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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

  /* 3. FEATURED ALBUM CARD */
  featuredAlbumCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  featuredMediaBox: {
    width: '100%',
    backgroundColor: colors.primary,
    justifyContent: 'space-between',
    padding: 14,
    position: 'relative',
    alignItems: 'center',
  },
  featuredTopOverlayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 10,
  },
  newAlbumBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  newAlbumBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  mediaCountBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  mediaCountBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  featuredBottomOverlay: {
    width: '100%',
    zIndex: 10,
  },
  featuredTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A7F3D0',
    letterSpacing: 0.6,
  },
  featuredTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
    letterSpacing: -0.2,
  },
  featuredBody: {
    padding: 14,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaClass: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  metaDot: {
    fontSize: 11,
    color: '#CBD5E1',
    marginHorizontal: 5,
  },
  metaTeacher: {
    fontSize: 11,
    color: '#64748B',
  },
  metaTime: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  featuredDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 12,
  },
  featuredButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  btnViewFullAlbum: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 4,
  },
  btnViewFullAlbumText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  btnViewFullAlbumArrow: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  btnDownloadHD: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },

  /* 4. GRID SECTION */
  sectionBlock: {
    gap: 12,
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
  gridTwoCols: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gridImageBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gridPhotoBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gridPhotoBadgeText: {
    fontSize: 9.5,
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
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCardBody: {
    padding: 10,
  },
  gridTagGreen: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 2,
  },
  gridTagBlue: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1A73E8',
    marginBottom: 2,
  },
  gridTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#131B2E',
  },
  gridSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  gridCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  gridCardTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  gridArrowGreen: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.primary,
  },
  gridArrowBlue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1A73E8',
  },

  /* 5. PRIVACY BANNER */
  privacyBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  privacyTextCol: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#131B2E',
  },
  privacyDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 2,
  },
  privacyActionRow: {
    marginTop: 10,
  },
  privacyRequestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  privacyRequestBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#005F2E',
  },

  /* LIGHTBOX MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '88%',
    paddingBottom: 32,
  },
  modalSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalSheetTitle: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#131B2E',
  },
  modalSheetSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  modalSheetBody: {
    marginBottom: 12,
  },
  lightboxBigPreview: {
    height: 200,
    backgroundColor: '#E8F7EE',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    position: 'relative',
  },
  lightboxBadge: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  lightboxBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  lightboxDesc: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 14,
  },
  lightboxGridTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 8,
  },
  lightboxThumbGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  lightboxThumb: {
    width: '31%',
    height: 64,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lightboxThumbNum: {
    fontSize: 9.5,
    color: '#94A3B8',
    fontWeight: '800',
    marginTop: 2,
  },
  modalFooterRow: {
    marginTop: 8,
  },
  modalDownloadAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  modalDownloadAllText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
