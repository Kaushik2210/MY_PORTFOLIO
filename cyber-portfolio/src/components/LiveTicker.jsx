import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/* Scrolling live attack stats ticker at very bottom of viewport */
export default function LiveTicker() {
  const [stats, setStats] = useState({
    bytes: 12480,
    sessions: 1,
    hashes: 0,
    exploits: 0,
    elapsed: 0,
  });

  useEffect(() => {
    const t = setInterval(() => {
      setStats(s => ({
        bytes:    s.bytes    + Math.floor(Math.random() * 2400 + 400),
        sessions: s.sessions + (Math.random() < 0.02 ? 1 : 0),
        hashes:   s.hashes   + (Math.random() < 0.08 ? 1 : 0),
        exploits: s.exploits + (Math.random() < 0.04 ? 1 : 0),
        elapsed:  s.elapsed  + 1,
      }));
    }, 600);
    return () => clearInterval(t);
  }, []);

  const fmt = (n) => n >= 1024 * 1024
    ? `${(n / 1024 / 1024).toFixed(2)} MB`
    : `${(n / 1024).toFixed(1)} KB`;

  const pad = (n) => String(n).padStart(2, '0');
  const elapsed = `${pad(Math.floor(stats.elapsed / 60))}:${pad(stats.elapsed % 60)}`;

  const items = [
    { label: 'DATA_STOLEN', value: fmt(stats.bytes), color: '#ff003c' },
    { label: 'ACTIVE_SESSIONS', value: stats.sessions, color: '#39ff14' },
    { label: 'HASHES_CRACKED', value: stats.hashes, color: '#ffcc00' },
    { label: 'EXPLOITS_RUN', value: stats.exploits, color: '#00f0ff' },
    { label: 'SESSION_TIME', value: elapsed, color: '#39ff14' },
    { label: 'STEALTH_MODE', value: 'ACTIVE', color: '#39ff14' },
    { label: 'IDS_STATUS', value: 'BYPASSED', color: '#ff003c' },
    { label: 'FIREWALL', value: 'EVADED', color: '#ff003c' },
    { label: 'TARGET', value: 'SVK_PORTFOLIO', color: '#00f0ff' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 8850,
      height: 24,
      background: 'rgba(5,9,10,0.9)',
      borderTop: '1px solid rgba(57,255,20,0.12)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* "LIVE" badge */}
      <div style={{
        flexShrink: 0,
        padding: '0 10px',
        borderRight: '1px solid rgba(57,255,20,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        height: '100%',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff003c', display: 'inline-block', animation: 'tickerPulse 1s ease-in-out infinite' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', color: '#ff003c', letterSpacing: '0.1em', fontWeight: 700 }}>LIVE</span>
      </div>

      {/* Scrolling ticker */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
          style={{ display: 'flex', alignItems: 'center', gap: 0, whiteSpace: 'nowrap', willChange: 'transform' }}
        >
          {[...items, ...items].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, paddingRight: 28 }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', color: '#445566', letterSpacing: '0.08em' }}>
                {item.label}:
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: item.color, fontWeight: 600 }}>
                {item.value}
              </span>
              <span style={{ color: '#223344', paddingLeft: 14 }}>◆</span>
            </span>
          ))}
        </motion.div>
      </div>

      <style>{`@keyframes tickerPulse{0%,100%{opacity:1;box-shadow:0 0 6px #ff003c}50%{opacity:0.4;box-shadow:none}}`}</style>
    </div>
  );
}
