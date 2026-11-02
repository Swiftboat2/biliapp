import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginInput, GuardianPinAuthInput, RegisterUserInput } from '@biliapp/validators';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(input: LoginInput) {
    const user = await this.prisma.client.user.findFirst({
      where: {
        OR: [{ dni: input.identifier }, { email: input.identifier }],
      },
      include: {
        guardianProfile: {
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
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verify either password or PIN (for parents)
    let isValid = false;
    if (user.passwordHash) {
      isValid = await bcrypt.compare(input.password, user.passwordHash);
    }
    if (!isValid && user.pinHash && input.password.length === 6) {
      isValid = await bcrypt.compare(input.password, user.pinHash);
    }

    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, dni: user.dni, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        dni: user.dni,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        guardianProfile: user.guardianProfile,
      },
    };
  }

  async loginWithPin(input: GuardianPinAuthInput) {
    const guardian = await this.prisma.client.guardian.findUnique({
      where: { id: input.guardianId },
      include: {
        user: true,
        students: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!guardian || !guardian.user || !guardian.user.isActive) {
      throw new UnauthorizedException('Tutor no encontrado o inactivo');
    }

    if (!guardian.user.pinHash) {
      throw new BadRequestException('El tutor no tiene configurado un PIN de acceso rápido');
    }

    const isPinValid = await bcrypt.compare(input.pin, guardian.user.pinHash);
    if (!isPinValid) {
      throw new UnauthorizedException('PIN incorrecto');
    }

    const payload = { sub: guardian.user.id, dni: guardian.user.dni, role: guardian.user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      guardian: {
        id: guardian.id,
        userId: guardian.userId,
        fullName: `${guardian.user.firstName} ${guardian.user.lastName}`,
        students: guardian.students,
      },
    };
  }

  async register(input: RegisterUserInput) {
    const existing = await this.prisma.client.user.findFirst({
      where: {
        OR: [{ dni: input.dni }, ...(input.email ? [{ email: input.email }] : [])],
      },
    });

    if (existing) {
      throw new BadRequestException('Ya existe un usuario con este DNI o correo electrónico');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const pinHash = input.pin ? await bcrypt.hash(input.pin, 10) : undefined;

    const user = await this.prisma.client.user.create({
      data: {
        dni: input.dni,
        email: input.email,
        passwordHash,
        pinHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role as any,
        phone: input.phone,
        ...(input.role === 'TUTOR'
          ? {
              guardianProfile: {
                create: {
                  phone: input.phone,
                },
              },
            }
          : {}),
      },
    });

    return { id: user.id, dni: user.dni, role: user.role, firstName: user.firstName };
  }
}

