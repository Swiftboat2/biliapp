import { useEffect, useRef, useState } from 'react';
import { Home, MessageCircle, FolderOpen, Image as ImageIcon, CheckSquare, LogOut } from 'lucide-react';
import { useApp } from '../data/store';
import { FAMILY, STAFF } from '../data/mock';
import { initials } from '../lib/school';
import { ROLE_LABEL } from '../components/Layout';
import { pendingSignatures, useKids, type Screen } from './parts';
import { FamInicio } from './FamInicio';
import { FamMensajes } from './FamMensajes';
import { FamArchivos } from './FamArchivos';
import { FamGaleria } from './FamGaleria';
import { FamAsistencia } from './FamAsistencia';
import { FamRetiros } from './FamRetiros';
import './family.css';

const TABS: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'mensajes', label: 'Mensajes', icon: MessageCircle },
  { id: 'archivos', label: 'Archivos', icon: FolderOpen },
  { id: 'galeria', label: 'Galería', icon: ImageIcon },
  { id: 'asistencia', label: 'Asistencia', icon: CheckSquare },
];

/**
 * Simulador de la app de familias (apps/mobile) dentro del panel.
 * Usa los mismos datos que el panel: lo que hace la familia le aparece al personal y al revés.
 */
export function FamilySimulator() {
  const { data, signIn, signOut } = useApp();
  const kids = useKids().map((k) => k.s);
  const [screen, setScreen] = useState<Screen>('inicio');
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Sin devolver nada: en Chrome reciente scrollTo devuelve una promesa y React la tomaría como limpieza.
    scroller.current?.scrollTo({ top: 0 });
  }, [screen]);

  const unread = data.threads.filter((t) => t.familyUnread && FAMILY.studentIds.includes(t.studentId)).length;
  const toSign = pendingSignatures(data, kids).length;
  const famDid = (text: string) => data.audit.some((a) => a.userId === FAMILY.id && a.action.includes(text));

  const steps = [
    { done: famDid('firmó'), text: <><b>Firmá la autorización</b> de la salida al museo en Archivos. Después mirá en Dirección → Comunicados cómo sube el contador de firmas.</> },
    { done: famDid('justificativo'), text: <><b>Justificá una falta</b> desde Asistencia (Mateo llegó tarde hoy). Le aparece a Preceptoría en Justificativos para aprobar.</> },
    { done: famDid('retiro eventual'), text: <><b>Autorizá un retiro por hoy</b> desde el escudo de arriba. Silvia (Preceptoría de Sala de 4) lo ve en Retiros; cuando registre la entrega, te aparece en el historial.</> },
    { done: famDid('mensaje'), text: <><b>Escribile a una docente</b> desde Mensajes. Carla lo recibe en su panel y, si responde, te llega con la marca "Nuevo".</> },
  ];

  const Current = { inicio: FamInicio, mensajes: FamMensajes, archivos: FamArchivos, galeria: FamGaleria, asistencia: FamAsistencia, retiros: FamRetiros }[screen];

  return (
    <div className="sim">
      <aside className="sim-info">
        <div className="brand" style={{ marginBottom: 0 }}>
          <img src="/logo-colegio.png" alt="" style={{ background: 'var(--primary)' }} />
          <div><b style={{ color: 'var(--fg)' }}>Simulador de la app de familias</b><small style={{ color: 'var(--fg3)' }}>VISTA DE LAURA LÓPEZ · MAMÁ DE MATEO Y SOFÍA</small></div>
        </div>
        <h1>Probala como si fueras un padre</h1>
        <p className="sub" style={{ fontSize: 14 }}>
          Es la app de celular de las familias, con los mismos datos del panel. Lo que hagas acá le llega al colegio al instante, y lo que cargue el colegio lo ves acá.
        </p>

        <div className="card">
          <div className="card-head"><h2>Probá el circuito</h2></div>
          <ol className="sim-steps">
            {steps.map((s, i) => (
              <li key={i} className={s.done ? 'done' : ''}><span className="n">{s.done ? '✓' : i + 1}</span><span>{s.text}</span></li>
            ))}
          </ol>
        </div>

        <div className="card">
          <div className="card-head"><h2>Ver el otro lado</h2></div>
          <p className="sub" style={{ marginBottom: 10 }}>Entrá al panel como alguien del colegio. Desde el menú del panel podés volver a la app.</p>
          <div className="sim-switch">
            {STAFF.map((s) => (
              <button key={s.id} className="btn sm" style={{ justifyContent: 'flex-start' }} onClick={() => signIn(s.id)}>
                <span className="avatar" style={{ width: 22, height: 22, fontSize: 9 }}>{initials(`${s.firstName} ${s.lastName}`)}</span>
                {ROLE_LABEL[s.role]} · {s.firstName}
              </button>
            ))}
          </div>
        </div>
        <button className="btn sm" style={{ alignSelf: 'flex-start' }} onClick={signOut}><LogOut /> Salir del simulador</button>
      </aside>

      <div className="phone-frame">
        <div className="phone-screen">
          <span className="phone-notch" />
          <div className="phone-scroll" ref={scroller}>
            <Current go={setScreen} />
          </div>
          <nav className="fam-tabs" aria-label="Secciones de la app">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} className={`fam-tab${screen === id || (id === 'inicio' && screen === 'retiros') ? ' on' : ''}`} onClick={() => setScreen(id)} aria-current={screen === id ? 'page' : undefined}>
                <Icon />
                {label}
                {id === 'mensajes' && unread > 0 && <span className="badge">{unread}</span>}
                {id === 'archivos' && toSign > 0 && <span className="badge">{toSign}</span>}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
