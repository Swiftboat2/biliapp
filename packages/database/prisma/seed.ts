import { PrismaClient, UserRole, EducationalLevel, SchoolShift, LegalAlertSeverity } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding BiliAPP database...');

  // 1. Institución
  const institution = await prisma.institution.upsert({
    where: { code: 'IRI-ER' },
    update: {},
    create: {
      name: 'Instituto República de Italia',
      code: 'IRI-ER',
      address: 'Entre Ríos, Argentina',
      phone: '+54 343 400-0000',
    },
  });

  // 2. Ciclo Lectivo 2026
  const academicYear = await prisma.academicYear.upsert({
    where: {
      institutionId_year: {
        institutionId: institution.id,
        year: 2026,
      },
    },
    update: {},
    create: {
      institutionId: institution.id,
      year: 2026,
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-12-15'),
      isCurrent: true,
    },
  });

  // 3. Cursos representativos para los 3 niveles
  // Jardín: Sala de 4 Tarde
  const sala4Tarde = await prisma.courseDivision.upsert({
    where: {
      academicYearId_level_yearNumber_division_shift: {
        academicYearId: academicYear.id,
        level: EducationalLevel.INICIAL,
        yearNumber: 4,
        division: 'Unica',
        shift: SchoolShift.TARDE,
      },
    },
    update: {},
    create: {
      institutionId: institution.id,
      academicYearId: academicYear.id,
      level: EducationalLevel.INICIAL,
      yearNumber: 4,
      division: 'Unica',
      shift: SchoolShift.TARDE,
    },
  });

  // Primaria: 4° Grado "B" Mañana
  const cuartoPrimaria = await prisma.courseDivision.upsert({
    where: {
      academicYearId_level_yearNumber_division_shift: {
        academicYearId: academicYear.id,
        level: EducationalLevel.PRIMARIA,
        yearNumber: 4,
        division: 'B',
        shift: SchoolShift.MANANA,
      },
    },
    update: {},
    create: {
      institutionId: institution.id,
      academicYearId: academicYear.id,
      level: EducationalLevel.PRIMARIA,
      yearNumber: 4,
      division: 'B',
      shift: SchoolShift.MANANA,
    },
  });

  // 4. Usuario Directivo
  const adminPassword = await bcrypt.hash('admin1234', 10);
  await prisma.user.upsert({
    where: { dni: '30111222' },
    update: {},
    create: {
      dni: '30111222',
      email: 'direccion@colegio.edu',
      passwordHash: adminPassword,
      role: UserRole.DIRECTIVO,
      firstName: 'Directora',
      lastName: 'Institucional',
    },
  });

  // 5. Tutor Multi-Hijo (Mariana López) con PIN de 6 dígitos (123456)
  const tutorPassword = await bcrypt.hash('tutor1234', 10);
  const pinHash = await bcrypt.hash('123456', 10);

  const tutorUser = await prisma.user.upsert({
    where: { dni: '32441908' },
    update: {},
    create: {
      dni: '32441908',
      email: 'mariana.lopez@ejemplo.com',
      passwordHash: tutorPassword,
      pinHash, // PIN rápido de 6 dígitos
      role: UserRole.TUTOR,
      firstName: 'Mariana',
      lastName: 'López',
      phone: '+54 9 11 5555-1234',
      guardianProfile: {
        create: {
          phone: '+54 9 11 5555-1234',
          address: 'Calle Falsa 123',
        },
      },
    },
    include: {
      guardianProfile: true,
    },
  });

  // 6. Alumno 1: Mateo (Nivel Inicial)
  const mateo = await prisma.student.upsert({
    where: { dni: '52144889' },
    update: {},
    create: {
      dni: '52144889',
      firstName: 'Mateo',
      lastName: 'González',
      birthDate: new Date('2022-04-10'),
      educationalLevel: EducationalLevel.INICIAL,
      enrollments: {
        create: {
          courseDivisionId: sala4Tarde.id,
        },
      },
      medicalRecord: {
        create: {
          bloodType: '0+',
          healthInsurance: 'OSDE 310',
          allergies: ['Frutos secos'],
          physicalExamExpirationDate: new Date('2026-11-20'),
        },
      },
      legalAlerts: {
        create: {
          severity: LegalAlertSeverity.CRITICA,
          title: 'Restricción Judicial de Acercamiento',
          description: 'Oficio Judicial N° 441/2025. Prohibición de retiro y contacto.',
          restrictedPersons: ['González, Roberto (DNI 28.114.992)'],
        },
      },
    },
  });

  // 7. Alumno 2: Sofía (Primaria)
  const sofia = await prisma.student.upsert({
    where: { dni: '48332110' },
    update: {},
    create: {
      dni: '48332110',
      firstName: 'Sofía',
      lastName: 'González',
      birthDate: new Date('2017-09-15'),
      educationalLevel: EducationalLevel.PRIMARIA,
      enrollments: {
        create: {
          courseDivisionId: cuartoPrimaria.id,
        },
      },
      medicalRecord: {
        create: {
          bloodType: 'A+',
          healthInsurance: 'OSDE 310',
          allergies: [],
          physicalExamExpirationDate: new Date('2027-03-01'),
        },
      },
    },
  });

  // 8. Relacionar al Tutor Mariana con sus 2 hijos (Mateo y Sofía)
  if (tutorUser.guardianProfile) {
    await prisma.guardianStudentRelation.upsert({
      where: {
        guardianId_studentId: {
          guardianId: tutorUser.guardianProfile.id,
          studentId: mateo.id,
        },
      },
      update: {},
      create: {
        guardianId: tutorUser.guardianProfile.id,
        studentId: mateo.id,
        relationship: 'Madre',
        isPrimaryContact: true,
      },
    });

    await prisma.guardianStudentRelation.upsert({
      where: {
        guardianId_studentId: {
          guardianId: tutorUser.guardianProfile.id,
          studentId: sofia.id,
        },
      },
      update: {},
      create: {
        guardianId: tutorUser.guardianProfile.id,
        studentId: sofia.id,
        relationship: 'Madre',
        isPrimaryContact: true,
      },
    });
  }

  console.log('✅ Seeding completado con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

