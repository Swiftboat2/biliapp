import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Hero, useKids, type Go } from './parts';

/** Galería de ejemplo (sin fotos reales: fondos de color, como los placeholders de la app). */
const ALBUMS = [
  { id: 'g1', kid: 0, title: 'Taller de expresión artística', when: 'Hace 2 días', emoji: '🎨🖼️', count: 18, bg: 'var(--primary-lt)', tag: 'Talleres' },
  { id: 'g2', kid: 1, title: 'Huerta escolar y ciencias', when: 'Hace 3 días', emoji: '🌱🌻', count: 24, bg: 'var(--celeste-lt)', tag: 'Ciencias' },
  { id: 'g3', kid: 0, title: 'Festa della Repubblica', when: 'Semana pasada', emoji: '🇮🇹🎶', count: 32, bg: '#fef9c3', tag: 'Italiano' },
  { id: 'g4', kid: 1, title: 'Torneo de atletismo', when: 'Hace 2 semanas', emoji: '🏃‍♀️🏅', count: 15, bg: '#fff1f2', tag: 'Deportes' },
];

export function FamGaleria({ go }: { go: Go }) {
  const kids = useKids();
  const [filter, setFilter] = useState<'todas' | number>('todas');
  const list = ALBUMS.filter((a) => filter === 'todas' || a.kid === filter);
  return (
    <>
      <Hero title="Galería" context="REGISTRO PEDAGÓGICO / TALLERES" go={go} />
      <div className="fam-body">
        <div className="fam-seg">
          <button className={filter === 'todas' ? 'on green' : ''} onClick={() => setFilter('todas')}>Todas</button>
          {kids.map((k, i) => <button key={k.s.id} className={filter === i ? `on ${k.color}` : ''} onClick={() => setFilter(i)}>{k.s.firstName}</button>)}
        </div>
        <div className="dual">
          {list.map((a) => {
            const k = kids[a.kid];
            return (
              <div key={a.id} className="fam-card" style={{ padding: 0 }}>
                <div className="album" style={{ background: a.bg }}>{a.emoji}<span className="count">{a.count} fotos</span></div>
                <div style={{ padding: 10 }}>
                  <span className={`fam-pill ${k.color}`}>{k.s.firstName}</span>
                  <div className="fam-title" style={{ fontSize: 12, marginTop: 4 }}>{a.title}</div>
                  <div className="fam-sub">{a.tag} · {a.when}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="fam-card fam-row" style={{ alignItems: 'flex-start', background: 'var(--soft)' }}>
          <span className="ibox green"><Lock /></span>
          <div className="fam-grow">
            <div className="fam-title">Privacidad institucional protegida</div>
            <p className="fam-text">Las fotos solo las ven las familias del curso, con la autorización de uso de imagen firmada.</p>
          </div>
        </div>
        <p className="fam-sub" style={{ textAlign: 'center' }}>En esta demo los álbumes no tienen fotos reales.</p>
      </div>
    </>
  );
}
