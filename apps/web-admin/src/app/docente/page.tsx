'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Save,
  Award,
  AlertCircle,
  FileSpreadsheet,
  Check,
  ChevronDown
} from 'lucide-react';

interface GradeRow {
  id: string;
  student: string;
  grade1: string;
  grade2: string;
  gradeOral: string;
  trimestreFinal: string;
  observations: string;
  alertMedical?: string;
}

export default function DocenteDashboard() {
  const [selectedSubject, setSelectedSubject] = useState('italiano');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [grades, setGrades] = useState<GradeRow[]>([
    {
      id: '1',
      student: 'Alvarez, Bruno',
      grade1: '8.5',
      grade2: '9.0',
      gradeOral: '8.0',
      trimestreFinal: '8.5',
      observations: 'Participa activamente en conversaciones en italiano.',
    },
    {
      id: '2',
      student: 'Benitez, Camila',
      grade1: '7.0',
      grade2: '8.0',
      gradeOral: '7.5',
      trimestreFinal: '7.5',
      observations: 'Buen progreso en vocabulario.',
    },
    {
      id: '3',
      student: 'Castillo, Franco',
      grade1: '6.5',
      grade2: '6.0',
      gradeOral: '7.0',
      trimestreFinal: '6.5',
      observations: 'Reforzar gramática de verbos regulares.',
    },
    {
      id: '4',
      student: 'Domínguez, Lucía',
      grade1: '9.0',
      grade2: '9.5',
      gradeOral: '10',
      trimestreFinal: '9.5',
      observations: 'Excelente pronunciación y fluidez.',
    },
    {
      id: '5',
      student: 'Fernandez, Mateo',
      grade1: '8.0',
      grade2: '8.5',
      gradeOral: '8.5',
      trimestreFinal: '8.3',
      observations: 'Muy buen desempeño.',
      alertMedical: 'Usa anteojos para lectura pizarrón',
    },
    {
      id: '6',
      student: 'López, Sofía',
      grade1: '9.5',
      grade2: '10',
      gradeOral: '9.8',
      trimestreFinal: '9.8',
      observations: 'Destacado compromiso en proyectos bilingües.',
    },
  ]);

  const handleGradeChange = (id: string, field: keyof GradeRow, val: string) => {
    setGrades((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: val } : row))
    );
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Docente */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-950 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-xs">
              Módulo Docente
            </span>
            <span className="text-xs text-amber-200">Planilla de Calificaciones & Pedagógico</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Libro de Calificaciones y Seguimiento de Materia
          </h1>
          <p className="text-sm text-amber-100/90 mt-1 max-w-2xl">
            Carga de notas por parciales, evaluación oral y boletín trimestral oficial con visibilidad médica escolar del alumno.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 self-start md:self-auto"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              ¡Calificaciones Guardadas!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar Calificaciones
            </>
          )}
        </button>
      </div>

      {/* Selectores de Cátedra */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Materia Asignada
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedSubject('italiano')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  selectedSubject === 'italiano'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                🇮🇹 Lengua y Cultura Italiana
              </button>
              <button
                onClick={() => setSelectedSubject('matematica')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  selectedSubject === 'matematica'
                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                📐 Matemática y Geometría
              </button>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Curso / Trimestre
            </label>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                4° Grado "B" (Primaria)
              </span>
              <span className="bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg border border-amber-200">
                1° Trimestre 2026
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Promedio de Curso</p>
          <p className="text-xl font-black text-emerald-700">8.35 / 10</p>
        </div>
      </div>

      {/* Planilla de Calificaciones */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Estudiante</th>
                <th className="py-3 px-3 text-center w-24">Parcial 1</th>
                <th className="py-3 px-3 text-center w-24">Parcial 2</th>
                <th className="py-3 px-3 text-center w-24">Oral / Trabajo</th>
                <th className="py-3 px-3 text-center w-28 bg-emerald-50/60 text-emerald-900">
                  Prom. Trimestral
                </th>
                <th className="py-3 px-4">Concepto & Observación Pedagógica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {grades.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <p>{row.student}</p>
                    {row.alertMedical && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        {row.alertMedical}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input
                      type="text"
                      value={row.grade1}
                      onChange={(e) => handleGradeChange(row.id, 'grade1', e.target.value)}
                      className="w-16 py-1 px-2 text-center font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
                    />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input
                      type="text"
                      value={row.grade2}
                      onChange={(e) => handleGradeChange(row.id, 'grade2', e.target.value)}
                      className="w-16 py-1 px-2 text-center font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
                    />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input
                      type="text"
                      value={row.gradeOral}
                      onChange={(e) => handleGradeChange(row.id, 'gradeOral', e.target.value)}
                      className="w-16 py-1 px-2 text-center font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
                    />
                  </td>
                  <td className="py-3.5 px-3 text-center bg-emerald-50/30">
                    <span className="inline-block py-1 px-3 bg-emerald-100 text-emerald-800 font-black rounded-lg text-xs">
                      {row.trimestreFinal}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <input
                      type="text"
                      value={row.observations}
                      onChange={(e) => handleGradeChange(row.id, 'observations', e.target.value)}
                      className="w-full py-1 px-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      placeholder="Comentarios pedagógicos..."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Las notas cargadas se publican en el boletín digital de la app de las familias tras el cierre del trimestre.
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              Exportar a Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

