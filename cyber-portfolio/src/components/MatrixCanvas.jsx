import { useEffect, useRef } from 'react';

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*';

export default function MatrixCanvas({ opacity = 0.06 }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile ? 12 : 14;
    const cols = Math.floor(window.innerWidth / fontSize);

    const drops = Array.from({ length: cols }, () => Math.random() * -100);
    const speeds = Array.from({ length: cols }, () => 0.2 + Math.random() * 0.5);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMouse);

    let lastTime = 0;
    const draw = (time) => {
      if (document.hidden) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      const delta = time - lastTime;
      if (delta < 33) { // ~30fps cap for canvas
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;

      ctx.fillStyle = `rgba(10,14,15,0.04)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const dx = x - mouseRef.current.x;
        const dy = y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const near = dist < 120;

        const alpha = near ? Math.min(opacity * 4, 0.3) : opacity;
        ctx.fillStyle = near
          ? `rgba(57,255,20,${alpha})`
          : `rgba(0,240,255,${alpha})`;
        ctx.font = `${fontSize}px JetBrains Mono, monospace`;
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += near ? speeds[i] * 3 : speeds[i];
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    const onVisibility = () => {
      if (!document.hidden && !animRef.current) {
        animRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
