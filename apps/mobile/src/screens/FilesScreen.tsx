import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';

interface FileItem {
  id: string;
  name: string;
  type: 'FOLDER' | 'PDF' | 'DOC' | 'SHEET';
  size?: string;
  dateTag: 'HOY' | 'ESTA_SEMANA' | 'ESTE_MES';
  sender: string;
}

export const FilesScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'RECIENTES' | 'CARPETAS'>('RECIENTES');
  const [search, setSearch] = useState('');

  const files: FileItem[] = [
    {
      id: 'f1',
      name: 'Archivos de Grado — 2026',
      type: 'FOLDER',
      dateTag: 'HOY',
      sender: 'Dirección General',
    },
    {
      id: 'f2',
      name: 'Reglamento_Institucional_2026.pdf',
      type: 'PDF',
      size: '1.8 MB',
      dateTag: 'HOY',
      sender: 'Secretaría Académica',
    },
    {
      id: 'f3',
      name: 'Actividades_Psicomotricidad.pdf',
      type: 'PDF',
      size: '640 KB',
      dateTag: 'ESTA_SEMANA',
      sender: 'Seño Laura (Jardín)',
    },
    {
      id: 'f4',
      name: 'Autorizacion_Salida_Temaiken.pdf',
      type: 'PDF',
      size: '320 KB',
      dateTag: 'ESTA_SEMANA',
      sender: 'Preceptoría General',
    },
    {
      id: 'f5',
      name: 'Lista_Materiales_Educacion_Fisica.docx',
      type: 'DOC',
      size: '120 KB',
      dateTag: 'ESTE_MES',
      sender: 'Prof. Carlos Gómez',
    },
    {
      id: 'f6',
      name: 'Boletin_Informativo_Trimestral.pdf',
      type: 'PDF',
      size: '2.1 MB',
      dateTag: 'ESTE_MES',
      sender: 'Dirección',
    },
  ];

  const renderIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'FOLDER':
        return <Text style={styles.iconFolder}>📁</Text>;
      case 'PDF':
        return <Text style={styles.iconPdf}>📄</Text>;
      case 'DOC':
        return <Text style={styles.iconDoc}>📝</Text>;
      default:
        return <Text style={styles.iconFile}>📎</Text>;
    }
  };

  const handleDownload = (file: FileItem) => {
    Alert.alert('Descargando Archivo', `Descargando "${file.name}" para consulta offline.`);
  };

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Archivos y Documentos</Text>
        <Text style={styles.bannerSubtitle}>
          Accede a archivos compartidos por docentes o directivos del colegio.
        </Text>
      </View>

      {/* Tabs Switcher: Recientes / Carpetas */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'RECIENTES' && styles.activeTab]}
          onPress={() => setActiveTab('RECIENTES')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'RECIENTES' && styles.activeTabText]}>
            Recientes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'CARPETAS' && styles.activeTab]}
          onPress={() => setActiveTab('CARPETAS')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'CARPETAS' && styles.activeTabText]}>
            Carpetas
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section: Hoy */}
        <Text style={styles.sectionHeader}>Hoy</Text>
        <View style={styles.group}>
          {files
            .filter((f) => f.dateTag === 'HOY')
            .map((file) => (
              <TouchableOpacity
                key={file.id}
                style={styles.fileRow}
                onPress={() => handleDownload(file)}
                activeOpacity={0.7}
              >
                <View style={styles.fileLeft}>
                  {renderIcon(file.type)}
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text style={styles.fileSender}>
                      {file.sender} {file.size ? `· ${file.size}` : ''}
                    </Text>
                  </View>
                </View>
                <Text style={styles.downloadAction}>↓</Text>
              </TouchableOpacity>
            ))}
        </View>

        {/* Section: Esta semana */}
        <Text style={styles.sectionHeader}>Esta semana</Text>
        <View style={styles.group}>
          {files
            .filter((f) => f.dateTag === 'ESTA_SEMANA')
            .map((file) => (
              <TouchableOpacity
                key={file.id}
                style={styles.fileRow}
                onPress={() => handleDownload(file)}
                activeOpacity={0.7}
              >
                <View style={styles.fileLeft}>
                  {renderIcon(file.type)}
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text style={styles.fileSender}>
                      {file.sender} {file.size ? `· ${file.size}` : ''}
                    </Text>
                  </View>
                </View>
                <Text style={styles.downloadAction}>↓</Text>
              </TouchableOpacity>
            ))}
        </View>

        {/* Section: Este mes */}
        <Text style={styles.sectionHeader}>Este mes</Text>
        <View style={styles.group}>
          {files
            .filter((f) => f.dateTag === 'ESTE_MES')
            .map((file) => (
              <TouchableOpacity
                key={file.id}
                style={styles.fileRow}
                onPress={() => handleDownload(file)}
                activeOpacity={0.7}
              >
                <View style={styles.fileLeft}>
                  {renderIcon(file.type)}
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text style={styles.fileSender}>
                      {file.sender} {file.size ? `· ${file.size}` : ''}
                    </Text>
                  </View>
                </View>
                <Text style={styles.downloadAction}>↓</Text>
              </TouchableOpacity>
            ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    marginHorizontal: 18,
    borderRadius: 20,
    padding: 3,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 18,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 18,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 14,
    marginBottom: 8,
  },
  group: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  fileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconFolder: {
    fontSize: 24,
  },
  iconPdf: {
    fontSize: 24,
  },
  iconDoc: {
    fontSize: 24,
  },
  iconFile: {
    fontSize: 24,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  fileSender: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  downloadAction: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    paddingHorizontal: 8,
  },
});

