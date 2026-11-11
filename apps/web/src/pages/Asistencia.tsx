import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { UserRole } from '@biliapp/shared-types';
import { AlertTriangle, CheckCheck, HeartPulse, Save } from 'lucide-react';
import { useApp, useUser } from '../data/store';
import { COURSES } from '../data/mock';
import { Empty, PageHead, Tabs, useToast } from '../components/ui';
import { longDate, timeOf, todayISO } from '../lib/dates';
import {
  course, dayStats, displayName, fmtFaltas, fullName, healthItems, LEVEL_LABEL, MARK_LABEL, MARK_VALUE, sheetKey, staffName, subject, THRESHOLDS,
  thresholdReached, totalAbsences,
} from '../lib/school';
import { myAssignments, studentsOf, visibleCourses } from '../lib/scope';
import type { Mark } from '../data/types';

export function Asistencia() {
  const user = useUser();
  return user.role === UserRole.DIRECTIVO ? <ResumenDireccion /> : <TomarAsistencia />;
}

/* --------------------------- Toma (Preceptoría / Docente) --------------------------- */

const MARKS: Mark[] = ['P', 'A', 'T', 'R'];
const EF = 's-ef';

function TomarAsistencia() {
  const { data, saveAttendance } = useApp();
  const user = useUser();
  const [params] = useSearchParams();
  const toast = useToast();
  const isTeacher = user.role === UserRole.DOCENTE;

  // Preceptoría: curso + tipo (diaria / contraturno). Docente: su clase (materia × curso).
  const courses = visibleCourses(user);
  const classes = myAssignments(user);
  const [courseId, setCourseId] = useState(params.get('curso') ?? courses[0]?.id ?? '');
  const [classId, setClassId] = useState(params.get('clase') ?? classes[0]?.id ?? '');
  const [kind, setKind] = useState<'diaria' | 'contraturno'>('diaria');
  const [date, setDate] = useState(todayISO());

  const activeCourseId = isTeacher ? classes.find((a) => a.id === classId)?.courseId ?? '' : courseId;
  const subjectId = isTeacher ? classes.find((a) => a.id === classId)?.subjectId : kind === 'contraturno' ? EF : undefined;
  const key = sheetKey(activeCourseId, date, subjectId);
  const existing = data.attendance[key];
  const students = useMemo(() => studentsOf(data, activeCourseId), [data, activeCourseId]);

  const [marks, setMarks] = useState<Record<string, Mark>>({});
  useEffect(() => setMarks(existing?.marks ?? {}), [key, existing]);

  const complete = students.length > 0 && students.every((s) => marks[s.id]);
  const dirty = JSON.stringify(marks) !== JSON.stringify(existing?.marks ?? {});
  const counts = MARKS.map((m) => ({ m, n: students.filter((s) => marks[s.id] === m).length }));

  function save() {
    // Avisos por límites alcanzados con esta carga (solo asistencia diaria).
    const crossed = subjectId
      ? []
      : students.filter((s) => {
          const before = totalAbsences(s, data) - (existing?.marks[s.id] ? MARK_VALUE[existing.marks[s.id]] : 0);
          const after = before + MARK_VALUE[marks[s.id]];
          return THRESHOLDS.some((t) => before < t && after >= t);
        });
    saveAttendance({ key, courseId: activeCourseId, date, subjectId, marks });
    toast.show(crossed.length ? `Asistencia guardada · ${crossed.length} alumno(s) llegaron a un límite: se avisó a la familia y a Dirección` : 'Asistencia guardada');
  }

  return (
    <>
      <PageHead
        eyebrow={isTeacher ? 'Asistencia por materia' : 'Preceptoría'}
        title="Tomar asistencia"
        sub="Un toque por alumno. Las medias faltas y los cuartos se calculan solos."
      />

      <div className="card">
        <div className="row wrap" style={{ gap: 14, alignItems: 'flex-end' }}>
          {isTeacher ? (
            <div className="field" style={{ minWidth: 260 }}>
              <label htmlFor="clase">Clase</label>
              <select id="clase" className="select" value={classId} onChange={(e) => setClassId(e.target.value)}>
                {classes.map((a) => (
                  <option key={a.id} value={a.id}>{course(a.courseId).name} · {subject(a.subjectId).name}</option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div className="field" style={{ minWidth: 200 }}>
                <label htmlFor="curso">Curso</label>
                <select id="curso" className="select" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                  {courses.map((c) => <option key={c.id} value={c.id}>{c.name} · {LEVEL_LABEL[c.level]}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Registro</label>
                <Tabs label="Tipo de registro" value={kind} onChange={setKind} options={[{ value: 'diaria', label: 'Diaria' }, { value: 'contraturno', label: 'Contraturno (Ed. Física)' }]} />
              </div>
            </>
          )}
          <div className="field">
            <label htmlFor="fecha">Fecha</label>
            <input id="fecha" type="date" className="input" value={date} max={todayISO()} onChange={(e) => e.target.value && setDate(e.target.value)} />
          </div>
          <div style={{ marginLeft: 'auto' }} className="row wrap">
            {existing && <span className="pill green">Tomada por {staffName(existing.takenBy)} · {timeOf(existing.takenAt)}</span>}
            <button className="btn" onClick={() => setMarks(Object.fromEntries(students.map((s) => [s.id, marks[s.id] ?? 'P'])))}>
              <CheckCheck /> Resto presentes
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h2>{course(activeCourseId)?.name} · {longDate(date)}</h2>
          <div className="row wrap" style={{ gap: 6 }}>
            {counts.map(({ m, n }) => <span key={m} className={`pill ${m === 'P' ? 'green' : m === 'A' ? 'red' : m === 'T' ? 'amber' : 'celeste'}`}>{MARK_LABEL[m]}: {n}</span>)}
          </div>
        </div>
        {students.length === 0 ? (
          <Empty title="No hay alumnos en este curso" />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Alumno</th><th>{subjectId ? 'Faltas (diarias)' : 'Faltas acumuladas'}</th><th>Marca</th></tr></thead>
              <tbody>
                {students.map((s) => {
                  const total = totalAbsences(s, data);
                  const hit = thresholdReached(total);
                  const health = healthItems(s);
                  return (
                    <tr key={s.id}>
                      <td>
                        <b>{fullName(s)}</b>
                        {health.length > 0 && <div className="sub" style={{ color: 'var(--red-tx)', display: 'flex', gap: 4, alignItems: 'center' }}><HeartPulse size={12} /> {health.join(' · ')}</div>}
                      </td>
                      <td>
                        <span style={{ fontWeight: 800 }}>{fmtFaltas(total)}</span>{' '}
                        {hit && <span className="pill red"><AlertTriangle /> Límite {hit}</span>}
                      </td>
                      <td>
                        <div className="marks" role="radiogroup" aria-label={`Asistencia de ${displayName(s)}`}>
                          {MARKS.map((m) => (
                            <button
                              key={m}
                              role="radio"
                              aria-checked={marks[s.id] === m}
                              title={`${MARK_LABEL[m]}${MARK_VALUE[m] ? ` (${fmtFaltas(MARK_VALUE[m])} falta)` : ''}`}
                              className={`mark ${m}${marks[s.id] === m ? ' on' : ''}`}
                              onClick={() => setMarks((x) => ({ ...x, [s.id]: m }))}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="row between wrap" style={{ marginTop: 14 }}>
          <span className="sub">P presente · A ausente (1 falta) · T tarde (¼) · R retiro anticipado (½){subjectId ? ' · Este registro no suma a las faltas diarias.' : ''}</span>
          <button className="btn primary" disabled={!complete || !dirty} onClick={save}>
            <Save /> {complete ? `Guardar · ${students.length} de ${students.length}` : `Faltan ${students.filter((s) => !marks[s.id]).length} alumnos`}
          </button>
        </div>
      </div>
      {toast.node}
    </>
  );
}

/* --------------------------- Resumen (Dirección) --------------------------- */

function ResumenDireccion() {
  const { data } = useApp();
  const date = todayISO();
  const rows = COURSES.map((c) => dayStats(data, c.id, date));
  const limit = data.students
    .map((s) => ({ s, total: totalAbsences(s, data) }))
    .filter((x) => x.total >= 8)
    .sort((a, b) => b.total - a.total);

  return (
    <>
      <PageHead eyebrow={longDate(date)} title="Asistencia del colegio" sub="Estado de la toma de hoy y alumnos cerca de los límites reglamentarios (10, 15 y 20 faltas)." />
      <div className="card">
        <div className="card-head"><h2>Hoy, por curso</h2></div>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Curso</th><th>Nivel</th><th>Presentes</th><th>Ausentes</th><th>Tardes</th><th>Retiros</th><th>Tomada por</th></tr></thead>
            <tbody>
              {rows.map(({ course: c, sheet, total, present, absent, late, early }) => (
                <tr key={c.id}>
                  <td><b>{c.name}</b></td>
                  <td>{LEVEL_LABEL[c.level]}</td>
                  <td>{sheet ? `${present} / ${total}` : '—'}</td>
                  <td>{sheet ? absent : '—'}</td>
                  <td>{sheet ? late : '—'}</td>
                  <td>{sheet ? early : '—'}</td>
                  <td>{sheet ? <span className="pill green">{staffName(sheet.takenBy)} · {timeOf(sheet.takenAt)}</span> : <span className="pill amber">Pendiente</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h2>Alumnos cerca o por encima del límite</h2></div>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Alumno</th><th>Curso</th><th>Faltas</th><th>Situación</th><th /></tr></thead>
            <tbody>
              {limit.map(({ s, total }) => {
                const hit = thresholdReached(total);
                const next = THRESHOLDS.find((t) => t > total);
                return (
                  <tr key={s.id}>
                    <td><b>{fullName(s)}</b></td>
                    <td>{course(s.courseId).name}</td>
                    <td><b>{fmtFaltas(total)}</b></td>
                    <td>{hit ? <span className="pill red">Superó {hit}</span> : <span className="pill amber">A {fmtFaltas(next! - total)} del límite de {next}</span>}</td>
                    <td><Link className="btn sm" to={`/legajos?alumno=${s.id}`}>Legajo</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
