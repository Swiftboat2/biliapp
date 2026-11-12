import { useMemo, useState } from 'react';
import { useApp } from '../data/store';
import { CalendarView } from '../components/CalendarView';
import { calendarItems, forCourses, type CalItem } from '../lib/calendar';
import { Hero, useKids, type Go } from './parts';

/** Calendario de la familia: lo que carga el colegio para los cursos de sus hijos. */
export function FamCalendario({ go }: { go: Go }) {
  const { data } = useApp();
  const kids = useKids();
  const [filter, setFilter] = useState<'todos' | string>('todos');

  const items = useMemo(() => {
    const courseIds = kids.filter((k) => filter === 'todos' || k.s.id === filter).map((k) => k.s.courseId);
    return forCourses(calendarItems(data), courseIds);
  }, [data, kids, filter]);

  const tag = (i: CalItem) => {
    const affected = kids.filter((k) => i.courseIds.includes(k.s.courseId));
    if (affected.length === kids.length) return <span className="fam-pill gray">Toda la familia</span>;
    return affected.map((k) => <span key={k.s.id} className={`fam-pill ${k.color}`}>{k.s.firstName}</span>);
  };

  return (
    <>
      <Hero title="Calendario" context="ACTOS · EVALUACIONES · FERIADOS" onBack={() => go('inicio')} go={go} />
      <div className="fam-body">
        <div className="fam-seg">
          <button className={filter === 'todos' ? 'on green' : ''} onClick={() => setFilter('todos')}>Toda la familia</button>
          {kids.map((k) => <button key={k.s.id} className={filter === k.s.id ? `on ${k.color}` : ''} onClick={() => setFilter(k.s.id)}>{k.s.firstName}</button>)}
        </div>
        <CalendarView items={items} compact tag={tag} />
      </div>
    </>
  );
}
