import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getGuardianStudents(guardianUserId: string) {
    const guardian = await this.prisma.client.guardian.findUnique({
      where: { userId: guardianUserId },
      include: {
        students: {
          include: {
            student: {
              include: {
                enrollments: {
                  include: {
                    courseDivision: true,
                  },
                },
                medicalRecord: true,
                legalAlerts: {
                  where: { isActive: true },
                },
              },
            },
          },
        },
      },
    });

    if (!guardian) {
      throw new NotFoundException('Perfil de tutor no encontrado');
    }

    return guardian.students.map((rel) => {
      const activeEnrollment = rel.student.enrollments[0];
      const courseName = activeEnrollment
        ? `${activeEnrollment.courseDivision.yearNumber}° "${activeEnrollment.courseDivision.division}" (${activeEnrollment.courseDivision.shift})`
        : 'Sin curso asignado';

      return {
        id: rel.student.id,
        dni: rel.student.dni,
        firstName: rel.student.firstName,
        lastName: rel.student.lastName,
        photoUrl: rel.student.photoUrl,
        educationalLevel: rel.student.educationalLevel,
        courseName,
        relationship: rel.relationship,
        isPrimaryContact: rel.isPrimaryContact,
        medicalRecord: rel.student.medicalRecord,
        hasLegalAlert: rel.student.legalAlerts.length > 0,
      };
    });
  }

  async getStudentDashboard(studentId: string) {
    const student = await this.prisma.client.student.findUnique({
      where: { id: studentId },
      include: {
        enrollments: {
          include: {
            courseDivision: true,
          },
        },
        medicalRecord: true,
        legalAlerts: {
          where: { isActive: true },
        },
        authorizedPersons: {
          where: {
            OR: [
              { isPermanent: true },
              { validUntil: { gte: new Date() } },
            ],
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    // Calculate attendance summary
    const attendanceDetails = await this.prisma.client.attendanceDetail.findMany({
      where: { studentId },
      include: {
        record: true,
      },
    });

    const totalAbsences = attendanceDetails.reduce((sum, item) => sum + item.fractionValue, 0);

    return {
      student: {
        id: student.id,
        dni: student.dni,
        firstName: student.firstName,
        lastName: student.lastName,
        educationalLevel: student.educationalLevel,
        medicalRecord: student.medicalRecord,
        legalAlerts: student.legalAlerts,
      },
      stats: {
        totalAbsences,
        recordedAttendancesCount: attendanceDetails.length,
        authorizedPersonsCount: student.authorizedPersons.length,
      },
    };
  }
}

