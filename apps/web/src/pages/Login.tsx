import { UserRole } from '@biliapp/shared-types';
import { ChevronRight, Smartphone } from 'lucide-react';
import { FAMILY, STAFF, INSTITUTION } from '../data/mock';
import { useApp } from '../data/store';
import { initials } from '../lib/school';
import { ROLE_LABEL } from '../components/Layout';

const COLOR: Record<string, string> = {
  [UserRole.DIRECTIVO]: 'var(--red)',
  [UserRole.PRECEPTOR]: 'var(--amber)',
  [UserRole.DOCENTE]: 'var(--celeste-dk)',
};

/**
 * Ingreso de demostración: se elige el perfil.
 * Con el API levantado, reemplazar por POST /auth/login (DNI o email + contraseña).
 */
export function Login() {
  const { signIn } = useApp();
  return (
    <div className="login">
      <div className="login-card">
        <div className="login-hero">
          <div className="brand" style={{ marginBottom: 0 }}>
            <img src="/logo-colegio.png" alt="Escudo del Instituto República de Italia" />
            <div>
              <b>{INSTITUTION.name}</b>
              <small>{INSTITUTION.place.toUpperCase()} · CICLO {INSTITUTION.cycle}</small>
            </div>
          </div>
          <h1>Panel institucional</h1>
          <p>Elegí con qué perfil querés entrar. Es una versión de demostración con datos de ejemplo.</p>
        </div>
        <div className="login-body">
          {STAFF.map((s) => {
            const name = `${s.firstName} ${s.lastName}`;
            return (
              <button key={s.id} className="who-btn" style={{ ['--wc' as string]: COLOR[s.role] }} onClick={() => signIn(s.id)}>
                <span className="avatar" style={{ background: 'var(--soft)', color: COLOR[s.role] }}>{initials(name)}</span>
                <span style={{ flex: 1 }}>
                  <b>{name}</b>
                  <small>{ROLE_LABEL[s.role]} · {s.title}</small>
                </span>
                <ChevronRight size={18} color="var(--muted)" />
              </button>
            );
          })}
          <span className="sub" style={{ marginTop: 6, fontWeight: 800, fontSize: 11, letterSpacing: 0.6 }}>APP DE FAMILIAS</span>
          <button className="who-btn" style={{ ['--wc' as string]: 'var(--primary)' }} onClick={() => signIn(FAMILY.id)}>
            <span className="avatar"><Smartphone size={17} /></span>
            <span style={{ flex: 1 }}>
              <b>{FAMILY.firstName} {FAMILY.lastName} · Familia</b>
              <small>Simulador de la app de celular · mamá de Mateo (Sala de 4) y Sofía (4° Grado)</small>
            </span>
            <ChevronRight size={18} color="var(--muted)" />
          </button>
        </div>
      </div>
    </div>
  );
}
