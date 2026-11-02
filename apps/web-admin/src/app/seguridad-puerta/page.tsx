'use client';

import React, { useState } from 'react';

export default function SeguridadPuertaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>({
    id: 's-101',
    name: 'Mateo González',
    dni: '52144889',
    level: 'Nivel Inicial — Sala de 4 (Tarde)',
    legalAlert: {
      hasAlert: true,
      title: 'Restricción Perimetral Judicial Vigente (Oficio N° 441/2025)',
      restrictedPersons: ['González, Roberto (DNI 28.114.992) - Prohibición de acercamiento y retiro'],
    },
    authorizedPersons: [
      {
        id: 'auth-1',
        name: 'Mariana López',
        dni: '32441908',
        relationship: 'Madre (Contacto Primario)',
        isPermanent: true,
      },
      {
        id: 'auth-2',
        name: 'Clara Domínguez',
        dni: '14220811',
        relationship: 'Abuela Materna',
        isPermanent: true,
      },
      {
        id: 'auth-3',
        name: 'Lucas Benítez',
        dni: '38190223',
        relationship: 'Tío (Autorización Eventual de Hoy)',
        isPermanent: false,
        validUntil: 'Hoy hasta las 18:00 hs',
      },
    ],
  });

  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  const handleCheckout = (personName: string) => {
    setCheckoutSuccess(`Egreso validado con éxito. Alumno retirado por: ${personName}`);
    setTimeout(() => setCheckoutSuccess(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Terminal de Control en Puerta (Pick-Up)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Validación de identidad para egreso seguro de estudiantes y control estricto de restricciones legales.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-3">
        <input
          type="text"
          placeholder="Buscar por DNI o apellido del alumno..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button className="px-5 py-2 bg-blue-700 text-white font-medium text-sm rounded-lg hover:bg-blue-800 transition-colors">
          Buscar
        </button>
      </div>

      {checkoutSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2">
          ✅ {checkoutSuccess}
        </div>
      )}

      {/* Student Details Card */}
      {selectedStudent && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">{selectedStudent.name}</h2>
                <span className="text-xs bg-slate-200 font-bold px-2.5 py-1 rounded-full text-slate-700">
                  DNI {selectedStudent.dni}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{selectedStudent.level}</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full border border-blue-200">
              Turno Salida
            </span>
          </div>

          {/* CRITICAL LEGAL ALERT BANNER */}
          {selectedStudent.legalAlert.hasAlert && (
            <div className="m-6 p-4 bg-red-50 border-2 border-red-500 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide">
                    {selectedStudent.legalAlert.title}
                  </h3>
                  <ul className="mt-2 text-xs text-red-700 space-y-1 list-disc list-inside font-medium">
                    {selectedStudent.legalAlert.restrictedPersons.map((person: string, idx: number) => (
                      <li key={idx} className="font-bold">{person}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-red-600 mt-2 italic">
                    Bajo ninguna circunstancia entregar al menor a personas no autorizadas o con orden judicial vigente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AUTHORIZED PERSONS LIST */}
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
              Personas Autorizadas para el Retiro
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedStudent.authorizedPersons.map((person: any) => (
                <div
                  key={person.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-all flex flex-col justify-between gap-3 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-base">{person.name}</h4>
                      {person.isPermanent ? (
                        <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                          Permanente
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                          Eventual (Hoy)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">DNI {person.dni}</p>
                    <p className="text-xs font-medium text-blue-700 mt-1">{person.relationship}</p>
                    {person.validUntil && (
                      <p className="text-[11px] text-amber-700 mt-1">⏰ {person.validUntil}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleCheckout(person.name)}
                    className="w-full mt-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    ✓ Validar Egreso con {person.name.split(' ')[0]}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

