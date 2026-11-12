import { useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserCheck, Users, PenLine, CheckCircle2, Clock, HeartPulse, X } from 'lucide-react';
import { useApp } from '../data/store';
import { COURSES, INSTITUTION, STAFF } from '../data/mock';
import { modulesOf, signatureKey, teachersOf, toMin, type Module } from '../data/timetable';
import { hhmm, shortDate, timeOf, todayISO } from '../lib/dates';
import { fullName, healthItems, sheetKey, SHIFT_LABEL } from '../lib/school';
import { absentInModule, markText } from '../lib/acta';
import { studentsOf } from '../lib/scope';
import { CourseQR } from '../components/CourseQR';
import { UserRole } from '@biliapp/shared-types';

const PROFILE_KEY = 'bili-docente';
const DAYS = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

interface Profile { name: string; pin: string }
function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

/**
 * Página que abre el docente al escanear el QR del aula (no requiere entrar al panel).
 * Ve el parte del día con los motivos y firma su hora con su PIN.
 */
export function CursoDocente() {
  const { courseId = '' } = useParams();
  const { data, user, signHour } = useApp();
  const c = COURSES.find((x) => x.id === courseId);
  const date = todayISO();
  const [profile, setProfile] = useState<Profile | null>(() => {
    const p = loadProfile();
    if (p) return p;
    // Si entró desde el panel con su usuario de docente, se lo reconoce.
    const st = user && STAFF.find((s) => s.id === user.id);
    return st && st.role === UserRole.DOCENTE ? { name: `${st.firstName} ${st.lastName}`, pin: '' } : null;
  });
  const [creating, setCreating] = useState(false);
  const [signing, setSigning] = useState<Module | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const students = useMemo(() => studentsOf(data, courseId), [data, courseId]);
  if (!c) return <div className="cd"><div className="cd-body"><p>Curso no encontrado.</p></div></div>;

  const sheet = data.attendance[sheetKey(courseId, date)];
  const off = students.filter((s) => sheet?.marks[s.id] && sheet.marks[s.id] !== 'P');
  const absentCount = students.filter((s) => sheet?.marks[s.id] === 'A').length;
  const modules = modulesOf(courseId);
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const health = students.filter((s) => healthItems(s).length > 0);

  return (
    <div className="cd">
      <header className="cd-hero">
        <div className="row between">
          <div className="row" style={{ gap: 8 }}>
            <img src="/logo-colegio.png" alt="" width={34} height={34} style={{ borderRadius: '50%', background: 'rgba(255,255,255,.15)' }} />
            <small style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, opacity: 0.85 }}>{INSTITUTION.name.toUpperCase()}</small>
          </div>
          <span className="pill" style={{ background: 'rgba(255,255,255,.18)', color: '#fff' }}>{shortDate(date)}</span>
        </div>
        <h1 style={{ marginTop: 12 }}>{c.name}</h1>
        <p style={{ opacity: 0.85, fontSize: 13 }}>{SHIFT_LABEL[c.shift]} · {DAYS[now.getDay()]}</p>
        <div className="row wrap" style={{ gap: 8, marginTop: 10 }}>
          {profile ? (
            <button className="pill" style={{ background: '#fff', color: 'var(--primary-dk)', border: 0, cursor: 'pointer', fontSize: 12 }} onClick={() => setCreating(true)}>
              <UserCheck /> {profile.name}
            </button>
          ) : (
            <button className="pill" style={{ background: '#fff', color: 'var(--primary-dk)', border: 0, cursor: 'pointer', fontSize: 12 }} onClick={() => setCreating(true)}>
              <UserCheck /> Soy docente
            </button>
          )}
          <span className="pill" style={{ background: absentCount ? 'var(--red-lt)' : 'rgba(255,255,255,.18)', color: absentCount ? 'var(--red-tx)' : '#fff', fontSize: 12 }}>
            <Users /> {absentCount} {absentCount === 1 ? 'ausente' : 'ausentes'}
          </span>
        </div>
      </header>

      <div className="cd-body">
        {!profile && (
          <div className="alert celeste">
            <span className="icon-box sm celeste" style={{ background: '#fff' }}><UserCheck /></span>
            <div className="grow">
              <b>¿Sos docente de este curso?</b>
              <span className="sub">Creá tu perfil con tu PIN para que este celular te recuerde y firmes con un toque.</span>
              <button className="btn sm primary" style={{ marginTop: 8 }} onClick={() => setCreating(true)}>Crear mi perfil</button>
            </div>
          </div>
        )}

        <section className="card">
          <div className="card-head"><h2>Parte del día</h2>{sheet && <span className="sub">Preceptoría · {timeOf(sheet.takenAt)}</span>}</div>
          {!sheet ? (
            <div className="empty" style={{ padding: 16 }}>
              <Clock size={28} color="var(--muted)" />
              <b>Aún no hay datos cargados</b>
              Preceptoría todavía no cargó el parte diario de hoy.
            </div>
          ) : off.length === 0 ? (
            <p className="sub">Están todos presentes ({students.length} alumnos).</p>
          ) : (
            <>
              <p className="sub" style={{ marginBottom: 6 }}>{students.length - absentCount} presentes de {students.length}. Novedades:</p>
              {off.map((s) => {
                const m = sheet.marks[s.id];
                const d = sheet.details?.[s.id] ?? {};
                return (
                  <div key={s.id} className="list-row" style={{ alignItems: 'flex-start' }}>
                    <span className={`pill ${m === 'A' ? 'red' : m === 'T' ? 'amber' : 'violet'}`} style={{ minWidth: 64, justifyContent: 'center' }}>{m === 'A' ? 'Ausente' : m === 'T' ? 'Tarde' : 'Retiro'}</span>
                    <div className="grow">
                      <b>{fullName(s)}</b>
                      <span className="sub">{m !== 'A' ? markText(m, d) + ' · ' : ''}{d.reason || 'Sin motivo cargado'}</span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </section>

        {health.length > 0 && (
          <section className="card">
            <div className="card-head"><h2>Salud: tené en cuenta</h2></div>
            {health.map((s) => (
              <div key={s.id} className="list-row">
                <span className="icon-box sm red"><HeartPulse /></span>
                <div className="grow"><b>{fullName(s)}</b><span className="sub">{healthItems(s, true).join(' · ')}</span></div>
              </div>
            ))}
          </section>
        )}

        <section className="card" style={{ padding: 8 }}>
          <div className="card-head" style={{ padding: '8px 8px 0' }}>
            <div><h2>Acta de clases y firma de profesores</h2><span className="sub">Firma por hora con tu PIN personal</span></div>
            <span className="pill gray">{modules.length} módulos hoy</span>
          </div>
          {modules.map((m) => {
            const sig = data.signatures[signatureKey(courseId, date, m.hour)];
            const isNow = nowMin >= toMin(m.start) && nowMin < toMin(m.end);
            return (
              <div key={m.hour} className={`mod${isNow ? ' now' : ''}`}>
                <div className="h">{m.hour}ª<small>{m.start} - {m.end}</small></div>
                <div className="grow" style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ textTransform: 'uppercase', fontSize: 13 }}>{m.subject}</b>
                  <div className="sub">{m.teacherName}{isNow ? ' · en curso' : ''}</div>
                </div>
                {sig ? (
                  <span className="pill green" title={sig.note}><CheckCircle2 /> {sig.teacherName.split(' ')[0]} · {hhmm(sig.at)}</span>
                ) : (
                  <button className="btn sm primary" onClick={() => (profile ? setSigning(m) : setCreating(true))}><PenLine /> Firmar mi hora</button>
                )}
              </div>
            );
          })}
        </section>

        <p className="sub" style={{ textAlign: 'center' }}>
          Demo: lo que firmes queda guardado en este dispositivo. <Link to="/">Ir al panel</Link>
        </p>
      </div>

      {creating && (
        <ProfileSheet
          courseId={courseId}
          current={profile}
          onClose={() => setCreating(false)}
          onSave={(p) => {
            try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch { /* sin almacenamiento */ }
            setProfile(p);
            setCreating(false);
          }}
        />
      )}
      {signing && profile && (
        <SignSheet
          m={signing}
          profile={profile}
          absent={absentInModule(sheet, students, signing).map((a) => `${fullName(a.s)}${a.mark !== 'A' ? ` (${markText(a.mark, a.detail)})` : ''}`)}
          onClose={() => setSigning(null)}
          onSign={(note) => {
            signHour({ key: signatureKey(courseId, date, signing.hour), courseId, date, hour: signing.hour, teacherName: profile.name, note: note || undefined });
            setDone(`${signing.hour}ª hora firmada`);
            setSigning(null);
            window.setTimeout(() => setDone(null), 2600);
          }}
        />
      )}
      {done && <div className="toast" role="status"><CheckCircle2 /> {done}</div>}
    </div>
  );
}

function PinInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(4, ' ').slice(0, 4).split('');
  return (
    <div className="pin4" role="group" aria-label={label}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="password"
          inputMode="numeric"
          aria-label={`${label}, dígito ${i + 1}`}
          value={d.trim()}
          onChange={(e) => {
            const typed = e.target.value.replace(/\D/g, '');
            const arr = value.split('');
            typed.split('').forEach((ch, k) => { if (i + k < 4) arr[i + k] = ch; });
            if (!typed) arr[i] = '';
            const next = arr.join('').slice(0, 4);
            onChange(next);
            if (typed) refs.current[Math.min(3, i + typed.length)]?.focus();
          }}
          onKeyDown={(e) => e.key === 'Backspace' && !d.trim() && i > 0 && refs.current[i - 1]?.focus()}
        />
      ))}
    </div>
  );
}

