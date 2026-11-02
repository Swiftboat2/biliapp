import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';

interface GalleryAlbum {
  id: string;
  title: string;
  category: string;
  date: string;
  photoCount: number;
  emoji: string;
  bgColor: string;
  description: string;
}

export const GalleryScreen: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('TODAS');

  const categories = ['TODAS', 'JARDÍN', 'ARTE', 'DEPORTES', 'SALIDAS'];

  const albums: GalleryAlbum[] = [
    {
      id: 'a1',
      title: 'Taller de Expresión Plástica y Modelado',
      category: 'ARTE',
      date: '28 de Octubre, 2026',
      photoCount: 18,
      emoji: '🎨',
      bgColor: '#FEE2E2',
      description: 'Los alumnos de Sala de 4 experimentaron con témperas y arcilla natural.',
    },
    {
      id: 'a2',
      title: 'Jornada Deportiva Intercolegial',
      category: 'DEPORTES',
      date: '24 de Octubre, 2026',
      photoCount: 32,
      emoji: '⚽',
      bgColor: '#DBEAFE',
      description: 'Torneo de atletismo y postas con escuelas de la zona.',
    },
    {
      id: 'a3',
      title: 'Proyecto Huerta y Cuidado Ambiental',
      category: 'JARDÍN',
      date: '16 de Octubre, 2026',
      photoCount: 24,
      emoji: '🌱',
      bgColor: '#DCFCE7',
      description: 'Siembra de hortalizas y riego en el cantero del patio.',
    },
    {
      id: 'a4',
      title: 'Visita Didáctica al Planetario',
      category: 'SALIDAS',
      date: '02 de Octubre, 2026',
      photoCount: 45,
      emoji: '🪐',
      bgColor: '#E0E7FF',
      description: 'Experiencia inmersiva en la cúpula astronómica para 4° grado.',
    },
  ];

  const filtered =
    activeCategory === 'TODAS'
      ? albums
      : albums.filter((a) => a.category === activeCategory);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Galería de Actividades</Text>
        <Text style={styles.bannerSubtitle}>
          Visualiza fotos y recuerdos compartidos de las jornadas pedagógicas.
        </Text>
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryPill, activeCategory === cat && styles.activePill]}
            onPress={() => setActiveCategory(cat)}
            activeOpacity={0.8}
          >
            <Text style={[styles.categoryText, activeCategory === cat && styles.activeCategoryText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Album Cards */}
      <View style={styles.grid}>
        {filtered.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.85}>
            <View style={[styles.photoPlaceholder, { backgroundColor: item.bgColor }]}>
              <Text style={styles.placeholderEmoji}>{item.emoji}</Text>
              <View style={styles.photoCountBadge}>
                <Text style={styles.photoCountText}>📷 {item.photoCount} fotos</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.tagRow}>
                <Text style={styles.categoryTag}>{item.category}</Text>
                <Text style={styles.dateTag}>{item.date}</Text>
              </View>
              <Text style={styles.albumTitle}>{item.title}</Text>
              <Text style={styles.albumDesc}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  banner: {
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
  categoryScroll: {
    paddingHorizontal: 18,
    gap: 8,
    marginBottom: 16,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activePill: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  grid: {
    paddingHorizontal: 18,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  photoPlaceholder: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  placeholderEmoji: {
    fontSize: 52,
  },
  photoCountBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photoCountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    padding: 16,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dateTag: {
    fontSize: 11,
    color: colors.textMuted,
  },
  albumTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  albumDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 17,
  },
});

