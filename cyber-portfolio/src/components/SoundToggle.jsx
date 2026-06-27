import { useState } from 'react';
import { soundEngine } from '../lib/soundEngine';
import { musicEngine } from '../lib/musicEngine';

export default function SoundToggle() {
  const [muted, setMuted] = useState(false);

  const toggle = () => {
    soundEngine.init();
    musicEngine.init();
    const next = !muted;
    setMuted(next);
    soundEngine.setMuted(next);
    musicEngine.setMuted(next);
    if (!next) soundEngine.beep(880, 0.06, 0.1);
  };

  return (
    <button
      onClick={toggle}
      title={muted ? 'Unmute' : 'Mute'}
      style={{
        position: 'fixed',
        bottom: 30,
        right: 16,
        zIndex: 9100,
        background: 'rgba(5,9,10,0.92)',
        border: `1px solid ${muted ? 'rgba(255,0,60,0.35)' : 'rgba(57,255,20,0.30)'}`,
        color: muted ? '#ff003c' : '#39ff14',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.6rem',
        letterSpacing: '0.1em',
        padding: '4px 9px',
        cursor: 'none',
        backdropFilter: 'blur(10px)',
        boxShadow: muted
          ? '0 0 8px rgba(255,0,60,0.15)'
          : '0 0 8px rgba(57,255,20,0.12)',
        transition: 'all 0.2s ease',
      }}
    >
      {muted ? '⊘ SFX' : '♪ SFX'}
    </button>
  );
}
