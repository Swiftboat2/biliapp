import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useActiveStudent } from '../context/StudentContext';
import { colors } from '../theme/colors';

export const StudentCarousel: React.FC = () => {
  const { students, activeStudent, setActiveStudent } = useActiveStudent();
  const { width } = useWindowDimensions();

  // Responsive card width
  const cardWidth = Math.min(width * 0.76, 290);
  const inactiveCardWidth = Math.min(width * 0.62, 230);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        decelerationRate="fast"
      >
        {students.map((student) => {
          const isSelected = activeStudent?.id === student.id;
          const percentage = student.educationalLevel === 'INICIAL' ? 96 : 88;
          const isKinder = student.educationalLevel === 'INICIAL';

          if (isSelected) {
            return (
              <View
                key={student.id}
                style={[styles.cardActive, { width: cardWidth }]}
              >
                {/* Top Green Accent Bar */}
                <View style={styles.topAccentBar} />

                <View style={styles.cardHeaderRow}>
                  <View style={styles.avatarWrap}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarEmoji}>{isKinder ? '🧒' : '👧'}</Text>
                    </View>
                    <View style={styles.avatarCheckBadge}>
                      <Text style={styles.avatarCheckIcon}>✓</Text>
                    </View>
                  </View>

                  <View style={styles.studentInfoCol}>
                    <View style={styles.nameRow}>
                      <Text style={styles.studentName} numberOfLines={1}>
                        {student.firstName} {student.lastName}
                      </Text>
                      <View style={styles.asistBadge}>
                        <Text style={styles.asistBadgeText}>{percentage}% ASIST.</Text>
                      </View>
                    </View>
                    <Text style={styles.courseSubtitle} numberOfLines={1}>
                      {student.courseName} · {isKinder ? 'Nivel Inicial' : 'Primaria'}
                    </Text>
                  </View>
                </View>

                {/* Bottom Status Strip */}
                <View style={styles.statusStrip}>
                  <View style={styles.statusStripLeft}>
                    <Text style={styles.statusStripIcon}>🏫</Text>
                    <Text style={styles.statusStripShift}>
                      Turno {isKinder ? 'Mañana/Tarde' : 'Mañana'}
                    </Text>
                  </View>
                  <Text style={styles.statusStripPresent}>PRESENTE HOY</Text>
                </View>
              </View>
            );
          }

          // Inactive Student Card (Brother/Sister switcher)
          return (
            <TouchableOpacity
              key={student.id}
              style={[styles.cardInactive, { width: inactiveCardWidth }]}
              onPress={() => setActiveStudent(student)}
              activeOpacity={0.88}
            >
              <View style={styles.cardHeaderRow}>
                <View style={styles.avatarInitials}>
                  <Text style={styles.avatarInitialsText}>
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </Text>
                </View>

                <View style={styles.studentInfoCol}>
                  <Text style={styles.studentNameInactive} numberOfLines={1}>
                    {student.firstName} {student.lastName}
                  </Text>
                  <Text style={styles.courseSubtitle} numberOfLines={1}>
                    {student.courseName} · {isKinder ? 'Nivel Inicial' : 'Primaria'}
                  </Text>
                </View>
              </View>

              <View style={styles.inactiveBottomRow}>
                <Text style={styles.inactiveActionText}>Ver bitácora</Text>
                <Text style={styles.inactiveArrow}>›</Text>
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
    width: '100%',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 12,
    paddingVertical: 4,
  },
  cardActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  topAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.primary,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F7EE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  avatarCheckBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarCheckIcon: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  studentInfoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#131B2E',
    flexShrink: 1,
  },
  asistBadge: {
    backgroundColor: '#E8F7EE',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 12,
  },
  asistBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#005F2E',
    letterSpacing: 0.5,
  },
  courseSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  statusStrip: {
    marginTop: 12,
    paddingTop: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusStripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusStripIcon: {
    fontSize: 13,
  },
  statusStripShift: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  statusStripPresent: {
    fontSize: 10,
    fontWeight: '800',
    color: '#005F2E',
    letterSpacing: 0.5,
  },
  // Inactive
  cardInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    opacity: 0.9,
    justifyContent: 'space-between',
  },
  avatarInitials: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  avatarInitialsText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A73E8',
  },
  studentNameInactive: {
    fontSize: 15,
    fontWeight: '700',
    color: '#131B2E',
  },
  inactiveBottomRow: {
    marginTop: 10,
    paddingTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  inactiveActionText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  inactiveArrow: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '700',
  },
});
