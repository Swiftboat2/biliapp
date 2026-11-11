import { useRef, useState } from 'react';
import { Bell, CheckCircle2, FileText, HeartPulse, Lock, PenLine } from 'lucide-react';
import { useApp } from '../data/store';
import { ASSIGNMENTS } from '../data/mock';
import { relative, shortDate, daysUntil } from '../lib/dates';
import { audienceLabel, conceptFor, course, gradeKey, staffName, subject } from '../lib/school';
import { annualAverage, fmtNota, instancesFor, partialGrade, termGrade } from '../lib/grades';
import { commsFor, Hero, HScroll, isKinder, Sheet, useKids, usePhoneToast, type Go, type Kid } from './parts';
import type { Communication } from '../data/types';

type Filter = 'todos' | 'firmas' | 'boletines' | 'circulares' | 'salud';

export function FamArchivos({ go }: { go: Go }) {
  const { data, familyReadComm, familySign } = useApp();
  const kids = useKids();
  const toast = usePhoneToast();
  const [filter, setFilter] = useState<Filter>('todos');
  const [reading, setReading] = useState<Communication | null>(null);
  const [signing, setSigning] = useState<Communication | null>(null);
  const [report, setReport] = useState<{ kid: Kid; periodId: string } | null>(null);

  const comms = commsFor(data, kids.map((k) => k.s));
  const toSign = comms.filter((c) => c.requiresSignature && !data.familySigned.includes(c.id));
  const signed = comms.filter((c) => c.requiresSignature && data.familySigned.includes(c.id));
  const circulars = comms.filter((c) => !c.requiresSignature);
  const show = (f: Filter) => filter === 'todos' || filter === f;

  function openComm(c: Communication) {
    familyReadComm(c.id);
    setReading(c);
  }

  return (
    <>
      <Hero title="Archivos" context="AUTORIZACIONES · BOLETINES · CIRCULARES" go={go} />
      <div className="fam-body">
        <HScroll gap={6}>
          {([['todos', 'Todos'], ['firmas', `Autorizaciones${toSign.length ? ` (${toSign.length})` : ''}`], ['boletines', 'Boletines'], ['circulares', 'Circulares'], ['salud', 'Fichas médicas']] as [Filter, string][]).map(([f, label]) => (
            <button key={f} className={`fam-btn sm ${filter === f ? '' : 'light'}`} onClick={() => setFilter(f)}>{label}</button>
          ))}
        </HScroll>

        {show('firmas') && (
          <section className="fam-section">
            <span className="fam-sec-title dot">Acción requerida</span>
            {toSign.length === 0 && <p className="fam-sub">No tenés autorizaciones pendientes.</p>}
            {toSign.map((c) => (
              <div key={c.id} className="fam-card" style={{ background: 'var(--red-lt)', borderColor: 'var(--red-bd)' }}>
                <div className="fam-row" style={{ alignItems: 'flex-start' }}>
                  <span className="ibox red" style={{ background: '#fff' }}><PenLine /></span>
                  <div className="fam-grow">
                    <div className="fam-title">{c.title}</div>
                    <div className="fam-sub">{audienceLabel(c.audience)} · {staffName(c.sentBy)} · {relative(c.sentAt)}</div>
                    <p className="fam-text" style={{ marginTop: 6 }}>{c.body}</p>
                  </div>
                </div>
                <button className="fam-btn block red" style={{ marginTop: 10 }} onClick={() => { familyReadComm(c.id); setSigning(c); }}><PenLine /> Revisar y firmar</button>
              </div>
            ))}
            {signed.map((c) => (
              <div key={c.id} className="fam-card fam-row">
                <span className="ibox green"><CheckCircle2 /></span>
                <div className="fam-grow"><div className="fam-title">{c.title}</div><div className="fam-sub" style={{ color: 'var(--primary-dk)', fontWeight: 700 }}>Firma registrada con PIN seguro</div></div>
              </div>
            ))}
          </section>
        )}

        {show('boletines') && (
          <section className="fam-section">
            <span className="fam-sec-title">Boletines y notas</span>
            {kids.map((k) =>
              data.periods.map((p) => (
                <button key={k.s.id + p.id} className="fam-card tap" onClick={() => setReport({ kid: k, periodId: p.id })}>
                  <div className="fam-row">
                    <span className={`ibox ${k.color}`}><FileText /></span>
                    <div className="fam-grow">
                      <div className="fam-row" style={{ gap: 5 }}>
                        <span className={`fam-pill ${k.color}`}>{k.s.firstName}</span>
                        {p.status === 'CERRADO' ? <span className="fam-pill gray">OFICIAL</span> : <span className="fam-pill amber">EN CURSO</span>}
                      </div>
                      <div className="fam-title" style={{ marginTop: 3 }}>{isKinder(k.s) ? 'Informe' : 'Boletín'} {p.name}</div>
                      <div className="fam-sub">{course(k.s.courseId).name}</div>
                    </div>
                    <span className="fam-btn sm light">Ver</span>
                  </div>
                </button>
              )),
            )}
          </section>
        )}

        {show('circulares') && (
          <section className="fam-section">
            <span className="fam-sec-title">Circulares y comunicados</span>
            {circulars.map((c) => (
              <button key={c.id} className="fam-card tap" onClick={() => openComm(c)}>
                <div className="fam-row">
                  <span className="ibox celeste"><Bell /></span>
                  <div className="fam-grow"><div className="fam-title">{c.title}</div><div className="fam-sub">{audienceLabel(c.audience)} · {relative(c.sentAt)}</div></div>
                  {!data.familyRead.includes(c.id) && <span className="fam-pill red">Nuevo</span>}
                </div>
              </button>
            ))}
          </section>
        )}

        {show('salud') && (
          <section className="fam-section">
            <span className="fam-sec-title">Fichas médicas y aptos</span>
            {kids.map((k) => {
              const h = k.s.health;
              const left = daysUntil(h.physicalExamUntil);
              return (
                <div key={k.s.id} className="fam-card">
                  <div className="fam-row">
                    <span className={`ibox ${k.color}`}><HeartPulse /></span>
                    <div className="fam-grow">
                      <div className="fam-title">{k.s.firstName} {k.s.lastName}</div>
                      <div className="fam-sub">{[...h.allergies.map((a) => `Alergia: ${a}`), ...h.conditions, ...h.medication].join(' · ') || 'Sin condiciones registradas'}</div>
                    </div>
                  </div>
                  <div className="kid-strip">
                    <span>Apto físico hasta {shortDate(h.physicalExamUntil)}</span>
                    <b style={{ color: left <= 30 ? 'var(--amber-dk)' : 'var(--primary-dk)' }}>{left <= 30 ? 'RENOVAR' : 'VIGENTE'}</b>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>

      {reading && (
        <Sheet title={reading.title} onClose={() => setReading(null)}>
          <span className="fam-sub">{audienceLabel(reading.audience)} · {staffName(reading.sentBy)} · {relative(reading.sentAt)}</span>
          <p className="fam-text">{reading.body}</p>
          <span className="fam-pill green" style={{ alignSelf: 'flex-start' }}>✓✓ Lectura confirmada</span>
          <button className="fam-btn block light" onClick={() => setReading(null)}>Cerrar</button>
        </Sheet>
      )}
      {signing && <PinSheet comm={signing} onClose={() => setSigning(null)} onSign={() => { familySign(signing.id); setSigning(null); toast.show('Autorización firmada. El colegio ya la ve.'); }} />}
      {report && <ReportSheet kid={report.kid} periodId={report.periodId} onClose={() => setReport(null)} />}
      {toast.node}
    </>
  );
}

/** Firma digital con PIN de 6 dígitos (en la demo, cualquier PIN de 6 dígitos sirve). */
function PinSheet({ comm, onClose, onSign }: { comm: Communication; onClose: () => void; onSign: () => void }) {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const full = pin.every((d) => d !== '');
  function set(i: number, v: string) {
    // Acepta un dígito o varios de golpe (pegar el PIN o tipear rápido).
    const digits = v.replace(/\D/g, '').split('');
    if (digits.length === 0) return setPin((p) => p.map((x, j) => (j === i ? '' : x)));
    setPin((p) => p.map((x, j) => (j >= i && j - i < digits.length ? digits[j - i] : x)));
    refs.current[Math.min(5, i + digits.length)]?.focus();
  }
  return (
    <Sheet title="Firma digital institucional" onClose={onClose}>
      <p className="fam-text">Vas a firmar: <b>{comm.title}</b>. Ingresá tu PIN de 6 dígitos.</p>
      <div className="pin-row">
        {pin.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            inputMode="numeric"
            aria-label={`Dígito ${i + 1} del PIN`}
            type="password"
            value={d}
            autoFocus={i === 0}
            onChange={(e) => set(i, e.target.value)}
            onKeyDown={(e) => e.key === 'Backspace' && !d && i > 0 && refs.current[i - 1]?.focus()}
          />
        ))}
      </div>
      <div className="fam-card fam-row" style={{ background: 'var(--amber-lt)', borderColor: 'var(--amber-bd)' }}>
        <Lock size={16} color="var(--amber-dk)" />
        <span className="fam-sub" style={{ color: 'var(--amber-dk)' }}>Demo: cualquier PIN de 6 dígitos funciona.</span>
      </div>
      <button className="fam-btn block" disabled={!full} onClick={onSign}>Confirmar y firmar</button>
    </Sheet>
  );
}

/** Boletín del período: nota por materia (o informe de Jardín), parciales y promedio anual. */
function ReportSheet({ kid, periodId, onClose }: { kid: Kid; periodId: string; onClose: () => void }) {
  const { data } = useApp();
  const period = data.periods.find((p) => p.id === periodId)!;
  const classes = ASSIGNMENTS.filter((a) => a.courseId === kid.s.courseId);
  return (
    <Sheet title={`${isKinder(kid.s) ? 'Informe' : 'Boletín'} ${period.name}`} onClose={onClose}>
      <span className="fam-sub">{kid.s.firstName} {kid.s.lastName} · {course(kid.s.courseId).name} · {period.status === 'CERRADO' ? 'Oficial' : 'En curso: puede cambiar'}</span>
      {classes.map((a) => {
        if (isKinder(kid.s)) {
          const text = data.grades[gradeKey(periodId, a.id, kid.s.id)]?.value;
          return (
            <div key={a.id} className="fam-card">
              <div className="fam-title">{subject(a.subjectId).name}</div>
              <p className="fam-text" style={{ marginTop: 4 }}>{text ?? 'El informe todavía no está disponible.'}</p>
            </div>
          );
        }
        const term = termGrade(data, periodId, a.id, kid.s.id);
        const annual = annualAverage(data, a.id, kid.s.id);
        const parts = instancesFor(data, a.id, periodId).map((i) => ({ i, g: partialGrade(data, i.id, kid.s.id) }));
        return (
          <div key={a.id} className="fam-card">
            <div className="fam-row">
              <div className="fam-grow">
                <div className="fam-title">{subject(a.subjectId).name}</div>
                <div className="fam-sub">{term.value !== null ? conceptFor(term.value) : 'Sin nota todavía'}{term.source === 'parciales' ? ' · promedio parcial' : ''}</div>
              </div>
              <span className={`score ${term.value !== null && term.value < 6 ? 'red' : kid.color}`}>{fmtNota(term.value)}</span>
            </div>
            {parts.length > 0 && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {parts.map(({ i, g }) => (
                  <div key={i.id} className="fam-row between" style={{ fontSize: 12 }}>
                    <span className="fam-text">{i.kind}: {i.title}{i.weight === 2 ? ' (×2)' : ''}</span>
                    <b>{fmtNota(g)}</b>
                  </div>
                ))}
              </div>
            )}
            <div className="kid-strip"><span>Promedio anual</span><b style={{ fontSize: 12 }}>{fmtNota(annual)}</b></div>
          </div>
        );
      })}
      <button className="fam-btn block light" onClick={onClose}>Cerrar</button>
    </Sheet>
  );
}
