export function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const todayISO = () => isoDate(new Date());

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

const fmtLong = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
const fmtShort = new Intl.DateTimeFormat('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
const fmtTime = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' });

const parseISO = (iso: string) => (iso.length === 10 ? new Date(iso + 'T12:00:00') : new Date(iso));

export const longDate = (iso: string) => capitalize(fmtLong.format(parseISO(iso)));
export const shortDate = (iso: string) => capitalize(fmtShort.format(parseISO(iso)));
export const timeOf = (iso: string) => fmtTime.format(new Date(iso));
/** Hora en formato 24 h ("07:21"), para actas y firmas. */
export const hhmm = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export function relative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60_000);
  if (min < 1) return 'recién';
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? 'ayer' : `hace ${d} días`;
}

export function daysUntil(iso: string): number {
  return Math.round((parseISO(iso).getTime() - parseISO(todayISO()).getTime()) / 86_400_000);
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Horario de silencio: mensajes entre 20:00 y 07:30 se notifican a las 07:30. */
export function isQuietHours(iso: string): boolean {
  const d = new Date(iso);
  const mins = d.getHours() * 60 + d.getMinutes();
  return mins >= 20 * 60 || mins < 7 * 60 + 30;
}
