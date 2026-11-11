import { useEffect, useState, type FormEvent } from 'react';
import { Moon, PenSquare, Send } from 'lucide-react';
import { UserRole } from '@biliapp/shared-types';
import { useApp } from '../data/store';
import { ASSIGNMENTS, COURSES, FAMILY } from '../data/mock';
import { isQuietHours, relative, shortDate, timeOf } from '../lib/dates';
import { initials, staff, staffName, subject } from '../lib/school';
import { Hero, Sheet, useKids, usePhoneToast, type Go } from './parts';

/** Con quién puede hablar la familia sobre un hijo: sus docentes y su preceptor/a. */
function contactsFor(courseId: string) {
  const teachers = ASSIGNMENTS.filter((a) => a.courseId === courseId).map((a) => ({ id: a.teacherId, label: `${staffName(a.teacherId)} · ${subject(a.subjectId).name}` }));
  const pre = COURSES.find((c) => c.id === courseId)?.preceptorId;
  return [...teachers, ...(pre ? [{ id: pre, label: `${staffName(pre)} · Preceptoría` }] : [])];
}

export function FamMensajes({ go }: { go: Go }) {
  const { data, familyReply, familyNewThread, familyMarkRead } = useApp();
  const kids = useKids();
  const toast = usePhoneToast();
  const [filter, setFilter] = useState<'todos' | string>('todos');
  const [openId, setOpenId] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);

  const threads = data.threads
    .filter((t) => FAMILY.studentIds.includes(t.studentId) && (filter === 'todos' || t.studentId === filter))
    .sort((a, b) => b.messages[b.messages.length - 1].at.localeCompare(a.messages[a.messages.length - 1].at));
  const open = data.threads.find((t) => t.id === openId) ?? null;

  useEffect(() => {
    if (open?.familyUnread) familyMarkRead(open.id);
  }, [open, familyMarkRead]);

  const quietNote = isQuietHours(new Date().toISOString());

  if (open) {
    const k = kids.find((x) => x.s.id === open.studentId)!;
    return (
      <>
        <Hero title={open.subject} context={`${staffName(open.staffId).toUpperCase()} · ${k.s.firstName.toUpperCase()}`} onBack={() => setOpenId(null)} go={go} />
        <div className="fam-body" style={{ gap: 10 }}>
          {open.messages.map((m) => (
            <div key={m.id} className={`chat-bubble ${m.from === 'FAMILIA' ? 'me' : 'them'}`}>
              {m.text}
              <small>{m.authorName} · {shortDate(m.at)} {timeOf(m.at)}</small>
            </div>
          ))}
          {quietNote && (
            <p className="fam-sub" style={{ textAlign: 'center' }}><Moon size={11} style={{ verticalAlign: -1 }} /> Fuera de horario: {staffName(open.staffId)} lo verá a las 07:30.</p>
          )}
          <ReplyBox onSend={(t) => { familyReply(open.id, t); toast.show('Mensaje enviado'); }} />
        </div>
        {toast.node}
      </>
    );
  }

  return (
    <>
      <Hero title="Mensajes" context="CANAL INSTITUCIONAL" go={go} />
      <div className="fam-body">
        <div className="fam-seg">
          <button className={filter === 'todos' ? 'on green' : ''} onClick={() => setFilter('todos')}>Todos</button>
          {kids.map((k) => <button key={k.s.id} className={filter === k.s.id ? `on ${k.color}` : ''} onClick={() => setFilter(k.s.id)}>{k.s.firstName}</button>)}
        </div>
        {threads.length === 0 && <p className="fam-sub" style={{ textAlign: 'center', padding: 20 }}>Sin mensajes.</p>}
        {threads.map((t) => {
          const k = kids.find((x) => x.s.id === t.studentId)!;
          const last = t.messages[t.messages.length - 1];
          const st = staff(t.staffId);
          return (
            <button key={t.id} className="fam-card tap" onClick={() => setOpenId(t.id)} style={t.familyUnread ? { borderColor: 'var(--primary)' } : undefined}>
              <div className="fam-row" style={{ alignItems: 'flex-start' }}>
                <span className={`kid-av ${k.color}`} style={{ width: 40, height: 40, fontSize: 12 }}>{initials(staffName(t.staffId))}</span>
                <div className="fam-grow">
                  <div className="fam-row between">
                    <span className="fam-title" style={{ fontSize: 13 }}>{staffName(t.staffId)}</span>
                    <span className="fam-sub">{relative(last.at)}</span>
                  </div>
                  <div className="fam-row" style={{ gap: 5, marginTop: 2 }}>
                    <span className={`fam-pill ${k.color}`}>{k.s.firstName}</span>
                    <span className="fam-pill gray">{st?.role === UserRole.PRECEPTOR ? 'Preceptoría' : 'Docente'}</span>
                    {t.familyUnread && <span className="fam-pill red">Nuevo</span>}
                  </div>
                  <div className="fam-title" style={{ fontSize: 12.5, marginTop: 5 }}>{t.subject}</div>
                  <div className="fam-sub" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{last.from === 'FAMILIA' ? 'Vos: ' : ''}{last.text}</div>
                </div>
              </div>
            </button>
          );
        })}
        <p className="fam-sub" style={{ textAlign: 'center' }}>Los mensajes fuera de horario (20:00 a 07:30) le llegan al docente a la mañana.</p>
      </div>
      <button className="fam-btn fam-fab" onClick={() => setComposing(true)}><PenSquare /> Nuevo mensaje</button>
      {composing && (
        <Compose
          onClose={() => setComposing(false)}
          onSend={(m) => {
            const id = familyNewThread(m);
            setComposing(false);
            setOpenId(id);
            toast.show(quietNote ? 'Enviado. Se notificará a las 07:30.' : 'Mensaje enviado');
          }}
        />
      )}
      {toast.node}
    </>
  );
}

