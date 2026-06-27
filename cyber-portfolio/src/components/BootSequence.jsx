import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINES = [
  '> initializing secure_session...',
  '> scanning identity...',
  '> user: S_V_KAUSHIK',
  '> clearance: GRANTED',
  '> loading portfolio...',
];

export default function BootSequence({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [done, setDone] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timeouts = [];

    LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        if (!cancelled) setVisibleLines(prev => [...prev, line]);
      }, 600 + i * 700);
      timeouts.push(t);
    });

    const finalT = setTimeout(() => {
      if (!cancelled) {
        setDone(true);
        setTimeout(() => {
          if (!cancelled) {
            setExiting(true);
            setTimeout(() => { if (!cancelled) onComplete(); }, 700);
          }
        }, 500);
      }
    }, 600 + LINES.length * 700 + 400);
    timeouts.push(finalT);

    return () => { cancelled = true; timeouts.forEach(clearTimeout); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'brightness(3)' }}
          transition={{ duration: 0.6, ease: 'easeIn' }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            zIndex: 99990,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          {/* Skip button */}
          <button
            onClick={() => { setExiting(true); setTimeout(onComplete, 700); }}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              color: '#39ff14',
              background: 'transparent',
              border: '1px solid #39ff14',
              padding: '4px 12px',
              cursor: 'none',
              opacity: 0.6,
            }}
          >
            Skip &gt;&gt;
          </button>

          <div style={{ width: 'min(560px, 90vw)' }}>
            {/* Header */}
            <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#39ff14', fontSize: '0.7rem', marginBottom: '1.5rem', opacity: 0.4 }}>
              ╔══════════════════════════════════╗<br/>
              ║   SECURE TERMINAL v2.4.1         ║<br/>
              ╚══════════════════════════════════╝
            </div>

            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  color: line.includes('GRANTED') ? '#39ff14' : '#e6e6e6',
                  fontSize: 'clamp(0.75rem, 2vw, 0.95rem)',
                  marginBottom: '0.5rem',
                  textShadow: line.includes('GRANTED') ? '0 0 12px rgba(57,255,20,0.8)' : 'none',
                }}
              >
                {line}
                {i === visibleLines.length - 1 && !done && (
                  <span style={{ animation: 'blink 0.8s step-end infinite' }}>█</span>
                )}
              </motion.div>
            ))}

            {done && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#39ff14',
                  fontSize: '0.85rem',
                  marginTop: '1rem',
                  textShadow: '0 0 20px rgba(57,255,20,0.9)',
                }}
              >
                █ LAUNCHING...
              </motion.div>
            )}
          </div>

          <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
