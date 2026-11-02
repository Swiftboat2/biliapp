import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-jwt-key-biliapp-change-in-production',
    });
  }

  async validate(payload: { sub: string; dni: string; role: string }) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: payload.sub },
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
                    medicalRecord: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no válido o inactivo');
    }

    return user;
  }
}

