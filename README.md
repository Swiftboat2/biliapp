# BiliAPP — Plataforma Escolar Integral y de Seguridad

Sistema integral de gestión escolar, seguridad física en puerta, asistencia con fracciones de inasistencia, seguimiento para nivel inicial, calificaciones y portal familiar con soporte para familias con múltiples hijos.

---

## 🏗️ Arquitectura del Monorepo

```text
biliapp/
├── apps/
│   ├── api/             # Backend NestJS (REST + WebSockets + JWT/PIN RBAC)
│   ├── web/             # Panel institucional web (Dirección, Preceptoría y Docentes) — Vite + React
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


### Panel institucional (web)
Panel para Dirección, Preceptoría y Docentes, con el mismo estilo de la app mobile. Por ahora usa datos de ejemplo en el navegador (`apps/web/src/data/mock.ts`), igual que la app mobile; las acciones se guardan en `localStorage` y se pueden restablecer desde el menú.

```bash
pnpm --filter @biliapp/web dev   # http://localhost:3001
```

Al entrar se elige el perfil (Dirección, Preceptoría o Docente). Cada rol ve solo sus secciones:
- **Dirección:** tablero del día, asistencia del colegio, ventanas de carga de notas, legajos (con actas DOE), retiros, comunicados, calendario y supervisión de conversaciones con auditoría.
- **Preceptoría:** toma de asistencia (diaria y contraturno), justificativos, retiros en puerta, legajos y salud, comunicados a sus cursos y mensajes con familias.
- **Docentes:** asistencia por materia, planilla de notas con instancias parciales (escrito, oral, TP o mixta, con opción "vale doble") y nota de cierre del trimestre, promedios por alumno y por curso del trimestre y del año (informe cualitativo en Jardín), observaciones pedagógicas, calendario de evaluaciones y mensajes.
- **App de familias (simulador):** desde el ingreso o el menú, "Ver la app de familias" muestra la app de celular de las familias (Laura López, mamá de Mateo y Sofía) dentro de un marco de teléfono. Usa los mismos datos del panel: firmar autorizaciones, enviar justificativos, autorizar retiros y escribir mensajes le llega al instante a Preceptoría, Docentes y Dirección.

Deploy en Vercel: proyecto con *Root Directory* `apps/web` (la configuración de build está en `apps/web/vercel.json`).
