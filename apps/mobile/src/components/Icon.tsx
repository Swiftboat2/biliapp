import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export type IconName =
  // 1. NAVEGACIÓN
  | 'home'
  | 'chat'
  | 'carpetas'
  | 'galeria'
  | 'seguridad'
  | 'asistencia'
  | 'usuario'
  // 2. SEGURIDAD Y ACCESO QR
  | 'pase-qr'
  | 'autorizar'
  | 'historial'
  | 'guardia'
  | 'candado'
  // 3. ACADÉMICO
  | 'boletin'
  | 'nota-parcial'
  | 'firma-digital'
  | 'descargar-pdf'
  | 'subir'
  | 'archivo'
  | 'graduacion'
  | 'certificado'
  // 4. VIDA DIARIA
  | 'comedor'
  | 'descanso'
  | 'primeros-auxilios'
  | 'deportes'
  | 'talleres'
  | 'calendario'
  // 5. COMUNICACIÓN
  | 'notificaciones'
  | 'redactar'
  | 'novedades'
  | 'adjunto'
  | 'leido'
  // 6. MULTIMEDIA Y CONTROLES
  | 'buscar'
  | 'filtros'
  | 'camara'
  | 'compartir'
  | 'favorito'
  | 'favorito-fill'
  | 'pantalla-completa'
  | 'cerrar'
  | 'check'
  | 'volver';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

/**
 * Sistema Unificado de Iconos Vectoriales (2px Stroke Vector)
 * Basado en las 6 familias del Design System institucional:
 * 1. Navegación
 * 2. Seguridad y Acceso QR
 * 3. Académico
 * 4. Vida Diaria
 * 5. Comunicación
 * 6. Multimedia y Controles
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = '#131B2E',
  style,
}) => {
  switch (name) {
    /* 1. NAVEGACIÓN (2px stroke) */
    case 'home':
      return <Feather name="home" size={size} color={color} style={style} />;
    case 'chat':
      return (
        <Feather name="message-circle" size={size} color={color} style={style} />
      );
    case 'carpetas':
      return <Feather name="folder" size={size} color={color} style={style} />;
    case 'galeria':
      return <Feather name="image" size={size} color={color} style={style} />;
    case 'seguridad':
      return (
        <MaterialCommunityIcons
          name="shield-check-outline"
          size={size + 2}
          color={color}
          style={style}
        />
      );
    case 'asistencia':
      return (
        <MaterialCommunityIcons
          name="calendar-check-outline"
          size={size + 2}
          color={color}
          style={style}
        />
      );
    case 'usuario':
      return <Feather name="user" size={size} color={color} style={style} />;

    /* 2. SEGURIDAD Y ACCESO QR */
    case 'pase-qr':
      return (
        <MaterialCommunityIcons
          name="qrcode-scan"
          size={size}
          color={color}
          style={style}
        />
      );
    case 'autorizar':
      return (
        <Feather name="check-circle" size={size} color={color} style={style} />
      );
    case 'historial':
      return (
        <MaterialCommunityIcons
          name="history"
          size={size + 2}
          color={color}
          style={style}
        />
      );
    case 'guardia':
      return (
        <MaterialCommunityIcons
          name="shield-account-outline"
          size={size + 2}
          color={color}
          style={style}
        />
      );
    case 'candado':
      return <Feather name="lock" size={size} color={color} style={style} />;

    /* 3. ACADÉMICO */
    case 'boletin':
    case 'nota-parcial':
      return (
        <MaterialCommunityIcons
          name="clipboard-check-outline"
          size={size + 2}
          color={color}
          style={style}
        />
      );
    case 'firma-digital':
      return <Feather name="edit-3" size={size} color={color} style={style} />;
    case 'descargar-pdf':
      return (
        <Feather name="download" size={size} color={color} style={style} />
      );
    case 'subir':
      return <Feather name="upload" size={size} color={color} style={style} />;
    case 'archivo':
      return (
        <Feather name="file-text" size={size} color={color} style={style} />
      );
    case 'graduacion':
      return (
        <Ionicons
          name="school-outline"
          size={size + 2}
          color={color}
          style={style}
        />
      );
    case 'certificado':
      return (
        <MaterialCommunityIcons
          name="certificate-outline"
          size={size + 2}
          color={color}
          style={style}
        />
      );

    /* 4. VIDA DIARIA */
    case 'comedor':
      return (
        <MaterialCommunityIcons
          name="silverware-fork-knife"
          size={size}
          color={color}
          style={style}
        />
      );
    case 'descanso':
      return (
        <MaterialCommunityIcons
          name="bed-outline"
          size={size + 2}
          color={color}
          style={style}
        />
      );
    case 'primeros-auxilios':
      return (
        <MaterialCommunityIcons
          name="medical-bag"
          size={size + 2}
          color={color}
          style={style}
        />
      );
    case 'deportes':
      return (
        <MaterialCommunityIcons
          name="run"
          size={size + 2}
          color={color}
          style={style}
        />
      );
    case 'talleres':
      return (
        <MaterialCommunityIcons
          name="tools"
          size={size}
          color={color}
          style={style}
        />
      );
    case 'calendario':
      return (
        <Feather name="calendar" size={size} color={color} style={style} />
      );

    /* 5. COMUNICACIÓN */
    case 'notificaciones':
      return <Feather name="bell" size={size} color={color} style={style} />;
    case 'redactar':
      return <Feather name="edit" size={size} color={color} style={style} />;
    case 'novedades':
      return (
        <Ionicons
          name="megaphone-outline"
          size={size}
          color={color}
          style={style}
        />
      );
    case 'adjunto':
      return (
        <Feather name="paperclip" size={size} color={color} style={style} />
      );
    case 'leido':
      return (
        <Ionicons
          name="checkmark-done"
          size={size}
          color={color}
          style={style}
        />
      );

    /* 6. MULTIMEDIA Y CONTROLES */
    case 'buscar':
      return <Feather name="search" size={size} color={color} style={style} />;
    case 'filtros':
      return <Feather name="filter" size={size} color={color} style={style} />;
    case 'camara':
      return <Feather name="camera" size={size} color={color} style={style} />;
    case 'compartir':
      return <Feather name="share-2" size={size} color={color} style={style} />;
    case 'favorito':
      return <Feather name="heart" size={size} color={color} style={style} />;
    case 'favorito-fill':
      return (
        <Ionicons
          name="heart"
          size={size}
          color={color}
          style={style}
        />
      );
    case 'pantalla-completa':
      return (
        <Feather name="maximize-2" size={size} color={color} style={style} />
      );
    case 'cerrar':
      return <Feather name="x" size={size} color={color} style={style} />;
    case 'check':
      return <Feather name="check" size={size} color={color} style={style} />;
    case 'volver':
      return <Feather name="arrow-left" size={size} color={color} style={style} />;

    default:
      return null;
  }
};

