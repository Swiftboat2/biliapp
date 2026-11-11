import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UserRole } from '@biliapp/shared-types';
import { Lock, LockOpen, CalendarClock, Plus, Trash2, Wand2, X } from 'lucide-react';
import { useApp, useUser } from '../data/store';
import { ASSIGNMENTS } from '../data/mock';
import { Kpi, PageHead, Tabs, useToast } from '../components/ui';
import { addDays, daysUntil, isoDate, shortDate, todayISO } from '../lib/dates';
import { conceptFor, course, fullName, gradeKey, gradeProgress, gradesLoaded, isQualitative, LEVEL_LABEL, parseGrade, staffName, subject } from '../lib/school';
import {
  annualAverage, average, courseAverage, fmtNota, instanceAverage, instancesFor, partialAverage, partialKey, passClass, PASS_MARK, suggestion, termGrade,
} from '../lib/grades';
import { myAssignments, studentsOf } from '../lib/scope';
import type { Assignment, GradingPeriod, InstanceKind } from '../data/types';

export function Calificaciones() {
  const user = useUser();
  return user.role === UserRole.DIRECTIVO ? <VentanasDireccion /> : <CargaDocente />;
}

const KIND_PILL: Record<InstanceKind, string> = { Escrito: 'red', Oral: 'celeste', 'Trabajo práctico': 'amber', Mixta: 'green' };
const KIND_SHORT: Record<InstanceKind, string> = { Escrito: 'Escrito', Oral: 'Oral', 'Trabajo práctico': 'TP', Mixta: 'Mixta' };

/* ------------------------------ Docente ------------------------------ */

function CargaDocente() {
  const { data } = useApp();
  const user = useUser();
  const [params] = useSearchParams();
  const classes = myAssignments(user);
  const [classId, setClassId] = useState(params.get('clase') ?? classes[0]?.id ?? '');
  const [periodId, setPeriodId] = useState(data.periods.find((p) => p.status === 'ABIERTO')?.id ?? data.periods[0].id);

  const a = classes.find((x) => x.id === classId);
  if (!a) return null;
  const c = course(a.courseId);
  const period = data.periods.find((p) => p.id === periodId)!;
  const locked = period.status === 'CERRADO';
  const qualitative = isQualitative(c.level);

  return (
    <>
      <PageHead
        eyebrow="Calificaciones"
        title="Carga de notas"
        sub={qualitative ? 'Nivel Inicial: informe descriptivo por alumno, sin notas numéricas.' : 'Notas parciales (escritos, orales, TPs) y nota de cierre del trimestre. Los promedios se calculan solos.'}
        actions={<Tabs label="Período" value={periodId} onChange={setPeriodId} options={data.periods.map((p) => ({ value: p.id, label: p.name }))} />}
      />

      <div className="card">
        <div className="row wrap" style={{ gap: 14, alignItems: 'flex-end' }}>
          <div className="field" style={{ minWidth: 280 }}>
            <label htmlFor="clase">Clase</label>
            <select id="clase" className="select" value={classId} onChange={(e) => setClassId(e.target.value)}>
              {classes.map((x) => <option key={x.id} value={x.id}>{course(x.courseId).name} · {subject(x.subjectId).name}</option>)}
            </select>
          </div>
          <span className="pill celeste">{LEVEL_LABEL[c.level]}</span>
          <div style={{ marginLeft: 'auto' }}>
            {locked ? <span className="pill gray"><Lock /> Cerrado por Dirección</span> : <span className="pill green"><LockOpen /> Abierto · cierra el {shortDate(period.closesOn)}</span>}
          </div>
        </div>
      </div>

      {locked && (
        <div className="alert amber">
          <span className="icon-box sm amber"><Lock /></span>
          <div className="grow"><b>Este período está cerrado</b><span className="sub">Las notas se pueden ver pero no modificar. Para un cambio, pedile a Dirección que reabra la carga.</span></div>
        </div>
      )}

      {qualitative ? <InformeJardin a={a} periodId={periodId} locked={locked} /> : <Planilla key={`${a.id}|${periodId}`} a={a} period={period} locked={locked} />}
    </>
  );
}

