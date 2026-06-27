import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTIONS = ['hero', 'about', 'skills', 'certifications', 'leadership', 'projects', 'education', 'contact'];

const FAKE_IPS = [
  '203.0.113.42', '198.51.100.7', '192.0.2.88',
  '10.45.12.201', '172.16.254.3', '45.33.32.156',
];

function randomIP() {
  return FAKE_IPS[Math.floor(Math.random() * FAKE_IPS.length)];
}

export default function BreachHUD() {
  const [breached, setBreached] = useState(0); // 0-8
  const [log, setLog] = useState([]);
  const [ip, setIp] = useState(randomIP());
  const [packetCount, setPacketCount] = useState(0);
  const lastSection = useRef('');
  const logRef = useRef(null);

  // Scroll tracking
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const idx = SECTIONS.indexOf(id);
          if (idx !== -1 && id !== lastSection.current) {
            lastSection.current = id;
            setBreached(idx + 1);
            setIp(randomIP());
            setLog(prev => [
              { id: Date.now(), text: `> ${id}.section — ACCESSED`, color: '#39ff14' },
              ...prev.slice(0, 4),
            ]);
          }
        }
      });
    }, { threshold: 0.3 });

    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Fake packet counter
  useEffect(() => {
    const t = setInterval(() => {
      setPacketCount(p => p + Math.floor(Math.random() * 12 + 3));
    }, 400);
    return () => clearInterval(t);
  }, []);

  const pct = Math.round((breached / SECTIONS.length) * 100);
  const barColor = pct < 40 ? '#39ff14' : pct < 70 ? '#ffcc00' : '#ff003c';

  return (
    <div style={{
      position: 'fixed',
      top: 60,
      left: 0,
      right: 0,
      zIndex: 8900,
      pointerEvents: 'none',
    }}>
      {/* Thin breach progress bar just below navbar */}
      <div style={{ position: 'relative', height: 3, background: 'rgba(255,255,255,0.04)' }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            background: `linear-gradient(90deg, #39ff14, ${barColor})`,
            boxShadow: `0 0 10px ${barColor}`,
          }}
        />
        {/* Glowing head */}
        <motion.div
          animate={{ left: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: -2,
            width: 3,
            height: 7,
            background: barColor,
            boxShadow: `0 0 12px ${barColor}, 0 0 24px ${barColor}`,
            transform: 'translateX(-50%)',
          }}
        />
      </div>

      {/* HUD strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2px clamp(1rem, 4vw, 2.5rem)',
        background: 'rgba(7,11,12,0.75)',
        backdropFilter: 'blur(6px)',
        borderBottom: '1px solid rgba(57,255,20,0.08)',
      }}>
        {/* Left: attacker IP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: barColor, display: 'inline-block', boxShadow: `0 0 6px ${barColor}`, animation: 'hudPulse 1.2s ease-in-out infinite' }} />
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.58rem',
            color: '#556070',
            letterSpacing: '0.08em',
          }}>
            ATK: <span style={{ color: '#ff003c' }}>{ip}</span>
          </span>
        </div>

        {/* Center: breach % */}
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.6rem',
          color: barColor,
          letterSpacing: '0.15em',
          fontWeight: 600,
        }}>
          BREACH {pct}%
        </div>

        {/* Right: packets */}
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.58rem',
          color: '#556070',
        }}>
          PKT: <span style={{ color: '#39ff14' }}>{packetCount.toLocaleString()}</span>
        </span>
      </div>

      <style>{`@keyframes hudPulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}
