import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommunicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getGuardianCommunications(guardianUserId: string) {
    const list = await this.prisma.client.communicationRecipient.findMany({
      where: { guardianUserId },
      include: {
        communication: true,
      },
      orderBy: {
        communication: {
          createdAt: 'desc',
        },
      },
    });

    return list.map((item) => ({
      recipientId: item.id,
      communicationId: item.communicationId,
      title: item.communication.title,
      content: item.communication.content,
      requiresPinAuth: item.communication.requiresPinAuth,
      authPrompt: item.communication.authPrompt,
      createdAt: item.communication.createdAt,
      isRead: item.isRead,
      readAt: item.readAt,
      isPinConfirmed: item.isPinConfirmed,
      pinConfirmedAt: item.pinConfirmedAt,
    }));
  }

  async markAsRead(recipientId: string, guardianUserId: string) {
    return this.prisma.client.communicationRecipient.updateMany({
      where: { id: recipientId, guardianUserId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async signWithPin(
    recipientId: string,
    guardianUserId: string,
    pin: string,
  ) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: guardianUserId },
    });

    if (!user || !user.pinHash) {
      throw new UnauthorizedException('El tutor no tiene configurado un PIN de firma');
    }

    const isMatch = await bcrypt.compare(pin, user.pinHash);
    if (!isMatch) {
      throw new UnauthorizedException('PIN incorrecto. Autorización no confirmada.');
    }

    return this.prisma.client.communicationRecipient.update({
      where: { id: recipientId },
      data: {
        isPinConfirmed: true,
        pinConfirmedAt: new Date(),
        isRead: true,
        readAt: new Date(),
      },
    });
  }
}