function Planilla({ a, period, locked }: { a: Assignment; period: GradingPeriod; locked: boolean }) {
  const { data, setPartial, setGrade, setGrades, addInstance, deleteInstance } = useApp();
  const toast = useToast();
  const [adding, setAdding] = useState(false);
  const students = studentsOf(data, a.courseId);
  const instances = instancesFor(data, a.id, period.id);
  const others = data.periods.filter((p) => p.id !== period.id);

  const termAvg = courseAverage(data, a.id, students, period.id);
  const yearAvg = courseAverage(data, a.id, students, null);
  const passed = students.filter((s) => (termGrade(data, period.id, a.id, s.id).value ?? 0) >= PASS_MARK).length;
  const closed = gradesLoaded(data, period.id, a.id, students);

  function fillFromAverages() {
    const entries: Record<string, string> = {};
    for (const s of students) {
      const key = gradeKey(period.id, a.id, s.id);
      const avg = partialAverage(data, a.id, period.id, s.id);
      if (!data.grades[key] && avg !== null) entries[key] = suggestion(avg);
    }
    const n = Object.keys(entries).length;
    if (!n) return toast.show('No hay notas de cierre vacías con promedio para completar');
    setGrades(entries);
    toast.show(`${n} notas de cierre completadas con el promedio de parciales`);
  }

  return (
    <>
      <div className="grid g-4">
        <Kpi label={`Promedio del curso · ${period.name}`} value={fmtNota(termAvg)} note={`${subject(a.subjectId).name}`} />
        <Kpi label="Promedio anual del curso" value={fmtNota(yearAvg)} color="var(--celeste-dk)" note="Promedio de los tres trimestres" />
        <Kpi label="Aprobados en el trimestre" value={passed} of={`/ ${students.length}`} color={passed === students.length ? 'var(--primary)' : 'var(--amber)'} note={`Nota ${PASS_MARK} o más`} />
        <Kpi label="Notas de cierre cargadas" value={closed} of={`/ ${students.length}`} color="var(--amber)" note={`${instances.length} instancias parciales`} />
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <h2>{course(a.courseId).name} · {subject(a.subjectId).name}</h2>
            <span className="sub">Se guarda al salir de cada casillero. Si no cargás la nota de cierre, cuenta el promedio de parciales.</span>
          </div>
          {!locked && (
            <div className="row wrap" style={{ gap: 8 }}>
              <button className="btn sm" onClick={fillFromAverages}><Wand2 /> Completar cierre con promedios</button>
              <button className="btn sm primary" onClick={() => setAdding((v) => !v)}>{adding ? <><X /> Cancelar</> : <><Plus /> Nueva instancia</>}</button>
            </div>
          )}
        </div>

        {adding && (
          <NewInstanceForm
            onAdd={(i) => {
              addInstance({ ...i, assignmentId: a.id, periodId: period.id });
              setAdding(false);
              toast.show(`Instancia "${i.title}" agregada a la planilla`);
            }}
          />
        )}

        <div className="table-wrap">
          <table className="data sheet">
            <thead>
              <tr>
                <th className="sticky">Alumno</th>
                {instances.map((i) => (
                  <th key={i.id} className="inst">
                    <span className={`pill ${KIND_PILL[i.kind]}`}>{KIND_SHORT[i.kind]}{i.weight === 2 ? ' ×2' : ''}</span>
                    <span className="inst-title" title={i.title}>{i.title}</span>
                    <span className="inst-date">
                      {shortDate(i.date)}
                      {!locked && (
                        <button className="icon-btn" aria-label={`Eliminar ${i.title}`} title="Eliminar instancia" onClick={() => { if (window.confirm(`¿Eliminar "${i.title}" y sus notas?`)) deleteInstance(i.id); }}>
                          <Trash2 size={12} />
                        </button>
                      )}
                    </span>
                  </th>
                ))}
                <th className="calc">Prom. parciales</th>
                <th className="calc strong">Nota {period.name.replace(' Trimestre', ' trim.')}</th>
                {others.map((p) => <th key={p.id} className="calc">{p.name.replace(' Trimestre', ' trim.')}</th>)}
                <th className="calc strong">Promedio anual</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const pAvg = partialAverage(data, a.id, period.id, s.id);
                const tKey = gradeKey(period.id, a.id, s.id);
                const tVal = data.grades[tKey]?.value ?? '';
                const tNum = tVal ? parseGrade(tVal) : null;
                const term = termGrade(data, period.id, a.id, s.id);
                const annual = annualAverage(data, a.id, s.id);
                return (
                  <tr key={s.id}>
                    <td className="sticky"><b>{fullName(s)}</b></td>
                    {instances.map((i) => {
                      const k = partialKey(i.id, s.id);
                      const v = data.partials[k]?.value ?? '';
                      const bad = v !== '' && parseGrade(v) === null;
                      return (
                        <td key={i.id} className="inst">
                          <GradeInput key={`${k}:${v}`} value={v} bad={bad} disabled={locked} label={`${i.title} de ${fullName(s)}`} onCommit={(nv) => setPartial(k, nv)} />
                        </td>
                      );
                    })}
                    <td className="calc"><span className={`pill ${passClass(pAvg)}`}>{fmtNota(pAvg)}</span></td>
                    <td className="calc strong">
                      <GradeInput
                        key={`${tKey}:${tVal}`}
                        value={tVal}
                        bad={tVal !== '' && tNum === null}
                        disabled={locked}
                        placeholder={pAvg !== null ? fmtNota(Math.round(pAvg * 100) / 100) : ''}
                        label={`Nota del ${period.name} de ${fullName(s)}`}
                        onCommit={(nv) => setGrade(tKey, nv)}
                        wide
                      />
                      {term.value !== null && <span className="concept">{conceptFor(term.value)}{term.source === 'parciales' ? ' · prom.' : ''}</span>}
                    </td>
                    {others.map((p) => {
                      const g = termGrade(data, p.id, a.id, s.id);
                      return <td key={p.id} className="calc muted-cell">{fmtNota(g.value)}{g.source === 'parciales' ? '*' : ''}</td>;
                    })}
                    <td className="calc strong"><span className={`pill ${passClass(annual)}`}>{fmtNota(annual)}</span></td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td className="sticky"><b>Promedio del curso</b></td>
                {instances.map((i) => <td key={i.id} className="inst"><b>{fmtNota(instanceAverage(data, i.id, students))}</b></td>)}
                <td className="calc"><b>{fmtNota(average(students.map((s) => partialAverage(data, a.id, period.id, s.id))))}</b></td>
                <td className="calc strong"><b>{fmtNota(termAvg)}</b></td>
                {others.map((p) => <td key={p.id} className="calc"><b>{fmtNota(courseAverage(data, a.id, students, p.id))}</b></td>)}
                <td className="calc strong"><b>{fmtNota(yearAvg)}</b></td>
              </tr>
            </tfoot>
          </table>
        </div>
        {instances.length === 0 && (
          <p className="sub" style={{ marginTop: 10 }}>Todavía no hay instancias en este trimestre. Agregá un escrito, oral o TP con <b style={{ display: 'inline' }}>Nueva instancia</b>, o cargá directamente la nota de cierre.</p>
        )}
        <p className="sub" style={{ marginTop: 10 }}>
          Promedio de parciales ponderado (las instancias ×2 valen doble). La nota de cierre la define el docente; si queda vacía, cuenta el promedio. * calculado de parciales. Aprobado: {PASS_MARK} o más.
        </p>
      </div>
      {toast.node}
    </>
  );
}

function GradeInput({ value, bad, disabled, label, placeholder, onCommit, wide }: { value: string; bad: boolean; disabled: boolean; label: string; placeholder?: string; onCommit: (v: string) => void; wide?: boolean }) {
  return (
    <input
      className={`grade-input${bad ? ' bad' : ''}${wide ? ' wide' : ''}`}
      inputMode="decimal"
      aria-label={label}
      aria-invalid={bad}
      title={bad ? 'La nota debe ser de 1 a 10' : undefined}
      defaultValue={value}
      placeholder={placeholder}
      disabled={disabled}
      onBlur={(e) => e.target.value.trim() !== value && onCommit(e.target.value.trim())}
      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
    />
  );
}

function NewInstanceForm({ onAdd }: { onAdd: (i: { title: string; kind: InstanceKind; date: string; weight: 1 | 2 }) => void }) {
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<InstanceKind>('Escrito');
  const [date, setDate] = useState(todayISO());
  const [double, setDouble] = useState(false);
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), kind, date, weight: double ? 2 : 1 });
  }
  return (
    <form className="alert green" style={{ marginBottom: 12, alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }} onSubmit={submit}>
      <div className="field" style={{ flex: '1 1 220px' }}>
        <label htmlFor="inst-title">Nombre</label>
        <input id="inst-title" className="input" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej.: Evaluación de verbos" />
      </div>
      <div className="field">
        <label htmlFor="inst-kind">Tipo</label>
        <select id="inst-kind" className="select" value={kind} onChange={(e) => setKind(e.target.value as InstanceKind)}>
          <option value="Escrito">Escrito</option>
          <option value="Oral">Oral</option>
          <option value="Trabajo práctico">Trabajo práctico</option>
          <option value="Mixta">Mixta (oral + escrito)</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="inst-date">Fecha</label>
        <input id="inst-date" type="date" className="input" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />
      </div>
      <label className="row" style={{ gap: 6, fontSize: 13, fontWeight: 600, paddingBottom: 10 }}>
        <input id="inst-double" type="checkbox" checked={double} onChange={(e) => setDouble(e.target.checked)} /> Vale doble
      </label>
      <button className="btn primary" type="submit" disabled={!title.trim()}><Plus /> Agregar</button>
    </form>
  );
}

