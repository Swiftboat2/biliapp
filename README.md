# BiliAPP — Plataforma Escolar Integral y de Seguridad

Sistema integral de gestión escolar, seguridad física en puerta, asistencia con fracciones de inasistencia, seguimiento para nivel inicial, calificaciones y portal familiar con soporte para familias con múltiples hijos.

---

## 🏗️ Arquitectura del Monorepo

```text
biliapp/
├── apps/
│   ├── api/             # Backend NestJS (REST + WebSockets + JWT/PIN RBAC)
│   └── mobile/          # App Móvil Familias y Puerta con Selector Multi-Hijo (React Native Expo SDK 58)
├── packages/
│   ├── database/        # Prisma ORM, migraciones PostgreSQL y seeders
│   ├── shared-types/    # Interfaces, Enums y contratos TypeScript compartidos
│   ├── validators/      # Esquemas de validación Zod compartidos
│   └── config/          # Configuraciones compartidas de TypeScript y ESLint
└── docker/
    └── docker-compose.yml # PostgreSQL 16 y Redis 7
```

---

## 🚀 Inicio Rápido en Desarrollo Local

### 1. Prerrequisitos
- Node.js 20+ (recomendado Node 22)
- pnpm (`npm install -g pnpm`)
- Docker Desktop

### 2. Variables de Entorno
Copia el archivo de ejemplo para configurar la base de datos y JWT:
```bash
cp .env.example .env
```

### 3. Levantar Base de Datos y Caché (PostgreSQL + Redis)
```bash
pnpm docker:up
```

### 4. Instalar Dependencias y Generar Cliente Prisma
```bash
pnpm install
pnpm db:generate
pnpm db:push
```

### 5. Cargar Datos Demo (Institución, Cursos, Familia Multi-Hijo, Alertas)
```bash
pnpm --filter @biliapp/database ts-node prisma/seed.ts
```

### 6. Iniciar Aplicaciones en Paralelo
```bash
pnpm dev
```
- **API NestJS:** `http://localhost:4000` (Endpoints REST y Auth)
- **App Móvil (Expo):** `pnpm --filter @biliapp/mobile start`

---

## 🔐 Decisiones Implementadas

- **Gestión Multi-Hijo:** La cuenta pertenece al Tutor/Padre (login por DNI/Email + PIN de 6 dígitos). Un tutor puede vincular a múltiples hijos de diferentes niveles (Jardín, Primaria, Secundaria). La app móvil cuenta con un selector reactivo en cabecera para conmutar de estudiante sin cerrar sesión.
- **Seguridad en Puerta (Pick-Up):** Búsqueda rápida por DNI, lista de personas autorizadas (permanentes o eventuales con fecha de vencimiento) y **banner visual de alerta roja inmediata** ante restricciones perimetrales o judiciales.
- **Asistencia con Cómputo de Fracciones:** Soporte nativo para `Presente (0)`, `Tardanza (1/4 falta)`, `Retiro Anticipado (1/2 falta)` y `Ausente (1 falta)` con bandeja para justificaciones médicas subidas por las familias.
- **Nivel Inicial:** Registro táctil de estados de ánimo, alimentación, descanso e higiene (mudas de pañal) con timeline para familias.
- **Auditoría Inmutable:** Interceptor append-only en NestJS que registra usuario, timestamp, IP, entidad modificada y payload previo/posterior.

