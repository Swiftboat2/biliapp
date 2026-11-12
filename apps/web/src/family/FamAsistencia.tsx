import { useState } from 'react';
import { Camera, FileUp } from 'lucide-react';
import { useApp } from '../data/store';
import { longDate, timeOf } from '../lib/dates';
import { fmtFaltas, THRESHOLDS, totalAbsences } from '../lib/school';
import { attendancePct, Hero, KidSwitch, Sheet, useKids, usePhoneToast, type Go } from './parts';
import type { Mark } from '../data/types';

const MARK_INFO: Record<Mark, { title: string; value: string; tone: string }> = {
  P: { title: 'Presente puntual', value: '0', tone: 'green' },
  T: { title: 'Tardanza (ingreso posterior al horario)', value: '¼', tone: 'amber' },
  A: { title: 'Inasistencia', value: '1', tone: 'red' },
  R: { title: 'Retiro anticipado', value: '½', tone: 'celeste' },
};

export function FamAsistencia({ go }: { go: Go }) {
  const { data, submitJustification } = useApp();
  const kids = useKids();
  const toast = usePhoneToast();
  const [kidId, setKidId] = useState(kids[0].s.id);
  const [justifying, setJustifying] = useState<string | null>(null); // fecha
  const [reason, setReason] = useState('');
  const [file, setFile] = useState('');

  const kid = kids.find((k) => k.s.id === kidId)!;
  const total = totalAbsences(kid.s, data);
  const nextLimit = THRESHOLDS.find((t) => t > total) ?? THRESHOLDS[THRESHOLDS.length - 1];
  const records = Object.values(data.attendance)
    .filter((sh) => sh.courseId === kid.s.courseId && !sh.subjectId && sh.marks[kid.s.id])
    .sort((a, b) => b.date.localeCompare(a.date));
  const myJust = data.justifications.filter((j) => j.studentId === kid.s.id);
  const justFor = (date: string) => myJust.find((j) => j.forDate === date);

  function send() {
    if (!justifying) return;
    submitJustification({ studentId: kid.s.id, forDate: justifying, dates: longDate(justifying), reason: reason.trim() || 'Certificado médico', fileName: file || 'certificado.jpg' });
    setJustifying(null);
    setReason('');
    setFile('');
    toast.show('Certificado enviado. Preceptoría lo va a revisar.');
  }

  return (
    <>
      <Hero title="Asistencia" context="REGISTRO DE ASISTENCIA DIARIA" go={go} />
      <div className="fam-body">
        <KidSwitch kids={kids} value={kidId} onChange={setKidId} />

        <div className="dual">
          <div className="red" style={{ minHeight: 0 }}>
            <span className="fam-sub">Faltas computadas</span>
            <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--red-tx)', fontVariantNumeric: 'tabular-nums' }}>{fmtFaltas(total)}</span>
            <span className="fam-sub">Próximo límite: <b>{nextLimit}</b></span>
          </div>
          <div className="green" style={{ minHeight: 0 }}>
            <span className="fam-sub">Asistencia</span>
            <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--primary-dk)' }}>{attendancePct(total)}%</span>
            <span className={`fam-pill ${total >= 10 ? 'amber' : 'green'}`} style={{ alignSelf: 'flex-start' }}>{total >= 15 ? 'Atención' : total >= 10 ? 'En seguimiento' : 'Regular'}</span>
          </div>
        </div>

        <section className="fam-section">
          <span className="fam-sec-title">Historial del período</span>
          {records.length === 0 && <p className="fam-sub">Todavía no hay registros en el panel para {kid.s.firstName}.</p>}
          {records.map((sh) => {
            const m = sh.marks[kid.s.id];
            const info = MARK_INFO[m];
            const j = justFor(sh.date);
            return (
              <div key={sh.key} className="fam-card">
                <div className="fam-row" style={{ alignItems: 'flex-start' }}>
                  <span className={`score ${info.tone === 'green' ? 'green' : info.tone === 'red' ? 'red' : 'celeste'}`} style={{ fontSize: 13 }}>{info.value}</span>
                  <div className="fam-grow">
                    <div className="fam-title">{info.title}</div>
                    <div className="fam-sub">{longDate(sh.date)} · {timeOf(sh.takenAt)} hs</div>
                    {sh.details?.[kid.s.id]?.reason && <div className="fam-sub" style={{ color: 'var(--fg2)', fontWeight: 600 }}>Motivo: {sh.details[kid.s.id].reason}</div>}
                    {m !== 'P' && (
                      <div style={{ marginTop: 8 }}>
                        {j?.status === 'APROBADO' && <span className="fam-pill green">Justificada ✓</span>}
                        {j?.status === 'PENDIENTE' && <span className="fam-pill amber">En revisión por Preceptoría</span>}
                        {j?.status === 'RECHAZADO' && <span className="fam-pill red">Certificado rechazado</span>}
                        {(!j || j.status === 'RECHAZADO') && (
                          <button className="fam-btn sm light" style={{ marginLeft: j ? 6 : 0 }} onClick={() => setJustifying(sh.date)}><FileUp /> Subir certificado</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {myJust.filter((j) => !j.forDate).length > 0 && (
          <section className="fam-section">
            <span className="fam-sec-title">Justificativos anteriores</span>
            {myJust.filter((j) => !j.forDate).map((j) => (
              <div key={j.id} className="fam-card fam-row">
                <div className="fam-grow"><div className="fam-title">{j.dates}</div><div className="fam-sub">{j.reason}</div></div>
                <span className={`fam-pill ${j.status === 'APROBADO' ? 'green' : j.status === 'PENDIENTE' ? 'amber' : 'red'}`}>{j.status === 'APROBADO' ? 'Aprobado' : j.status === 'PENDIENTE' ? 'En revisión' : 'Rechazado'}</span>
              </div>
            ))}
          </section>
        )}
      </div>

      {justifying && (
        <Sheet title="Adjuntar justificación médica" onClose={() => setJustifying(null)}>
          <p className="fam-sub">{kid.s.firstName} · {longDate(justifying)}</p>
          <label className="fam-card tap" style={{ textAlign: 'center', borderStyle: 'dashed', cursor: 'pointer' }}>
            <Camera size={26} color="var(--primary)" />
            <div className="fam-title" style={{ marginTop: 4 }}>{file || 'Tomar foto o subir comprobante'}</div>
            <div className="fam-sub">JPG, PNG o PDF (máx. 5 MB)</div>
            <input type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0]?.name ?? '')} />
          </label>
          <div>
            <label className="fam-label" htmlFor="j-reason">Diagnóstico médico o motivo</label>
            <textarea id="j-reason" className="fam-textarea" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ej.: Angina, reposo 48 h" />
          </div>
          <div className="fam-row">
            <button className="fam-btn light" style={{ flex: 1 }} onClick={() => setJustifying(null)}>Cancelar</button>
            <button className="fam-btn" style={{ flex: 1 }} onClick={send}>Enviar a Preceptoría</button>
          </div>
        </Sheet>
      )}
      {toast.node}
    </>
  );
}
