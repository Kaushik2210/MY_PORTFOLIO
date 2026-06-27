import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import DecryptText from './DecryptText';

export default function Leadership() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="leadership" ref={ref} style={{ padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 6vw, 5rem)', position: 'relative', zIndex: 1 }}>
      <p className="section-prompt">&gt; cd ./leadership</p>

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
        ACTIVE<span style={{ color: '#00f0ff' }}>_ROLES</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{
          maxWidth: 700,
          border: '1px solid rgba(0,240,255,0.2)',
          background: 'rgba(13,17,23,0.8)',
          padding: '1.8rem 2rem',
          position: 'relative',
        }}
      >
        {/* Role badge */}
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.6rem',
          color: '#00f0ff',
          letterSpacing: '0.2em',
          marginBottom: '0.5rem',
          opacity: 0.6,
        }}>
          ROLE_ID: AMBASSADOR_001
        </div>

        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: '#00f0ff',
          marginBottom: '0.4rem',
          fontWeight: 600,
        }}>
          Google Student Ambassador
        </div>

        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.82rem',
          color: '#8b949e',
          marginBottom: '1rem',
        }}>
          Christ University &amp; St. Joseph's University, Bengaluru
        </div>

        <DecryptText
          text="Drives student engagement with Google and tech programs across both campuses. Facilitates workshops, events, and community initiatives to foster a culture of innovation and technical growth among students."
          as="p"
          triggerOnView
          duration={1400}
          delay={300}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.95rem',
            color: '#e6e6e6',
            lineHeight: 1.75,
          }}
        />

        {/* Active indicator */}
        <div style={{
          position: 'absolute',
          top: 14,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#39ff14',
            display: 'inline-block',
            boxShadow: '0 0 8px #39ff14',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.6rem',
            color: '#39ff14',
            opacity: 0.7,
          }}>ACTIVE</span>
        </div>
      </motion.div>

      <style>{`
        @keyframes pulse {
          0%,100%{ box-shadow: 0 0 6px #39ff14; }
          50%{ box-shadow: 0 0 14px #39ff14, 0 0 24px rgba(57,255,20,0.4); }
        }
      `}</style>
    </section>
  );
}
