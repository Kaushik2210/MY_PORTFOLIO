import { useState, useEffect } from 'react';
import MatrixCanvas from './components/MatrixCanvas';
import { musicEngine } from './lib/musicEngine';
import CustomCursor from './components/CustomCursor';
import BootSequence from './components/BootSequence';
import IntrusionOverlay from './components/IntrusionOverlay';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Leadership from './components/Leadership';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';
import HackerTerminal from './components/HackerTerminal';
import BreachHUD from './components/BreachHUD';
import { AccessAlert, SectionScanner, TargetReticle } from './components/ScanEffect';
import SectionGlitch from './components/SectionGlitch';
import FloatingTerminals from './components/FloatingTerminals';
import DataExfil from './components/DataExfil';
import LiveTicker from './components/LiveTicker';
import SoundToggle from './components/SoundToggle';

const SCAN_SECTIONS = ['about','skills','certifications','leadership','projects','education','contact'];
const SCAN_COLORS   = ['#00f0ff','#39ff14','#ff003c','#00f0ff','#39ff14','#00f0ff','#ff003c'];

export default function App() {
  const [phase, setPhase] = useState('boot');

  /* Start boot music on first user interaction, then crossfade per phase */
  useEffect(() => {
    const onFirstInteraction = () => {
      musicEngine.init();
      musicEngine.transition('boot');
      window.removeEventListener('click',      onFirstInteraction);
      window.removeEventListener('keydown',    onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
    };
    window.addEventListener('click',      onFirstInteraction, { once: true });
    window.addEventListener('keydown',    onFirstInteraction, { once: true });
    window.addEventListener('touchstart', onFirstInteraction, { once: true });
  }, []);

  const handleBootComplete = () => {
    setPhase('intrusion');
    // Keep boot ambient through the SOC overlay
  };

  const handleIntrusionDone = () => {
    setPhase('main');
    musicEngine.transition('main');
  };

  return (
    <div className="scanlines" style={{ minHeight: '100vh', background: '#0a0e0f', position: 'relative', paddingBottom: 24 }}>
      <MatrixCanvas opacity={phase === 'main' ? 0.06 : 0.13} />
      <CustomCursor />

      <SoundToggle />
      {phase === 'boot'      && <BootSequence   onComplete={handleBootComplete} />}
      {phase === 'intrusion' && <IntrusionOverlay onDone={handleIntrusionDone} />}

      {phase === 'main' && (
        <>
          <Navbar />
          <BreachHUD />
          <HackerTerminal />
          <FloatingTerminals />
          <AccessAlert />
          <SectionGlitch />
          <DataExfil />
          <LiveTicker />

          {SCAN_SECTIONS.map((id, i) => (
            <SectionScanner key={id} sectionId={id} color={SCAN_COLORS[i]} />
          ))}
          {['skills','projects','contact'].map(id => (
            <TargetReticle key={id} sectionId={id} />
          ))}

          <main style={{ position: 'relative', zIndex: 1 }}>
            <Hero />
            <About />
            <Skills />
            <Certifications />
            <Leadership />
            <Projects />
            <Education />
            <Contact />
          </main>
        </>
      )}
    </div>
  );
}
