import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlitchText from './GlitchText';

const LINKS = [
  { label: 'about', href: '#about' },
  { label: 'skills', href: '#skills' },
  { label: 'projects', href: '#projects' },
  { label: 'education', href: '#education' },
  { label: 'contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9990,
        padding: '0 clamp(1rem, 4vw, 2.5rem)',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(10,14,15,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(57,255,20,0.1)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Logo */}
      <a href="#hero" style={{ textDecoration: 'none' }}>
        <GlitchText
          text="SVK_PORTFOLIO"
          className="font-mono"
          style={{ color: '#39ff14', fontSize: '0.85rem', letterSpacing: '0.1em' }}
        />
      </a>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="hidden-mobile">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              color: '#8b949e',
              textDecoration: 'none',
              letterSpacing: '0.08em',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = '#39ff14'}
            onMouseLeave={e => e.target.style.color = '#8b949e'}
          >
            ./{link.label}
          </a>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        className="show-mobile"
        style={{ background: 'none', border: 'none', color: '#39ff14', cursor: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem' }}
      >
        {menuOpen ? '[X]' : '[≡]'}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 60, left: 0, right: 0,
          background: 'rgba(10,14,15,0.97)', padding: '1.5rem',
          borderBottom: '1px solid rgba(57,255,20,0.15)',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          {LINKS.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              style={{ fontFamily: 'JetBrains Mono, monospace', color: '#39ff14', textDecoration: 'none', fontSize: '0.85rem' }}>
              ./{link.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media(min-width:768px){ .hidden-mobile { display:flex !important; } .show-mobile { display:none !important; } }
        @media(max-width:767px){ .hidden-mobile { display:none !important; } .show-mobile { display:block !important; } }
      `}</style>
    </motion.nav>
  );
}
