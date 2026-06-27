import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Narrative script: one entry per scroll section ─── */
const SCRIPT = [
  {
    section: 'hero',
    label: 'INITIALIZING',
    color: '#39ff14',
    lines: [
      { text: '> nmap -sV 192.168.1.1 --target=portfolio', delay: 0 },
      { text: 'PORT   STATE  SERVICE', delay: 700, dim: true },
      { text: '80/tcp open   http  (SVK_SRV)', delay: 900, dim: true },
      { text: '443/tcp open  https (SECURE)', delay: 1100, dim: true },
      { text: '> target_identified: S_V_KAUSHIK', delay: 1400, accent: true },
      { text: '> initiating_breach_protocol v4.2...', delay: 1900 },
      { text: '[OK] stealth_mode: ACTIVE', delay: 2400, success: true },
    ],
  },
  {
    section: 'about',
    label: 'RECON',
    color: '#00f0ff',
    lines: [
      { text: '> accessing CLASSIFIED_FILES...', delay: 0 },
      { text: '> curl -X GET /api/personal_data', delay: 500 },
      { text: '[WARN] WAF detected — bypassing...', delay: 1000, warn: true },
      { text: '> sqlmap --level=5 --risk=3', delay: 1500 },
      { text: '[INFO] injecting payloads...', delay: 2000, dim: true },
      { text: '[INFO] decrypting identity records', delay: 2500, dim: true },
      { text: '[OK] DOC-SVK-001 extracted', delay: 3000, success: true },
    ],
  },
  {
    section: 'skills',
    label: 'SCANNING',
    color: '#39ff14',
    lines: [
      { text: '> nikto -h target --scan=full', delay: 0 },
      { text: '[INFO] scanning skill_matrix...', delay: 600, dim: true },
      { text: '[WARN] Linux expertise detected', delay: 1100, warn: true },
      { text: '[WARN] Threat Analysis active', delay: 1400, warn: true },
      { text: '[WARN] AWS cloud access confirmed', delay: 1700, warn: true },
      { text: '[ERROR] unable to exploit — too hardened', delay: 2200, error: true },
      { text: '> pivoting strategy...', delay: 2700 },
    ],
  },
  {
    section: 'certifications',
    label: 'CREDENTIAL THEFT',
    color: '#ff003c',
    lines: [
      { text: '> hashcat -a 0 cert_hash.txt', delay: 0 },
      { text: '[INFO] IBM cert hash: 9f3a2c...', delay: 700, dim: true },
      { text: '[INFO] attempting dictionary attack', delay: 1200, dim: true },
      { text: '[ERROR] HASH MISMATCH — legit cert', delay: 1800, error: true },
      { text: '> certificate_forgery: FAILED', delay: 2300, error: true },
      { text: '[OK] creds confirmed authentic', delay: 2800, success: true },
    ],
  },
  {
    section: 'leadership',
    label: 'OSINT',
    color: '#00f0ff',
    lines: [
      { text: '> theHarvester -d svkaushik', delay: 0 },
      { text: '[INFO] social_engineering scan...', delay: 700, dim: true },
      { text: '[INFO] Google Ambassador: VERIFIED', delay: 1200, dim: true },
      { text: '[INFO] 2x university network access', delay: 1600, dim: true },
      { text: '> network_map: Christ + St.Josephs', delay: 2100 },
      { text: '[OK] high-value target confirmed', delay: 2600, success: true },
    ],
  },
  {
    section: 'projects',
    label: 'EXFILTRATION',
    color: '#39ff14',
    lines: [
      { text: '> git clone github.com/Kaushik2210', delay: 0 },
      { text: 'Cloning into target_repo...', delay: 600, dim: true },
      { text: '[INFO] analyzing source_code...', delay: 1100, dim: true },
      { text: '[WARN] encryption layers detected', delay: 1600, warn: true },
      { text: '> exfil --stealth CyberSentinel.zip', delay: 2000 },
      { text: '[OK] 3 repos cloned successfully', delay: 2500, success: true },
    ],
  },
  {
    section: 'education',
    label: 'DATA BREACH',
    color: '#00f0ff',
    lines: [
      { text: '> accessing academic_records...', delay: 0 },
      { text: '[INFO] BCA — St. Josephs (2023-26)', delay: 700, dim: true },
      { text: '[INFO] MCA — Christ University (2026)', delay: 1200, dim: true },
      { text: '[WARN] record integrity: VERIFIED', delay: 1700, warn: true },
      { text: '[ERROR] cannot alter records — locked', delay: 2200, error: true },
    ],
  },
  {
    section: 'contact',
    label: 'REVERSE SHELL',
    color: '#ff003c',
    lines: [
      { text: '> nc -lvnp 4444 --target reverse', delay: 0 },
      { text: '[INFO] establishing reverse_shell...', delay: 700, dim: true },
      { text: 'listening on 0.0.0.0:4444', delay: 1100, dim: true },
      { text: '> Connection from svkaushik2210', delay: 1600, accent: true },
      { text: '[OK] BREACH COMPLETE — full access', delay: 2200, success: true },
      { text: '> pwd: /portfolio/root/contact', delay: 2700 },
      { text: '> whoami: OWNER — nice try, hacker.', delay: 3200, accent: true },
    ],
  },
];

