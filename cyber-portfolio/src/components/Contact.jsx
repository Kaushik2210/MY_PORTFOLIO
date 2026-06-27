import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const LINKS = [
  { label: 'EMAIL', value: 'svkaushik2210@gmail.com', href: 'mailto:svkaushik2210@gmail.com', icon: '✉' },
  { label: 'LINKEDIN', value: 'sodagum-venkata-kaushik', href: 'https://www.linkedin.com/in/sodagum-venkata-kaushik-3497a4248/', icon: '◈' },
  { label: 'GITHUB', value: 'Kaushik2210', href: 'https://github.com/Kaushik2210', icon: '◎' },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="contact" ref={ref} style={{ padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 6vw, 5rem) 3rem', position: 'relative', zIndex: 1 }}>
      <p className="section-prompt">&gt; cd ./contact</p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          color: '#e6e6e6',
          marginBottom: '0.75rem',
        }}
      >
        OPEN<span style={{ color: '#00f0ff' }}>_CHANNEL</span>
      </motion.h2>

      {/* Terminal sign-off */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.82rem',
          color: '#39ff14',
          opacity: 0.6,
          marginBottom: '2.5rem',
        }}
      >
        &gt; connection established<br/>
        &gt; awaiting your message...
        <span style={{ animation: 'blink 1s step-end infinite', marginLeft: 4 }}>█</span>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 560 }}>
        {LINKS.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('mailto') ? '_self' : '_blank'}
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem',
              padding: '1rem 1.2rem',
              border: '1px solid rgba(0,240,255,0.15)',
              background: 'rgba(13,17,23,0.7)',
              textDecoration: 'none',
              transition: 'border-color 0.2s, background 0.2s',
              cursor: 'none',
            }}
            whileHover={{ borderColor: 'rgba(0,240,255,0.5)', backgroundColor: 'rgba(0,240,255,0.04)' }}
          >
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '1.2rem',
              color: '#00f0ff',
              width: 28,
              textAlign: 'center',
            }}>
              {link.icon}
            </span>
            <div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.6rem',
                color: '#00f0ff',
                opacity: 0.5,
                letterSpacing: '0.15em',
                marginBottom: '0.15rem',
              }}>
                {link.label}
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.82rem',
                color: '#e6e6e6',
              }}>
                {link.value}
              </div>
            </div>
            <span style={{
              marginLeft: 'auto',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              color: '#39ff14',
              opacity: 0.4,
            }}>
              &gt;
            </span>
          </motion.a>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
        style={{
          marginTop: '4rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(57,255,20,0.1)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.7rem',
          color: '#8b949e',
          opacity: 0.5,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span>© 2026 S V KAUSHIK — ALL RIGHTS RESERVED</span>
        <span>SESSION: ENCRYPTED &nbsp;|&nbsp; BUILD: v1.0.0</span>
      </motion.div>

      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </section>
  );
}
