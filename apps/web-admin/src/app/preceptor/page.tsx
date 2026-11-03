'use client';

import React, { useState } from 'react';
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Search,
  Filter,
  Check,
  AlertCircle,
  Eye,
  FileCheck2
} from 'lucide-react';

interface StudentAttendance {
  id: string;
  name: string;
  status: 'presente' | 'ausente' | 'tardanza' | 'retirado';
  arrivalTime?: string;
  medicalNote?: {
    uploaded: boolean;
    reason: string;
    verified: boolean;
  };
}

export default function PreceptorDashboard() {
  const [selectedDivision, setSelectedDivision] = useState('4-primaria-b');
  const [students, setStudents] = useState<StudentAttendance[]>([
    { id: '1', name: 'Alvarez, Bruno', status: 'presente' },
    {
      id: '2',
      name: 'Benitez, Camila',
      status: 'ausente',
      medicalNote: { uploaded: true, reason: 'Gastroenteritis 48hs (Dr. Rossi)', verified: false },
    },
    { id: '3', name: 'Castillo, Franco', status: 'tardanza', arrivalTime: '08:15 hs' },
    { id: '4', name: 'Domínguez, Lucía', status: 'presente' },
    { id: '5', name: 'Fernandez, Mateo', status: 'presente' },
    {
      id: '6',
      name: 'López, Sofía',
      status: 'presente',
      medicalNote: { uploaded: true, reason: 'Certificado Odontológico (Control)', verified: true },
    },
    { id: '7', name: 'Martínez, Joaquín', status: 'ausente' },
    { id: '8', name: 'Pérez, Valentina', status: 'presente' },
  ]);

  const updateStatus = (id: string, status: StudentAttendance['status']) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const markAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: 'presente' })));
  };

  const presentCount = students.filter((s) => s.status === 'presente').length;
  const ausenteCount = students.filter((s) => s.status === 'ausente').length;
  const tardanzaCount = students.filter((s) => s.status === 'tardanza').length;

  return (
    <div className="space-y-6">
      {/* Banner de Preceptoría */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-950 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-xs">
              Módulo de Preceptoría
            </span>
            <span className="text-xs text-blue-200">Parte Diario & Control de Asistencia</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Toma Rápida de Asistencia y Justificaciones Médicas
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Carga de partes diarios por división, cómputo normativo de inasistencias (1/4 de falta) y validación de certificados cargados desde la app familiar.
          </p>
        </div>

        {/* Botón rápido */}
        <div className="flex items-center gap-2">
          <button
            onClick={markAllPresent}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            Marcar Todos Presentes
          </button>
        </div>
      </div>

      {/* Selector de División y Resumen de Estado */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Seleccionar División / Curso
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDivision('sala-4')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                selectedDivision === 'sala-4'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Sala de 4 (Inicial)
            </button>
            <button
              onClick={() => setSelectedDivision('4-primaria-b')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                selectedDivision === '4-primaria-b'
                  ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              4° Grado "B" (Primaria)
            </button>
            <button
              onClick={() => setSelectedDivision('1-secundaria-a')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                selectedDivision === '1-secundaria-a'
                  ? 'bg-purple-50 text-purple-800 border-purple-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              1° Año "A" (Secundaria)
            </button>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Presentes</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{presentCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ausencias / Tardanzas</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              <span className="text-red-600">{ausenteCount}</span> / <span className="text-amber-600">{tardanzaCount}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Planilla de Asistencia Interactiva */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-700" />
              Nómina de Alumnos — Turno Mañana
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hacé click en los botones para cambiar el estado al instante.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Total matriculados en curso: {students.length}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {students.map((student, idx) => (
            <div
              key={student.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                <div>
                  <p className="text-sm font-bold text-slate-900">{student.name}</p>
                  {student.medicalNote && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-semibold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-blue-600" />
                        {student.medicalNote.reason}
                      </span>
                      {student.medicalNote.verified ? (
                        <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Justificado
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" /> Pendiente de Aprobación
                        </span>
                      )}
                    </div>
                  )}
                  {student.status === 'tardanza' && student.arrivalTime && (
                    <span className="text-[11px] text-amber-700 font-medium">
                      Ingreso registrado: {student.arrivalTime} (cómputo 1/4 falta)
                    </span>
                  )}
                </div>
              </div>

              {/* Botones de Acción de Estado */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  onClick={() => updateStatus(student.id, 'presente')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    student.status === 'presente'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Presente
                </button>

                <button
                  onClick={() => updateStatus(student.id, 'tardanza')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    student.status === 'tardanza'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tardanza
                </button>

                <button
                  onClick={() => updateStatus(student.id, 'ausente')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    student.status === 'ausente'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Ausente
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Cambios guardados automáticamente en la base central.
          </span>
          <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs">
            Cerrar Parte Diario de la División
          </button>
        </div>
      </div>
    </div>
  );
}

