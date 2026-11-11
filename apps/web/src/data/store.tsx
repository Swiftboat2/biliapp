import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { buildInitialState, FAMILY, STAFF } from './mock';
import type {
  AttendanceSheet, Communication, DataState, Evaluation, GradeInstance, JustStatus, Observation, PickupPerson, StaffUser,
} from './types';

const DATA_KEY = 'biliapp-panel-data-v3';
const SESSION_KEY = 'biliapp-panel-session-v1';

function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function save(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento no disponible: el panel sigue funcionando en memoria */
  }
}

const uid = () => Math.random().toString(36).slice(2, 10);

interface AppContextValue {
  user: StaffUser | null;
  /** true cuando se está usando el simulador de la app de familias. */
  isFamily: boolean;
  signIn: (userId: string) => void;
  signOut: () => void;
  data: DataState;
  saveAttendance: (sheet: Omit<AttendanceSheet, 'takenBy' | 'takenAt'>) => void;
  reviewJustification: (id: string, status: JustStatus) => void;
  setPeriodStatus: (id: string, status: 'ABIERTO' | 'CERRADO', closesOn?: string) => void;
  setGrade: (key: string, value: string) => void;
  setPartial: (key: string, value: string) => void;
  addInstance: (i: Omit<GradeInstance, 'id'>) => void;
  deleteInstance: (id: string) => void;
  /** Carga varias notas de trimestre de una vez (p. ej. desde los promedios). */
  setGrades: (entries: Record<string, string>) => void;
  sendCommunication: (c: Omit<Communication, 'id' | 'sentBy' | 'sentAt' | 'read' | 'signed'>) => void;
  reply: (threadId: string, text: string) => void;
  markRead: (threadId: string) => void;
  addEvaluation: (e: Omit<Evaluation, 'id'>) => void;
  addObservation: (o: Omit<Observation, 'id' | 'authorId' | 'date'>) => void;
  recordPickup: (studentId: string, personId: string) => void;
  logAccess: (action: string) => void;
  resetDemo: () => void;

