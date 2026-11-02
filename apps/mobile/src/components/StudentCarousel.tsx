import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useActiveStudent } from '../context/StudentContext';
import { colors } from '../theme/colors';

export const StudentCarousel: React.FC = () => {
  const { students, activeStudent, setActiveStudent } = useActiveStudent();
  const { width } = useWindowDimensions();

  // Responsive card width: on smaller screens it leaves a peek of the next card
  const cardWidth = Math.min(width * 0.72, 280);

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <View style={styles.titleWithBadge}>
          <Text style={styles.sectionTitle}>Estudiantes a cargo</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{students.length}</Text>
          </View>
        </View>
        <Text style={styles.filterLink}>Toca para cambiar</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        decelerationRate="fast"
        snapToInterval={cardWidth + 12}
      >
        {students.map((student, index) => {
          const isSelected = activeStudent?.id === student.id;
          const percentage = student.educationalLevel === 'INICIAL' ? 96 : 88;
          const avatarGradients = ['#008C45', '#3898EC', '#D97706'];
          const avatarBg = avatarGradients[index % avatarGradients.length];

          return (
            <TouchableOpacity
              key={student.id}
              style={[
                styles.studentCard,
                { width: cardWidth },
                isSelected && styles.studentCardActive,
              ]}
              onPress={() => setActiveStudent(student)}
              activeOpacity={0.88}
            >
              {/* Portrait Avatar Box */}
              <View style={[styles.avatarBox, { backgroundColor: avatarBg }]}>
                <Text style={styles.avatarEmoji}>
                  {student.educationalLevel === 'INICIAL' ? '🧒' : '👧'}
                </Text>
                <View style={styles.statusIndicator} />
              </View>

              {/* Student Details */}
              <View style={styles.detailsCol}>
                <View style={styles.topNameRow}>
                  <Text
                    style={[styles.studentName, isSelected && styles.studentNameActive]}
                    numberOfLines={1}
                  >
                    {student.firstName}
                  </Text>

                  {/* Circular Score Ring */}
                  <View style={[styles.circleRing, isSelected && styles.circleRingActive]}>
                    <Text style={[styles.circleText, isSelected && styles.circleTextActive]}>
                      {percentage}%
                    </Text>
                  </View>
                </View>

                <Text style={styles.courseText} numberOfLines={1}>
                  {student.courseName}
                </Text>

                <View style={styles.bottomPillRow}>
                  <View style={[styles.levelPill, isSelected && styles.levelPillActive]}>
                    <Text style={[styles.levelPillText, isSelected && styles.levelPillTextActive]}>
                      {student.educationalLevel === 'INICIAL'
                        ? 'Nivel Inicial'
                        : student.educationalLevel === 'PRIMARIA'
                        ? 'Primaria'
                        : 'Secundaria'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  countBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  filterLink: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 22,
    padding: 12,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  studentCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.emerald,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  detailsCol: {
    flex: 1,
  },
  topNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: -0.3,
  },
  studentNameActive: {
    color: colors.primaryDark,
  },
  circleRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  circleRingActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  circleText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.textSecondary,
  },
  circleTextActive: {
    color: colors.primary,
  },
  courseText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  bottomPillRow: {
    marginTop: 6,
    flexDirection: 'row',
  },
  levelPill: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  levelPillActive: {
    backgroundColor: colors.primaryLight,
  },
  levelPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  levelPillTextActive: {
    color: colors.primaryDark,
  },
});
