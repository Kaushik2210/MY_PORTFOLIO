import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import DecryptText from './DecryptText';

const BIO = `MCA student at Christ University with a strong interest in cybersecurity and AI. IBM Certified Cybersecurity Analyst with hands-on exposure to Linux systems, threat analysis, security tooling, and AWS cloud environments. Serves as a Google Student Ambassador for Christ University and St. Joseph's University, helping drive tech engagement on campus.`;

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} style={{ padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 6vw, 5rem)', position: 'relative', zIndex: 1 }}>
      <p className="section-prompt">&gt; cd ./about</p>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: 760,
          borderLeft: '2px solid rgba(57,255,20,0.3)',
          paddingLeft: '2rem',
        }}
      >
        <h2 style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          color: '#39ff14',
          marginBottom: '1.5rem',
          letterSpacing: '-0.01em',
        }}>
          ABOUT_ME<span style={{ color: '#00f0ff' }}>.classified</span>
        </h2>

        <div style={{
          background: 'rgba(13,17,23,0.7)',
          border: '1px solid rgba(57,255,20,0.12)',
          padding: '1.5rem 2rem',
          position: 'relative',
        }}>
          {/* Classification header */}
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.65rem',
            color: '#ff003c',
            letterSpacing: '0.2em',
            marginBottom: '1rem',
            opacity: 0.7,
          }}>
            ██ CLASSIFIED — CLEARANCE LEVEL: GRANTED ██
          </div>

          <DecryptText
            text={BIO}
            as="p"
            triggerOnView
            duration={1800}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
              lineHeight: 1.8,
              color: '#e6e6e6',
              letterSpacing: '0.01em',
            }}
          />

          {/* Corner accent */}
          <div style={{
            position: 'absolute',
            bottom: 8,
            right: 12,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.6rem',
            color: '#39ff14',
            opacity: 0.3,
          }}>
            DOC-SVK-001
          </div>
        </div>
      </motion.div>
    </section>
  );
}
