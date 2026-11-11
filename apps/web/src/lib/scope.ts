import { UserRole } from '@biliapp/shared-types';
import { ASSIGNMENTS, COURSES } from '../data/mock';
import type { Course, DataState, StaffUser, Student } from '../data/types';

/** Cursos que ve cada persona: Dirección todos, Preceptoría los suyos, Docentes donde dicta. */
export function visibleCourses(user: StaffUser): Course[] {
  if (user.role === UserRole.DIRECTIVO) return COURSES;
  if (user.role === UserRole.PRECEPTOR) return COURSES.filter((c) => user.courseIds?.includes(c.id));
  const ids = new Set(ASSIGNMENTS.filter((a) => a.teacherId === user.id).map((a) => a.courseId));
  return COURSES.filter((c) => ids.has(c.id));
}

export function visibleStudents(user: StaffUser, data: DataState): Student[] {
  const ids = new Set(visibleCourses(user).map((c) => c.id));
  return data.students.filter((s) => ids.has(s.courseId));
}

export const myAssignments = (user: StaffUser) => ASSIGNMENTS.filter((a) => a.teacherId === user.id);

export const studentsOf = (data: DataState, courseId: string) =>
  data.students.filter((s) => s.courseId === courseId).sort((a, b) => a.lastName.localeCompare(b.lastName, 'es'));
