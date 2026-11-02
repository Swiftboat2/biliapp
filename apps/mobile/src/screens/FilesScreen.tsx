import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
    Alert.alert('Descarga de Archivo', `Descargando "${file.name}" para consulta sin conexión.`);
  };

  return (
    <View style={styles.container}>
      {/* 1. CURVED HERO BANNER */}
      <View style={styles.heroBanner}>
        <Text style={styles.heroTitle}>Archivos</Text>
        <Text style={styles.heroSubtitle}>
          Accede a archivos compartidos por docentes o directivos del colegio.
        </Text>
      </View>

      {/* 2. FLOATING TAB BAR */}
      <View style={styles.tabWrapper}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'RECIENTES' && styles.activeTab]}
            onPress={() => setActiveTab('RECIENTES')}
            activeOpacity={0.85}
          >
            <Text style={[styles.tabText, activeTab === 'RECIENTES' && styles.activeTabText]}>
              Recientes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'CARPETAS' && styles.activeTab]}
            onPress={() => setActiveTab('CARPETAS')}
            activeOpacity={0.85}
          >
            <Text style={[styles.tabText, activeTab === 'CARPETAS' && styles.activeTabText]}>
              Carpetas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section: Hoy */}
        <Text style={styles.sectionHeader}>Hoy</Text>
        <View style={styles.groupCard}>
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
                  <View style={styles.iconBox}>{renderIcon(file.type)}</View>
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text style={styles.fileSender}>
                      {file.sender} {file.size ? `· ${file.size}` : ''}
                    </Text>
                  </View>
                </View>
                <View style={styles.downloadCircle}>
                  <Text style={styles.downloadAction}>↓</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* Section: Esta semana */}
        <Text style={styles.sectionHeader}>Esta semana</Text>
        <View style={styles.groupCard}>
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
                  <View style={styles.iconBox}>{renderIcon(file.type)}</View>
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text style={styles.fileSender}>
                      {file.sender} {file.size ? `· ${file.size}` : ''}
                    </Text>
                  </View>
                </View>
                <View style={styles.downloadCircle}>
                  <Text style={styles.downloadAction}>↓</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* Section: Este mes */}
        <Text style={styles.sectionHeader}>Este mes</Text>
        <View style={styles.groupCard}>
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
                  <View style={styles.iconBox}>{renderIcon(file.type)}</View>
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text style={styles.fileSender}>
                      {file.sender} {file.size ? `· ${file.size}` : ''}
                    </Text>
                  </View>
                </View>
                <View style={styles.downloadCircle}>
                  <Text style={styles.downloadAction}>↓</Text>
                </View>
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
  tabWrapper: {
    paddingHorizontal: 20,
    marginTop: -20,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  fileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconFolder: {
    fontSize: 22,
  },
  iconPdf: {
    fontSize: 22,
  },
  iconDoc: {
    fontSize: 22,
  },
  iconFile: {
    fontSize: 22,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  fileSender: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  downloadCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  downloadAction: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
  },
});
