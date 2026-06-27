import { useEffect, useRef, useCallback } from 'react';

const GLYPHS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789░▒▓█▄▀■□▪▫';

export function useDecryptText(ref, originalText, options = {}) {
  const {
    duration = 1200,
    delay = 0,
    trigger = 'auto',
  } = options;

  const frameRef = useRef(null);
  const startRef = useRef(null);

  const run = useCallback(() => {
    if (!ref.current) return;
    const el = ref.current;
    const text = originalText;

    cancelAnimationFrame(frameRef.current);

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current - delay;

      if (elapsed < 0) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const lockedChars = Math.floor(progress * text.length);

      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') { result += ' '; continue; }
        if (text[i] === '\n') { result += '\n'; continue; }
        if (i < lockedChars) {
          result += text[i];
        } else {
          result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }

      el.textContent = result;

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        el.textContent = text;
      }
    };

    startRef.current = null;
    frameRef.current = requestAnimationFrame(animate);
  }, [originalText, duration, delay, ref]);

  useEffect(() => {
    if (trigger === 'auto') run();
    return () => cancelAnimationFrame(frameRef.current);
  }, [trigger, run]);

  return run;
}
