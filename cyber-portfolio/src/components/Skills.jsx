import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import DecryptText from './DecryptText';

const SKILL_GROUPS = [
  {
    category: 'SYS_SECURITY',
    color: '#39ff14',
    skills: ['Linux', 'Threat Analysis', 'Security Tools', 'Network Security', 'SIEM'],
  },
  {
    category: 'CLOUD_INFRA',
    color: '#00f0ff',
    skills: ['AWS'],
    placeholders: 2, // [ + ADD SKILL ] slots
  },
  {
    category: 'LANGUAGES_TOOLS',
    color: '#39ff14',
    skills: ['Python', 'Bash'],
    placeholders: 2,
  },
  {
    category: 'AI_ML',
    color: '#00f0ff',
    skills: ['AI Concepts', 'Machine Learning Basics'],
    placeholders: 1,
  },
];

function SkillPill({ label, color, delay, isPlaceholder }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  if (isPlaceholder) {
    return (
      <div
        ref={ref}
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.72rem',
          border: '1px dashed rgba(139,148,158,0.3)',
          color: '#8b949e',
          padding: '0.35rem 0.9rem',
          opacity: 0.4,
          letterSpacing: '0.05em',
        }}
      >
        {/* [ + ADD SKILL ] */}
        [ + ADD SKILL ]
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.3 }}
    >
      <DecryptText
        text={label}
        triggerOnView
        duration={600}
        delay={delay * 1000}
        style={{
          display: 'inline-block',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.78rem',
          border: `1px solid ${color}44`,
          color: color,
          padding: '0.35rem 0.9rem',
          background: `${color}08`,
          letterSpacing: '0.05em',
          cursor: 'default',
          transition: 'box-shadow 0.2s',
        }}
        className="skill-pill"
      />
      <style>{`.skill-pill:hover { box-shadow: 0 0 12px ${color}44; }`}</style>
    </motion.div>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" ref={ref} style={{ padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 6vw, 5rem)', position: 'relative', zIndex: 1 }}>
      <p className="section-prompt">&gt; cd ./skills</p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          color: '#e6e6e6',
          marginBottom: '2.5rem',
        }}
      >
        SKILL<span style={{ color: '#39ff14' }}>_SET</span>
      </motion.h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: 900 }}>
        {SKILL_GROUPS.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: gi * 0.15, duration: 0.5 }}
          >
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem',
              color: group.color,
              opacity: 0.6,
              letterSpacing: '0.2em',
              marginBottom: '0.75rem',
            }}>
              // {group.category}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {group.skills.map((skill, si) => (
                <SkillPill
                  key={skill}
                  label={skill}
                  color={group.color}
                  delay={gi * 0.1 + si * 0.08}
                />
              ))}
              {/* Placeholder slots */}
              {Array.from({ length: group.placeholders || 0 }).map((_, pi) => (
                <SkillPill key={`ph-${pi}`} isPlaceholder />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
