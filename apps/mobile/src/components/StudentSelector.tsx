import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useActiveStudent, ChildStudent } from '../context/StudentContext';

export const StudentSelector: React.FC = () => {
  const { students, activeStudent, setActiveStudent } = useActiveStudent();

  if (students.length <= 1) {
    if (students.length === 1) {
      return (
        <View style={styles.singleContainer}>
          <Text style={styles.singleName}>
            {students[0].firstName} {students[0].lastName}
          </Text>
          <Text style={styles.singleCourse}>{students[0].courseName}</Text>
        </View>
      );
    }
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Estudiante activo:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {students.map((student) => {
          const isActive = activeStudent?.id === student.id;
          return (
            <TouchableOpacity
              key={student.id}
              onPress={() => setActiveStudent(student)}
              style={[styles.pill, isActive && styles.activePill]}
              activeOpacity={0.8}
            >
              <View style={[styles.avatar, isActive && styles.activeAvatar]}>
                <Text style={styles.avatarText}>
                  {student.firstName.charAt(0)}
                  {student.lastName.charAt(0)}
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={[styles.studentName, isActive && styles.activeText]}>
                  {student.firstName}
                </Text>
                <Text style={[styles.courseText, isActive && styles.activeSubText]}>
                  {student.educationalLevel === 'INICIAL'
                    ? 'Jardín'
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
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    paddingHorizontal: 16,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
  },
  activePill: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  activeAvatar: {
    backgroundColor: '#3b82f6',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  info: {
    flexDirection: 'column',
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  activeText: {
    color: '#ffffff',
  },
  courseText: {
    fontSize: 11,
    color: '#64748b',
  },
  activeSubText: {
    color: '#93c5fd',
  },
  singleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  singleName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  singleCourse: {
    fontSize: 13,
    color: '#475569',
  },
});