/* ─── Typewriter for a list of lines ─── */
function TerminalLines({ lines, key: k }) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    const timers = [];
    lines.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setVisible(prev => [...prev, i]);
      }, line.delay));
    });
    return () => timers.forEach(clearTimeout);
  }, [k]);

  const color = (line) => {
    if (line.error)   return '#ff003c';
    if (line.success) return '#39ff14';
    if (line.warn)    return '#ffcc00';
    if (line.accent)  return '#00f0ff';
    if (line.dim)     return '#556070';
    return '#c0ccd8';
  };

  return (
    <>
      {lines.map((line, i) => (
        <AnimatePresence key={i}>
          {visible.includes(i) && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.67rem',
                color: color(line),
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {line.text}
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </>
  );
}

export default function HackerTerminal() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [scriptKey, setScriptKey] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastSection = useRef('');

  /* track which section is in viewport */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const idx = SCRIPT.findIndex(s => s.section === id);
            if (idx !== -1 && id !== lastSection.current) {
              lastSection.current = id;
              setActiveIdx(idx);
              setScriptKey(k => k + 1);
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    SCRIPT.forEach(s => {
      const el = document.getElementById(s.section);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const current = SCRIPT[activeIdx];

  if (isMobile) {
    return (
      <>
        {/* Mobile FAB toggle */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9000,
            background: '#0d1117',
            border: '1px solid #39ff14',
            color: '#39ff14',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.7rem',
            padding: '8px 14px',
            cursor: 'none',
            boxShadow: '0 0 16px rgba(57,255,20,0.3)',
          }}
        >
          {mobileOpen ? '[CLOSE_TERM]' : '[>_ HACKER]'}
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed',
                bottom: 70,
                right: 16,
                left: 16,
                zIndex: 8999,
                maxHeight: '50vh',
                overflow: 'hidden',
                background: 'rgba(7,11,12,0.97)',
                border: '1px solid rgba(57,255,20,0.4)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <TermBody current={current} scriptKey={scriptKey} activeIdx={activeIdx} />
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
      style={{
        position: 'fixed',
        top: '50%',
        right: 0,
        transform: minimized ? 'translateY(-50%) translateX(calc(100% - 36px))' : 'translateY(-50%)',
        zIndex: 8000,
        width: 290,
        background: 'rgba(7,11,12,0.93)',
        border: '1px solid rgba(57,255,20,0.35)',
        borderRight: 'none',
        backdropFilter: 'blur(16px)',
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Collapse tab */}
      <button
        onClick={() => setMinimized(m => !m)}
        style={{
          position: 'absolute',
          left: -28,
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#0d1117',
          border: '1px solid rgba(57,255,20,0.35)',
          borderRight: 'none',
          color: '#39ff14',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem',
          width: 28,
          height: 80,
          cursor: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          writingMode: 'vertical-lr',
          letterSpacing: '0.1em',
          padding: 0,
        }}
      >
        {minimized ? '▶ TERM' : '◀ HIDE'}
      </button>

      <TermBody current={current} scriptKey={scriptKey} activeIdx={activeIdx} minimized={minimized} />
    </motion.div>
  );
}

function TermBody({ current, scriptKey, activeIdx, minimized }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 100);
    }
  }, [scriptKey]);

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Title bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 10px',
        borderBottom: '1px solid rgba(57,255,20,0.2)',
        background: 'rgba(57,255,20,0.05)',
      }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff003c', display: 'inline-block' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffcc00', display: 'inline-block' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#39ff14', display: 'inline-block', boxShadow: '0 0 6px #39ff14' }} />
        </div>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.62rem',
          color: '#39ff14',
          letterSpacing: '0.12em',
          opacity: 0.8,
        }}>
          BREACH_TERMINAL v4.2
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.6rem',
          color: current.color,
          opacity: 0.7,
          letterSpacing: '0.05em',
        }}>
          [{activeIdx + 1}/{SCRIPT.length}]
        </span>
      </div>

      {/* Phase badge */}
      <div style={{
        padding: '4px 10px',
        background: `${current.color}11`,
        borderBottom: `1px solid ${current.color}33`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: current.color,
          boxShadow: `0 0 8px ${current.color}`,
          animation: 'tbPulse 1.5s ease-in-out infinite',
          display: 'inline-block',
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.6rem',
          color: current.color,
          letterSpacing: '0.15em',
          fontWeight: 600,
        }}>
          PHASE: {current.label}
        </span>
      </div>

      {/* Breach progress bar */}
      <div style={{ padding: '6px 10px', borderBottom: '1px solid rgba(57,255,20,0.1)' }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.58rem',
          color: '#556070',
          marginBottom: 4,
        }}>
          BREACH_LEVEL
        </div>
        <div style={{ background: 'rgba(255,255,255,0.06)', height: 4, borderRadius: 2, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${((activeIdx + 1) / SCRIPT.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, #39ff14, ${current.color})`,
              boxShadow: `0 0 8px ${current.color}`,
              borderRadius: 2,
            }}
          />
        </div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.58rem',
          color: current.color,
          textAlign: 'right',
          marginTop: 2,
        }}>
          {Math.round(((activeIdx + 1) / SCRIPT.length) * 100)}%
        </div>
      </div>

      {/* Log output */}
      <div
        ref={scrollRef}
        style={{
          padding: '10px',
          maxHeight: 260,
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: '#39ff14 transparent',
        }}
      >
        <TerminalLines lines={current.lines} key={scriptKey} />
        {/* Blinking cursor */}
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.67rem',
          color: '#39ff14',
          animation: 'tbBlink 0.8s step-end infinite',
        }}>█</span>
      </div>

      {/* IP / timestamp footer */}
      <div style={{
        padding: '5px 10px',
        borderTop: '1px solid rgba(57,255,20,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.56rem',
          color: '#334455',
        }}>
          SRC: 10.0.0.{Math.floor(Math.random() * 255) + 1}
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.56rem',
          color: '#334455',
        }}>
          {new Date().toLocaleTimeString()}
        </span>
      </div>

      <style>{`
        @keyframes tbPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes tbBlink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
