import { useEffect, useRef, useState } from 'react';

const HEX_CHARS = '0123456789ABCDEF';
const randomHex = (n = 2) => Array.from({ length: n }, () => HEX_CHARS[Math.floor(Math.random() * 16)]).join('');
const randomByte = () => `0x${randomHex(2)}`;

/* Data exfiltration particle stream — fires on Projects + Contact sections */
export default function DataExfil() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const active    = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const isMobile = window.innerWidth < 768;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* ─── Particle pool ─── */
    class Particle {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x = initial
          ? Math.random() * canvas.width
          : canvas.width * 0.1 + Math.random() * canvas.width * 0.4;
        this.y = 80 + Math.random() * (canvas.height - 160);
        this.vx = 2.5 + Math.random() * 4;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.alpha = 0;
        this.targetAlpha = 0.35 + Math.random() * 0.45;
        this.size  = isMobile ? 8 + Math.random() * 4 : 9 + Math.random() * 5;
        this.label = this.makeLabel();
        this.color = Math.random() > 0.7
          ? `rgba(0,240,255,`
          : Math.random() > 0.5
            ? `rgba(57,255,20,`
            : `rgba(255,0,60,`;
        this.fadeIn  = true;
        this.fadeOut = false;
      }
      makeLabel() {
        const r = Math.random();
        if (r < 0.3) return `${randomByte()} ${randomByte()} ${randomByte()}`;
        if (r < 0.55) return `[${randomHex(4)}]`;
        if (r < 0.75) return `0b${Array.from({length:8},()=>Math.round(Math.random())).join('')}`;
        return `"${randomHex(6)}"`;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += (Math.random() - 0.5) * 0.05;
        if (this.fadeIn) {
          this.alpha = Math.min(this.alpha + 0.06, this.targetAlpha);
          if (this.alpha >= this.targetAlpha) this.fadeIn = false;
        }
        if (this.x > canvas.width * 0.75) this.fadeOut = true;
        if (this.fadeOut) this.alpha = Math.max(this.alpha - 0.04, 0);
        return this.alpha > 0 && this.x < canvas.width + 60;
      }
      draw(ctx) {
        ctx.font = `${this.size}px JetBrains Mono, monospace`;
        ctx.shadowBlur  = 8;
        ctx.shadowColor = `${this.color}0.6)`;
        ctx.fillStyle   = `${this.color}${this.alpha})`;
        ctx.fillText(this.label, this.x, this.y);
        ctx.shadowBlur  = 0;
      }
    }

    const MAX = isMobile ? 30 : 70;
    let particles = [];
    let spawnTimer = 0;

    const draw = () => {
      if (!active.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn
      spawnTimer++;
      if (spawnTimer % 3 === 0 && particles.length < MAX) {
        particles.push(new Particle());
      }

      // Update & draw
      particles = particles.filter(p => {
        const alive = p.update();
        if (alive) p.draw(ctx);
        return alive;
      });

      // Right-edge vignette to sell the "going off-screen" feel
      const grad = ctx.createLinearGradient(canvas.width * 0.6, 0, canvas.width, 0);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, 'rgba(10,14,15,0.9)');
      ctx.fillStyle = grad;
      ctx.fillRect(canvas.width * 0.6, 0, canvas.width * 0.4, canvas.height);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    /* ─── Section observers ─── */
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (['projects','contact'].includes(entry.target.id)) {
          active.current = entry.isIntersecting;
        }
      });
    }, { threshold: 0.2 });

    ['projects','contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    const onHidden = () => { if (document.hidden) active.current = false; };
    document.addEventListener('visibilitychange', onHidden);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      obs.disconnect();
      document.removeEventListener('visibilitychange', onHidden);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        pointerEvents: 'none',
      }}
    />
  );
}
