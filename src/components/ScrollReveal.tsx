'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'up' | 'left' | 'right' | 'fade';
  delay?: number; // delay in seconds or milliseconds (default: 0)
  duration?: number; // duration in ms
  style?: React.CSSProperties;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  variant = 'up',
  delay = 0,
  duration = 700,
  style = {},
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If already revealed, no need to re-observe
    if (isVisible) return;

    const el = ref.current;
    if (!el) return;

    // Initial check: reveal immediately ONLY if element is already inside visible viewport
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top <= windowHeight - 20 && rect.bottom >= 0) {
      setIsVisible(true);
      return;
    }


    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  // Determine initial transform offset before reveal
  const getInitialTransform = () => {
    if (variant === 'left') return 'translateX(-28px)';
    if (variant === 'right') return 'translateX(28px)';
    if (variant === 'fade') return 'none';
    return 'translateY(28px)';
  };

  // Convert delay parameter if given in seconds (e.g. 0.1) or ms (e.g. 100)
  const normalizedDelay = delay < 10 ? delay * 1000 : delay;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? undefined : getInitialTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${normalizedDelay}ms, transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${normalizedDelay}ms`,
        willChange: isVisible ? undefined : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
