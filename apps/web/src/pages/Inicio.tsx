import { Link } from 'react-router-dom';
import { UserRole } from '@biliapp/shared-types';
import { AlertTriangle, Camera, ShieldCheck, HeartPulse, Lock, MessageCircle, CalendarDays, CheckSquare, Award } from 'lucide-react';
import { useApp, useUser } from '../data/store';
import { COURSES } from '../data/mock';
import { Kpi, PageHead } from '../components/ui';
import { daysUntil, longDate, relative, shortDate, timeOf, todayISO } from '../lib/dates';
import { isQualitative, course, dayStats, displayName, findStudent, fmtFaltas, gradeProgress, gradesLoaded, hasHealthCondition, healthItems, LEVEL_LABEL, pendingJustifications, SHIFT_LABEL, studentInitials, subject, thresholdReached, todaysEventualPickups, totalAbsences } from '../lib/school';
import { courseAverage, fmtNota } from '../lib/grades';
import { myAssignments, studentsOf, visibleCourses, visibleStudents } from '../lib/scope';
import type { DataState, StaffUser } from '../data/types';

export function Inicio() {
  const user = useUser();
  if (user.role === UserRole.DIRECTIVO) return <InicioDireccion />;
  if (user.role === UserRole.PRECEPTOR) return <InicioPreceptoria user={user} />;
  return <InicioDocente user={user} />;
}

function greeting() {
  const h = new Date().getHours();
  return h < 13 ? 'Buen día' : h < 20 ? 'Buenas tardes' : 'Buenas noches';
}

function atThreshold(data: DataState, students = data.students) {
  return students
    .map((s) => ({ s, total: totalAbsences(s, data) }))
    .filter((x) => thresholdReached(x.total) !== null)
    .sort((a, b) => b.total - a.total);
}

/* ------------------------------ Dirección ------------------------------ */