  /* ---- Acciones de la familia (simulador de la app) ---- */
  familyReadComm: (id: string) => void;
  familySign: (id: string) => void;
  submitJustification: (j: { studentId: string; forDate: string; dates: string; reason: string; fileName: string }) => void;
  addEventualPickup: (studentId: string, p: Omit<PickupPerson, 'id' | 'permanent' | 'createdBy'>) => void;
  familyReply: (threadId: string, text: string) => void;
  familyNewThread: (t: { studentId: string; staffId: string; subject: string; text: string }) => string;
  familyMarkRead: (threadId: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataState>(() => load<DataState>(DATA_KEY) ?? buildInitialState());
  const [userId, setUserId] = useState<string | null>(() => load<string>(SESSION_KEY));
  const user = STAFF.find((s) => s.id === userId) ?? null;
  const isFamily = userId === FAMILY.id;

  useEffect(() => save(DATA_KEY, data), [data]);
  useEffect(() => save(SESSION_KEY, userId), [userId]);

  const withAudit = useCallback(
    (action: string, fn: (d: DataState) => DataState) =>
      setData((d) => {
        const next = fn(d);
        if (!userId) return next;
        return { ...next, audit: [{ id: uid(), at: new Date().toISOString(), userId, action }, ...next.audit].slice(0, 200) };
      }),
    [userId],
  );

  const value = useMemo<AppContextValue>(() => {
    const me = userId ?? 'anon';
    const meName = user ? `${user.firstName} ${user.lastName}` : 'Personal';
    const famName = `${FAMILY.firstName} ${FAMILY.lastName}`;
    return {
      user,
      isFamily,
      data,
      signIn: (id) => setUserId(id),
      signOut: () => setUserId(null),

      saveAttendance: (sheet) =>
        withAudit(`Asistencia guardada (${sheet.key})`, (d) => ({
          ...d,
          attendance: { ...d.attendance, [sheet.key]: { ...sheet, takenBy: me, takenAt: new Date().toISOString() } },
        })),

      reviewJustification: (id, status) =>
        withAudit(`Justificativo ${id} → ${status}`, (d) => ({
          ...d,
          justifications: d.justifications.map((j) => (j.id === id ? { ...j, status, reviewedBy: me } : j)),
        })),

      setPeriodStatus: (id, status, closesOn) =>
        withAudit(`Período ${id} → ${status}`, (d) => ({
          ...d,
          periods: d.periods.map((p) => (p.id === id ? { ...p, status, closesOn: closesOn ?? p.closesOn } : p)),
        })),

      setGrade: (key, value) =>
        setData((d) => {
          const grades = { ...d.grades };
          if (value.trim() === '') delete grades[key];
          else grades[key] = { key, value, updatedAt: new Date().toISOString() };
          return { ...d, grades };
        }),

      setPartial: (key, value) =>
        setData((d) => {
          const partials = { ...d.partials };
          if (value.trim() === '') delete partials[key];
          else partials[key] = { key, value, updatedAt: new Date().toISOString() };
          return { ...d, partials };
        }),

      addInstance: (i) =>
        withAudit(`Instancia de evaluación creada: ${i.title}`, (d) => ({ ...d, instances: [...d.instances, { ...i, id: uid() }] })),

      deleteInstance: (id) =>
        withAudit(`Instancia de evaluación eliminada (${id})`, (d) => ({
          ...d,
          instances: d.instances.filter((i) => i.id !== id),
          partials: Object.fromEntries(Object.entries(d.partials).filter(([k]) => !k.startsWith(id + '|'))),
        })),

      setGrades: (entries) =>
        withAudit(`Notas de trimestre cargadas desde promedios (${Object.keys(entries).length})`, (d) => {
          const now = new Date().toISOString();
          const grades = { ...d.grades };
          for (const [key, value] of Object.entries(entries)) grades[key] = { key, value, updatedAt: now };
          return { ...d, grades };
        }),

      sendCommunication: (c) =>
        withAudit(`Comunicado enviado: ${c.title}`, (d) => ({
          ...d,
          communications: [{ ...c, id: uid(), sentBy: me, sentAt: new Date().toISOString(), read: 0, signed: 0 }, ...d.communications],
        })),

      reply: (threadId, text) =>
        setData((d) => ({
          ...d,
          threads: d.threads.map((t) =>
            t.id === threadId
              ? { ...t, unread: false, familyUnread: true, messages: [...t.messages, { id: uid(), from: 'STAFF', authorName: meName, text, at: new Date().toISOString() }] }
              : t,
          ),
        })),

      markRead: (threadId) =>
        setData((d) => ({ ...d, threads: d.threads.map((t) => (t.id === threadId ? { ...t, unread: false } : t)) })),

      addEvaluation: (e) =>
        withAudit(`Evaluación agendada: ${e.title}`, (d) => ({ ...d, evaluations: [...d.evaluations, { ...e, id: uid() }] })),

      addObservation: (o) =>
        withAudit('Observación pedagógica cargada', (d) => ({
          ...d,
          observations: [{ ...o, id: uid(), authorId: me, date: new Date().toISOString().slice(0, 10) }, ...d.observations],
        })),

      recordPickup: (studentId, personId) =>
        withAudit(`Retiro registrado (${studentId})`, (d) => ({
          ...d,
          pickupLogs: [{ id: uid(), studentId, personId, at: new Date().toISOString(), verifiedBy: me }, ...d.pickupLogs],
        })),

      logAccess: (action) => withAudit(action, (d) => d),

      resetDemo: () => setData(buildInitialState()),

      familyReadComm: (id) =>
        setData((d) =>
          d.familyRead.includes(id)
            ? d
            : { ...d, familyRead: [...d.familyRead, id], communications: d.communications.map((c) => (c.id === id ? { ...c, read: Math.min(c.recipients, c.read + 1) } : c)) },
        ),

      familySign: (id) =>
        withAudit(`Familia López firmó: ${data.communications.find((c) => c.id === id)?.title ?? id}`, (d) =>
          d.familySigned.includes(id)
            ? d
            : { ...d, familySigned: [...d.familySigned, id], communications: d.communications.map((c) => (c.id === id ? { ...c, signed: Math.min(c.recipients, c.signed + 1) } : c)) },
        ),

      submitJustification: (j) =>
        withAudit(`Familia López envió un justificativo`, (d) => ({
          ...d,
          justifications: [{ ...j, id: uid(), sentAt: new Date().toISOString(), status: 'PENDIENTE' }, ...d.justifications],
        })),

      addEventualPickup: (studentId, p) =>
        withAudit(`Familia López autorizó un retiro eventual (${p.fullName})`, (d) => ({
          ...d,
          students: d.students.map((s) =>
            s.id === studentId ? { ...s, pickup: [...s.pickup, { ...p, id: uid(), permanent: false, createdBy: famName }] } : s,
          ),
        })),

      familyReply: (threadId, text) =>
        withAudit('Familia López respondió un mensaje', (d) => ({
          ...d,
          threads: d.threads.map((t) =>
            t.id === threadId
              ? { ...t, unread: true, familyUnread: false, messages: [...t.messages, { id: uid(), from: 'FAMILIA', authorName: famName, text, at: new Date().toISOString() }] }
              : t,
          ),
        })),

      familyNewThread: ({ studentId, staffId, subject, text }) => {
        const id = uid();
        withAudit(`Familia López envió un mensaje nuevo: ${subject}`, (d) => ({
          ...d,
          threads: [
            { id, staffId, studentId, subject, unread: true, familyUnread: false, messages: [{ id: uid(), from: 'FAMILIA', authorName: famName, text, at: new Date().toISOString() }] },
            ...d.threads,
          ],
        }));
        return id;
      },

      familyMarkRead: (threadId) =>
        setData((d) => ({ ...d, threads: d.threads.map((t) => (t.id === threadId ? { ...t, familyUnread: false } : t)) })),
    };
  }, [data, user, userId, isFamily, withAudit]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return ctx;
}

/** Usuario logueado (las rutas protegidas garantizan que existe). */
export function useUser(): StaffUser {
  const { user } = useApp();
  if (!user) throw new Error('Sin sesión');
  return user;
}
