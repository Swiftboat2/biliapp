import { useState } from 'react';
import { Eye, ShieldAlert } from 'lucide-react';
import { useApp } from '../data/store';
import { PageHead } from '../components/ui';
import { relative, shortDate, timeOf } from '../lib/dates';
import { course, displayName, findStudent, staffName } from '../lib/school';

/** Dirección puede auditar conversaciones ante denuncias o conflictos. Cada apertura queda registrada. */
export function Supervision() {
  const { data, logAccess } = useApp();
  const [openId, setOpenId] = useState<string | null>(null);
  const open = data.threads.find((t) => t.id === openId) ?? null;

  function view(id: string) {
    const t = data.threads.find((x) => x.id === id)!;
    const s = findStudent(data, t.studentId);
    logAccess(`Supervisión: lectura de la conversación "${t.subject}" (${staffName(t.staffId)} con familia de ${displayName(s)})`);
    setOpenId(id);
  }

  return (
    <>
      <PageHead eyebrow="Dirección" title="Supervisión de conversaciones" sub="Para revisar ante denuncias o conflictos institucionales. Cada lectura queda registrada en la auditoría." />
      <div className="alert amber">
        <span className="icon-box sm amber"><ShieldAlert /></span>
        <div className="grow"><b>Uso reservado</b><span className="sub">Abrí una conversación solo cuando haya un motivo institucional. Docentes y preceptores saben que esta revisión es posible.</span></div>
      </div>
      <div className="grid g-main">
        <div className="card">
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Conversación</th><th>Personal</th><th>Familia</th><th>Último mensaje</th><th /></tr></thead>
              <tbody>
                {data.threads.map((t) => {
                  const s = findStudent(data, t.studentId);
                  return (
                    <tr key={t.id}>
                      <td><b>{t.subject}</b><div className="sub">{t.messages.length} mensajes</div></td>
                      <td>{staffName(t.staffId)}</td>
                      <td>{s.guardianName}<div className="sub">{course(s.courseId).name}</div></td>
                      <td>{relative(t.messages[t.messages.length - 1].at)}</td>
                      <td><button className="btn sm" onClick={() => view(t.id)}><Eye /> Revisar</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {open && (
            <div style={{ marginTop: 16, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
              <h3 style={{ fontSize: 15 }}>{open.subject}</h3>
              <div className="chat">
                {open.messages.map((m) => (
                  <div key={m.id} className={`bubble ${m.from === 'STAFF' ? 'me' : 'fam'}`}>
                    {m.text}
                    <small>{m.authorName} · {shortDate(m.at)} {timeOf(m.at)}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="card">
          <div className="card-head"><h2>Registro de auditoría</h2></div>
          {data.audit.length === 0 && <p className="sub">Sin acciones registradas en esta sesión.</p>}
          {data.audit.slice(0, 15).map((a) => (
            <div className="list-row" key={a.id} style={{ alignItems: 'flex-start' }}>
              <span className="pill gray">{timeOf(a.at)}</span>
              <div className="grow"><span style={{ fontSize: 13 }}>{a.action}</span><span className="sub">{staffName(a.userId)}</span></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
