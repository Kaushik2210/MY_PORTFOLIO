import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const trailPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const move = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', move);

    let raf;
    const animate = () => {
      trailPos.current.x += (posRef.current.x - trailPos.current.x) * 0.12;
      trailPos.current.y += (posRef.current.y - trailPos.current.y) * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailPos.current.x}px, ${trailPos.current.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Glow trail */}
      <div
        ref={trailRef}
        style={{
          position: 'fixed',
          top: -16,
          left: -16,
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(57,255,20,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform',
        }}
      />
      {/* Crosshair */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: -10,
          left: -10,
          width: 20,
          height: 20,
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="4" fill="none" stroke="#39ff14" strokeWidth="1" opacity="0.9"/>
          <line x1="10" y1="0" x2="10" y2="6" stroke="#39ff14" strokeWidth="1" opacity="0.7"/>
          <line x1="10" y1="14" x2="10" y2="20" stroke="#39ff14" strokeWidth="1" opacity="0.7"/>
          <line x1="0" y1="10" x2="6" y2="10" stroke="#39ff14" strokeWidth="1" opacity="0.7"/>
          <line x1="14" y1="10" x2="20" y2="10" stroke="#39ff14" strokeWidth="1" opacity="0.7"/>
        </svg>
      </div>
    </>
  );
}
