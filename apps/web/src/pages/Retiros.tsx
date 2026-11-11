import { useState } from 'react';
import { AlertTriangle, CheckCircle2, HeartPulse, Search, ShieldCheck, UserCheck } from 'lucide-react';
import { useApp, useUser } from '../data/store';
import { Empty, PageHead, useToast } from '../components/ui';
import { shortDate, timeOf, todayISO } from '../lib/dates';
import { course, displayName, findStudent, fullName, hasHealthCondition, healthItems, staffName, studentInitials, todaysEventualPickups } from '../lib/school';
import { visibleStudents } from '../lib/scope';

/** Control de retiros en puerta: quién puede retirar hoy a cada alumno. */
export function Retiros() {
  const { data, recordPickup } = useApp();
  const user = useUser();
  const toast = useToast();
  const today = todayISO();
  const students = visibleStudents(user, data).sort((a, b) => a.lastName.localeCompare(b.lastName, 'es'));
  const [q, setQ] = useState('');
  const [selId, setSelId] = useState<string | null>(null);

  const eventual = todaysEventualPickups(students);
  const matches = q.length >= 2 ? students.filter((s) => `${s.firstName} ${s.lastName} ${s.dni}`.toLowerCase().includes(q.toLowerCase())).slice(0, 8) : [];
  const sel = students.find((s) => s.id === selId) ?? null;
  const logsToday = data.pickupLogs.filter((l) => l.at.slice(0, 10) === today);
  const doneFor = (studentId: string) => logsToday.find((l) => l.studentId === studentId);

  const allowedToday = sel ? sel.pickup.filter((p) => p.permanent || p.validOn === today) : [];

  return (
    <>
      <PageHead eyebrow="Seguridad escolar" title="Retiros en puerta" sub="Buscá al alumno y verificá quién puede retirarlo hoy, con DNI, permisos del día y alertas legales." />

      <div className="grid g-main">
        <div className="stack" style={{ gap: 14 }}>
          <div className="card">
            <label htmlFor="buscar-alumno" style={{ fontSize: 12, fontWeight: 800, color: 'var(--fg2)' }}>Alumno</label>
            <div style={{ position: 'relative', marginTop: 5 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--muted)' }} />
              <input id="buscar-alumno" className="input" style={{ paddingLeft: 34 }} placeholder="Escribí nombre, apellido o DNI" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
            </div>
            {matches.length > 0 && (
              <div style={{ marginTop: 8 }}>
                {matches.map((s) => (
                  <button key={s.id} className="row-btn" onClick={() => { setSelId(s.id); setQ(''); }}>
                    <span className="avatar">{studentInitials(s)}</span>
                    <span style={{ flex: 1 }}><b>{fullName(s)}</b><span className="sub">{course(s.courseId).name}</span></span>
                    {s.legalAlert && <span className="pill solid-red"><AlertTriangle /> Alerta</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {sel ? (
            <div className="card accent" style={{ ['--ac' as string]: sel.legalAlert ? 'var(--red)' : 'var(--primary)' }}>
              <div className="row">
                <span className="avatar lg">{studentInitials(sel)}</span>
                <div style={{ flex: 1 }}>
                  <b style={{ fontSize: 18 }}>{displayName(sel)}</b>
                  <div className="sub">{course(sel.courseId).name}</div>
                </div>
                {doneFor(sel.id) && <span className="pill green"><CheckCircle2 /> Retirado {timeOf(doneFor(sel.id)!.at)}</span>}
              </div>

              {sel.legalAlert && (
                <div className="alert red" style={{ marginTop: 12 }}>
                  <span className="icon-box sm red" style={{ background: '#fff' }}><AlertTriangle /></span>
                  <div className="grow"><b>Restricción {sel.legalAlert.severity === 'CRITICA' ? 'judicial vigente' : 'a tener en cuenta'}</b><span className="sub">{sel.legalAlert.text}</span></div>
                </div>
              )}
              {hasHealthCondition(sel) && (
                <div className="alert celeste" style={{ marginTop: 10 }}>
                  <span className="icon-box sm celeste" style={{ background: '#fff' }}><HeartPulse /></span>
                  <div className="grow"><b>Salud</b><span className="sub">{healthItems(sel, true).join(' · ')}</span></div>
                </div>
              )}

              <h3 style={{ fontSize: 14, margin: '16px 0 4px' }}>Pueden retirar hoy</h3>
              {allowedToday.map((p) => (
                <div className="list-row" key={p.id}>
                  <span className="icon-box green"><UserCheck /></span>
                  <div className="grow">
                    <b>{p.fullName}</b>
                    <span className="sub">{p.relationship} · DNI {p.dni}{p.createdBy ? ` · cargado por ${p.createdBy}` : ''}</span>
                  </div>
                  {p.permanent ? <span className="pill gray">Permanente</span> : <span className="pill green">Permiso de hoy</span>}
                  <button className="btn sm primary" disabled={!!doneFor(sel.id)} onClick={() => { recordPickup(sel.id, p.id); toast.show(`Entrega registrada · se avisó a la familia`); }}>Entregar</button>
                </div>
              ))}
              <p className="sub" style={{ marginTop: 8 }}>Verificá el DNI antes de entregar. Si la persona no figura, no se entrega y se llama a la familia.</p>
            </div>
          ) : (
            <div className="card"><Empty title="Buscá un alumno para empezar">Vas a ver quién puede retirarlo, con su DNI y las alertas.</Empty></div>
          )}
        </div>

        <div className="stack" style={{ gap: 14 }}>
          <div className="card">
            <div className="card-head"><h2>Permisos del día</h2><span className="pill green">{eventual.length}</span></div>
            {eventual.length === 0 && <p className="sub">Ninguna familia cargó permisos eventuales para hoy.</p>}
            {eventual.map(({ s, p }) => (
              <button key={p.id} className="row-btn" onClick={() => setSelId(s.id)}>
                <span className="icon-box sm green"><ShieldCheck /></span>
                <span style={{ flex: 1 }}><b>{displayName(s)}</b><span className="sub">Lo retira {p.fullName} ({p.relationship.toLowerCase()})</span></span>
                {doneFor(s.id) ? <span className="pill green">Entregado</span> : <span className="pill amber">Pendiente</span>}
              </button>
            ))}
          </div>
          <div className="card">
            <div className="card-head"><h2>Entregas de hoy</h2></div>
            {logsToday.length === 0 && <p className="sub">Todavía no se registraron entregas.</p>}
            {logsToday.map((l) => {
              const s = findStudent(data, l.studentId);
              const p = s.pickup.find((x) => x.id === l.personId);
              return (
                <div className="list-row" key={l.id}>
                  <span className="pill gray">{timeOf(l.at)}</span>
                  <div className="grow"><b>{displayName(s)}</b><span className="sub">Con {p?.fullName} · verificó {staffName(l.verifiedBy)}</span></div>
                </div>
              );
            })}
            <p className="sub" style={{ marginTop: 8 }}>{shortDate(today)}</p>
          </div>
        </div>
      </div>
      {toast.node}
    </>
  );
}
