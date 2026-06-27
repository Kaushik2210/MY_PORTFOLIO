import { useEffect, useRef } from 'react';

export default function GlitchText({ text, className = '', style = {} }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = containerRef.current;
    let timeoutId;

    const scheduleGlitch = () => {
      const delay = 8000 + Math.random() * 7000;
      timeoutId = setTimeout(() => {
        if (!el) return;
        el.classList.add('glitching');
        setTimeout(() => {
          el.classList.remove('glitching');
          scheduleGlitch();
        }, 120);
      }, delay);
    };

    scheduleGlitch();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <style>{`
        .glitch-wrap { position: relative; display: inline-block; }
        .glitch-wrap .glitch-r,
        .glitch-wrap .glitch-b {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
        }
        .glitch-wrap.glitching .glitch-r {
          opacity: 0.8;
          color: #ff003c;
          animation: glR 0.12s steps(1) forwards;
        }
        .glitch-wrap.glitching .glitch-b {
          opacity: 0.8;
          color: #00f0ff;
          animation: glB 0.12s steps(1) forwards;
        }
        @keyframes glR {
          0%  { clip-path: inset(20% 0 60% 0); transform: translate(-4px, 1px); }
          33% { clip-path: inset(55% 0 15% 0); transform: translate(3px, -2px); }
          66% { clip-path: inset(5% 0 80% 0);  transform: translate(-2px, 2px); }
          100%{ opacity: 0; }
        }
        @keyframes glB {
          0%  { clip-path: inset(60% 0 5% 0);  transform: translate(4px, -1px); }
          33% { clip-path: inset(15% 0 55% 0); transform: translate(-3px, 2px); }
          66% { clip-path: inset(80% 0 5% 0);  transform: translate(2px, -2px); }
          100%{ opacity: 0; }
        }
      `}</style>
      <span ref={containerRef} className={`glitch-wrap ${className}`} style={style}>
        <span className="glitch-r" aria-hidden="true">{text}</span>
        <span className="glitch-b" aria-hidden="true">{text}</span>
        {text}
      </span>
    </>
  );
}
