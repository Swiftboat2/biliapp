import { useState, type FormEvent } from 'react';
import { UserRole, EducationalLevel } from '@biliapp/shared-types';
import { Bell, PenLine, Send } from 'lucide-react';
import { useApp, useUser } from '../data/store';
import { PageHead, useToast } from '../components/ui';
import { relative } from '../lib/dates';
import { audienceLabel, audienceSize, LEVEL_LABEL, staffName } from '../lib/school';
import { visibleCourses } from '../lib/scope';
import type { Audience } from '../data/types';

export function Comunicados() {
  const { data, sendCommunication } = useApp();
  const user = useUser();
  const toast = useToast();
  const isDir = user.role === UserRole.DIRECTIVO;
  const courses = visibleCourses(user);

  // Preceptoría envía a sus cursos; Dirección a todo el colegio, un nivel o un curso.
  const audienceOptions: { value: string; label: string; a: Audience }[] = [
    ...(isDir ? [{ value: 'TODOS', label: 'Todo el colegio', a: { kind: 'TODOS' } as Audience }] : []),
    ...(isDir ? Object.values(EducationalLevel).map((l) => ({ value: `N-${l}`, label: LEVEL_LABEL[l], a: { kind: 'NIVEL', level: l } as Audience })) : []),
    ...courses.map((c) => ({ value: `C-${c.id}`, label: c.name, a: { kind: 'CURSO', courseId: c.id } as Audience })),
  ];
  const [aud, setAud] = useState(audienceOptions[0].value);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sign, setSign] = useState(false);

  const visible = data.communications.filter((c) => isDir || c.sentBy === user.id || (c.audience.kind === 'CURSO' && courses.some((x) => x.id === (c.audience as { courseId: string }).courseId)));

  function submit(e: FormEvent) {
    e.preventDefault();
    const audience = audienceOptions.find((o) => o.value === aud)!.a;
    sendCommunication({ title: title.trim(), body: body.trim(), audience, requiresSignature: sign, recipients: audienceSize(audience, data.students) });
    setTitle('');
    setBody('');
    setSign(false);
    toast.show('Comunicado enviado a las familias');
  }

  return (
    <>
      <PageHead eyebrow="Comunicación institucional" title="Comunicados oficiales" sub="De la escuela a las familias, sin respuestas desordenadas. Ves en vivo quién leyó y quién firmó." />
      <div className="grid g-main">
        <div className="stack" style={{ gap: 14 }}>
          {visible.map((c) => {
            const readPct = Math.round((c.read / c.recipients) * 100);
            const signPct = Math.round((c.signed / c.recipients) * 100);
            return (
              <div className="card" key={c.id}>
                <div className="row" style={{ alignItems: 'flex-start' }}>
                  <span className={`icon-box ${c.requiresSignature ? 'red' : 'celeste'}`}>{c.requiresSignature ? <PenLine /> : <Bell />}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="row wrap" style={{ gap: 6 }}>
                      <b style={{ fontSize: 15 }}>{c.title}</b>
                      {c.requiresSignature && <span className="pill red">Requiere firma</span>}
                    </div>
                    <div className="sub">{audienceLabel(c.audience)} · {staffName(c.sentBy)} · {relative(c.sentAt)}</div>
                    <p style={{ marginTop: 6, color: 'var(--fg2)' }}>{c.body}</p>
                  </div>
                </div>
                <div className={`grid ${c.requiresSignature ? 'g-2' : ''}`} style={{ marginTop: 12 }}>
                  <div>
                    <div className="row between"><span className="sub">Leído</span><b>{c.read} / {c.recipients} · {readPct}%</b></div>
                    <div className="bar" style={{ marginTop: 6 }}><i style={{ width: `${readPct}%` }} /></div>
                  </div>
                  {c.requiresSignature && (
                    <div>
                      <div className="row between"><span className="sub">Firmado</span><b>{c.signed} / {c.recipients} · {signPct}%</b></div>
                      <div className="bar" style={{ marginTop: 6 }}><i style={{ width: `${signPct}%`, background: 'var(--celeste-dk)' }} /></div>
                    </div>
                  )}
                </div>
                {c.read < c.recipients && (
                  <div className="row" style={{ justifyContent: 'flex-end', marginTop: 10 }}>
                    <button className="btn sm" onClick={() => toast.show(`Recordatorio enviado a ${c.recipients - (c.requiresSignature ? c.signed : c.read)} familias`)}>Enviar recordatorio</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <form className="card stack" onSubmit={submit} style={{ alignSelf: 'start' }}>
          <div className="card-head" style={{ marginBottom: 0 }}><h2>Nuevo comunicado</h2></div>
          <div className="field">
            <label htmlFor="para">Para</label>
            <select id="para" className="select" value={aud} onChange={(e) => setAud(e.target.value)}>
              {audienceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <span className="sub">{audienceSize(audienceOptions.find((o) => o.value === aud)!.a, data.students)} familias</span>
          </div>
          <div className="field">
            <label htmlFor="titulo">Título</label>
            <input id="titulo" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej.: Acto del 25 de Mayo" />
          </div>
          <div className="field">
            <label htmlFor="cuerpo">Mensaje</label>
            <textarea id="cuerpo" className="textarea" value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
          <label className="row" style={{ gap: 8, fontSize: 13, fontWeight: 600 }}>
            <input id="firma" type="checkbox" checked={sign} onChange={(e) => setSign(e.target.checked)} /> Pedir firma digital (salidas, uso de imagen)
          </label>
          <button className="btn primary" type="submit" disabled={!title.trim() || !body.trim()}><Send /> Enviar comunicado</button>
        </form>
      </div>
      {toast.node}
    </>
  );
}
