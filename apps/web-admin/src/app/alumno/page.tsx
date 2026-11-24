'use client';

import React, { useMemo, useState } from 'react';
import {
  CHILDREN, SUBJECTS, ATTENDANCE, TODAY_CLASSES, TRAJECTORY, ALBUMS, CURRENT_CYCLE,
  nextThreshold, type Child,
} from './data';

type Mode = 'familia' | 'alumno';
const GREEN = '#008C45';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 p-4 mb-3 ${className}`}>{children}</div>
);
const GradePill: React.FC<{ n: number }> = ({ n }) => (
  <span className="min-w-10 text-center px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 font-extrabold text-sm">{n}</span>
);
const Hero: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => (
  <div className="px-5 pt-8 pb-6 rounded-b-[32px] text-white" style={{ background: GREEN }}>
    <p className="text-[22px] font-extrabold tracking-tight">{title}</p>
    {sub && <p className="text-[13px] text-emerald-100 mt-1">{sub}</p>}
  </div>
);

function Attendance({ child, family }: { child: Child; family: boolean }) {
  const records = ATTENDANCE[child.id] ?? [];
  const faltas = records.reduce((a, r) => a + r.fraction, 0);
  const nt = nextThreshold(faltas);
  return (
    <>
      <Hero title={family ? 'Asistencia' : 'Mi Asistencia'} sub={family ? `${child.firstName} · ${child.course}` : 'Tus faltas y tardanzas del ciclo'} />
      <div className="p-4">
        <Card>
          <p className="text-[11px] font-extrabold tracking-wider text-slate-400">FALTAS COMPUTADAS</p>
          <p className="text-4xl font-extrabold text-slate-900 mt-1">{faltas} <span className="text-lg text-slate-500 font-semibold">/ {nt.value}</span></p>
          <p className="text-xs text-slate-500 mt-2 leading-snug">
            {nt.label} · 1° reincorporación a las 10 faltas · 2° a las 20. Tardanza = 1/4 falta · Retiro anticipado = 1/2 falta.
            {!family && ' Las justificaciones las gestiona tu familia.'}
          </p>
        </Card>
        <p className="text-[17px] font-extrabold text-slate-900 my-2">Historial</p>
        {records.map((r) => (
          <Card key={r.id} className="flex items-center gap-3">
            <div className="flex-1">
              <p className="font-extrabold text-slate-900 text-[15px]">{r.state}</p>
              <p className="text-xs text-slate-500">{r.date} · {r.time}</p>
              {r.justified && <p className="text-[11px] font-extrabold text-emerald-800 mt-1">Justificada</p>}
              {family && r.fraction > 0 && !r.justified && (
                <button className="mt-2 text-xs font-bold text-emerald-700 underline" onClick={() => alert('Simulación: aquí la familia sube el certificado.')}>
                  Justificar
                </button>
              )}
            </div>
            <span className="font-extrabold" style={{ color: '#CD212A' }}>{r.fraction === 0 ? '—' : `+${r.fraction}`}</span>
          </Card>
        ))}
      </div>
    </>
  );
}

function Notes() {
  const [tab, setTab] = useState<'parciales' | 'trimestre'>('parciales');
  return (
    <>
      <Hero title="Mis Notas" sub="Notas parciales y nota de trimestre" />
      <div className="p-4">
        <div className="flex bg-slate-100 rounded-2xl p-1 mb-3">
          {(['parciales', 'trimestre'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${tab === t ? 'bg-white text-emerald-700' : 'text-slate-500'}`}>
              {t === 'parciales' ? 'Parciales' : 'Trimestre'}
            </button>
          ))}
        </div>
        {tab === 'trimestre' && (
          <p className="text-xs text-slate-500 mb-3 leading-snug">
            La nota de trimestre la carga cada docente. No es un promedio de las notas parciales y cada trimestre se muestra por separado.
          </p>
        )}
        {SUBJECTS.map((s) => (
          <Card key={s.id}>
            <p className="font-extrabold text-slate-900 mb-2">{s.name}</p>
            {tab === 'parciales' ? (
              s.partials.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-2 border-t border-slate-100">
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-slate-900">{p.title}</p>
                    <p className="text-[11px] text-slate-400">{p.date}</p>
                    {p.observation && <p className="text-xs text-slate-500 italic mt-1">“{p.observation}”</p>}
                  </div>
                  <GradePill n={p.grade} />
                </div>
              ))
            ) : (
              <div className="flex gap-2">
                {s.trimester.map((g, i) => (
                  <div key={i} className="flex-1 text-center bg-slate-50 rounded-xl py-2.5">
                    <p className="text-[10px] font-bold text-slate-400">{i + 1}° Trimestre</p>
                    {g === null ? <p className="text-[11px] text-slate-400 mt-2.5">Sin cargar</p>
                      : <p className="text-2xl font-extrabold mt-1" style={{ color: GREEN }}>{g}</p>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}

function Trajectory({ child }: { child: Child }) {
  const [open, setOpen] = useState<string | null>(null);
  const cur = TRAJECTORY.findIndex((y) => y.label === child.yearLabel);
  const albumsOf = (label: string) => ALBUMS[`${child.id}|${label}`] ?? [];
  const total = TRAJECTORY.reduce((s, y) => s + albumsOf(y.label).reduce((a, b) => a + b.photos, 0), 0);
  const gradCycle = CURRENT_CYCLE + (TRAJECTORY.length - cur - 1);
  const levels = Array.from(new Set(TRAJECTORY.map((y) => y.level)));
  return (
    <>
      <Hero title="Galería de Trayectoria" sub="Todo el recorrido escolar, desde el jardín hasta el egreso." />
      <div className="p-4">
        <Card>
          <p className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">{child.firstName} {child.lastName}</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">Año {cur + 1} de {TRAJECTORY.length}
            <span className="text-[13px] text-slate-500 font-semibold"> · {total} fotos guardadas</span></p>
          <div className="h-2 rounded bg-slate-100 mt-3 overflow-hidden">
            <div className="h-2 rounded" style={{ width: `${((cur + 1) / TRAJECTORY.length) * 100}%`, background: GREEN }} />
          </div>
          <p className="text-xs text-slate-500 mt-2">Egreso estimado: ciclo {gradCycle}</p>
        </Card>
        {levels.map((lv) => (
          <div key={lv} className="mt-2">
            <p className="text-[17px] font-extrabold text-slate-900 mb-2">{lv}</p>
            {TRAJECTORY.map((y, i) => {
              if (y.level !== lv) return null;
              const al = albumsOf(y.label);
              const future = i > cur;
              const isOpen = open === y.label;
              return (
                <div key={y.label} className={`bg-white rounded-2xl mb-2 overflow-hidden border ${i === cur ? 'border-2 border-[#008C45]' : 'border-slate-200'}`}>
                  <button disabled={future || !al.length} onClick={() => setOpen(isOpen ? null : y.label)} className="w-full flex items-center gap-2 p-3.5 text-left">
                    <div className="flex-1">
                      <p className={`font-extrabold text-[15px] ${future ? 'text-slate-400' : 'text-slate-900'}`}>{y.label}</p>
                      <p className="text-xs text-slate-500">Ciclo {CURRENT_CYCLE + i - cur}
                        {future ? ' · Próximamente' : al.length ? ` · ${al.length} álbumes · ${al.reduce((a, b) => a + b.photos, 0)} fotos` : ' · Sin álbumes'}</p>
                    </div>
                    {i === cur && <span className="text-[10px] font-extrabold tracking-wide bg-emerald-50 text-emerald-900 px-2 py-1 rounded-lg">AÑO ACTUAL</span>}
                    {future && <span aria-hidden>🔒</span>}
                  </button>
                  {isOpen && al.map((a) => (
                    <div key={a.title} className="px-3.5 py-3 border-t border-slate-100">
                      <p className="text-sm font-bold text-slate-900">{a.title}</p>
                      <p className="text-xs text-slate-500">{a.date} · {a.photos} fotos</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
        <Card className="flex items-center gap-3 mt-2">
          <span aria-hidden>🎓</span>
          <div className="flex-1"><p className="font-extrabold text-slate-900">Egreso</p>
            <p className="text-xs text-slate-500">Álbum de la promoción {gradCycle} · se habilita al finalizar la secundaria.</p></div>
          <span aria-hidden>🔒</span>
        </Card>
      </div>
    </>
  );
}

function Home({ child, family, go }: { child: Child; family: boolean; go: (t: string) => void }) {
  const faltas = (ATTENDANCE[child.id] ?? []).reduce((a, r) => a + r.fraction, 0);
  const nt = nextThreshold(faltas);
  const latest = SUBJECTS.map((s) => ({ ...s.partials[0], subject: s.name })).slice(0, 3);
  const showNotes = child.level !== 'INICIAL';
  return (
    <>
      <Hero title={family ? '¡Hola, Familia González! 👋' : `¡Hola, ${child.firstName}! 👋`} sub={`${child.firstName} ${child.lastName} · ${child.course}`} />
      <div className="p-4">
        <Card>
          <p className="text-[11px] font-extrabold tracking-wider text-slate-400">{family ? 'FALTAS' : 'MIS FALTAS'}</p>
          <p className="text-4xl font-extrabold text-slate-900 mt-1">{faltas} <span className="text-sm text-slate-500 font-medium">para la {nt.label}</span></p>
          <button onClick={() => go('Asistencia')} className="text-[13px] font-bold mt-2" style={{ color: GREEN }}>Ver asistencia →</button>
        </Card>
        {!family && (
          <>
            <p className="text-[17px] font-extrabold text-slate-900 mb-2">Hoy en clase</p>
            <Card>{TODAY_CLASSES.map((c) => (
              <div key={c.time} className="flex py-1.5"><span className="w-14 font-extrabold" style={{ color: GREEN }}>{c.time}</span><span className="font-semibold text-slate-900">{c.subject}</span></div>
            ))}</Card>
          </>
        )}
        {showNotes ? (
          <>
            <div className="flex justify-between items-end mb-2">
              <p className="text-[17px] font-extrabold text-slate-900">Últimas notas parciales</p>
              {!family && <button onClick={() => go('Notas')} className="text-[13px] font-bold" style={{ color: GREEN }}>Ver todas →</button>}
            </div>
            {latest.map((n) => (
              <Card key={n.id} className="flex items-center gap-3">
                <div className="flex-1"><p className="font-extrabold text-slate-900">{n.subject}</p><p className="text-xs text-slate-500 truncate">{n.title}</p></div>
                <GradePill n={n.grade} />
              </Card>
            ))}
          </>
        ) : (
          <Card><p className="font-extrabold text-slate-900">Seguimiento de Nivel Inicial</p>
            <p className="text-xs text-slate-500 mt-1">En Nivel Inicial el seguimiento es narrativo; no hay notas numéricas.</p></Card>
        )}
      </div>
    </>
  );
}

export default function SimuladorApp() {
  const [mode, setMode] = useState<Mode>('familia');
  const [childId, setChildId] = useState(CHILDREN[1].id);
  const [tab, setTab] = useState('Inicio');

  // El alumno ve su propio perfil (Sofía, primaria); la familia elige entre sus hijos.
  const child = useMemo(
    () => (mode === 'alumno' ? CHILDREN[1] : CHILDREN.find((c) => c.id === childId) ?? CHILDREN[0]),
    [mode, childId]
  );
  const tabs = mode === 'alumno' ? ['Inicio', 'Notas', 'Asistencia'] : ['Inicio', 'Galería', 'Asistencia'];
  const active = tabs.includes(tab) ? tab : 'Inicio';

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Simulador de la App Móvil</h1>
        <p className="text-sm text-slate-500 mt-1">Así ve la app una familia y así la ve un alumno. Datos de ejemplo.</p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="inline-flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-sm font-semibold">
          {(['familia', 'alumno'] as Mode[]).map((m) => (
            <button key={m} onClick={() => { setMode(m); setTab('Inicio'); }}
              className={`px-4 py-1.5 rounded-lg ${mode === m ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'}`}>
              {m === 'familia' ? 'Vista Familia' : 'Vista Alumno'}
            </button>
          ))}
        </div>
        {mode === 'familia' && (
          <div className="inline-flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-sm font-semibold">
            {CHILDREN.map((c) => (
              <button key={c.id} onClick={() => setChildId(c.id)}
                className={`px-4 py-1.5 rounded-lg ${childId === c.id ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'}`}>
                {c.firstName}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto w-[380px] max-w-full rounded-[44px] border-[10px] border-slate-900 bg-slate-900 shadow-xl">
        <div className="rounded-[34px] overflow-hidden bg-[#F4F7FC] flex flex-col h-[760px]">
          <div className="flex-1 overflow-y-auto">
            {active === 'Inicio' && <Home child={child} family={mode === 'familia'} go={setTab} />}
            {active === 'Notas' && <Notes />}
            {active === 'Galería' && <Trajectory child={child} />}
            {active === 'Asistencia' && <Attendance child={child} family={mode === 'familia'} />}
          </div>
          <div className="flex border-t border-slate-200 bg-white pb-2 pt-1.5">
            {tabs.map((t) => (
              <button key={t} onClick={() => setTab(t)} className="flex-1 py-2 text-[11px] font-bold"
                style={{ color: active === t ? GREEN : '#94A3B8' }}>{t}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
