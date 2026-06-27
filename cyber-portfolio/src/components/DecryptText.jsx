import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const GLYPHS = '!@#$%^&*()_+-=[]{}|;:.<>?/~`▒░█▄▀■□0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export default function DecryptText({
  text,
  as: Tag = 'span',
  className = '',
  duration = 900,
  delay = 0,
  autoStart = false,
  triggerOnView = true,
  style = {},
}) {
  const ref = useRef(null);
  const frameRef = useRef(null);
  const startRef = useRef(null);
  const [displayed, setDisplayed] = useState(autoStart ? text : scramble(text));
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  function scramble(t) {
    return t.split('').map(c => {
      if (c === ' ' || c === '\n') return c;
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }).join('');
  }

  function runDecrypt() {
    cancelAnimationFrame(frameRef.current);
    startRef.current = null;

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current - delay;
      if (elapsed < 0) { frameRef.current = requestAnimationFrame(animate); return; }

      const progress = Math.min(elapsed / duration, 1);
      const locked = Math.floor(progress * text.length);

      const result = text.split('').map((c, i) => {
        if (c === ' ' || c === '\n') return c;
        if (i < locked) return c;
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }).join('');

      setDisplayed(result);
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
      else setDisplayed(text);
    };

    frameRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    if ((triggerOnView && isInView) || autoStart) {
      runDecrypt();
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [isInView, autoStart]);

  return (
    <Tag ref={ref} className={`font-mono ${className}`} style={style}>
      {displayed}
    </Tag>
  );
}
