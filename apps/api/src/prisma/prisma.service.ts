import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma, PrismaClient } from '@biliapp/database';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  readonly client: PrismaClient = prisma;

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
