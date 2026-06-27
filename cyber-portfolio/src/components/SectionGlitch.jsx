import { useEffect, useRef } from 'react';

/* Canvas-based violent RGB glitch that fires on every section entry */
export default function SectionGlitch() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const SECTIONS = ['hero','about','skills','certifications','leadership','projects','education','contact'];
    const fired = new Set();

    const triggerGlitch = (intensity = 1) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      let frame = 0;
      const FRAMES = 9;

      const COLORS = [
        `rgba(255,0,60,`,
        `rgba(0,240,255,`,
        `rgba(57,255,20,`,
        `rgba(255,0,60,`,
      ];

      const drawFrame = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (frame >= FRAMES) {
          // Fade out
          let opacity = 1;
          const fadeOut = () => {
            opacity -= 0.15;
            if (opacity <= 0) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
            ctx.globalAlpha = opacity;
            setTimeout(fadeOut, 30);
          };
          fadeOut();
          return;
        }

        ctx.globalAlpha = 1;

        // ─── Horizontal tear bands ───────────────────────────────────
        const numBands = 5 + Math.floor(Math.random() * 5 * intensity);
        for (let i = 0; i < numBands; i++) {
          const bandTop    = Math.random() * canvas.height;
          const bandH      = 8 + Math.random() * 55 * intensity;
          const offsetX    = (Math.random() - 0.5) * 60 * intensity;
          const colorIdx   = Math.floor(Math.random() * COLORS.length);
          const alpha      = 0.08 + Math.random() * 0.18;

          ctx.save();
          ctx.beginPath();
          ctx.rect(0, bandTop, canvas.width, bandH);
          ctx.clip();
          ctx.fillStyle = `${COLORS[colorIdx]}${alpha})`;
          ctx.fillRect(offsetX, bandTop, canvas.width, bandH);
          ctx.restore();
        }

        // ─── RGB channel split overlay ───────────────────────────────
        if (frame % 2 === 0) {
          const splitAmt = 6 + Math.random() * 12 * intensity;

          // Red channel left
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = `rgba(255,0,60,0.06)`;
          ctx.fillRect(-splitAmt, 0, canvas.width, canvas.height);
          ctx.restore();

          // Cyan channel right
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = `rgba(0,240,255,0.06)`;
          ctx.fillRect(splitAmt, 0, canvas.width, canvas.height);
          ctx.restore();
        }

        // ─── Pixel scramble blocks ────────────────────────────────────
        if (frame === 1 || frame === 4) {
          for (let b = 0; b < 6; b++) {
            const bx = Math.random() * canvas.width;
            const by = Math.random() * canvas.height;
            const bw = 30 + Math.random() * 80;
            const bh = 4 + Math.random() * 20;
            ctx.fillStyle = `rgba(57,255,20,${0.03 + Math.random() * 0.07})`;
            ctx.fillRect(bx, by, bw, bh);
          }
        }

        // ─── Full-screen flash on first frame ────────────────────────
        if (frame === 0) {
          ctx.fillStyle = `rgba(0,240,255,0.035)`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        frame++;
        setTimeout(drawFrame, 55 + Math.random() * 30);
      };

      drawFrame();
    };

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = entry.target.id;
        if (entry.isIntersecting && !fired.has(id)) {
          fired.add(id);
          const intense = ['projects','contact','certifications'].includes(id) ? 1.6 : 1;
          triggerGlitch(intense);
        }
      });
    }, { threshold: 0.25 });

    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 8600,
        pointerEvents: 'none',
      }}
    />
  );
}
