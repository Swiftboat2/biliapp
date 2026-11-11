import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Moon, Send } from 'lucide-react';
import { useApp, useUser } from '../data/store';
import { Empty, PageHead } from '../components/ui';
import { isQuietHours, relative, shortDate, timeOf } from '../lib/dates';
import { course, displayName, findStudent, studentInitials } from '../lib/school';
import type { Thread } from '../data/types';

export function Mensajes() {
  const { data, reply, markRead } = useApp();
  const user = useUser();
  const [params, setParams] = useSearchParams();
  const mine = data.threads.filter((t) => t.staffId === user.id);
  const activeId = params.get('t') ?? mine[0]?.id;
  const active = mine.find((t) => t.id === activeId) ?? null;

  useEffect(() => {
    if (active?.unread) markRead(active.id);
  }, [active, markRead]);

  return (
    <>
      <PageHead eyebrow="Mensajería cuidada" title="Mensajes con familias" sub="Lo que llega fuera de horario (20:00 a 07:30) se guarda y te notifica recién a las 07:30." />
      {mine.length === 0 ? (
        <div className="card"><Empty title="No tenés conversaciones" /></div>
      ) : (
        <div className="grid g-main" style={{ gridTemplateColumns: 'minmax(0, 0.8fr) minmax(0, 1.4fr)' }}>
          <div className="card" style={{ padding: 8 }}>
            {mine.map((t) => {
              const s = findStudent(data, t.studentId);
              const last = t.messages[t.messages.length - 1];
              return (
                <button key={t.id} className={`row-btn boxed${t.id === activeId ? ' selected' : ''}`} onClick={() => setParams({ t: t.id })}>
                  <span className="avatar celeste">{studentInitials(s)}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <b style={{ display: 'block', fontSize: 13.5 }}>{t.subject}</b>
                    <span className="sub" style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName(s)} · {last.text}</span>
                  </span>
                  <span style={{ textAlign: 'right' }}>
                    <span className="sub" style={{ display: 'block' }}>{relative(last.at)}</span>
                    {t.unread && <span className="pill solid-red">Nuevo</span>}
                  </span>
                </button>
              );
            })}
          </div>
          {active && <Conversation key={active.id} thread={active} onSend={(text) => reply(active.id, text)} />}
        </div>
      )}
    </>
  );
}

function Conversation({ thread, onSend }: { thread: Thread; onSend: (text: string) => void }) {
  const { data } = useApp();
  const [text, setText] = useState('');
  const s = findStudent(data, thread.studentId);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-head">
        <div><h2>{thread.subject}</h2><span className="sub">{displayName(s)} · {course(s.courseId).name} · {s.guardianName}</span></div>
      </div>
      <div className="chat" style={{ flex: 1 }}>
        {thread.messages.map((m) => (
          <div key={m.id} className={`bubble ${m.from === 'STAFF' ? 'me' : 'fam'}`}>
            {m.text}
            <small>
              {m.authorName} · {shortDate(m.at)} {timeOf(m.at)}
              {m.from === 'FAMILIA' && isQuietHours(m.at) && <> · <Moon size={10} style={{ verticalAlign: -1 }} /> notificado a las 07:30</>}
            </small>
          </div>
        ))}
      </div>
      <form className="row" onSubmit={submit} style={{ marginTop: 12 }}>
        <input className="input" aria-label="Respuesta" placeholder="Escribí tu respuesta" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn primary" type="submit" disabled={!text.trim()}><Send /> Enviar</button>
      </form>
      <p className="sub" style={{ marginTop: 8 }}>Dirección puede revisar las conversaciones ante una denuncia o conflicto.</p>
    </div>
  );
}
