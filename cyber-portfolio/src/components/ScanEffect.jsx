import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../lib/soundEngine';

/* Horizontal laser sweep that fires when a section enters view */
export function SectionScanner({ sectionId, color = '#00f0ff' }) {
  const [scanning, setScanning] = useState(false);
  const ref = useRef(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !fired.current) {
        fired.current = true;
        setScanning(true);
        soundEngine.sweep();
        setTimeout(() => setScanning(false), 1400);
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [sectionId]);

  return (
    <AnimatePresence>
      {scanning && (
        <motion.div
          key="scan"
          initial={{ top: '0%', opacity: 0.8 }}
          animate={{ top: '100%', opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'linear' }}
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${color} 20%, ${color} 80%, transparent 100%)`,
            boxShadow: `0 0 18px ${color}, 0 0 40px ${color}55`,
            zIndex: 8500,
            pointerEvents: 'none',
          }}
        />
      )}
    </AnimatePresence>
  );
}

/* Full-screen glitch flash alert */
export function AccessAlert() {
  const [alert, setAlert] = useState(null); // { type: 'denied'|'granted'|'warn', label }
  const lastSection = useRef('');

  const ALERTS = {
    hero:           null,
    about:          { type: 'warn',    label: 'CLASSIFIED FILE ACCESS DETECTED' },
    skills:         { type: 'denied',  label: 'EXPLOIT BLOCKED — SYSTEM HARDENED' },
    certifications: { type: 'denied',  label: 'CERTIFICATE FORGERY FAILED' },
    leadership:     { type: 'warn',    label: 'SOCIAL ENGINEERING DETECTED' },
    projects:       { type: 'granted', label: 'SOURCE CODE EXFILTRATED' },
    education:      { type: 'warn',    label: 'ACADEMIC RECORDS ACCESSED' },
    contact:        { type: 'granted', label: 'BREACH COMPLETE — SHELL ESTABLISHED' },
  };

  useEffect(() => {
    const ids = Object.keys(ALERTS);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id !== lastSection.current && ALERTS[id]) {
            lastSection.current = id;
            setAlert(ALERTS[id]);
            if (ALERTS[id].type === 'granted') soundEngine.granted();
            else if (ALERTS[id].type === 'denied') soundEngine.denied();
            else soundEngine.alert();
            setTimeout(() => setAlert(null), 1800);
          }
        }
      });
    }, { threshold: 0.4 });

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const colors = {
    denied:  { bg: '#ff003c', text: '#fff', border: '#ff003c' },
    granted: { bg: '#39ff14', text: '#000', border: '#39ff14' },
    warn:    { bg: '#ffcc00', text: '#000', border: '#ffcc00' },
  };

  const icons = { denied: '⛔', granted: '✓', warn: '⚠' };

  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          key={alert.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9500,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '5rem',
          }}
        >
          {/* Edge vignette flash */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: alert.type === 'denied'
              ? 'radial-gradient(ellipse at center, transparent 40%, rgba(255,0,60,0.18) 100%)'
              : alert.type === 'granted'
              ? 'radial-gradient(ellipse at center, transparent 40%, rgba(57,255,20,0.12) 100%)'
              : 'radial-gradient(ellipse at center, transparent 40%, rgba(255,204,0,0.12) 100%)',
          }} />

          {/* Alert banner */}
          <motion.div
            initial={{ y: -40, opacity: 0, scaleX: 0.7 }}
            animate={{ y: 0, opacity: 1, scaleX: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              background: 'rgba(7,11,12,0.95)',
              border: `2px solid ${colors[alert.type].border}`,
              padding: '0.65rem 1.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: `0 0 40px ${colors[alert.type].border}55, 0 0 80px ${colors[alert.type].border}22`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{icons[alert.type]}</span>
            <div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.6rem',
                color: colors[alert.type].bg,
                letterSpacing: '0.2em',
                marginBottom: '0.1rem',
              }}>
                {alert.type === 'denied' ? 'ACCESS_DENIED' : alert.type === 'granted' ? 'ACCESS_GRANTED' : 'ALERT'}
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.78rem',
                color: '#e6e6e6',
                letterSpacing: '0.05em',
              }}>
                {alert.label}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Targeting reticle that appears on sections */
export function TargetReticle({ sectionId }) {
  const [active, setActive] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !fired.current) {
        fired.current = true;
        setActive(true);
        setTimeout(() => setActive(false), 2000);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [sectionId]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="reticle"
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [1.5, 1, 1, 0.8] }}
          transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1] }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 8400,
            pointerEvents: 'none',
            width: 120,
            height: 120,
          }}
        >
          <svg viewBox="0 0 120 120" width="120" height="120">
            {/* Outer ring */}
            <circle cx="60" cy="60" r="55" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="8 4" opacity="0.6"/>
            {/* Inner ring */}
            <circle cx="60" cy="60" r="30" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.8"/>
            {/* Center dot */}
            <circle cx="60" cy="60" r="4" fill="#00f0ff" opacity="0.9"/>
            {/* Cross */}
            <line x1="60" y1="0" x2="60" y2="25" stroke="#00f0ff" strokeWidth="1" opacity="0.7"/>
            <line x1="60" y1="95" x2="60" y2="120" stroke="#00f0ff" strokeWidth="1" opacity="0.7"/>
            <line x1="0" y1="60" x2="25" y2="60" stroke="#00f0ff" strokeWidth="1" opacity="0.7"/>
            <line x1="95" y1="60" x2="120" y2="60" stroke="#00f0ff" strokeWidth="1" opacity="0.7"/>
            {/* Corner brackets */}
            <path d="M10,10 L10,24 M10,10 L24,10" fill="none" stroke="#39ff14" strokeWidth="2"/>
            <path d="M110,10 L110,24 M110,10 L96,10" fill="none" stroke="#39ff14" strokeWidth="2"/>
            <path d="M10,110 L10,96 M10,110 L24,110" fill="none" stroke="#39ff14" strokeWidth="2"/>
            <path d="M110,110 L110,96 M110,110 L96,110" fill="none" stroke="#39ff14" strokeWidth="2"/>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