function ProfileSheet({ courseId, current, onClose, onSave }: { courseId: string; current: Profile | null; onClose: () => void; onSave: (p: Profile) => void }) {
  const names = teachersOf(courseId);
  const [name, setName] = useState(current?.name && names.includes(current.name) ? current.name : names[0]);
  const [pin, setPin] = useState('');
  return (
    <div className="sheet-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label="Mi perfil de docente">
        <div className="row between"><h3>Mi perfil de docente</h3><button className="icon-btn" aria-label="Cerrar" onClick={onClose}><X size={16} /></button></div>
        <div className="field">
          <label htmlFor="doc-name">¿Quién sos?</label>
          <select id="doc-name" className="select" value={name} onChange={(e) => setName(e.target.value)}>
            {names.map((n) => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Elegí un PIN de 4 dígitos</label>
          <PinInput value={pin} onChange={setPin} label="PIN nuevo" />
        </div>
        <p className="sub">El PIN queda guardado solo en este celular. Demo: cualquier PIN de 4 dígitos sirve.</p>
        <button className="btn primary" disabled={pin.replace(/\D/g, '').length !== 4} onClick={() => onSave({ name, pin })}>Guardar perfil</button>
      </div>
    </div>
  );
}

function SignSheet({ m, profile, absent, onClose, onSign }: { m: Module; profile: Profile; absent: string[]; onClose: () => void; onSign: (note: string) => void }) {
  const [pin, setPin] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const other = m.teacherName !== profile.name;
  function submit() {
    if (profile.pin && pin !== profile.pin) return setError('PIN incorrecto.');
    onSign(note.trim());
  }
  return (
    <div className="sheet-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={`Firmar ${m.hour}ª hora`}>
        <div className="row between"><h3>Firmar {m.hour}ª hora · {m.subject}</h3><button className="icon-btn" aria-label="Cerrar" onClick={onClose}><X size={16} /></button></div>
        <p className="sub">{m.start} a {m.end} · firmás como <b>{profile.name}</b></p>
        {other && <div className="alert amber"><div className="grow"><b>Esta hora es de {m.teacherName}</b><span className="sub">Si estás de reemplazo, podés firmarla igual.</span></div></div>}
        <div className="card" style={{ boxShadow: 'none', background: 'var(--soft)' }}>
          <b style={{ fontSize: 13 }}>Ausentes en tu hora</b>
          {absent.length === 0 ? <p className="sub">Sin ausentes según el parte de Preceptoría.</p> : absent.map((a) => <div key={a} className="sub" style={{ color: 'var(--red-tx)' }}>• {a}</div>)}
        </div>
        <div className="field">
          <label htmlFor="sig-note">Novedad u observación (opcional)</label>
          <input id="sig-note" className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej.: evaluación escrita, salida al patio…" />
        </div>
        <div className="field">
          <label>{profile.pin ? 'Tu PIN' : 'PIN (demo: cualquier PIN de 4 dígitos)'}</label>
          <PinInput value={pin} onChange={(v) => { setPin(v); setError(''); }} label="PIN" />
          {error && <span className="sub" style={{ color: 'var(--red)', textAlign: 'center' }}>{error}</span>}
        </div>
        <button className="btn primary" disabled={pin.replace(/\D/g, '').length !== 4} onClick={submit}><PenLine /> Firmar mi hora</button>
      </div>
    </div>
  );
}

/** Hoja con el QR grande para imprimir y pegar en el aula. */
export function QrPrint() {
  const { courseId = '' } = useParams();
  const c = COURSES.find((x) => x.id === courseId);
  if (!c) return <p style={{ padding: 24 }}>Curso no encontrado.</p>;
  return (
    <div className="qr-print">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <img src="/logo-colegio.png" alt="" width={72} height={72} />
        <small style={{ fontWeight: 800, letterSpacing: 1 }}>{INSTITUTION.name.toUpperCase()}</small>
        <h1>{c.name}</h1>
        <CourseQR courseId={courseId} size={320} />
        <p style={{ fontSize: 16, maxWidth: 380 }}>Docente: escaneá este código con tu celular para ver el parte del día y firmar tu hora.</p>
        <button className="btn primary no-print" onClick={() => window.print()}>Imprimir</button>
      </div>
    </div>
  );
}

