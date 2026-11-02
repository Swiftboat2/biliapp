import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditAction } from '@biliapp/database';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body, ip } = request;

    // Only audit mutating actions (POST, PUT, PATCH, DELETE)
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const actionMap: Record<string, AuditAction> = {
      POST: AuditAction.CREATE,
      PUT: AuditAction.UPDATE,
      PATCH: AuditAction.UPDATE,
      DELETE: AuditAction.DELETE,
    };

    const action = actionMap[method] || AuditAction.UPDATE;

    return next.handle().pipe(
      tap({
        next: async (responseData) => {
          try {
            if (user?.id) {
              const entityName = url.split('/')[1] || 'UNKNOWN';
              const entityId = responseData?.id || responseData?.data?.id || 'N/A';

              await this.prisma.client.auditLog.create({
                data: {
                  userId: user.id,
                  ipAddress: ip,
                  action,
                  entityName,
                  entityId: String(entityId),
                  afterState: body ? (body as any) : undefined,
                  reason: request.headers['x-audit-reason'] || undefined,
                },
              });
            }
          } catch (error) {
            this.logger.error(`Failed to record audit log: ${error.message}`);
          }
        },
      }),
    );
  }
}

