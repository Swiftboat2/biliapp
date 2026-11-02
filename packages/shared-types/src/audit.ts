export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  UNLOCK_PERIOD = 'UNLOCK_PERIOD',
  SUPERVISE_CHAT = 'SUPERVISE_CHAT',
  EMERGENCY_PICKUP = 'EMERGENCY_PICKUP'
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  ipAddress?: string;
  action: AuditAction;
  entityName: string;
  entityId: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  reason?: string;
  createdAt: string;
}