function ReplyBox({ onSend }: { onSend: (t: string) => void }) {
  const [text, setText] = useState('');
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  }
  return (
    <form className="fam-row" onSubmit={submit} style={{ marginTop: 6 }}>
      <input className="fam-input" aria-label="Respuesta" placeholder="Escribí tu respuesta" value={text} onChange={(e) => setText(e.target.value)} />
      <button className="fam-btn" style={{ padding: 11 }} aria-label="Enviar" disabled={!text.trim()}><Send /></button>
    </form>
  );
}

function Compose({ onClose, onSend }: { onClose: () => void; onSend: (m: { studentId: string; staffId: string; subject: string; text: string }) => void }) {
  const kids = useKids();
  const [kidId, setKidId] = useState(kids[0].s.id);
  const contacts = contactsFor(kids.find((k) => k.s.id === kidId)!.s.courseId);
  const [to, setTo] = useState(contacts[0]?.id ?? '');
  const [subj, setSubj] = useState('');
  const [text, setText] = useState('');
  useEffect(() => setTo(contactsFor(kids.find((k) => k.s.id === kidId)!.s.courseId)[0]?.id ?? ''), [kidId]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Sheet title="Nuevo mensaje" onClose={onClose}>
      <div>
        <span className="fam-label">¿Sobre qué hijo?</span>
        <div className="fam-seg">
          {kids.map((k) => <button key={k.s.id} className={kidId === k.s.id ? `on ${k.color}` : ''} onClick={() => setKidId(k.s.id)}>{k.s.firstName}</button>)}
        </div>
      </div>
      <div>
        <label className="fam-label" htmlFor="m-to">Para</label>
        <select id="m-to" className="fam-select" value={to} onChange={(e) => setTo(e.target.value)}>
          {contacts.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>
      <div>
        <label className="fam-label" htmlFor="m-subj">Asunto</label>
        <input id="m-subj" className="fam-input" value={subj} onChange={(e) => setSubj(e.target.value)} placeholder="Ej.: Consulta por la tarea" />
      </div>
      <div>
        <label className="fam-label" htmlFor="m-text">Mensaje</label>
        <textarea id="m-text" className="fam-textarea" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <button className="fam-btn block" disabled={!subj.trim() || !text.trim() || !to} onClick={() => onSend({ studentId: kidId, staffId: to, subject: subj.trim(), text: text.trim() })}>
        <Send /> Enviar
      </button>
    </Sheet>
  );
}
