import { Link, useParams } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';
import { useApp } from '../data/store';
import { COURSES, INSTITUTION } from '../data/mock';
import { hhmm, todayISO } from '../lib/dates';
import { LEVEL_LABEL, SHIFT_LABEL } from '../lib/school';
import { dayActa, markText, shortName } from '../lib/acta';

const DAYS = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

/** Parte diario oficial para imprimir: una fila por hora con la firma del docente y quién faltó. */
export function Acta() {
  const { courseId = '', date = todayISO() } = useParams();
  const { data } = useApp();
  const c = COURSES.find((x) => x.id === courseId);
  if (!c) return <div className="acta-page"><div className="acta">Curso no encontrado.</div></div>;
  const acta = dayActa(data, courseId, date);
  const day = DAYS[new Date(date + 'T12:00:00').getDay()];
  const justified = (studentId: string) =>
    data.justifications.some((j) => j.studentId === studentId && j.forDate === date && j.status === 'APROBADO');
  const notes = acta.sheet?.notes ?? {};

  return (
    <div className="acta-page">
      <div className="acta-bar no-print">
        <Link className="btn sm" to="/asistencia"><ArrowLeft /> Volver al panel</Link>
        <span className="sub">{acta.signed} de {acta.rows.length} horas firmadas</span>
        <button className="btn sm primary" style={{ marginLeft: 'auto' }} onClick={() => window.print()}><Printer /> Imprimir</button>
      </div>

      <article className="acta">
        <div className="acta-top">
          <div>
            <h1>{INSTITUTION.name.toUpperCase()}</h1>
            <small>{LEVEL_LABEL[c.level].toUpperCase()} · PRECEPTORÍA</small>
          </div>
          <span className="acta-badge">PARTE DIARIO OFICIAL</span>
        </div>
        <div className="acta-meta">
          <div><span>CURSO:</span><b>{c.name}</b></div>
          <div><span>TURNO:</span><b>{SHIFT_LABEL[c.shift].replace('Turno ', '').toUpperCase()}</b></div>
          <div><span>DÍA:</span><b>{day}</b></div>
          <div><span>FECHA:</span><b>{date.split('-').reverse().join('/')}</b></div>
        </div>

        <div className="acta-scroll">
          <table className="acta-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Hora</th>
                <th>Asignatura</th>
                <th style={{ textAlign: 'center' }}>Firma profesor</th>
                <th>Alumnos ausentes</th>
                <th>Inasistencia justificada / motivo</th>
                <th>Observaciones y novedades</th>
              </tr>
            </thead>
            <tbody>
              {acta.rows.map(({ m, signature, absent }) => (
                <tr key={m.hour}>
                  <td className="hour">{m.hour}ª<small>{m.start} -<br />{m.end}</small></td>
                  <td><span className="subject">{m.subject}</span><div style={{ fontSize: 9.5, color: '#475569' }}>{m.teacherName}</div></td>
                  <td className="sig">
                    {signature ? (
                      <>
                        <b>{signature.teacherName}</b>
                        <div style={{ fontSize: 8.5, color: '#475569' }}>Firmó {hhmm(signature.at)} hs</div>
                      </>
                    ) : (
                      <>
                        <div className="line" />
                        <em>Pendiente</em>
                      </>
                    )}
                  </td>
                  <td>
                    {!acta.sheet ? <em style={{ color: '#94a3b8' }}>Sin parte</em> : absent.length === 0 ? <em style={{ color: '#94a3b8' }}>Sin ausentes</em> : absent.map((a) => <div key={a.s.id}>{shortName(a.s)}{a.mark !== 'A' ? ` (${markText(a.mark, a.detail)})` : ''}</div>)}
                  </td>
                  <td>
                    {absent.filter((a) => a.detail.reason || justified(a.s.id)).map((a) => (
                      <div key={a.s.id}>{a.s.lastName}: {a.detail.reason || 'Certificado presentado'}{justified(a.s.id) ? ' ✓ justificada' : ''}</div>
                    ))}
                  </td>
                  <td>
                    {signature?.note && <div>{signature.note}</div>}
                    {m.hour === 1 && Object.entries(notes).map(([id, n]) => {
                      const s = acta.students.find((x) => x.id === id);
                      return s ? <div key={id}>{s.lastName}: {n}</div> : null;
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="acta-totals">
          <span>MATRÍCULA TOTAL: {acta.totals.total}</span>
          <span style={{ color: '#047857' }}>PRESENTES: {acta.totals.present}</span>
          <span style={{ color: '#be123c' }}>AUSENTES: {acta.totals.absent}</span>
          <span style={{ color: '#b45309' }}>TARDANZAS: {acta.totals.late}</span>
          <span style={{ color: '#6d28d9' }}>RETIRADOS: {acta.totals.early}</span>
        </div>

        <div className="acta-sign">
          <div>FIRMA Y ACLARACIÓN PRECEPTOR/A</div>
          <div>FIRMA DE DIRECCIÓN / VICEDIRECCIÓN</div>
        </div>
      </article>
    </div>
  );
}
