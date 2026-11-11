import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UserRole } from '@biliapp/shared-types';
import { AlertTriangle, HeartPulse, Lock, Search, ShieldCheck, Users, X, Phone } from 'lucide-react';
import { useApp, useUser } from '../data/store';
import { PageHead, Tabs } from '../components/ui';
import { daysUntil, shortDate } from '../lib/dates';
import { course, isQualitative, subject, displayName, fmtFaltas, fullName, hasHealthCondition, healthItems, LEVEL_LABEL, staffName, studentInitials, thresholdReached, totalAbsences } from '../lib/school';
import { visibleCourses, visibleStudents } from '../lib/scope';
import { annualAverage, average, fmtNota, passClass, termGrade } from '../lib/grades';
import { ASSIGNMENTS } from '../data/mock';
import type { Student } from '../data/types';

type Filter = 'todos' | 'salud' | 'legales' | 'aptos';

export function Legajos() {
  const { data } = useApp();
  const user = useUser();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [courseId, setCourseId] = useState('todos');
  const [filter, setFilter] = useState<Filter>((params.get('filtro') as Filter) ?? 'todos');
  const openId = params.get('alumno');

  const all = visibleStudents(user, data);
  const list = useMemo(
    () =>
      all
        .filter((s) => courseId === 'todos' || s.courseId === courseId)
        .filter((s) => !q || `${s.firstName} ${s.lastName} ${s.dni}`.toLowerCase().includes(q.toLowerCase()))
        .filter((s) =>
          filter === 'salud' ? hasHealthCondition(s)
          : filter === 'legales' ? !!s.legalAlert
          : filter === 'aptos' ? daysUntil(s.health.physicalExamUntil) <= 30
          : true,
        )
        .sort((a, b) => a.lastName.localeCompare(b.lastName, 'es')),
    [all, courseId, q, filter],
  );
  const open = all.find((s) => s.id === openId) ?? null;

  return (
    <>
      <PageHead eyebrow="Legajo integral" title="Legajos y salud" sub="Datos del alumno, condiciones de salud críticas, personas autorizadas y alertas legales." />
      <div className="card">
        <div className="row wrap" style={{ gap: 12 }}>
          <div className="field" style={{ flex: '1 1 220px' }}>
            <label htmlFor="buscar">Buscar</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--muted)' }} />
              <input id="buscar" className="input" style={{ paddingLeft: 34 }} placeholder="Nombre o DNI" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="curso">Curso</label>
            <select id="curso" className="select" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              <option value="todos">Todos</option>
              {visibleCourses(user).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Mostrar</label>
            <Tabs label="Filtro" value={filter} onChange={setFilter} options={[
              { value: 'todos', label: 'Todos' },
              { value: 'salud', label: 'Con condición de salud' },
              { value: 'legales', label: 'Alertas legales' },
              { value: 'aptos', label: 'Apto por vencer' },
            ]} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Alumno</th><th>Curso</th><th>Faltas</th><th>Salud</th><th>Alertas</th></tr></thead>
            <tbody>
              {list.map((s) => {
                const total = totalAbsences(s, data);
                const health = healthItems(s);
                return (
                  <tr key={s.id} className="clickable" onClick={() => setParams({ alumno: s.id })} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setParams({ alumno: s.id })}>
                    <td><b>{fullName(s)}</b><div className="sub">DNI {s.dni}</div></td>
                    <td>{course(s.courseId).name}</td>
                    <td>{fmtFaltas(total)} {thresholdReached(total) && <span className="pill red">Límite</span>}</td>
                    <td>{health.length ? <span className="pill red"><HeartPulse /> {health.join(', ')}</span> : <span className="muted">—</span>}</td>
                    <td className="row wrap" style={{ gap: 4 }}>
                      {s.legalAlert && <span className={`pill ${s.legalAlert.severity === 'CRITICA' ? 'solid-red' : 'amber'}`}><AlertTriangle /> Legal</span>}
                      {daysUntil(s.health.physicalExamUntil) <= 30 && <span className="pill celeste">Apto vence {shortDate(s.health.physicalExamUntil)}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {list.length === 0 && <p className="sub" style={{ padding: 12 }}>No hay alumnos con ese filtro.</p>}
      </div>

      {open && <StudentDrawer student={open} onClose={() => setParams({})} />}
    </>
  );
}

export function StudentDrawer({ student: s, onClose }: { student: Student; onClose: () => void }) {
  const { data, logAccess } = useApp();
  const user = useUser();
  const isDir = user.role === UserRole.DIRECTIVO;
  const c = course(s.courseId);
  const total = totalAbsences(s, data);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="drawer-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={`Legajo de ${displayName(s)}`}>
        <div className="drawer-hero">
          <button className="close-btn" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
          <div className="row">
            <span className="avatar lg" style={{ background: '#fff', color: 'var(--primary)' }}>{studentInitials(s)}</span>
            <div>
              <h2>{displayName(s)}</h2>
              <p>{c.name} · {LEVEL_LABEL[c.level]} · DNI {s.dni}</p>
            </div>
          </div>
        </div>
        <div className="drawer-body">
          {s.legalAlert && (
            <div className="alert red">
              <span className="icon-box sm red" style={{ background: '#fff' }}><AlertTriangle /></span>
              <div className="grow"><b>Alerta legal {s.legalAlert.severity === 'CRITICA' ? 'crítica' : 'moderada'}</b><span className="sub">{s.legalAlert.text}</span></div>
            </div>
          )}

          <div className="card">
            <div className="card-head"><h3>Salud</h3><span className={`pill ${daysUntil(s.health.physicalExamUntil) <= 30 ? 'amber' : 'green'}`}>Apto físico hasta {shortDate(s.health.physicalExamUntil)}</span></div>
            {s.health.allergies.length + s.health.conditions.length + s.health.medication.length === 0 ? (
              <p className="sub">Sin condiciones críticas registradas.</p>
            ) : (
              <div className="stack" style={{ gap: 6 }}>
                {s.health.allergies.map((a) => <div key={a} className="row" style={{ gap: 8 }}><HeartPulse size={15} color="var(--red)" /> <span>Alergia: <b style={{ display: 'inline' }}>{a}</b></span></div>)}
                {s.health.conditions.map((a) => <div key={a} className="row" style={{ gap: 8 }}><HeartPulse size={15} color="var(--red)" /> <b>{a}</b></div>)}
                {s.health.medication.map((a) => <div key={a} className="row" style={{ gap: 8, color: 'var(--red-tx)', fontWeight: 600 }}>💊 {a}</div>)}
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-head"><h3>Familia</h3></div>
            <div className="row"><Users size={16} color="var(--fg3)" /> {s.guardianName}</div>
            <div className="row" style={{ marginTop: 6 }}><Phone size={16} color="var(--fg3)" /> {s.guardianPhone}</div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Autorizados a retirar</h3></div>
            {s.pickup.map((p) => (
              <div className="list-row" key={p.id}>
                <span className="icon-box sm green"><ShieldCheck /></span>
                <div className="grow"><b>{p.fullName}</b><span className="sub">{p.relationship} · DNI {p.dni}</span></div>
                {p.permanent ? <span className="pill gray">Permanente</span> : <span className="pill green">Solo {shortDate(p.validOn!)}</span>}
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-head"><h3>Asistencia</h3>{thresholdReached(total) && <span className="pill red">Superó {thresholdReached(total)}</span>}</div>
            <p><b style={{ fontSize: 22 }}>{fmtFaltas(total)}</b> faltas en el ciclo</p>
          </div>

          <GradesCard student={s} />

          <div className="card">
            <div className="card-head"><h3>Actas del equipo de orientación (DOE)</h3><span className="pill gray"><Lock /> Reservado</span></div>
            {isDir ? (
              s.doeReports.length ? (
                s.doeReports.map((r) => (
                  <div key={r.date} className="list-row" style={{ alignItems: 'flex-start' }}>
                    <div className="grow"><span className="sub">{shortDate(r.date)}</span><p>{r.text}</p></div>
                  </div>
                ))
              ) : <p className="sub">Sin actas.</p>
            ) : (
              <p className="sub">Solo Dirección y el equipo de orientación pueden ver estos informes.</p>
            )}
            {isDir && s.doeReports.length > 0 && (
              <button className="btn sm" style={{ marginTop: 8 }} onClick={() => logAccess(`Lectura de acta DOE de ${displayName(s)}`)}>Registrar lectura en auditoría</button>
            )}
          </div>

          <p className="sub">Última toma de asistencia: {Object.values(data.attendance).filter((x) => x.courseId === s.courseId && !x.subjectId).sort((a, b) => b.takenAt.localeCompare(a.takenAt)).map((x) => `${shortDate(x.date)} por ${staffName(x.takenBy)}`)[0] ?? 'sin datos en el panel'}</p>
        </div>
      </aside>
    </div>
  );
}

/** Notas del alumno por materia: cada trimestre, promedio anual y promedio general. */
function GradesCard({ student: s }: { student: Student }) {
  const { data } = useApp();
  const c = course(s.courseId);
  const classes = ASSIGNMENTS.filter((a) => a.courseId === s.courseId);
  if (isQualitative(c.level)) {
    return (
      <div className="card">
        <div className="card-head"><h3>Calificaciones</h3><span className="pill celeste">Informe descriptivo</span></div>
        <p className="sub">En Nivel Inicial no hay notas numéricas: cada trimestre el docente carga un informe de desarrollo.</p>
      </div>
    );
  }
  const annuals = classes.map((a) => annualAverage(data, a.id, s.id));
  const general = average(annuals);
  const termGeneral = (periodId: string) => average(classes.map((a) => termGrade(data, periodId, a.id, s.id).value));
  return (
    <div className="card">
      <div className="card-head"><h3>Calificaciones</h3><span className={`pill ${passClass(general)}`}>Promedio general {fmtNota(general)}</span></div>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th>Materia</th>{data.periods.map((p) => <th key={p.id}>{p.name.replace(" Trimestre", " trim.")}</th>)}<th>Anual</th></tr></thead>
          <tbody>
            {classes.map((a, i) => (
              <tr key={a.id}>
                <td><b>{subject(a.subjectId).name}</b></td>
                {data.periods.map((p) => {
                  const g = termGrade(data, p.id, a.id, s.id);
                  return <td key={p.id}>{fmtNota(g.value)}{g.source === "parciales" ? "*" : ""}</td>;
                })}
                <td><span className={`pill ${passClass(annuals[i])}`}>{fmtNota(annuals[i])}</span></td>
              </tr>
            ))}
            <tr>
              <td><b>Promedio general</b></td>
              {data.periods.map((p) => <td key={p.id}><b>{fmtNota(termGeneral(p.id))}</b></td>)}
              <td><b>{fmtNota(general)}</b></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="sub" style={{ marginTop: 6 }}>* trimestre sin cierre: se muestra el promedio de parciales.</p>
    </div>
  );
}
