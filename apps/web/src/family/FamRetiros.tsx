import { useMemo, useState, type FormEvent } from 'react';
import { ShieldCheck, UserCheck, UserPlus, ArrowUpFromLine } from 'lucide-react';
import { useApp } from '../data/store';
import { shortDate, timeOf, todayISO } from '../lib/dates';
import { Hero, KidSwitch, Sheet, useKids, usePhoneToast, type Go } from './parts';

/** Patrón de QR estable por alumno y día (decorativo, como en la app). */
function qrCells(seed: string): boolean[] {
  let h = 2166136261;
  const out: boolean[] = [];
  for (let i = 0; i < 21 * 21; i++) {
    h ^= seed.charCodeAt(i % seed.length) + i;
    h = Math.imul(h, 16777619);
    const x = i % 21;
    const y = Math.floor(i / 21);
    const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    if (finder) {
      const fx = x > 13 ? x - 14 : x;
      const fy = y > 13 ? y - 14 : y;
      out.push(fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4));
    } else out.push((h >>> 7) % 2 === 0);
  }
  return out;
}

export function FamRetiros({ go }: { go: Go }) {
  const { data, addEventualPickup } = useApp();
  const kids = useKids();
  const toast = usePhoneToast();
  const [kidId, setKidId] = useState(kids[0].s.id);
  const [adding, setAdding] = useState(false);
  const kid = kids.find((k) => k.s.id === kidId)!;
  const today = todayISO();
  const cells = useMemo(() => qrCells(kid.s.id + today), [kid.s.id, today]);

  const permanent = kid.s.pickup.filter((p) => p.permanent);
  const todays = kid.s.pickup.filter((p) => !p.permanent && p.validOn === today);
  const logs = data.pickupLogs.filter((l) => l.studentId === kid.s.id);

  return (
    <>
      <Hero title="Retiro seguro" context="PASE DIGITAL · AUTORIZADOS" onBack={() => go('inicio')} go={go} />
      <div className="fam-body">
        <KidSwitch kids={kids} value={kidId} onChange={setKidId} />

        <div className="fam-card" style={{ textAlign: 'center' }}>
          <span className="accent" style={{ background: kid.color === 'green' ? 'var(--primary)' : 'var(--celeste-dk)' }} />
          <div className="fam-row between" style={{ marginBottom: 10 }}>
            <span className="fam-title">{kid.s.firstName} {kid.s.lastName}</span>
            <span className="fam-pill green">ACTIVO</span>
          </div>
          <div className="qr" aria-label="Código QR de retiro (ejemplo)">{cells.map((on, i) => <i key={i} className={on ? 'on' : ''} />)}</div>
          <p className="fam-sub" style={{ marginTop: 8 }}>Mostralo en puerta. Válido hoy hasta las <b>17:45 hs</b>.</p>
        </div>

        <button className="fam-card tap" onClick={() => setAdding(true)} style={{ background: 'var(--celeste-lt)', borderColor: 'var(--celeste-bd)' }}>
          <div className="fam-row">
            <span className="ibox celeste" style={{ background: '#fff' }}><UserPlus /></span>
            <div className="fam-grow"><div className="fam-title">Autorizar un retiro por hoy</div><div className="fam-sub">"Hoy lo retira un familiar o un compañero"</div></div>
          </div>
        </button>

        {todays.length > 0 && (
          <section className="fam-section">
            <span className="fam-sec-title dot">Permisos de hoy</span>
            {todays.map((p) => (
              <div key={p.id} className="fam-card fam-row">
                <span className="ibox green"><ShieldCheck /></span>
                <div className="fam-grow"><div className="fam-title">{p.fullName}</div><div className="fam-sub">{p.relationship} · DNI {p.dni}</div></div>
                <span className="fam-pill green">Solo hoy</span>
              </div>
            ))}
          </section>
        )}

        <section className="fam-section">
          <span className="fam-sec-title">Autorizados habituales</span>
          {permanent.map((p) => (
            <div key={p.id} className="fam-card fam-row">
              <span className="ibox green"><UserCheck /></span>
              <div className="fam-grow"><div className="fam-title">{p.fullName}</div><div className="fam-sub">{p.relationship} · DNI {p.dni}</div></div>
            </div>
          ))}
        </section>

        <section className="fam-section">
          <span className="fam-sec-title">Historial de puerta</span>
          {logs.length === 0 && <p className="fam-sub">Cuando Preceptoría registre un retiro, aparece acá al instante.</p>}
          <div className="timeline">
            {logs.map((l) => {
              const p = kid.s.pickup.find((x) => x.id === l.personId);
              return (
                <div key={l.id} className="tl-item">
                  <span className="ibox green" style={{ width: 32, height: 32, borderRadius: 10 }}><ArrowUpFromLine size={15} /></span>
                  <div><div className="fam-title">Retiro efectuado</div><div className="fam-sub">{shortDate(l.at)}, {timeOf(l.at)} hs · con {p?.fullName ?? 'persona autorizada'}</div></div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {adding && (
        <AddPermit
          kidName={kid.s.firstName}
          onClose={() => setAdding(false)}
          onSave={(p) => {
            addEventualPickup(kid.s.id, { ...p, validOn: today });
            setAdding(false);
            toast.show(`Listo: ${p.fullName} puede retirar a ${kid.s.firstName} hoy.`);
          }}
        />
      )}
      {toast.node}
    </>
  );
}

function AddPermit({ kidName, onClose, onSave }: { kidName: string; onClose: () => void; onSave: (p: { fullName: string; dni: string; relationship: string }) => void }) {
  const [fullName, setFullName] = useState('');
  const [dni, setDni] = useState('');
  const [relationship, setRelationship] = useState('');
  const valid = fullName.trim().length > 3 && dni.replace(/\D/g, '').length >= 7 && relationship.trim();
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!valid) return;
    onSave({ fullName: fullName.trim(), dni: dni.trim(), relationship: relationship.trim() });
  }
  return (
    <Sheet title={`Retiro excepcional de ${kidName}`} onClose={onClose}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div><label className="fam-label" htmlFor="pk-name">Nombre y apellido</label><input id="pk-name" className="fam-input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ej.: Marta Giménez" /></div>
        <div><label className="fam-label" htmlFor="pk-dni">DNI</label><input id="pk-dni" className="fam-input" inputMode="numeric" value={dni} onChange={(e) => setDni(e.target.value)} placeholder="Ej.: 14.523.118" /></div>
        <div><label className="fam-label" htmlFor="pk-rel">Parentesco o vínculo</label><input id="pk-rel" className="fam-input" value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="Ej.: Abuela, madre de un compañero" /></div>
        <p className="fam-sub">Vale solo por hoy. En puerta le van a pedir el DNI.</p>
        <button className="fam-btn block" type="submit" disabled={!valid}>Autorizar retiro</button>
      </form>
    </Sheet>
  );
}
