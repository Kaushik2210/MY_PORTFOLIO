import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const GH = 'https://github.com/Kaushik2210';

const PROJECTS = [
  {
    id: 'proj-001',
    title: 'ORBITAL SENTINEL',
    category: 'SPACE CYBERSECURITY',
    description: 'Anomaly detection for space missions that tells cyberattacks apart from sensor faults, hardware failures and solar weather. Runs layered detectors over real NASA telemetry with explainable attribution, MITRE ATT&CK mapping and AI-written incident reports.',
    tags: ['Python', 'PyTorch', 'ONNX', 'FastAPI', 'Next.js', 'MITRE ATT&CK'],
    repo: `${GH}/ORBITAL-SENTINEL`,
    featured: true,
  },
  {
    id: 'proj-002',
    title: 'Deepfake Detector',
    category: 'TRUST & SAFETY / AI',
    description: 'Synthetic-media detection platform that returns calibrated probabilities with visual evidence instead of a binary verdict. One detection core serves a web app, a Chrome extension and a REST API.',
    tags: ['Python', 'PyTorch', 'FastAPI', 'Next.js', 'Computer Vision'],
    repo: `${GH}/Deepfake-Detector`,
    featured: true,
  },
  {
    id: 'proj-003',
    title: 'PORTCULLIS',
    category: 'LLM SECURITY',
    description: 'Adversarial prompt-injection detection gateway that sits in front of LLM applications and screens incoming prompts before they reach the model.',
    tags: ['Python', 'LLM Security', 'Prompt Injection', 'Gateway'],
    repo: `${GH}/PORTCULLIS`,
    featured: true,
  },
  {
    id: 'proj-004',
    title: 'GLYPHFORGE',
    category: 'GRAPHICS / WEBGL',
    description: 'GPU-native ASCII art engine for the browser. Converts photos to character grids using perceptual shape-matching, linear-light colour maths and Oklab clustering, rendered with a single GPU-instanced draw call.',
    tags: ['TypeScript', 'React', 'WebGL', 'Canvas'],
    repo: `${GH}/GLYPHFORGE`,
    live: 'https://glyphforge-web.vercel.app',
  },
  {
    id: 'proj-005',
    title: 'AlgoVerse',
    category: 'FULL-STACK / EDTECH',
    description: 'DSA visualisation and interview-prep platform with 25 data-structure modules, 13 pattern guides, 635+ explained LeetCode solutions, gamified progress and a live leaderboard.',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    repo: `${GH}/AlgoVerse`,
    live: 'https://algoverse-lovat-seven.vercel.app',
  },
  {
    id: 'proj-006',
    title: 'gitVisualise',
    category: 'DEVELOPER TOOLS / OPEN SOURCE',
    description: 'Paste a GitHub link and get an interactive, narrated architecture tour of the repo. Ships as a website, CLI, Claude Code skill and GitHub Action with zero dependencies.',
    tags: ['JavaScript', 'Node.js', 'GitHub Actions', 'Static Analysis'],
    repo: `${GH}/gitVisualise`,
    live: 'https://kaushik2210.github.io/gitVisualise/',
  },
];

const GLYPHS = '!@#$%^&*()_+-=[]{}░▒▓0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function scramble(text) {
  return text.split('').map(c => c === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join('');
}

function ProjectCard({ project, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [hovered, setHovered] = useState(false);
  const [titleDisplay, setTitleDisplay] = useState(project.title);
  const frameRef = useRef(null);

  const runDecrypt = (text, setter, dur = 400) => {
    cancelAnimationFrame(frameRef.current);
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / dur, 1);
      const locked = Math.floor(progress * text.length);
      const result = text.split('').map((c, i) =>
        c === ' ' ? ' ' : (i < locked ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])
      ).join('');
      setter(result);
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
      else setter(text);
    };
    frameRef.current = requestAnimationFrame(animate);
  };

  const handleHover = (on) => {
    setHovered(on);
    if (on) runDecrypt(project.title, setTitleDisplay, 350);
    else setTitleDisplay(project.title);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      className="hud-card"
      style={{
        flex: '1 1 320px',
        border: `1px solid ${hovered ? 'rgba(0,240,255,0.5)' : 'rgba(57,255,20,0.15)'}`,
        background: 'rgba(13,17,23,0.85)',
        padding: '1.5rem',
        position: 'relative',
        transition: 'border-color 0.25s, box-shadow 0.25s',
        boxShadow: hovered ? '0 0 30px rgba(0,240,255,0.1)' : 'none',
        cursor: 'none',
      }}
    >
      <div className="hud-br" />

      {project.featured && (
        <div style={{
          position: 'absolute',
          top: -1,
          right: 16,
          background: '#39ff14',
          color: '#0d1117',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.58rem',
          padding: '2px 8px',
          letterSpacing: '0.1em',
          fontWeight: 700,
        }}>
          FEATURED
        </div>
      )}

      {/* Project ID */}
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.6rem',
        color: hovered ? '#00f0ff' : '#39ff14',
        opacity: 0.5,
        letterSpacing: '0.15em',
        marginBottom: '0.6rem',
        marginTop: '0.3rem',
        transition: 'color 0.2s',
      }}>
        {project.id.toUpperCase()} // {project.category} &gt;
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
        color: hovered ? '#00f0ff' : '#e6e6e6',
        fontWeight: 600,
        marginBottom: '0.75rem',
        transition: 'color 0.2s',
        minHeight: '1.4em',
      }}>
        {titleDisplay}
      </div>

      {/* Description */}
      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.87rem',
        color: '#8b949e',
        lineHeight: 1.7,
        marginBottom: '1.2rem',
        filter: hovered ? 'none' : 'none',
        transition: 'filter 0.3s',
      }}>
        {project.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.2rem' }}>
        {project.tags.map(tag => (
          <span key={tag} style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.65rem',
            color: hovered ? '#00f0ff' : '#39ff14',
            border: `1px solid ${hovered ? 'rgba(0,240,255,0.3)' : 'rgba(57,255,20,0.25)'}`,
            padding: '2px 8px',
            transition: 'all 0.2s',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-terminal ${hovered ? 'btn-terminal-cyan' : ''}`}
          style={{ fontSize: '0.72rem', padding: '0.4rem 1rem' }}
        >
          [ Source ]
        </a>
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-terminal ${hovered ? 'btn-terminal-cyan' : ''}`}
            style={{ fontSize: '0.72rem', padding: '0.4rem 1rem' }}
          >
            [ Live Demo ]
          </a>
        )}
      </div>

      {/* Glitch flash overlay on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="glitch"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,240,255,0.04)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="projects" ref={ref} style={{ padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 6vw, 5rem)', position: 'relative', zIndex: 1 }}>
      <p className="section-prompt">&gt; cd ./projects</p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          color: '#e6e6e6',
          marginBottom: '0.5rem',
        }}
      >
        PROJECT<span style={{ color: '#39ff14' }}>_ARCHIVE</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.7rem',
          color: '#8b949e',
          marginBottom: '2.5rem',
          letterSpacing: '0.05em',
        }}
      >
        // selected work: security, AI and full-stack engineering
      </motion.p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', maxWidth: 1200 }}>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} delay={i * 0.12} />
        ))}
      </div>

      <a href={GH + '?tab=repositories'} target="_blank" rel="noopener noreferrer" className="btn-terminal" style={{ display: 'inline-block', marginTop: '2rem', fontSize: '0.75rem' }}>
        [ View all repositories ]
      </a>
    </section>
  );
}
