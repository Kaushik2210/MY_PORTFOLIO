import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../lib/soundEngine';

const SOC_LINES = [
  { text: '> Initializing SOC workstation...', delay: 0 },
  { text: '> Loading analyst profile: S_V_KAUSHIK', delay: 550, color: '#00f0ff' },
  { text: '> Connecting to SIEM: Splunk Enterprise v9.2', delay: 800 },
  { text: '  [OK] SIEM connection established', delay: 500, color: '#39ff14' },
  { text: '> Syncing threat intelligence feeds...', delay: 600 },
  { text: '  [OK] MITRE ATT&CK framework: LOADED', delay: 450, color: '#39ff14' },
  { text: '  [OK] CVE database: 2024-06-27 (247,632 entries)', delay: 300, color: '#39ff14' },
  { text: '> Activating IDS/IPS sensors...', delay: 550 },
  { text: '  [OK] Snort rules: 48,291 active', delay: 400, color: '#39ff14' },
  { text: '> Scanning monitored endpoints...', delay: 600 },
  { text: '  [OK] 47 endpoints online | 0 critical alerts', delay: 450, color: '#39ff14' },
  { text: '> Firewall policy: 2,847 rules loaded', delay: 500, color: '#39ff14' },
  { text: '> Network baseline: ESTABLISHED', delay: 400, color: '#39ff14' },
  { text: '', delay: 300 },
  { text: '> SOC ANALYST WORKSTATION READY', delay: 500, color: '#00f0ff', big: true },
];

export default function IntrusionOverlay({ onDone }) {
  const [visible, setVisible] = useState([]);
  const [done, setDone]       = useState(false);

  useEffect(() => {
    const timers = [];
    let cum = 200;
    SOC_LINES.forEach((line, i) => {
      cum += line.delay;
      timers.push(setTimeout(() => {
        setVisible(v => [...v, i]);
        // [OK] lines get a beep; the final READY line gets startup chime
        if (line.text.includes('[OK]')) soundEngine.beep(880, 0.06, 0.09);
        else if (line.big) soundEngine.startup();
        else if (line.text.startsWith('>')) soundEngine.click(0.12);
      }, cum));
    });
    const finishT = setTimeout(() => {
      setDone(true);
      setTimeout(onDone, 900);
    }, cum + 600);
    timers.push(finishT);
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="soc-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'brightness(2) blur(3px)' }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed', inset: 0,
            background: '#000',
            zIndex: 99980,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 'min(600px, 90vw)' }}>

            {/* SOC header box */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ marginBottom: '1.8rem' }}
            >
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                color: '#00f0ff',
                fontSize: 'clamp(0.55rem, 1.5vw, 0.72rem)',
                lineHeight: 1.4,
                opacity: 0.85,
              }}>
                {`╔══════════════════════════════════════════════╗
║   SECURITY OPERATIONS CENTER — WORKSTATION   ║
║   ANALYST: S V KAUSHIK  |  IBM CERT: ACTIVE  ║
╚══════════════════════════════════════════════╝`}
              </div>

              {/* Status row */}
              <div style={{
                display: 'flex',
                gap: '1.5rem',
                marginTop: '0.75rem',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.6rem',
              }}>
                {[
                  { label: 'THREAT LEVEL', value: 'ELEVATED', color: '#ffcc00' },
                  { label: 'INCIDENTS',    value: '3 OPEN',   color: '#ff003c' },
                  { label: 'UPTIME',       value: '99.97%',   color: '#39ff14' },
                ].map(s => (
                  <span key={s.label} style={{ color: '#445566' }}>
                    {s.label}: <span style={{ color: s.color }}>{s.value}</span>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Divider */}
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', color: '#223344', marginBottom: '1rem' }}>
              ──────────────────────────────────────────────
            </div>

            {/* Boot lines */}
            <div style={{ minHeight: 260 }}>
              {SOC_LINES.map((line, i) => (
                <AnimatePresence key={i}>
                  {visible.includes(i) && (
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.14 }}
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: line.big ? 'clamp(0.82rem, 2vw, 1rem)' : '0.7rem',
                        color: line.color || '#c0ccd8',
                        marginBottom: line.text === '' ? '0.4rem' : '0.25rem',
                        fontWeight: line.big ? 700 : 400,
                        letterSpacing: line.big ? '0.12em' : '0.01em',
                        textShadow: line.big ? '0 0 20px rgba(0,240,255,0.5)' : 'none',
                      }}
                    >
                      {line.text}
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>

            {/* Loading bar when complete */}
            {visible.length >= SOC_LINES.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ marginTop: '1.2rem' }}
              >
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', color: '#445566', marginBottom: '0.4rem' }}>
                  Loading portfolio...
                </div>
                <div style={{ background: 'rgba(0,240,255,0.1)', height: 3, borderRadius: 2, overflow: 'hidden', width: '100%' }}>
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, #00f0ff, #39ff14)', boxShadow: '0 0 8px #00f0ff' }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
