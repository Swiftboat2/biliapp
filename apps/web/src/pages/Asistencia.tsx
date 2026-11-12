import { Link } from 'react-router-dom';
import { UserRole } from '@biliapp/shared-types';
import { CheckCircle2, FileText, QrCode, ScanLine } from 'lucide-react';
import { useApp, useUser } from '../data/store';
import { COURSES } from '../data/mock';
import { modulesOf, signatureKey, toMin } from '../data/timetable';
import { PageHead } from '../components/ui';
import { CourseQR } from '../components/CourseQR';
import { hhmm, longDate, timeOf, todayISO } from '../lib/dates';
import { course, dayStats, fmtFaltas, fullName, LEVEL_LABEL, staffName, THRESHOLDS, thresholdReached, totalAbsences } from '../lib/school';
import { dayActa } from '../lib/acta';
import { ParteDiario } from './ParteDiario';

export function Asistencia() {
  const user = useUser();
  if (user.role === UserRole.DIRECTIVO) return <ResumenDireccion />;
  if (user.role === UserRole.PRECEPTOR) return <ParteDiario />;
  return <MisHoras />;
}

/* --------------------------- Docente: mis horas de hoy --------------------------- */

function MisHoras() {
  const { data } = useApp();
  const user = useUser();
  const date = todayISO();
  const name = `${user.firstName} ${user.lastName}`;
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const byCourse = COURSES.map((c) => ({ c, mods: modulesOf(c.id).filter((m) => m.teacherId === user.id) })).filter((x) => x.mods.length);
  const total = byCourse.reduce((n, x) => n + x.mods.length, 0);
  const signed = byCourse.reduce((n, x) => n + x.mods.filter((m) => data.signatures[signatureKey(x.c.id, date, m.hour)]).length, 0);

  return (
    <>
      <PageHead
        eyebrow={longDate(date)}
        title="Mis horas de hoy"
        sub="En el aula escaneá el QR del curso con tu celular: ves el parte del día (ausentes, tardanzas y retiros con su motivo) y firmás tu hora con tu PIN."
        actions={<span className="pill gray" style={{ fontSize: 12 }}>{signed} de {total} horas firmadas</span>}
      />
      <div className="grid g-2">
        {byCourse.map(({ c, mods }) => {
          const stats = dayStats(data, c.id, date);
          return (
            <div key={c.id} className="card accent" style={{ ['--ac' as string]: 'var(--celeste-dk)' }}>
              <div className="row" style={{ alignItems: 'flex-start', gap: 14 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span className="pill celeste">{LEVEL_LABEL[c.level]}</span>
                  <b style={{ display: 'block', fontSize: 17, marginTop: 6 }}>{c.name}</b>
                  <span className="sub">{stats.sheet ? `${stats.present} presentes · ${stats.absent} ausentes · ${stats.late} tarde · ${stats.early} retiro` : 'Preceptoría todavía no cargó el parte'}</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <CourseQR courseId={c.id} size={92} />
                  <span className="sub" style={{ fontSize: 10.5 }}>QR del aula</span>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                {mods.map((m) => {
                  const sig = data.signatures[signatureKey(c.id, date, m.hour)];
                  const isNow = nowMin >= toMin(m.start) && nowMin < toMin(m.end);
                  return (
                    <div key={m.hour} className={`list-row${isNow ? ' now-row' : ''}`}>
                      <span className="pill gray" style={{ minWidth: 92, justifyContent: 'center' }}>{m.hour}ª · {m.start}</span>
                      <div className="grow"><b>{m.subject}</b>{isNow && <span className="sub">En curso</span>}</div>
                      {sig ? <span className="pill green"><CheckCircle2 /> Firmada {hhmm(sig.at)}</span> : <span className="pill amber">Sin firmar</span>}
                    </div>
                  );
                })}
              </div>
              <div className="row wrap" style={{ gap: 8, marginTop: 12 }}>
                <Link className="btn sm primary" to={`/curso/${c.id}`}><ScanLine /> Abrir como si escaneara el QR</Link>
              </div>
            </div>
          );
        })}
      </div>
      <p className="sub">Firmás como {name}. En el celular, la página del curso te pide crear tu perfil con un PIN la primera vez.</p>
    </>
  );
}

/* --------------------------- Dirección: resumen del colegio --------------------------- */

function ResumenDireccion() {
  const { data } = useApp();
  const date = todayISO();
  const rows = COURSES.map((c) => ({ ...dayStats(data, c.id, date), acta: dayActa(data, c.id, date) }));
  const limit = data.students
    .map((s) => ({ s, total: totalAbsences(s, data) }))
    .filter((x) => x.total >= 8)
    .sort((a, b) => b.total - a.total);

  return (
    <>
      <PageHead eyebrow={longDate(date)} title="Asistencia del colegio" sub="Parte diario de cada curso, firmas de los docentes por hora y alumnos cerca de los límites (10, 15 y 20 faltas)." />
      <div className="card">
        <div className="card-head"><h2>Hoy, por curso</h2></div>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Curso</th><th>Presentes</th><th>Ausentes</th><th>Tardes</th><th>Retiros</th><th>Parte</th><th>Horas firmadas</th><th /></tr></thead>
            <tbody>
              {rows.map(({ course: c, sheet, total, present, absent, late, early, acta }) => (
                <tr key={c.id}>
                  <td><b>{c.name}</b><div className="sub">{LEVEL_LABEL[c.level]}</div></td>
                  <td>{sheet ? `${present} / ${total}` : '—'}</td>
                  <td>{sheet ? absent : '—'}</td>
                  <td>{sheet ? late : '—'}</td>
                  <td>{sheet ? early : '—'}</td>
                  <td>{sheet ? <span className="pill green">{staffName(sheet.takenBy)} · {timeOf(sheet.takenAt)}</span> : <span className="pill amber">Pendiente</span>}</td>
                  <td><span className={`pill ${acta.signed === acta.rows.length ? 'green' : acta.signed ? 'amber' : 'gray'}`}>{acta.signed} / {acta.rows.length}</span></td>
                  <td>
                    <div className="row" style={{ gap: 6 }}>
                      <Link className="btn sm" to={`/acta/${c.id}/${date}`} target="_blank"><FileText /> Acta</Link>
                      <Link className="btn sm" to={`/qr/${c.id}`} target="_blank" title="QR del aula"><QrCode /></Link>
                    </div>
                  </td>
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
