import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import DecryptText from './DecryptText';
import GlitchText from './GlitchText';

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(5rem, 10vh, 8rem) clamp(1.5rem, 6vw, 5rem) 4rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Status bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.7rem',
          color: '#39ff14',
          opacity: 0.5,
          marginBottom: '2rem',
          letterSpacing: '0.1em',
        }}
      >
        ● SECURE CONNECTION ESTABLISHED &nbsp;|&nbsp; LOCATION: BENGALURU, INDIA &nbsp;|&nbsp; STATUS: ONLINE
      </motion.div>

      {/* Main name */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}
      >
        <GlitchText
          text="S V KAUSHIK"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(2.8rem, 8vw, 6rem)',
            fontWeight: 700,
            color: '#e6e6e6',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        />
      </motion.div>

      {/* Full name */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.78rem',
          color: '#00f0ff',
          opacity: 0.7,
          marginTop: '0.5rem',
          letterSpacing: '0.15em',
        }}
      >
        // SODAGUM VENKATA KAUSHIK
      </motion.p>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.6 }}
        style={{ marginTop: '1.8rem', maxWidth: 680 }}
      >
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
          color: '#8b949e',
          lineHeight: 1.6,
        }}>
          MCA Student @ Christ University &nbsp;|&nbsp; Cybersecurity &amp; AI Enthusiast &nbsp;|&nbsp;{' '}
          <span style={{ color: '#39ff14' }}>IBM Certified Cybersecurity Analyst</span>
        </p>
      </motion.div>

      {/* Subtext decrypt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        style={{ marginTop: '1rem' }}
      >
        <DecryptText
          text='"MCA student who loves tech alongside AI and cybersecurity."'
          as="p"
          autoStart
          delay={800}
          duration={1000}
          style={{ color: '#00f0ff', fontSize: '0.9rem', opacity: 0.8 }}
        />
      </motion.div>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}
      >
        <a href="#projects" className="btn-terminal">[ run ./projects ]</a>
        <a href="#contact" className="btn-terminal btn-terminal-cyan">[ run ./contact ]</a>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: 'clamp(1.5rem, 6vw, 5rem)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem',
          color: '#39ff14',
          opacity: 0.35,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'blink 2s step-end infinite',
        }}
      >
        ▼ SCROLL TO DECRYPT
      </motion.div>

      <style>{`@keyframes blink{0%,100%{opacity:0.35}50%{opacity:0.7}}`}</style>
    </section>
  );
}
