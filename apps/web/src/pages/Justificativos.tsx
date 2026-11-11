import { useState } from 'react';
import { Check, FileImage, X } from 'lucide-react';
import { useApp, useUser } from '../data/store';
import { Empty, PageHead, Tabs, useToast } from '../components/ui';
import { relative } from '../lib/dates';
import { course, displayName, findStudent, pendingJustifications, staffName, studentInitials } from '../lib/school';
import { visibleStudents } from '../lib/scope';
import type { JustStatus } from '../data/types';

export function Justificativos() {
  const { data, reviewJustification } = useApp();
  const user = useUser();
  const toast = useToast();
  const [tab, setTab] = useState<JustStatus>('PENDIENTE');
  const mine = visibleStudents(user, data);
  const ids = new Set(mine.map((s) => s.id));
  const list = data.justifications.filter((j) => ids.has(j.studentId) && j.status === tab);
  const pending = pendingJustifications(data, mine).length;

  return (
    <>
      <PageHead
        eyebrow="Asistencia"
        title="Justificativos"
        sub="Las familias suben la foto del certificado desde la app. Al aprobarlo, la falta queda justificada."
        actions={
          <Tabs label="Estado" value={tab} onChange={setTab} options={[
            { value: 'PENDIENTE', label: `Pendientes (${pending})` },
            { value: 'APROBADO', label: 'Aprobados' },
            { value: 'RECHAZADO', label: 'Rechazados' },
          ]} />
        }
      />
      {list.length === 0 && <div className="card"><Empty title={tab === 'PENDIENTE' ? 'No hay justificativos para revisar' : 'Nada por acá todavía'}>Cuando una familia envíe un certificado, aparece en esta lista.</Empty></div>}
      <div className="grid g-2">
        {list.map((j) => {
          const s = findStudent(data, j.studentId);
          return (
            <div className="card" key={j.id}>
              <div className="row">
                <span className="avatar">{studentInitials(s)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ fontSize: 15 }}>{displayName(s)}</b>
                  <div className="sub">{course(s.courseId).name} · enviado por {s.guardianName} {relative(j.sentAt)}</div>
                </div>
                {j.status === 'APROBADO' && <span className="pill green">Aprobado</span>}
                {j.status === 'RECHAZADO' && <span className="pill red">Rechazado</span>}
              </div>
              <div className="alert celeste" style={{ marginTop: 12 }}>
                <span className="icon-box sm celeste" style={{ background: '#fff' }}><FileImage /></span>
                <div className="grow">
                  <b>{j.dates}</b>
                  <span className="sub">{j.reason}</span>
                  <div className="sub" style={{ marginTop: 2 }}>Adjunto: {j.fileName}</div>
                </div>
              </div>
              {j.status === 'PENDIENTE' ? (
                <div className="row" style={{ marginTop: 12, justifyContent: 'flex-end' }}>
                  <button className="btn ghost-red" onClick={() => { reviewJustification(j.id, 'RECHAZADO'); toast.show('Justificativo rechazado · se avisó a la familia'); }}><X /> Rechazar</button>
                  <button className="btn primary" onClick={() => { reviewJustification(j.id, 'APROBADO'); toast.show('Falta justificada · se avisó a la familia'); }}><Check /> Aprobar</button>
                </div>
              ) : (
                <p className="sub" style={{ marginTop: 10 }}>Revisado por {staffName(j.reviewedBy ?? '')}</p>
              )}
            </div>
          );
        })}
      </div>
      {toast.node}
    </>
  );
}
