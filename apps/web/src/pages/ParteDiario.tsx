import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, X, Clock, LogOut, MessageSquarePlus, FileText, QrCode, Repeat, HeartPulse, PenLine } from 'lucide-react';
import { useApp, useUser } from '../data/store';
import { PageHead, Tabs } from '../components/ui';
import { CourseQR, courseUrl } from '../components/CourseQR';
import { timeOf, todayISO } from '../lib/dates';
import { course, fullName, healthItems, LEVEL_LABEL, sheetKey, SHIFT_LABEL } from '../lib/school';
import { studentsOf, visibleCourses } from '../lib/scope';
import { dayActa } from '../lib/acta';
import type { Mark, MarkDetail } from '../data/types';

const EF = 's-ef';

const REASONS: Record<Exclude<Mark, 'P'>, string[]> = {
  A: ['Enfermedad', 'Certificado médico', 'Sin aviso', 'Motivo personal', 'Turno médico'],
  T: ['Problema de transporte', 'Turno médico', 'Trámite familiar', 'Sin aviso'],
  R: ['Descompuesto / Malestar', 'Retiro con tutor/padre', 'Turno médico', 'Trámite familiar', 'Autorizado'],
};

const BTNS: { m: Mark; label: string; icon: typeof Check }[] = [
  { m: 'P', label: 'Presente', icon: Check },
  { m: 'A', label: 'Ausente', icon: X },
  { m: 'T', label: 'Tarde', icon: Clock },
  { m: 'R', label: 'Retiro', icon: LogOut },
];

const nowHHMM = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

