import { useMemo, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Clock, Trash2 } from 'lucide-react';
import { addDays, isoDate, longDate, shortDate, todayISO } from '../lib/dates';
import { KIND_COLOR, KINDS, MONTHS, monthGrid, occursOn, parseDay, weekDays, WEEKDAYS_SHORT, type CalItem, type CalKind } from '../lib/calendar';
import '../calendar.css';

export type CalViewMode = 'mes' | 'semana' | 'anio' | 'agenda';

interface Props {
  items: CalItem[];
  /** Versión para el celular (app de familias): puntos en vez de títulos en el mes. */
  compact?: boolean;
  canDelete?: (i: CalItem) => boolean;
  onDelete?: (i: CalItem) => void;
  /** Contenido extra al lado de cada evento (p. ej. el hijo al que corresponde). */
  tag?: (i: CalItem) => ReactNode;
}

/** Calendario escolar con vistas de mes, semana, año y agenda. */
export function CalendarView({ items, compact, canDelete, onDelete, tag }: Props) {
  const today = todayISO();
  const [view, setView] = useState<CalViewMode>('mes');
  const [cursor, setCursor] = useState(today);
  const [selected, setSelected] = useState(today);
  const [hidden, setHidden] = useState<CalKind[]>([]);

  const visible = useMemo(() => items.filter((i) => !hidden.includes(i.kind)), [items, hidden]);
  const on = (day: string) => visible.filter((i) => occursOn(i, day));
  const c = parseDay(cursor);

  function move(dir: 1 | -1) {
    const d = parseDay(cursor);
    if (view === 'mes') d.setMonth(d.getMonth() + dir, 1);
    else if (view === 'semana') d.setDate(d.getDate() + 7 * dir);
    else if (view === 'anio') d.setFullYear(d.getFullYear() + dir);
    else d.setDate(d.getDate() + 30 * dir);
    setCursor(isoDate(d));
  }

  const label =
    view === 'mes' ? `${MONTHS[c.getMonth()]} ${c.getFullYear()}`
    : view === 'anio' ? String(c.getFullYear())
    : view === 'semana' ? (() => { const w = weekDays(c); return `Semana del ${shortDate(w[0])} al ${shortDate(w[6])}`; })()
    : `Desde el ${shortDate(cursor)}`;

  const counts = (k: CalKind) => items.filter((i) => i.kind === k).length;

  return (
    <div className={`cal${compact ? ' compact' : ''}`}>
      <div className="cal-bar">
        <div className="cal-nav">
          <button className="cal-icon" aria-label="Anterior" onClick={() => move(-1)}><ChevronLeft size={18} /></button>
          <b className="cal-label">{label}</b>
          <button className="cal-icon" aria-label="Siguiente" onClick={() => move(1)}><ChevronRight size={18} /></button>
          <button className="cal-today" onClick={() => { setCursor(today); setSelected(today); }}>Hoy</button>
        </div>
        <div className="cal-views" role="tablist" aria-label="Vista del calendario">
          {([['mes', 'Mes'], ['semana', 'Semana'], ['anio', 'Año'], ['agenda', 'Agenda']] as [CalViewMode, string][]).map(([v, l]) => (
            <button key={v} role="tab" aria-selected={view === v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="cal-legend" aria-label="Filtrar por tipo">
        {KINDS.filter((k) => counts(k) > 0).map((k) => (
          <button key={k} className={`cal-kind ${KIND_COLOR[k]}${hidden.includes(k) ? ' off' : ''}`} aria-pressed={!hidden.includes(k)} onClick={() => setHidden((h) => (h.includes(k) ? h.filter((x) => x !== k) : [...h, k]))}>
            <i /> {k}
          </button>
        ))}
      </div>

      {view === 'mes' && (
        <>
          <div className="cal-month">
            {WEEKDAYS_SHORT.map((d) => <span key={d} className="cal-wd">{d}</span>)}
            {monthGrid(c.getFullYear(), c.getMonth()).map((day) => {
              const list = on(day);
              const d = parseDay(day);
              const out = d.getMonth() !== c.getMonth();
              const holiday = list.some((i) => i.kind === 'Feriado');
              const weekend = d.getDay() === 0 || d.getDay() === 6;
              return (
                <button
                  key={day}
                  className={`cal-day${out ? ' out' : ''}${day === today ? ' today' : ''}${day === selected ? ' sel' : ''}${holiday ? ' holiday' : ''}${weekend ? ' weekend' : ''}`}
                  onClick={() => setSelected(day)}
                  aria-label={`${longDate(day)}: ${list.length} eventos`}
                >
                  <span className="n">{d.getDate()}</span>
                  {compact ? (
                    <span className="dots">{list.slice(0, 4).map((i) => <i key={i.id} className={KIND_COLOR[i.kind]} />)}</span>
                  ) : (
                    <span className="chips">
                      {list.slice(0, 3).map((i) => <span key={i.id} className={`cal-chip ${KIND_COLOR[i.kind]}`}>{i.time ? `${i.time} ` : ''}{i.title}</span>)}
                      {list.length > 3 && <span className="more">+{list.length - 3} más</span>}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <DayList day={selected} items={on(selected)} canDelete={canDelete} onDelete={onDelete} tag={tag} />
        </>
      )}

      {view === 'semana' && (
        <div className="cal-week">
          {weekDays(c).map((day) => {
            const list = on(day);
            return (
              <div key={day} className={`cal-wcol${day === today ? ' today' : ''}`}>
                <div className="cal-whead"><span>{WEEKDAYS_SHORT[(parseDay(day).getDay() + 6) % 7]}</span><b>{parseDay(day).getDate()}</b></div>
                {list.length === 0 && <span className="cal-empty">—</span>}
                {list.map((i) => <Item key={i.id} i={i} canDelete={canDelete} onDelete={onDelete} tag={tag} small />)}
              </div>
            );
          })}
        </div>
      )}

      {view === 'anio' && (
        <div className="cal-year">
          {MONTHS.map((m, mi) => (
            <div key={m} className="cal-mini">
              <button className="cal-mini-title" onClick={() => { setCursor(isoDate(new Date(c.getFullYear(), mi, 1, 12))); setView('mes'); }}>
                {m} <span>{visible.filter((i) => parseDay(i.date).getFullYear() === c.getFullYear() && parseDay(i.date).getMonth() === mi).length || ''}</span>
              </button>
              <div className="cal-mini-grid">
                {WEEKDAYS_SHORT.map((d) => <span key={d} className="wd">{d[0]}</span>)}
                {monthGrid(c.getFullYear(), mi).map((day) => {
                  const d = parseDay(day);
                  if (d.getMonth() !== mi) return <span key={day} />;
                  const list = on(day);
                  const k = list[0]?.kind;
                  return (
                    <button
                      key={day}
                      className={`md${day === today ? ' today' : ''}${k ? ` has ${KIND_COLOR[k]}` : ''}`}
                      title={list.map((i) => i.title).join(' · ')}
                      onClick={() => { setCursor(day); setSelected(day); setView('mes'); }}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'agenda' && <Agenda from={cursor} items={visible} canDelete={canDelete} onDelete={onDelete} tag={tag} />}
    </div>
  );
}

function DayList({ day, items, canDelete, onDelete, tag }: { day: string; items: CalItem[] } & Pick<Props, 'canDelete' | 'onDelete' | 'tag'>) {
  return (
    <div className="cal-daylist">
      <b className="cal-daytitle">{longDate(day)}</b>
      {items.length === 0 ? <p className="cal-empty">Sin eventos este día.</p> : items.map((i) => <Item key={i.id} i={i} canDelete={canDelete} onDelete={onDelete} tag={tag} />)}
    </div>
  );
}

function Agenda({ from, items, canDelete, onDelete, tag }: { from: string; items: CalItem[] } & Pick<Props, 'canDelete' | 'onDelete' | 'tag'>) {
  const until = isoDate(addDays(parseDay(from), 60));
  const upcoming = items.filter((i) => (i.endDate ?? i.date) >= from && i.date <= until);
  const days = [...new Set(upcoming.map((i) => (i.date < from ? from : i.date)))].sort();
  if (days.length === 0) return <p className="cal-empty" style={{ padding: 16 }}>No hay eventos en los próximos 60 días.</p>;
  return (
    <div className="cal-agenda">
      {days.map((d) => (
        <div key={d} className="cal-agenda-day">
          <b className="cal-daytitle">{longDate(d)}</b>
          {upcoming.filter((i) => (i.date < from ? from : i.date) === d).map((i) => <Item key={i.id} i={i} canDelete={canDelete} onDelete={onDelete} tag={tag} />)}
        </div>
      ))}
      <p className="cal-empty">Próximos 60 días. Usá las flechas para ver más.</p>
    </div>
  );
}

function Item({ i, canDelete, onDelete, tag, small }: { i: CalItem; small?: boolean } & Pick<Props, 'canDelete' | 'onDelete' | 'tag'>) {
  return (
    <div className={`cal-item ${KIND_COLOR[i.kind]}${small ? ' small' : ''}`}>
      <div className="cal-item-main">
        <b>{i.title}</b>
        <span className="meta">
          {i.time && <><Clock size={11} /> {i.time} · </>}
          {i.endDate && i.endDate !== i.date ? `Del ${shortDate(i.date)} al ${shortDate(i.endDate)} · ` : ''}
          {i.who}
        </span>
        {!small && i.detail && <span className="detail">{i.detail}</span>}
        {(tag || !small) && (
          <span className="tags">
            {!small && <span className={`cal-kind ${KIND_COLOR[i.kind]} static`}><i /> {i.kind}</span>}
            {tag?.(i)}
          </span>
        )}
      </div>
      {canDelete?.(i) && onDelete && (
        <button className="cal-icon del" aria-label={`Eliminar ${i.title}`} title="Eliminar" onClick={() => onDelete(i)}><Trash2 size={14} /></button>
      )}
    </div>
  );
}
