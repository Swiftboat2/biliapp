import { useState } from 'react';
import { CalendarDays, CheckSquare, ChevronRight, GraduationCap, PenLine, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../data/store';
import { ASSIGNMENTS, FAMILY } from '../data/mock';
import { daysUntil, shortDate, timeOf, todayISO } from '../lib/dates';
import { conceptFor, course, LEVEL_LABEL, SHIFT_LABEL, sheetKey, staffName, subject, totalAbsences } from '../lib/school';
import { fmtNota, instancesFor, partialGrade } from '../lib/grades';
import { attendancePct, Hero, HScroll, isKinder, kidInitials, pendingSignatures, useKids, type Go } from './parts';
import type { Mark } from '../data/types';

const TODAY_LABEL: Record<Mark, { title: string; sub: string; tone: 'green' | 'red' | 'blue'; pill: string }> = {
  P: { title: 'Puntual', sub: 'Ingreso registrado en puerta', tone: 'blue', pill: 'Presente ✓' },
  T: { title: 'Falta parcial', sub: 'Ingreso posterior al horario', tone: 'red', pill: 'Tardanza (¼)' },
  A: { title: 'Ausente', sub: 'Podés enviar el certificado desde Asistencia', tone: 'red', pill: 'Ausente (1)' },
  R: { title: 'Retiro anticipado', sub: 'Se retiró antes de hora', tone: 'blue', pill: 'Retiro (½)' },
};

export function FamInicio({ go }: { go: Go }) {
  const { data } = useApp();
  const kids = useKids();
  const [active, setActive] = useState(kids[0].s.id);
  const today = todayISO();

  const kidClasses = ASSIGNMENTS.filter((a) => kids.some((k) => k.s.courseId === a.courseId));
  const events = [
    ...data.evaluations
      .filter((e) => kidClasses.some((a) => a.id === e.assignmentId) && daysUntil(e.date) >= 0)
      .map((e) => {
        const a = ASSIGNMENTS.find((x) => x.id === e.assignmentId)!;
        const k = kids.find((x) => x.s.courseId === a.courseId)!;
        return { id: e.id, date: e.date, title: `${e.kind}: ${e.title}`, who: `${k.s.firstName} · ${subject(a.subjectId).name}`, tone: k.color === 'green' ? 'yellow' : 'blue' };
      }),
    { id: 'ev-fam', date: today.slice(0, 8) + '17', title: 'Reunión de padres y balance pedagógico', who: 'Toda la familia', tone: 'green' },
  ]
    .filter((e) => daysUntil(e.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  // Notas recientes: últimas instancias parciales con nota de cada hijo.
  const recent = kids
    .flatMap((k) =>
      ASSIGNMENTS.filter((a) => a.courseId === k.s.courseId).flatMap((a) =>
        data.periods.flatMap((p) =>
          instancesFor(data, a.id, p.id)
            .map((i) => ({ k, a, i, g: partialGrade(data, i.id, k.s.id) }))
            .filter((x) => x.g !== null),
        ),
      ),
    )
    .sort((x, y) => y.i.date.localeCompare(x.i.date))
    .slice(0, 3);

  const toSign = pendingSignatures(data, kids.map((k) => k.s));
  const observations = data.observations.filter((o) => o.visibleToFamily && FAMILY.studentIds.includes(o.studentId)).slice(0, 2);

  return (
    <>
      <Hero title={`¡Hola, Familia ${FAMILY.lastName}! 👋`} go={go} />
      <div className="fam-body" style={{ marginTop: -4 }}>
        <div className="kid-stack">
          {kids.map((k) => {
            const sheet = data.attendance[sheetKey(k.s.courseId, today)];
            const mark = sheet?.marks[k.s.id];
            const c = course(k.s.courseId);
            return (
              <button key={k.s.id} className={`fam-card tap kid-card ${k.color}${active === k.s.id ? ' active' : ''}`} onClick={() => setActive(k.s.id)}>
                <span className="accent" style={{ background: k.color === 'green' ? 'var(--primary)' : 'var(--celeste-dk)' }} />
                <div className="fam-row" style={{ marginTop: 2 }}>
                  <span className={`kid-av ${k.color}`}>{kidInitials(k.s)}</span>
                  <div className="fam-grow">
                    <div className="fam-row between">
                      <span className="fam-title" style={{ fontSize: 14.5 }}>{k.s.firstName} {k.s.lastName}</span>
                      <span className={`fam-pill ${k.color}`}>{attendancePct(totalAbsences(k.s, data))}% ASIST.</span>
                    </div>
                    <div className="fam-sub">{c.name} · {LEVEL_LABEL[c.level]}</div>
                  </div>
                </div>
                <div className="kid-strip">
                  <span className="fam-row" style={{ gap: 6 }}><GraduationCap size={13} /> {SHIFT_LABEL[c.shift]}</span>
                  <b style={{ color: !mark ? 'var(--fg3)' : mark === 'A' ? 'var(--red-tx)' : 'var(--primary-dk)' }}>
                    {!mark ? 'SIN REGISTRO AÚN' : mark === 'A' ? 'AUSENTE HOY' : mark === 'T' ? 'LLEGÓ TARDE' : mark === 'R' ? 'SE RETIRÓ' : 'PRESENTE HOY'}
                  </b>
                </div>
              </button>
            );
          })}
        </div>

        {toSign.length > 0 && (
          <button className="fam-card tap" onClick={() => go('archivos')} style={{ background: 'var(--red-lt)', borderColor: 'var(--red-bd)' }}>
            <div className="fam-row">
              <span className="ibox red" style={{ background: '#fff' }}><PenLine /></span>
              <div className="fam-grow">
                <div className="fam-title">{toSign.length === 1 ? 'Autorización pendiente' : `${toSign.length} autorizaciones pendientes`}</div>
                <div className="fam-sub" style={{ color: 'var(--red-tx)', fontWeight: 600 }}>{toSign[0].title} · Firmar con PIN</div>
              </div>
              <ChevronRight size={18} color="var(--muted)" />
            </div>
          </button>
        )}

        <section className="fam-section">
          <div className="fam-sec-head"><span className="fam-sec-title dot">Próximos eventos</span></div>
          <HScroll>
            {events.map((e) => (
              <div key={e.id} className={`event-card ${e.tone}`}>
                <span className="fam-pill white" style={{ alignSelf: 'flex-start' }}><GraduationCap /> {e.who}</span>
                <span className="fam-title" style={{ lineHeight: 1.3 }}>{e.title}</span>
                <span className="date"><CalendarDays size={11} style={{ verticalAlign: -1 }} /> {shortDate(e.date)}</span>
              </div>
            ))}
          </HScroll>
        </section>

        <section className="fam-section">
          <div>
            <span className="fam-sec-title">¿Qué pasó hoy?</span>
            <div className="fam-sub">Asistencia y novedades del día de {kids.map((k) => k.s.firstName).join(' y ')}</div>
          </div>
          <div className="dual">
            {kids.map((k) => {
              const sheet = data.attendance[sheetKey(k.s.courseId, today)];
              const mark = sheet?.marks[k.s.id];
              const info = mark ? TODAY_LABEL[mark] : null;
              return (
                <button key={k.s.id} className={`fam-card tap ${info ? info.tone : 'gray'}`} onClick={() => go('asistencia')} style={{ display: 'flex', flexDirection: 'column', gap: 3, minHeight: 120, padding: 11, background: info?.tone === 'red' ? 'var(--red-lt)' : info ? 'var(--celeste-lt)' : '#fff', borderColor: info?.tone === 'red' ? 'var(--red-bd)' : info ? 'var(--celeste-bd)' : 'var(--line)' }}>
                  <div className="fam-row between"><span className={`fam-pill ${info?.tone === 'red' ? 'red' : 'celeste'}`}>{k.s.firstName}</span><span className="fam-sub">{sheet ? `${timeOf(sheet.takenAt)} hs` : ''}</span></div>
                  <span className="fam-title">{info ? info.title : 'Sin registro'}</span>
                  <span className="fam-sub">{info ? info.sub : 'Todavía no se tomó asistencia hoy'}</span>
                  {info && <span className="fam-pill white" style={{ marginTop: 'auto', alignSelf: 'flex-start', color: info.tone === 'red' ? 'var(--red-tx)' : 'var(--celeste-dk)' }}>{info.pill} ›</span>}
                </button>
              );
            })}
          </div>
        </section>

        <section className="fam-section">
          <div className="fam-sec-head">
            <span className="fam-sec-title">Notas parciales</span>
            <button className="fam-link" onClick={() => go('archivos')}>Ver boletines →</button>
          </div>
          {recent.length === 0 && <p className="fam-sub">Todavía no hay notas cargadas.</p>}
          {recent.map(({ k, a, i, g }) => (
            <div key={i.id + k.s.id} className="fam-card">
              <div className="fam-row">
                <span className={`ibox ${k.color}`}><Sparkles /></span>
                <div className="fam-grow">
                  <div className="fam-row" style={{ gap: 6 }}><span className={`fam-pill ${k.color}`}>{k.s.firstName} · {course(a.courseId).name}</span><span className="fam-sub">{shortDate(i.date)}</span></div>
                  <div className="fam-title" style={{ marginTop: 2 }}>{subject(a.subjectId).name}</div>
                  <div className="fam-sub">{i.kind}: {i.title}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span className={`score ${g! >= 6 ? k.color : 'red'}`}>{fmtNota(g)}</span>
                  <div style={{ fontSize: 8.5, fontWeight: 800, textTransform: 'uppercase', marginTop: 2, color: 'var(--fg3)' }}>{conceptFor(g!)}</div>
                </div>
              </div>
            </div>
          ))}
          {kids.filter((k) => isKinder(k.s)).map((k) => (
            <div key={k.s.id} className="fam-card">
              <div className="fam-row" style={{ alignItems: 'flex-start' }}>
                <span className="ibox green"><Sparkles /></span>
                <div className="fam-grow">
                  <span className="fam-pill green">{k.s.firstName} · {course(k.s.courseId).name}</span>
                  <div className="fam-title" style={{ marginTop: 4 }}>Informe de Jardín</div>
                  <div className="fam-text">En Nivel Inicial no hay notas numéricas: el informe de desarrollo llega en Archivos.</div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {observations.length > 0 && (
          <section className="fam-section">
            <span className="fam-sec-title">Comentarios de docentes</span>
            {observations.map((o) => {
              const k = kids.find((x) => x.s.id === o.studentId)!;
              return (
                <div key={o.id} className="fam-card">
                  <div className="fam-row" style={{ gap: 6 }}><span className={`fam-pill ${k.color}`}>{k.s.firstName}</span><span className="fam-pill gray">{o.kind}</span><span className="fam-sub">{shortDate(o.date)}</span></div>
                  <p className="fam-text" style={{ marginTop: 6 }}>{o.text}</p>
                  <div className="fam-sub" style={{ marginTop: 4 }}>{staffName(o.authorId)}</div>
                </div>
              );
            })}
          </section>
        )}

        <section className="fam-section">
          <button className="fam-card tap" onClick={() => go('asistencia')}>
            <div className="fam-row">
              <span className="ibox green"><CheckSquare /></span>
              <div className="fam-grow"><div className="fam-title">Control de asistencia</div><div className="fam-sub">Registro diario, tardanzas y justificativos</div></div>
              <ChevronRight size={18} color="var(--muted)" />
            </div>
          </button>
          <button className="fam-card tap" onClick={() => go('retiros')}>
            <div className="fam-row">
              <span className="ibox celeste"><ShieldCheck /></span>
              <div className="fam-grow"><div className="fam-title">Retiro seguro</div><div className="fam-sub">Pase QR, autorizados y permisos del día</div></div>
              <ChevronRight size={18} color="var(--muted)" />
            </div>
          </button>
        </section>
      </div>
    </>
  );
}
