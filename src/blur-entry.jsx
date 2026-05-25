import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import GradualBlur from './GradualBlur';

const BLUR_PROPS = {
  target: 'page',
  strength: 3,
  height: '7rem',
  divCount: 8,
  curve: 'bezier',
  exponential: true,
  opacity: 1,
  zIndex: 9000,
};

const FADE_STYLE_BASE = {
  position: 'fixed',
  left: 0,
  right: 0,
  height: '7rem',
  pointerEvents: 'none',
  zIndex: 8999,
};

function PageBlur() {
  const [footerVisible, setFooterVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (footer) {
      const observer = new IntersectionObserver(
        ([entry]) => setFooterVisible(entry.isIntersecting),
        { threshold: 0.01 }
      );
      observer.observe(footer);
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const opacity = scrolled && !footerVisible ? 1 : 0;
  const transition = 'opacity 0.4s ease';

  return (
    <>
      <GradualBlur
        {...BLUR_PROPS}
        position="bottom"
        style={{ opacity, transition }}
      />
      <div
        style={{
          ...FADE_STYLE_BASE,
          bottom: 0,
          background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
          opacity,
          transition,
        }}
      />
    </>
  );
}

const mount = document.createElement('div');
mount.id = 'pageBlurMount';
document.body.appendChild(mount);
ReactDOM.createRoot(mount).render(<PageBlur />);
