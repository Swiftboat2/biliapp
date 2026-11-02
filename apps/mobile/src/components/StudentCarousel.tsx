import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useActiveStudent, ChildStudent } from '../context/StudentContext';
import { colors } from '../theme/colors';

interface StudentExtended extends ChildStudent {
  attendancePercentage?: number;
  avatarBg?: string;
}

export const StudentCarousel: React.FC = () => {
  const { students, activeStudent, setActiveStudent } = useActiveStudent();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Estudiantes</Text>
        <Text style={styles.filterText}>Ver todos ▾</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {students.map((student, index) => {
          const isSelected = activeStudent?.id === student.id;
          const percentage = student.educationalLevel === 'INICIAL' ? 96 : 88;
          const avatarColors = ['#F97316', '#3B82F6', '#10B981', '#8B5CF6'];
          const avatarColor = avatarColors[index % avatarColors.length];

          return (
            <TouchableOpacity
              key={student.id}
              style={[styles.card, isSelected && styles.activeCard]}
              onPress={() => setActiveStudent(student)}
              activeOpacity={0.85}
            >
              {/* Avatar Box */}
              <View style={[styles.avatarBox, { backgroundColor: avatarColor }]}>
                <Text style={styles.avatarInitial}>
                  {student.firstName.charAt(0)}
                  {student.lastName.charAt(0)}
                </Text>
              </View>

              {/* Info Column */}
              <View style={styles.infoCol}>
                <View style={styles.topInfoRow}>
                  <Text style={[styles.studentName, isSelected && styles.activeName]}>
                    {student.firstName}
                  </Text>
                  {/* Circular Score Badge */}
                  <View style={[styles.percentBadge, isSelected && styles.activePercentBadge]}>
                    <Text style={[styles.percentText, isSelected && styles.activePercentText]}>
                      {percentage}%
                    </Text>
                  </View>
                </View>

                <Text style={styles.courseSubtitle} numberOfLines={1}>
                  {student.educationalLevel === 'INICIAL'
                    ? 'Nivel Inicial'
                    : student.educationalLevel === 'PRIMARIA'
                    ? 'Primaria'
                    : 'Secundaria'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 18,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    padding: 10,
    paddingRight: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    minWidth: 180,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  activeCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  avatarBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  infoCol: {
    flex: 1,
  },
  topInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  activeName: {
    color: colors.primaryDark,
  },
  percentBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePercentBadge: {
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
  },
  percentText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  activePercentText: {
    color: colors.primary,
  },
  courseSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

