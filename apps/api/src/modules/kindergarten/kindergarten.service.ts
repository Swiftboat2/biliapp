import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DailyKindergartenLogInput } from '@biliapp/validators';
import { DailyKindergartenLog } from '@biliapp/database';

@Injectable()
export class KindergartenService {
  constructor(private readonly prisma: PrismaService) {}

  async getDailyLog(studentId: string, dateStr: string): Promise<DailyKindergartenLog | null> {
    const targetDate = new Date(dateStr);
    return this.prisma.client.dailyKindergartenLog.findUnique({
      where: {
        studentId_date: {
          studentId,
          date: targetDate,
        },
      },
    });
  }

  async saveDailyLog(input: DailyKindergartenLogInput, teacherUserId: string): Promise<DailyKindergartenLog> {
    const targetDate = new Date(input.date);

    return this.prisma.client.dailyKindergartenLog.upsert({
      where: {
        studentId_date: {
          studentId: input.studentId,
          date: targetDate,
        },
      },
      update: {
        mood: input.mood as any,
        snackIntake: input.snackIntake as any,
        lunchIntake: input.lunchIntake as any,
        napStart: input.napStart,
        napEnd: input.napEnd,
        diaperLogs: input.diaperLogs as any,
        observations: input.observations,
        recordedByUserId: teacherUserId,
      },
      create: {
        studentId: input.studentId,
        date: targetDate,
        mood: input.mood as any,
        snackIntake: input.snackIntake as any,
        lunchIntake: input.lunchIntake as any,
        napStart: input.napStart,
        napEnd: input.napEnd,
        diaperLogs: input.diaperLogs as any,
        observations: input.observations,
        recordedByUserId: teacherUserId,
      },
    });
  }
}