/** Parte diario de Preceptoría: carga rápida con motivo de cada ausencia, tardanza y retiro. */
export function ParteDiario() {
  const { data, updateSheet } = useApp();
  const user = useUser();
  const [params] = useSearchParams();
  const courses = visibleCourses(user);
  const [courseId, setCourseId] = useState(params.get('curso') ?? courses[0]?.id ?? '');
  const [date, setDate] = useState(todayISO());
  const [kind, setKind] = useState<'diaria' | 'contraturno'>('diaria');
  const [showQR, setShowQR] = useState(false);
  const [noteOpen, setNoteOpen] = useState<Record<string, boolean>>({});

  const subjectId = kind === 'contraturno' ? EF : undefined;
  const key = sheetKey(courseId, date, subjectId);
  const sheet = data.attendance[key];
  const students = useMemo(() => studentsOf(data, courseId), [data, courseId]);
  const marks = sheet?.marks ?? {};
  const details = sheet?.details ?? {};
  const notes = sheet?.notes ?? {};
  const c = course(courseId);
  const acta = dayActa(data, courseId, date);

  function save(next: { marks?: Record<string, Mark>; details?: Record<string, MarkDetail>; notes?: Record<string, string> }) {
    updateSheet({
      key, courseId, date, subjectId,
      marks: next.marks ?? marks,
      details: next.details ?? details,
      notes: next.notes ?? notes,
    });
  }
  const setMark = (id: string, m: Mark) => {
    const d = { ...details };
    if (m === 'P') delete d[id];
    else if (marks[id] !== m) d[id] = m === 'R' ? { time: nowHHMM(), returns: false } : m === 'T' ? { time: nowHHMM() } : {};
    save({ marks: { ...marks, [id]: m }, details: d });
  };
  const setDetail = (id: string, patch: Partial<MarkDetail>) => save({ details: { ...details, [id]: { ...details[id], ...patch } } });
  const setNote = (id: string, text: string) => {
    const n = { ...notes };
    if (text.trim()) n[id] = text;
    else delete n[id];
    save({ notes: n });
  };

  const count = (m: Mark) => students.filter((s) => marks[s.id] === m).length;
  const pending = students.filter((s) => !marks[s.id]).length;

  return (
    <>
      <PageHead
        eyebrow="Preceptoría"
        title="Parte diario"
        sub="Carga rápida de inasistencias, tardanzas y retiros anticipados. Se guarda solo."
        actions={
          <>
            <select aria-label="Curso" className="select" style={{ width: 'auto' }} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              {courses.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
            <input aria-label="Fecha" type="date" className="input" style={{ width: 'auto' }} value={date} max={todayISO()} onChange={(e) => e.target.value && setDate(e.target.value)} />
            <button className="btn" onClick={() => setShowQR(true)}><QrCode /> QR del aula</button>
            <Link className="btn" to={`/acta/${courseId}/${date}`} target="_blank"><FileText /> Ver acta imprimible</Link>
          </>
        }
      />

      <div className="row wrap" style={{ gap: 10 }}>
        <Tabs label="Registro" value={kind} onChange={setKind} options={[{ value: 'diaria', label: 'Diaria' }, { value: 'contraturno', label: 'Contraturno (Ed. Física)' }]} />
        <span className="sub">{c.name} · {LEVEL_LABEL[c.level]} · {SHIFT_LABEL[c.shift]}</span>
        <span className="pill gray" style={{ marginLeft: 'auto' }}><PenLine /> {acta.signed} de {acta.rows.length} horas firmadas por docentes</span>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="pd-head">
          <b>{students.length} alumnos <span className="sub">(ordenados alfabéticamente)</span></b>
          <span className="pill green">{count('P')} Presentes</span>
          <span className="pill red">{count('A')} Ausentes</span>
          <span className="pill amber">{count('T')} Tardanzas</span>
          <span className="pill violet">{count('R')} Retirados</span>
          {pending > 0 && <span className="pill gray">{pending} sin marcar</span>}
          <span style={{ marginLeft: 'auto' }} className="row" >
            {sheet && <span className="sub">Guardado · {staffLabel(sheet.takenAt)}</span>}
            <button className="btn sm" disabled={pending === 0} onClick={() => save({ marks: Object.fromEntries(students.map((s) => [s.id, marks[s.id] ?? 'P'])) })}>Marcar todos presentes</button>
          </span>
        </div>

        {students.map((s, i) => {
          const m = marks[s.id];
          const d = details[s.id] ?? {};
          const health = healthItems(s);
          const tone = m === 'A' ? 'red' : m === 'T' ? 'amber' : m === 'R' ? 'violet' : '';
          return (
            <div key={s.id} className={`pd-row ${tone}`}>
              <div className="pd-top">
                <span className="pd-num">{i + 1}.</span>
                <div className="pd-name">
                  <b>{fullName(s)}</b>
                  <div className="row wrap" style={{ gap: 4, marginTop: 3 }}>
                    {m === 'A' && <span className="pill red">Ausente</span>}
                    {m === 'T' && <span className="pill amber">Tardanza{d.time ? ` · ${d.time}` : ''}</span>}
                    {m === 'R' && <span className="pill violet">Retirado{d.returns ? ' (vuelve)' : ' (no vuelve)'}</span>}
                    {health.length > 0 && <span className="pill red" title={health.join(' · ')}><HeartPulse /> {health[0]}</span>}
                  </div>
                </div>
                <div className="seg" role="radiogroup" aria-label={`Asistencia de ${fullName(s)}`}>
                  {BTNS.map(({ m: b, label, icon: Icon }) => (
                    <button key={b} role="radio" aria-checked={m === b} className={`seg-btn ${b}${m === b ? ' on' : ''}`} onClick={() => setMark(s.id, b)}>
                      <Icon size={15} /> {label}
                    </button>
                  ))}
                </div>
              </div>

              {m && m !== 'P' && (
                <div className={`pd-panel ${tone}`}>
                  <div className="row between wrap" style={{ gap: 8 }}>
                    <span className="pd-label">{m === 'A' ? 'Motivo de la ausencia' : m === 'T' ? 'Motivo / detalle de llegada tarde' : 'Motivo de la retirada'}:</span>
                    <div className="row wrap" style={{ gap: 5 }}>
                      {REASONS[m].map((r) => (
                        <button key={r} className={`chip ${tone}${d.reason === r ? ' on' : ''}`} onClick={() => setDetail(s.id, { reason: d.reason === r ? '' : r })}>{r}</button>
                      ))}
                    </div>
                  </div>
                  <div className="row wrap" style={{ gap: 10, marginTop: 8 }}>
                    <input
                      key={`${key}|${s.id}|${d.reason ?? ''}`}
                      className="input"
                      style={{ flex: '1 1 260px' }}
                      aria-label="Motivo"
                      placeholder={m === 'A' ? 'Escribí el motivo de la inasistencia (ej. fiebre, viaje, trámite)…' : m === 'T' ? 'Escribí el motivo o detalle (ej. llegó 8:25 por tránsito)…' : 'Escribí el motivo del retiro (ej. descompuesto, lo retiró su madre)…'}
                      defaultValue={d.reason ?? ''}
                      onBlur={(e) => e.target.value !== (d.reason ?? '') && setDetail(s.id, { reason: e.target.value })}
                    />
                    {m !== 'A' && (
                      <label className="row" style={{ gap: 6, fontSize: 12.5, fontWeight: 700 }}>
                        {m === 'T' ? 'Llegó a las' : 'Se retiró a las'}
                        <input type="time" className="input" style={{ width: 120 }} value={d.time ?? ''} onChange={(e) => setDetail(s.id, { time: e.target.value })} />
                      </label>
                    )}
                  </div>
                  {m === 'R' && (
                    <div className="pd-return">
                      <span className="pd-label">¿Vuelve más tarde a clases?</span>
                      <div className="row wrap" style={{ gap: 8 }}>
                        <button className={`btn sm ${d.returns ? '' : 'danger'}`} onClick={() => setDetail(s.id, { returns: false, returnTime: undefined })}><X /> No vuelve más tarde</button>
                        <button className={`btn sm ${d.returns ? 'violet' : ''}`} onClick={() => setDetail(s.id, { returns: true })}><Repeat /> Sí, vuelve más tarde</button>
                        {d.returns && (
                          <label className="row" style={{ gap: 6, fontSize: 12.5, fontWeight: 700 }}>
                            Volvió a las
                            <input type="time" className="input" style={{ width: 120 }} value={d.returnTime ?? ''} onChange={(e) => setDetail(s.id, { returnTime: e.target.value })} />
                          </label>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(noteOpen[s.id] || notes[s.id]) ? (
                <div className="row" style={{ marginTop: 8, paddingLeft: 30 }}>
                  <input
                    className="input"
                    aria-label={`Observación de ${fullName(s)}`}
                    placeholder="Observación de Preceptoría (ej. olvidó el uniforme, se sintió mal en el recreo)…"
                    defaultValue={notes[s.id] ?? ''}
                    autoFocus={!notes[s.id]}
                    onBlur={(e) => setNote(s.id, e.target.value)}
                  />
                </div>
              ) : (
                <button className="chip green" style={{ marginTop: 8, marginLeft: 30 }} onClick={() => setNoteOpen((x) => ({ ...x, [s.id]: true }))}>
                  <MessageSquarePlus size={12} /> Agregar observación (Preceptoría)
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showQR && (
        <div className="drawer-bg" style={{ justifyContent: 'center', alignItems: 'center' }} onClick={(e) => e.target === e.currentTarget && setShowQR(false)}>
          <div className="card qr-card" role="dialog" aria-modal="true" aria-label="QR del aula">
            <img src="/logo-colegio.png" alt="" width={48} height={48} />
            <h2>{c.name}</h2>
            <p className="sub">Escaneá para ver el parte del día y firmar tu hora</p>
            <CourseQR courseId={courseId} size={240} />
            <code className="sub" style={{ wordBreak: 'break-all' }}>{courseUrl(courseId)}</code>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn" onClick={() => setShowQR(false)}>Cerrar</button>
              <Link className="btn primary" to={`/qr/${courseId}`} target="_blank">Imprimir para el aula</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const staffLabel = (iso: string) => `desde ${timeOf(iso)}`;
