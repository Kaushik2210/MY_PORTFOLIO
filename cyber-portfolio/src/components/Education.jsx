import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EDU = [
  {
    degree: 'Master of Computer Applications (MCA)',
    institution: 'Christ University',
    period: '2026 – 2028',
    location: 'Bengaluru, India',
    status: 'UPCOMING',
    color: '#39ff14',
  },
  {
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: "St. Joseph's University",
    period: '2023 – 2026',
    location: 'Bengaluru, India',
    status: 'ACTIVE',
    color: '#00f0ff',
  },
];

export default function Education() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="education" ref={ref} style={{ padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 6vw, 5rem)', position: 'relative', zIndex: 1 }}>
      <p className="section-prompt">&gt; cd ./education</p>

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
        ACADEMIC<span style={{ color: '#39ff14' }}>_RECORD</span>
      </motion.h2>

      {/* Timeline */}
      <div style={{ position: 'relative', maxWidth: 700 }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 12,
          bottom: 12,
          width: 1,
          background: 'linear-gradient(to bottom, #39ff14, #00f0ff)',
          opacity: 0.3,
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingLeft: '2.5rem' }}>
          {EDU.map((edu, i) => (
            <motion.div
              key={edu.institution}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              style={{ position: 'relative' }}
            >
              {/* Timeline dot */}
              <div style={{
                position: 'absolute',
                left: -37,
                top: 8,
                width: 10,
                height: 10,
                border: `2px solid ${edu.color}`,
                background: '#0a0e0f',
                boxShadow: `0 0 10px ${edu.color}`,
              }} />

              <div style={{
                border: `1px solid ${edu.color}22`,
                background: 'rgba(13,17,23,0.8)',
                padding: '1.2rem 1.5rem',
                position: 'relative',
              }}>
                {/* Status */}
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 14,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.58rem',
                  color: edu.color,
                  border: `1px solid ${edu.color}44`,
                  padding: '2px 8px',
                  letterSpacing: '0.1em',
                }}>
                  {edu.status}
                </div>

                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1rem',
                  color: '#e6e6e6',
                  fontWeight: 600,
                  marginBottom: '0.25rem',
                  paddingRight: '5rem',
                }}>
                  {edu.degree}
                </div>

                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.82rem',
                  color: edu.color,
                  marginBottom: '0.2rem',
                }}>
                  {edu.institution}
                </div>

                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.7rem',
                  color: '#8b949e',
                }}>
                  {edu.period} &nbsp;·&nbsp; {edu.location}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
