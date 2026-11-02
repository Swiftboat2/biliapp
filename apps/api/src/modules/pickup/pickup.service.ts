import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePickupAuthorizationInput, RecordPickupInput } from '@biliapp/validators';

@Injectable()
export class PickupService {
  constructor(private readonly prisma: PrismaService) {}

  async getAuthorizedPersons(studentId: string) {
    const student = await this.prisma.client.student.findUnique({
      where: { id: studentId },
      include: {
        legalAlerts: {
          where: { isActive: true },
        },
        authorizedPersons: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return {
      legalAlerts: student?.legalAlerts || [],
      authorizedPersons: student?.authorizedPersons || [],
    };
  }

  async createEventualAuthorization(input: CreatePickupAuthorizationInput) {
    // Check if the person is under legal restrictions
    const student = await this.prisma.client.student.findUnique({
      where: { id: input.studentId },
      include: {
        legalAlerts: { where: { isActive: true } },
      },
    });

    if (student?.legalAlerts) {
      for (const alert of student.legalAlerts) {
        if (alert.restrictedPersons.some((p) => p.includes(input.dni))) {
          throw new BadRequestException(
            'ATENCIÓN: Este DNI se encuentra expresamente restringido por orden judicial.',
          );
        }
      }
    }

    return this.prisma.client.pickupAuthorizedPerson.create({
      data: {
        studentId: input.studentId,
        dni: input.dni,
        fullName: input.fullName,
        relationship: input.relationship,
        phone: input.phone,
        isPermanent: false,
        validUntil: input.validUntil ? new Date(input.validUntil) : new Date(Date.now() + 86400000), // Default 24hs
      },
    });
  }

  async recordPickup(input: RecordPickupInput, preceptorUserId: string) {
    return this.prisma.client.pickupLog.create({
      data: {
        studentId: input.studentId,
        authorizedPersonId: input.authorizedPersonId,
        verifiedByUserId: preceptorUserId,
        notes: input.notes,
      },
    });
  }
}

