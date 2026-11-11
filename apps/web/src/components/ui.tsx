import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';

export function PageHead({ eyebrow, title, sub, actions }: { eyebrow: string; title: string; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="page-head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {actions && <div className="row wrap">{actions}</div>}
    </header>
  );
}

export function Kpi({ label, value, of, note, color }: { label: string; value: ReactNode; of?: ReactNode; note?: ReactNode; color?: string }) {
  return (
    <div className="card kpi" style={{ ['--kc' as string]: color }}>
      <small>{label}</small>
      <div className="value">
        {value} {of !== undefined && <span>{of}</span>}
      </div>
      {note && <p>{note}</p>}
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <b>{title}</b>
      {children}
    </div>
  );
}

/** Aviso breve tras una acción ("Asistencia guardada"). */
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const show = useCallback((m: string) => {
    setMsg(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 2600);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const node = msg ? (
    <div className="toast" role="status">
      <CheckCircle2 /> {msg}
    </div>
  ) : null;
  return { show, node };
}

export function Tabs<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string }) {
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" role="tab" className="tab" aria-selected={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
