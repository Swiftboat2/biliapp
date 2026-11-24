// Trayectoria escolar completa (Nivel Inicial → Primaria → Secundaria → Egreso).
// Datos de ejemplo: se reemplazan por la API.

export type Level = 'INICIAL' | 'PRIMARIA' | 'SECUNDARIA';

export interface TrajectoryYear {
  key: string;
  level: Level;
  /** Texto que identifica el año dentro del nombre del curso del alumno. */
  label: string;
}

const years = (level: Level, labels: string[]): TrajectoryYear[] =>
  labels.map((label) => ({ key: `${level}-${label}`, level, label }));

export const TRAJECTORY: TrajectoryYear[] = [
  ...years('INICIAL', ['Sala de 3', 'Sala de 4', 'Sala de 5']),
  ...years('PRIMARIA', ['1° Grado', '2° Grado', '3° Grado', '4° Grado', '5° Grado', '6° Grado']),
  ...years('SECUNDARIA', ['1° Año', '2° Año', '3° Año', '4° Año', '5° Año', '6° Año']),
];

export const LEVEL_TITLE: Record<Level, string> = {
  INICIAL: 'Nivel Inicial',
  PRIMARIA: 'Nivel Primario',
  SECUNDARIA: 'Nivel Secundario',
};

export interface TrajectoryAlbum {
  id: string;
  title: string;
  description: string;
  teacher: string;
  date: string;
  photoCount: number;
  videoCount?: number;
}

/** Álbumes por alumno y año: `${studentId}|${yearLabel}`. */
export const TRAJECTORY_ALBUMS: Record<string, TrajectoryAlbum[]> = {
  'student-1|Sala de 3': [
    { id: 'm3-1', title: 'Período de adaptación', description: 'Los primeros días en el jardín.', teacher: 'Seño Marta', date: 'Mar 2025', photoCount: 18 },
    { id: 'm3-2', title: 'Acto del 25 de Mayo', description: 'Primer acto patrio de la sala.', teacher: 'Seño Marta', date: 'May 2025', photoCount: 22 },
  ],
  'student-1|Sala de 4': [
    { id: 'm4-1', title: "Pintura y Símbolos: Fratelli d'Italia", description: 'Témperas, acuarelas y canciones tradicionales italianas.', teacher: 'Seño Valentina', date: 'Nov 2026', photoCount: 24, videoCount: 2 },
    { id: 'm4-2', title: 'Huerta Escolar Bilingüe', description: 'Siembra de aromáticas con vocabulario en italiano.', teacher: 'Seño Valentina', date: 'Nov 2026', photoCount: 16 },
  ],
  'student-2|Sala de 3': [
    { id: 's3-1', title: 'Primer día de jardín', description: 'Ingreso y adaptación.', teacher: 'Seño Lucía', date: 'Mar 2020', photoCount: 14 },
  ],
  'student-2|Sala de 5': [
    { id: 's5-1', title: 'Acto de egreso del jardín', description: 'Cierre de Nivel Inicial con las familias.', teacher: 'Seño Lucía', date: 'Dic 2022', photoCount: 40, videoCount: 3 },
  ],
  'student-2|1° Grado': [
    { id: 's6-1', title: 'Primeras letras', description: 'Taller de alfabetización inicial.', teacher: 'Seño Andrea', date: 'Jun 2023', photoCount: 20 },
  ],
  'student-2|3° Grado': [
    { id: 's8-1', title: 'Feria de Ciencias', description: 'Experimentos sobre el ciclo del agua.', teacher: 'Seño Paula', date: 'Sep 2025', photoCount: 27 },
  ],
  'student-2|4° Grado': [
    { id: 's9-1', title: 'Torneo Intercolegial de Atletismo', description: 'Postas de velocidad y salto en largo.', teacher: 'Prof. Carlos Gómez', date: 'Nov 2026', photoCount: 32 },
    { id: 's9-2', title: 'Taller de Teatro: Le Avventure di Pinocchio', description: 'Lectura dramatizada y títeres.', teacher: 'Prof. Giulia Bianchi', date: 'Nov 2026', photoCount: 20 },
    { id: 's9-3', title: 'Festa della Repubblica: Cocina Italiana', description: 'Pasta fresca y degustación familiar.', teacher: 'Equipo Bicultural', date: 'Oct 2026', photoCount: 42 },
  ],
};
