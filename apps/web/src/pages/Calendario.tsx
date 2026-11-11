import { useState, type FormEvent } from 'react';
import { UserRole } from '@biliapp/shared-types';
import { CalendarPlus, CalendarDays } from 'lucide-react';
import { useApp, useUser } from '../data/store';
import { ASSIGNMENTS } from '../data/mock';
import { Empty, PageHead, useToast } from '../components/ui';
import { addDays, daysUntil, isoDate, longDate, todayISO } from '../lib/dates';
import { course, staffName, subject } from '../lib/school';
import { myAssignments, visibleCourses } from '../lib/scope';
import type { Evaluation } from '../data/types';

const KIND_PILL: Record<Evaluation['kind'], string> = { Examen: 'red', Oral: 'celeste', 'Trabajo práctico': 'amber', Entrega: 'green' };

export function Calendario() {
  const { data, addEvaluation } = useApp();
  const user = useUser();
  const toast = useToast();
  const isTeacher = user.role === UserRole.DOCENTE;
  const courseIds = new Set(visibleCourses(user).map((c) => c.id));
  const classes = myAssignments(user);

  const upcoming = data.evaluations
    .filter((e) => courseIds.has(ASSIGNMENTS.find((a) => a.id === e.assignmentId)!.courseId) && daysUntil(e.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date));
  const byDay = upcoming.reduce<Record<string, Evaluation[]>>((acc, e) => ((acc[e.date] ??= []).push(e), acc), {});

  const [classId, setClassId] = useState(classes[0]?.id ?? '');
  const [date, setDate] = useState(isoDate(addDays(new Date(), 7)));
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<Evaluation['kind']>('Examen');
  const clash = upcoming.filter((e) => e.date === date && ASSIGNMENTS.find((a) => a.id === e.assignmentId)!.courseId === classes.find((a) => a.id === classId)?.courseId);

  function submit(e: FormEvent) {
    e.preventDefault();
    addEvaluation({ assignmentId: classId, date, title: title.trim(), kind });
    setTitle('');
    toast.show('Evaluación publicada · las familias la ven en la app');
  }

  return (
    <>
      <PageHead eyebrow="Calendario de evaluaciones" title="Calendario" sub="Fechas de exámenes y entregas. Es público para familias y alumnos." />
      <div className={`grid ${isTeacher ? 'g-main' : ''}`}>
        <div className="card">
          {upcoming.length === 0 && <Empty title="No hay evaluaciones próximas" />}
          {Object.entries(byDay).map(([day, list]) => (
            <div key={day} style={{ marginBottom: 14 }}>
              <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                <CalendarDays size={16} color="var(--primary)" />
                <b>{longDate(day)}</b>
                <span className="sub">{daysUntil(day) === 0 ? 'hoy' : daysUntil(day) === 1 ? 'mañana' : `en ${daysUntil(day)} días`}</span>
              </div>
              {list.map((e) => {
                const a = ASSIGNMENTS.find((x) => x.id === e.assignmentId)!;
                return (
                  <div className="list-row" key={e.id} style={{ paddingLeft: 24 }}>
                    <div className="grow"><b>{e.title}</b><span className="sub">{course(a.courseId).name} · {subject(a.subjectId).name} · {staffName(a.teacherId)}</span></div>
                    <span className={`pill ${KIND_PILL[e.kind]}`}>{e.kind}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {isTeacher && (
          <form className="card stack" onSubmit={submit} style={{ alignSelf: 'start' }}>
            <div className="card-head" style={{ marginBottom: 0 }}><h2>Agendar evaluación</h2></div>
            <div className="field">
              <label htmlFor="cal-clase">Clase</label>
              <select id="cal-clase" className="select" value={classId} onChange={(e) => setClassId(e.target.value)}>
                {classes.map((a) => <option key={a.id} value={a.id}>{course(a.courseId).name} · {subject(a.subjectId).name}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="cal-fecha">Fecha</label>
              <input id="cal-fecha" type="date" className="input" min={todayISO()} value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />
              {clash.length > 0 && <span className="pill amber" style={{ alignSelf: 'flex-start' }}>Ese día el curso ya tiene: {clash.map((c) => c.title).join(', ')}</span>}
            </div>
            <div className="field">
              <label htmlFor="cal-titulo">Título</label>
              <input id="cal-titulo" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej.: Evaluación de verbos" />
            </div>
            <div className="field">
              <label htmlFor="cal-tipo">Tipo</label>
              <select id="cal-tipo" className="select" value={kind} onChange={(e) => setKind(e.target.value as Evaluation['kind'])}>
                <option>Examen</option><option>Oral</option><option>Trabajo práctico</option><option>Entrega</option>
              </select>
            </div>
            <button className="btn primary" type="submit" disabled={!title.trim()}><CalendarPlus /> Publicar fecha</button>
          </form>
        )}
      </div>
      {toast.node}
    </>
  );
}
