'use client';

import React, { useState } from 'react';

interface MockStudentRow {
  id: string;
  name: string;
  dni: string;
  state: 'PRESENTE' | 'AUSENTE_INJUSTIFICADO' | 'AUSENTE_JUSTIFICADO' | 'TARDANZA_CUARTO' | 'RETIRO_MEDIO';
  fraction: number;
}

export default function AsistenciaPage() {
  const [students, setStudents] = useState<MockStudentRow[]>([
    { id: '1', name: 'Alvarez, Lucas', dni: '49112233', state: 'PRESENTE', fraction: 0 },
    { id: '2', name: 'Benitez, Camila', dni: '49223344', state: 'PRESENTE', fraction: 0 },
    { id: '3', name: 'Castro, Joaquín', dni: '49334455', state: 'TARDANZA_CUARTO', fraction: 0.25 },
    { id: '4', name: 'Díaz, Valentina', dni: '49445566', state: 'AUSENTE_INJUSTIFICADO', fraction: 1 },
    { id: '5', name: 'Fernández, Tomás', dni: '49556677', state: 'RETIRO_MEDIO', fraction: 0.5 },
  ]);

  const updateState = (id: string, newState: MockStudentRow['state']) => {
    const fractionMap = {
      PRESENTE: 0,
      TARDANZA_CUARTO: 0.25,
      RETIRO_MEDIO: 0.5,
      AUSENTE_JUSTIFICADO: 1,
      AUSENTE_INJUSTIFICADO: 1,
    };

    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, state: newState, fraction: fractionMap[newState] } : s))
    );
  };

  const totalAbsences = students.reduce((acc, curr) => acc + curr.fraction, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Toma y Control de Asistencia
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Curso: <strong>3° Grado "A"</strong> · Nivel Primaria · Turno Mañana · Fecha: <strong>02/11/2026</strong>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200">
            Total Faltas de la Jornada: <strong>{totalAbsences}</strong>
          </span>
          <button className="px-4 py-2 bg-blue-700 text-white font-medium text-sm rounded-lg hover:bg-blue-800 transition-colors shadow-sm">
            Guardar & Cerrar Parte
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-3.5">Estudiante</th>
                <th className="px-6 py-3.5">DNI</th>
                <th className="px-6 py-3.5 text-center">Estado de Asistencia</th>
                <th className="px-6 py-3.5 text-center">Cómputo Fracción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{student.name}</td>
                  <td className="px-6 py-4 text-slate-500">{student.dni}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-1.5">
                      <button
                        onClick={() => updateState(student.id, 'PRESENTE')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                          student.state === 'PRESENTE'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Presente
                      </button>
                      <button
                        onClick={() => updateState(student.id, 'TARDANZA_CUARTO')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                          student.state === 'TARDANZA_CUARTO'
                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Tardanza (1/4)
                      </button>
                      <button
                        onClick={() => updateState(student.id, 'RETIRO_MEDIO')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                          student.state === 'RETIRO_MEDIO'
                            ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Retiro (1/2)
                      </button>
                      <button
                        onClick={() => updateState(student.id, 'AUSENTE_INJUSTIFICADO')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                          student.state === 'AUSENTE_INJUSTIFICADO'
                            ? 'bg-red-600 text-white border-red-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Ausente
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-800">
                    {student.fraction > 0 ? (
                      <span className="text-red-600">+{student.fraction} falta</span>
                    ) : (
                      <span className="text-emerald-600">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