function InicioDireccion() {
  const { data } = useApp();
  const user = useUser();
  const rows = COURSES.map((c) => dayStats(data, c.id));
  const taken = rows.filter((r) => r.sheet);
  const presentToday = taken.reduce((n, r) => n + r.present, 0);
  const listedToday = taken.reduce((n, r) => n + r.total, 0);
  const pending = rows.filter((r) => !r.sheet);
  const period = data.periods.find((p) => p.status === 'ABIERTO');
  const pendingJust = pendingJustifications(data);
  const eventual = todaysEventualPickups(data.students);
  const expiring = data.students.filter((s) => daysUntil(s.health.physicalExamUntil) <= 30);
  const limit = atThreshold(data);
  const lastComm = data.communications[0];
  const alerts = limit.length + (pendingJust.length ? 1 : 0) + (expiring.length ? 1 : 0);

  return (
    <>
      <PageHead
        eyebrow={longDate(todayISO())}
        title={`${greeting()}, ${user.firstName}`}
        sub="Resumen del colegio para hoy."
      />

      <div className="grid g-4">
        <Kpi label="Presentes hoy" value={taken.length ? presentToday : '—'} of={taken.length ? `/ ${listedToday}` : undefined} note={`${taken.length} de ${rows.length} cursos con asistencia`} />
        <Kpi label="Asistencia sin tomar" value={pending.length} of="cursos" color="var(--amber)" note={pending.map((r) => r.course.name).join(' · ') || 'Todos los cursos al día'} />
        <Kpi label="Último comunicado" value={lastComm ? `${Math.round((lastComm.read / lastComm.recipients) * 100)}%` : '—'} color="var(--celeste-dk)" note={lastComm ? `leído · ${lastComm.title}` : 'Sin comunicados'} />
        <Kpi label="Alertas" value={alerts} color="var(--red)" note="requieren atención" />
      </div>

      {period && <PeriodBanner data={data} />}

      <div className="grid g-main">
        <div className="card">
          <div className="card-head"><h2>Requiere atención</h2></div>
          {limit.slice(0, 4).map(({ s, total }) => (
            <div className="list-row" key={s.id}>
              <span className="icon-box sm red"><AlertTriangle /></span>
              <div className="grow">
                <b>{displayName(s)} llegó a {thresholdReached(total)} faltas</b>
                <span className="sub">{course(s.courseId).name} · lleva {fmtFaltas(total)} · se avisó a la familia</span>
              </div>
              <Link className="btn sm" to={`/legajos?alumno=${s.id}`}>Ver legajo</Link>
            </div>
          ))}
          {pendingJust.length > 0 && (
            <div className="list-row">
              <span className="icon-box sm amber"><Camera /></span>
              <div className="grow"><b>{pendingJust.length} justificativos para revisar</b><span className="sub">Certificados subidos por las familias desde la app</span></div>
              <Link className="btn sm primary" to="/justificativos">Revisar</Link>
            </div>
          )}
          <div className="list-row">
            <span className="icon-box sm green"><ShieldCheck /></span>
            <div className="grow"><b>{eventual.length} permisos de retiro para hoy</b><span className="sub">Cargados por las familias desde la app</span></div>
            <Link className="btn sm" to="/retiros">Ver lista</Link>
          </div>
          {expiring.length > 0 && (
            <div className="list-row">
              <span className="icon-box sm celeste"><HeartPulse /></span>
              <div className="grow"><b>{expiring.length} aptos físicos vencen en los próximos 30 días</b><span className="sub">La app avisa automáticamente a las familias</span></div>
              <Link className="btn sm" to="/legajos?filtro=aptos">Detalle</Link>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-head"><h2>Asistencia por curso</h2><Link className="link" to="/asistencia">Ver todo ›</Link></div>
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Curso</th><th>Presentes</th><th>Estado</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.course.id}>
                    <td><b>{r.course.name}</b><div className="sub">{LEVEL_LABEL[r.course.level]}</div></td>
                    <td>{r.sheet ? `${r.present} / ${r.total}` : `— / ${r.total}`}</td>
                    <td>{r.sheet ? <span className="pill green">Tomada {timeOf(r.sheet.takenAt)}</span> : <span className="pill amber">Pendiente</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export function PeriodBanner({ data }: { data: DataState }) {
  const period = data.periods.find((p) => p.status === 'ABIERTO');
  if (!period) return null;
  const { done, total } = gradeProgress(data, period.id);
  return (
    <div className="alert celeste">
      <span className="icon-box sm celeste" style={{ background: '#fff' }}><Lock /></span>
      <div className="grow">
        <b>Carga de notas del {period.name}: abierta</b>
        <span className="sub">Cierra el {shortDate(period.closesOn)} · {done} de {total} planillas completas</span>
      </div>
      <Link className="btn sm primary" to="/calificaciones">Gestionar</Link>
    </div>
  );
}

/* ------------------------------ Preceptoría ------------------------------ */

function InicioPreceptoria({ user }: { user: StaffUser }) {
  const { data } = useApp();
  const courses = visibleCourses(user);
  const rows = courses.map((c) => dayStats(data, c.id));
  const mine = visibleStudents(user, data);
  const pendingJust = pendingJustifications(data, mine);
  const eventual = todaysEventualPickups(mine);
  const health = mine.filter(hasHealthCondition);
  const unread = data.threads.filter((t) => t.staffId === user.id && t.unread);
  const limit = atThreshold(data, mine);

  return (
    <>
      <PageHead eyebrow={longDate(todayISO())} title={`${greeting()}, ${user.firstName}`} sub={`${user.title} · ${courses.length} cursos a cargo`} />

      <div className="grid g-3">
        {rows.map((r) => (
          <div className="card accent" key={r.course.id} style={{ ['--ac' as string]: r.sheet ? 'var(--primary)' : 'var(--amber)' }}>
            <div className="row between">
              <div><b style={{ fontSize: 16 }}>{r.course.name}</b><div className="sub">{LEVEL_LABEL[r.course.level]} · {SHIFT_LABEL[r.course.shift]}</div></div>
              {r.sheet ? <span className="pill green">TOMADA</span> : <span className="pill amber">PENDIENTE</span>}
            </div>
            <div className="row" style={{ marginTop: 12, gap: 18 }}>
              <div><div className="kpi"><div className="value" style={{ fontSize: 22 }}>{r.sheet ? r.present : '—'}<span> / {r.total}</span></div></div><span className="sub">presentes</span></div>
              {r.sheet && <div><div className="value" style={{ fontSize: 22, fontWeight: 900, color: 'var(--red)' }}>{r.absent}</div><span className="sub">ausentes</span></div>}
              {r.sheet && <div><div className="value" style={{ fontSize: 22, fontWeight: 900, color: 'var(--amber)' }}>{r.late}</div><span className="sub">tardes</span></div>}
            </div>
            <Link className={`btn sm ${r.sheet ? '' : 'primary'}`} style={{ marginTop: 12 }} to={`/asistencia?curso=${r.course.id}`}>
              <CheckSquare /> {r.sheet ? 'Revisar asistencia' : 'Tomar asistencia'}
            </Link>
          </div>
        ))}
      </div>

      <div className="grid g-2">
        <div className="card">
          <div className="card-head"><h2>Para hacer hoy</h2></div>
          <div className="list-row">
            <span className="icon-box sm amber"><Camera /></span>
            <div className="grow"><b>{pendingJust.length} justificativos pendientes</b><span className="sub">Revisá el certificado y aprobá o rechazá</span></div>
            <Link className="btn sm primary" to="/justificativos">Revisar</Link>
          </div>
          <div className="list-row">
            <span className="icon-box sm green"><ShieldCheck /></span>
            <div className="grow"><b>{eventual.length} retiros con permiso del día</b><span className="sub">{eventual.map(({ s, p }) => `${s.firstName} (${p.relationship.toLowerCase()})`).join(' · ') || 'Sin permisos eventuales'}</span></div>
            <Link className="btn sm" to="/retiros">Ir a puerta</Link>
          </div>
          <div className="list-row">
            <span className="icon-box sm celeste"><MessageCircle /></span>
            <div className="grow"><b>{unread.length} mensajes de familias sin leer</b><span className="sub">Los de la noche llegaron en silencio hasta las 07:30</span></div>
            <Link className="btn sm" to="/mensajes">Abrir</Link>
          </div>
          {limit.slice(0, 3).map(({ s, total }) => (
            <div className="list-row" key={s.id}>
              <span className="icon-box sm red"><AlertTriangle /></span>
              <div className="grow"><b>{displayName(s)}: {fmtFaltas(total)} faltas</b><span className="sub">{course(s.courseId).name} · superó el límite de {thresholdReached(total)}</span></div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-head"><h2>Salud: tené en cuenta</h2><Link className="link" to="/legajos">Legajos ›</Link></div>
          {health.map((s) => (
            <div className="list-row" key={s.id}>
              <span className="icon-box sm red"><HeartPulse /></span>
              <div className="grow">
                <b>{displayName(s)}</b>
                <span className="sub">{course(s.courseId).name} · {healthItems(s).join(' · ')}</span>
                {s.health.medication.length > 0 && <div className="sub" style={{ color: 'var(--red-tx)', fontWeight: 600 }}>{s.health.medication.join(' · ')}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ------------------------------ Docente ------------------------------ */

function InicioDocente({ user }: { user: StaffUser }) {
  const { data } = useApp();
  const mine = myAssignments(user);
  const period = data.periods.find((p) => p.status === 'ABIERTO');
  const evals = data.evaluations
    .filter((e) => mine.some((a) => a.id === e.assignmentId) && daysUntil(e.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date));
  const unread = data.threads.filter((t) => t.staffId === user.id);

  return (
    <>
      <PageHead eyebrow={longDate(todayISO())} title={`${greeting()}, prof. ${user.lastName}`} sub={`${user.title} · ${mine.length} cursos`} />

      {period && (
        <div className="alert celeste">
          <span className="icon-box sm celeste" style={{ background: '#fff' }}><Award /></span>
          <div className="grow">
            <b>Carga de notas del {period.name} abierta</b>
            <span className="sub">Dirección la cierra el {shortDate(period.closesOn)} ({daysUntil(period.closesOn)} días). Después no se pueden modificar.</span>
          </div>
          <Link className="btn sm primary" to="/calificaciones">Cargar notas</Link>
        </div>
      )}

      <div className="grid g-3">
        {mine.map((a) => {
          const c = course(a.courseId);
          const st = studentsOf(data, c.id);
          const loaded = period ? gradesLoaded(data, period.id, a.id, st) : 0;
          return (
            <div className="card accent" key={a.id} style={{ ['--ac' as string]: 'var(--celeste-dk)' }}>
              <span className="pill celeste">{LEVEL_LABEL[c.level]}</span>
              <b style={{ display: 'block', fontSize: 16, marginTop: 8 }}>{c.name}</b>
              <div className="sub">{subject(a.subjectId).name} · {a.schedule}</div>
              {period && (
                <>
                  {!isQualitative(c.level) && <div className="row between" style={{ marginTop: 12 }}><span className="sub">Promedio del curso · trimestre / anual</span><b>{fmtNota(courseAverage(data, a.id, st, period.id))} / {fmtNota(courseAverage(data, a.id, st, null))}</b></div>}
                  <div className="row between" style={{ marginTop: 8 }}><span className="sub">{isQualitative(c.level) ? "Informes cargados" : "Notas de cierre cargadas"}</span><b>{loaded} / {st.length}</b></div>
                  <div className="bar" style={{ marginTop: 6 }}><i style={{ width: `${(loaded / st.length) * 100}%` }} /></div>
                </>
              )}
              <div className="row wrap" style={{ marginTop: 12, gap: 8 }}>
                <Link className="btn sm" to={`/asistencia?clase=${a.id}`}><CheckSquare /> Asistencia</Link>
                <Link className="btn sm" to={`/calificaciones?clase=${a.id}`}><Award /> Notas</Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid g-2">
        <div className="card">
          <div className="card-head"><h2>Próximas evaluaciones</h2><Link className="link" to="/calendario">Calendario ›</Link></div>
          {evals.length === 0 && <p className="sub">No hay evaluaciones agendadas.</p>}
          {evals.map((e) => {
            const a = mine.find((x) => x.id === e.assignmentId)!;
            return (
              <div className="list-row" key={e.id}>
                <span className="icon-box sm celeste"><CalendarDays /></span>
                <div className="grow"><b>{e.title}</b><span className="sub">{course(a.courseId).name} · {e.kind}</span></div>
                <span className="pill gray">{shortDate(e.date)}</span>
              </div>
            );
          })}
        </div>
        <div className="card">
          <div className="card-head"><h2>Mensajes de familias</h2><Link className="link" to="/mensajes">Ver todos ›</Link></div>
          {unread.length === 0 && <p className="sub">No tenés conversaciones.</p>}
          {unread.map((t) => {
            const s = findStudent(data, t.studentId);
            const last = t.messages[t.messages.length - 1];
            return (
              <Link to={`/mensajes?t=${t.id}`} className="list-row" key={t.id} style={{ textDecoration: 'none' }}>
                <span className="avatar celeste">{studentInitials(s)}</span>
                <div className="grow"><b>{t.subject}</b><span className="sub">{last.authorName} · {relative(last.at)}</span></div>
                {t.unread && <span className="pill solid-red">Nuevo</span>}
              </Link>
            );
          })}
          <p className="sub" style={{ marginTop: 8 }}>Lo que las familias escriben fuera de horario te llega a las 07:30.</p>
        </div>
      </div>
    </>
  );
}
