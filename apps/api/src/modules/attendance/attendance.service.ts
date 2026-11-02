import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TakeAttendanceInput } from '@biliapp/validators';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentAttendanceHistory(studentId: string) {
    return this.prisma.client.attendanceDetail.findMany({
      where: { studentId },
      include: {
        record: {
          include: {
            courseDivision: true,
            subject: true,
          },
        },
      },
      orderBy: {
        record: {
          date: 'desc',
        },
      },
    });
  }

  async uploadMedicalCertificate(detailId: string, certUrl: string, notes?: string) {
    const detail = await this.prisma.client.attendanceDetail.findUnique({
      where: { id: detailId },
    });

    if (!detail) {
      throw new NotFoundException('Registro de inasistencia no encontrado');
    }

    return this.prisma.client.attendanceDetail.update({
      where: { id: detailId },
      data: {
        medicalCertUrl: certUrl,
        justificationNotes: notes,
        justificationStatus: 'PENDING',
      },
    });
  }

  async takeAttendance(input: TakeAttendanceInput, teacherUserId: string) {
    const fractionMap = {
      PRESENTE: 0.0,
      TARDANZA_CUARTO: 0.25,
      RETIRO_MEDIO: 0.5,
      AUSENTE_JUSTIFICADO: 1.0,
      AUSENTE_INJUSTIFICADO: 1.0,
    };

    const record = await this.prisma.client.attendanceRecord.upsert({
      where: {
        courseDivisionId_date_shift_subjectId: {
          courseDivisionId: input.courseDivisionId,
          date: new Date(input.date),
          shift: input.shift as any,
          subjectId: input.subjectId || null,
        },
      },
      update: {
        takenByUserId: teacherUserId,
        clientSyncId: input.clientSyncId,
      },
      create: {
        courseDivisionId: input.courseDivisionId,
        date: new Date(input.date),
        shift: input.shift as any,
        subjectId: input.subjectId || null,
        takenByUserId: teacherUserId,
        clientSyncId: input.clientSyncId,
      },
    });

    // Bulk upsert details
    for (const entry of input.entries) {
      const fraction = fractionMap[entry.state];
      await this.prisma.client.attendanceDetail.upsert({
        where: {
          recordId_studentId: {
            recordId: record.id,
            studentId: entry.studentId,
          },
        },
        update: {
          state: entry.state as any,
          fractionValue: fraction,
          justificationNotes: entry.justificationNotes,
        },
        create: {
          recordId: record.id,
          studentId: entry.studentId,
          state: entry.state as any,
          fractionValue: fraction,
          justificationNotes: entry.justificationNotes,
        },
      });
    }

    return record;
  }
}

