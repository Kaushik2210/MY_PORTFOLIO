import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function CertCard({ title, issuer, icon, delay, placeholder }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  if (placeholder) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 0.35, y: 0 } : {}}
        transition={{ delay }}
        style={{
          border: '1px dashed rgba(139,148,158,0.3)',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          minWidth: 280,
        }}
      >
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.75rem',
          color: '#8b949e',
          letterSpacing: '0.1em',
        }}>
          [ CERT_SLOT_EMPTY ]<br/>
          <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>// add future certification here</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="hud-card"
      style={{
        border: '1px solid rgba(57,255,20,0.2)',
        background: 'rgba(13,17,23,0.8)',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1.2rem',
        minWidth: 280,
        flex: '1 1 300px',
        position: 'relative',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      whileHover={{ borderColor: 'rgba(57,255,20,0.5)', boxShadow: '0 0 24px rgba(57,255,20,0.1)' }}
    >
      <div className="hud-br" />

      {/* Icon */}
      <div style={{
        width: 44,
        height: 44,
        border: '1px solid rgba(57,255,20,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: '1.3rem',
      }}>
        {icon}
      </div>

      <div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem',
          color: '#39ff14',
          opacity: 0.6,
          letterSpacing: '0.15em',
          marginBottom: '0.3rem',
        }}>
          VERIFIED CREDENTIAL
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.95rem',
          color: '#e6e6e6',
          fontWeight: 600,
          lineHeight: 1.4,
          marginBottom: '0.25rem',
        }}>
          {title}
        </div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.7rem',
          color: '#00f0ff',
          opacity: 0.7,
        }}>
          {issuer}
        </div>
      </div>

      {/* Status badge */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 12,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.6rem',
        color: '#39ff14',
        background: 'rgba(57,255,20,0.1)',
        border: '1px solid rgba(57,255,20,0.3)',
        padding: '2px 8px',
      }}>
        ACTIVE
      </div>
    </motion.div>
  );
}

export default function Certifications() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="certifications" ref={ref} style={{ padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 6vw, 5rem)', position: 'relative', zIndex: 1 }}>
      <p className="section-prompt">&gt; cd ./certifications</p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          color: '#e6e6e6',
          marginBottom: '2.5rem',
        }}
      >
        CERT<span style={{ color: '#39ff14' }}>_VAULT</span>
      </motion.h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', maxWidth: 900 }}>
        <CertCard
          title="IBM Cybersecurity Analyst"
          issuer="IBM / Coursera — Professional Certificate"
          icon="🔐"
          delay={0.1}
        />
        <CertCard placeholder delay={0.25} />
        <CertCard placeholder delay={0.35} />
      </div>
    </section>
  );
}
