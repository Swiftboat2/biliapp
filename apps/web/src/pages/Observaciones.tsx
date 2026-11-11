import { useState, type FormEvent } from 'react';
import { UserRole } from '@biliapp/shared-types';
import { Eye, EyeOff, Plus } from 'lucide-react';
import { useApp, useUser } from '../data/store';
import { Empty, PageHead, useToast } from '../components/ui';
import { shortDate } from '../lib/dates';
import { course, displayName, findStudent, fullName, staffName, studentInitials } from '../lib/school';
import { visibleStudents } from '../lib/scope';
import type { Observation } from '../data/types';

const KIND_PILL: Record<Observation['kind'], string> = { Logro: 'green', Desempeño: 'amber', Conducta: 'red' };

export function Observaciones() {
  const { data, addObservation } = useApp();
  const user = useUser();
  const toast = useToast();
  const isTeacher = user.role === UserRole.DOCENTE;
  const students = visibleStudents(user, data).sort((a, b) => a.lastName.localeCompare(b.lastName, 'es'));
  const ids = new Set(students.map((s) => s.id));
  const list = data.observations.filter((o) => ids.has(o.studentId) && (!isTeacher || o.authorId === user.id));

  const [studentId, setStudentId] = useState(students[0]?.id ?? '');
  const [kind, setKind] = useState<Observation['kind']>('Desempeño');
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(true);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    addObservation({ studentId, kind, text: text.trim(), visibleToFamily: visible });
    setText('');
    toast.show(visible ? 'Observación guardada · la familia la ve en la app' : 'Observación guardada · solo la ve el equipo');
  }

  return (
    <>
      <PageHead eyebrow="Seguimiento" title="Observaciones pedagógicas" sub="Notas de conducta o desempeño. Elegís si la familia las ve o quedan para el equipo." />
      <div className="grid g-main">
        <div className="card">
          <div className="card-head"><h2>{isTeacher ? 'Mis observaciones' : 'Observaciones de los docentes'}</h2></div>
          {list.length === 0 && <Empty title="Todavía no hay observaciones" />}
          {list.map((o) => {
            const s = findStudent(data, o.studentId);
            return (
              <div className="list-row" key={o.id} style={{ alignItems: 'flex-start' }}>
                <span className="avatar">{studentInitials(s)}</span>
                <div className="grow">
                  <div className="row wrap" style={{ gap: 6 }}>
                    <b style={{ display: 'inline' }}>{displayName(s)}</b>
                    <span className={`pill ${KIND_PILL[o.kind]}`}>{o.kind}</span>
                    <span className="pill gray">{o.visibleToFamily ? <><Eye /> Familia</> : <><EyeOff /> Solo equipo</>}</span>
                  </div>
                  <p style={{ marginTop: 4 }}>{o.text}</p>
                  <span className="sub">{course(s.courseId).name} · {staffName(o.authorId)} · {shortDate(o.date)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {isTeacher && (
          <form className="card stack" onSubmit={submit}>
            <div className="card-head" style={{ marginBottom: 0 }}><h2>Nueva observación</h2></div>
            <div className="field">
              <label htmlFor="obs-alumno">Alumno</label>
              <select id="obs-alumno" className="select" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                {students.map((s) => <option key={s.id} value={s.id}>{fullName(s)} · {course(s.courseId).name}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="obs-tipo">Tipo</label>
              <select id="obs-tipo" className="select" value={kind} onChange={(e) => setKind(e.target.value as Observation['kind'])}>
                <option>Logro</option><option>Desempeño</option><option>Conducta</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="obs-texto">Observación</label>
              <textarea id="obs-texto" className="textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="Qué pasó y, si corresponde, qué se acordó." />
            </div>
            <label className="row" style={{ gap: 8, fontSize: 13, fontWeight: 600 }}>
              <input id="obs-visible" type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} /> Visible para la familia en la app
            </label>
            <button className="btn primary" type="submit" disabled={!text.trim()}><Plus /> Guardar observación</button>
          </form>
        )}
      </div>
      {toast.node}
    </>
  );
}