function InformeJardin({ a, periodId, locked }: { a: Assignment; periodId: string; locked: boolean }) {
  const { data, setGrade } = useApp();
  const students = studentsOf(data, a.courseId);
  const loaded = gradesLoaded(data, periodId, a.id, students);
  return (
    <div className="card">
      <div className="card-head">
        <h2>{course(a.courseId).name} · {subject(a.subjectId).name}</h2>
        <span className="sub">{loaded} de {students.length} informes · se guarda al salir de cada campo</span>
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th>Alumno</th><th>Informe descriptivo</th></tr></thead>
          <tbody key={`${periodId}|${a.id}`}>
            {students.map((s) => {
              const key = gradeKey(periodId, a.id, s.id);
              const value = data.grades[key]?.value ?? '';
              return (
                <tr key={s.id}>
                  <td style={{ width: 200 }}><b>{fullName(s)}</b></td>
                  <td>
                    <textarea
                      className="textarea"
                      style={{ minHeight: 64 }}
                      aria-label={`Informe de ${fullName(s)}`}
                      placeholder="Ej.: Reconoce colores y saludos en italiano, participa en canciones…"
                      defaultValue={value}
                      disabled={locked}
                      onBlur={(e) => e.target.value !== value && setGrade(key, e.target.value)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------ Dirección ------------------------------ */

function VentanasDireccion() {
  const { data, setPeriodStatus } = useApp();
  const toast = useToast();
  const open = data.periods.find((p) => p.status === 'ABIERTO');

  return (
    <>
      <PageHead eyebrow="Calificaciones" title="Ventanas de carga y promedios" sub="Dirección abre y cierra la carga de notas de cada período y sigue los promedios de cada curso." />

      <div className="grid g-3">
        {data.periods.map((p) => {
          const prog = gradeProgress(data, p.id);
          const isOpen = p.status === 'ABIERTO';
          return (
            <div className="card accent" key={p.id} style={{ ['--ac' as string]: isOpen ? 'var(--primary)' : 'var(--muted)' }}>
              <div className="row between">
                <b style={{ fontSize: 16 }}>{p.name}</b>
                {isOpen ? <span className="pill green"><LockOpen /> Abierto</span> : <span className="pill gray"><Lock /> Cerrado</span>}
              </div>
              <p className="sub" style={{ marginTop: 4 }}>
                {isOpen ? `Cierra el ${shortDate(p.closesOn)} (${daysUntil(p.closesOn)} días)` : `Cerrado el ${shortDate(p.closesOn)}`}
              </p>
              <div className="row between" style={{ marginTop: 12 }}><span className="sub">Planillas con cierre completo</span><b>{prog.done} / {prog.total}</b></div>
              <div className="bar" style={{ marginTop: 6 }}><i style={{ width: `${(prog.done / prog.total) * 100}%` }} /></div>
              <div className="row wrap" style={{ marginTop: 14, gap: 8 }}>
                {isOpen ? (
                  <>
                    <button className="btn sm" onClick={() => { setPeriodStatus(p.id, 'ABIERTO', isoDate(addDays(new Date(p.closesOn + 'T12:00:00'), 7))); toast.show('Carga extendida una semana'); }}><CalendarClock /> Extender 7 días</button>
                    <button className="btn sm danger" onClick={() => { if (window.confirm(`¿Cerrar la carga del ${p.name}? Los docentes no podrán modificar notas.`)) { setPeriodStatus(p.id, 'CERRADO', isoDate(new Date())); toast.show(`${p.name} cerrado`); } }}><Lock /> Cerrar carga</button>
                  </>
                ) : (
                  <button className="btn sm" disabled={!!open} title={open ? 'Ya hay un período abierto' : undefined} onClick={() => { setPeriodStatus(p.id, 'ABIERTO', isoDate(addDays(new Date(), 7))); toast.show(`${p.name} reabierto por 7 días`); }}><LockOpen /> Reabrir</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-head"><h2>Promedios por curso y materia</h2><span className="sub">* trimestre en curso: incluye promedios de parciales donde aún no hay cierre</span></div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Curso</th><th>Materia</th><th>Docente</th>
                {data.periods.map((p) => <th key={p.id}>{p.name.replace(' Trimestre', ' trim.')}{p.status === 'ABIERTO' ? '*' : ''}</th>)}
                <th>Anual</th><th>Aprobados (anual)</th>
              </tr>
            </thead>
            <tbody>
              {ASSIGNMENTS.map((a) => {
                const c = course(a.courseId);
                const st = studentsOf(data, a.courseId);
                if (isQualitative(c.level)) {
                  return (
                    <tr key={a.id}>
                      <td><b>{c.name}</b></td><td>{subject(a.subjectId).name}</td><td>{staffName(a.teacherId)}</td>
                      <td colSpan={data.periods.length + 2} className="sub">Nivel Inicial: informes descriptivos, sin promedio numérico</td>
                    </tr>
                  );
                }
                const yearAvg = courseAverage(data, a.id, st, null);
                const passed = st.filter((s) => (annualAverage(data, a.id, s.id) ?? 0) >= PASS_MARK).length;
                return (
                  <tr key={a.id}>
                    <td><b>{c.name}</b></td>
                    <td>{subject(a.subjectId).name}</td>
                    <td>{staffName(a.teacherId)}</td>
                    {data.periods.map((p) => <td key={p.id}>{fmtNota(courseAverage(data, a.id, st, p.id))}</td>)}
                    <td><span className={`pill ${passClass(yearAvg)}`}>{fmtNota(yearAvg)}</span></td>
                    <td>{passed} / {st.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="card">
          <div className="card-head"><h2>Avance por docente · {open.name}</h2></div>
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Docente</th><th>Clase</th><th>Instancias</th><th>Cierres cargados</th><th>Estado</th></tr></thead>
              <tbody>
                {ASSIGNMENTS.map((a) => {
                  const st = studentsOf(data, a.courseId);
                  const n = gradesLoaded(data, open.id, a.id, st);
                  return (
                    <tr key={a.id}>
                      <td><b>{staffName(a.teacherId)}</b></td>
                      <td>{course(a.courseId).name} · {subject(a.subjectId).name}</td>
                      <td>{isQualitative(course(a.courseId).level) ? '—' : instancesFor(data, a.id, open.id).length}</td>
                      <td>{n} / {st.length}</td>
                      <td>{n === st.length ? <span className="pill green">Completa</span> : n ? <span className="pill amber">En curso</span> : <span className="pill red">Sin cierre</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {toast.node}
    </>
  );
}
