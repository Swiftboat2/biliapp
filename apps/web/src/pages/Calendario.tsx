import { useMemo, useState, type FormEvent } from 'react';
import { UserRole, EducationalLevel } from '@biliapp/shared-types';
import { CalendarPlus, Plus, X } from 'lucide-react';
import { useApp, useUser } from '../data/store';
import { ASSIGNMENTS } from '../data/mock';
import { PageHead, useToast } from '../components/ui';
import { CalendarView } from '../components/CalendarView';
import { addDays, isoDate, todayISO } from '../lib/dates';
import { calendarItems, forCourses, type CalItem } from '../lib/calendar';
import { course, LEVEL_LABEL, subject } from '../lib/school';
import { myAssignments, visibleCourses } from '../lib/scope';
import type { Audience, Evaluation, EventKind } from '../data/types';

/** Calendario escolar completo: lo ve todo el personal y lo cargan Dirección, Preceptoría (eventos) y Docentes (evaluaciones). */
export function Calendario() {
  const { data, addEvaluation, addEvent, deleteEvent } = useApp();
  const user = useUser();
  const toast = useToast();
  const isTeacher = user.role === UserRole.DOCENTE;
  const isDir = user.role === UserRole.DIRECTIVO;
  const courses = visibleCourses(user);
  const [filter, setFilter] = useState('todos');
  const [adding, setAdding] = useState(false);

  const items = useMemo(() => {
    const all = calendarItems(data);
    const ids = filter === 'todos' ? courses.map((c) => c.id) : [filter];
    return forCourses(all, ids);
  }, [data, filter, courses]);

  const canDelete = (i: CalItem) => {
    if (i.source === 'evento') return isDir || i.createdBy === user.id;
    const ev = data.evaluations.find((e) => e.id === i.id);
    return !!ev && ASSIGNMENTS.find((a) => a.id === ev.assignmentId)?.teacherId === user.id;
  };
  const onDelete = (i: CalItem) => {
    if (!window.confirm(`¿Eliminar "${i.title}" del calendario?`)) return;
    if (i.source === 'evento') deleteEvent(i.id);
    else toast.show('Las evaluaciones se quitan desde la planilla del docente');
  };

  return (
    <>
      <PageHead
        eyebrow="Calendario escolar"
        title="Calendario"
        sub="Actos, reuniones, salidas, feriados y evaluaciones. Lo que se carga acá les llega a las familias que corresponde."
        actions={
          <>
            {courses.length > 1 && (
              <select aria-label="Curso" className="select" style={{ width: 'auto' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="todos">{isDir ? 'Todo el colegio' : 'Todos mis cursos'}</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
            <button className="btn primary" onClick={() => setAdding((v) => !v)}>
              {adding ? <><X /> Cerrar</> : <><Plus /> {isTeacher ? 'Agendar evaluación' : 'Nuevo evento'}</>}
            </button>
          </>
        }
      />

      {adding && (isTeacher ? (
        <EvaluationForm
          onSave={(e) => { addEvaluation(e); setAdding(false); toast.show('Evaluación publicada · las familias la ven en la app'); }}
          clashes={(assignmentId, date) => {
            const courseId = ASSIGNMENTS.find((a) => a.id === assignmentId)?.courseId;
            return calendarItems(data).filter((i) => i.kind === 'Evaluación' && i.date === date && courseId && i.courseIds.includes(courseId)).map((i) => i.title);
          }}
        />
      ) : (
        <EventForm onSave={(e) => { addEvent(e); setAdding(false); toast.show('Evento agendado · las familias lo ven en la app'); }} />
      ))}

      <div className="card">
        <CalendarView items={items} canDelete={canDelete} onDelete={onDelete} />
      </div>
      {toast.node}
    </>
  );
}

function EvaluationForm({ onSave, clashes }: { onSave: (e: Omit<Evaluation, 'id'>) => void; clashes: (assignmentId: string, date: string) => string[] }) {
  const user = useUser();
  const classes = myAssignments(user);
  const [classId, setClassId] = useState(classes[0]?.id ?? '');
  const [date, setDate] = useState(isoDate(addDays(new Date(), 7)));
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<Evaluation['kind']>('Examen');
  const clash = clashes(classId, date);
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ assignmentId: classId, date, title: title.trim(), kind });
  }
  return (
    <form className="card" onSubmit={submit}>
      <div className="card-head"><h2>Agendar evaluación</h2></div>
      <div className="row wrap" style={{ gap: 12, alignItems: 'flex-end' }}>
        <div className="field" style={{ flex: '1 1 220px' }}>
          <label htmlFor="ev-clase">Clase</label>
          <select id="ev-clase" className="select" value={classId} onChange={(e) => setClassId(e.target.value)}>
            {classes.map((a) => <option key={a.id} value={a.id}>{course(a.courseId).name} · {subject(a.subjectId).name}</option>)}
          </select>
        </div>
        <div className="field" style={{ flex: '2 1 220px' }}>
          <label htmlFor="ev-title">Título</label>
          <input id="ev-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej.: Evaluación de verbos" />
        </div>
        <div className="field">
          <label htmlFor="ev-kind">Tipo</label>
          <select id="ev-kind" className="select" value={kind} onChange={(e) => setKind(e.target.value as Evaluation['kind'])}>
            <option>Examen</option><option>Oral</option><option>Trabajo práctico</option><option>Entrega</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="ev-date">Fecha</label>
          <input id="ev-date" type="date" className="input" min={todayISO()} value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />
        </div>
        <button className="btn primary" type="submit" disabled={!title.trim()}><CalendarPlus /> Publicar fecha</button>
      </div>
      {clash.length > 0 && <p className="pill amber" style={{ marginTop: 10, display: 'inline-flex' }}>Ese día el curso ya tiene: {clash.join(', ')}</p>}
    </form>
  );
}

function EventForm({ onSave }: { onSave: (e: { title: string; kind: EventKind; date: string; endDate?: string; time?: string; detail?: string; audience: Audience }) => void }) {
  const user = useUser();
  const isDir = user.role === UserRole.DIRECTIVO;
  const courses = visibleCourses(user);
  const audiences: { value: string; label: string; a: Audience }[] = [
    ...(isDir ? [{ value: 'TODOS', label: 'Todo el colegio', a: { kind: 'TODOS' } as Audience }] : []),
    ...(isDir ? Object.values(EducationalLevel).map((l) => ({ value: `N-${l}`, label: LEVEL_LABEL[l], a: { kind: 'NIVEL', level: l } as Audience })) : []),
    ...courses.map((c) => ({ value: `C-${c.id}`, label: c.name, a: { kind: 'CURSO', courseId: c.id } as Audience })),
  ];
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<EventKind>('Acto');
  const [date, setDate] = useState(isoDate(addDays(new Date(), 7)));
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('');
  const [aud, setAud] = useState(audiences[0].value);
  const [detail, setDetail] = useState('');
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(), kind, date,
      endDate: endDate && endDate > date ? endDate : undefined,
      time: time || undefined,
      detail: detail.trim() || undefined,
      audience: audiences.find((x) => x.value === aud)!.a,
    });
  }
  const kinds: EventKind[] = isDir ? ['Acto', 'Reunión', 'Salida', 'Institucional', 'Feriado'] : ['Acto', 'Reunión', 'Salida', 'Institucional'];
  return (
    <form className="card" onSubmit={submit}>
      <div className="card-head"><h2>Nuevo evento</h2></div>
      <div className="row wrap" style={{ gap: 12, alignItems: 'flex-end' }}>
        <div className="field" style={{ flex: '2 1 240px' }}>
          <label htmlFor="e-title">Título</label>
          <input id="e-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej.: Acto del Día de la Tradición" />
        </div>
        <div className="field">
          <label htmlFor="e-kind">Tipo</label>
          <select id="e-kind" className="select" value={kind} onChange={(e) => setKind(e.target.value as EventKind)}>
            {kinds.map((k) => <option key={k}>{k}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="e-aud">Para</label>
          <select id="e-aud" className="select" value={aud} onChange={(e) => setAud(e.target.value)}>
            {audiences.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
        </div>
      </div>
      <div className="row wrap" style={{ gap: 12, alignItems: 'flex-end', marginTop: 12 }}>
        <div className="field">
          <label htmlFor="e-date">Fecha</label>
          <input id="e-date" type="date" className="input" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="e-end">Hasta (opcional)</label>
          <input id="e-end" type="date" className="input" min={date} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="e-time">Hora (opcional)</label>
          <input id="e-time" type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div className="field" style={{ flex: '2 1 240px' }}>
          <label htmlFor="e-detail">Detalle (opcional)</label>
          <input id="e-detail" className="input" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Ej.: En el SUM. Traer bandera." />
        </div>
        <button className="btn primary" type="submit" disabled={!title.trim()}><CalendarPlus /> Agendar</button>
      </div>
    </form>
  );
}
