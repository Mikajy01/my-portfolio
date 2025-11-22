import { useEffect, useRef, useState } from 'react';

interface HandDrawnUnderlineProps {
  children: React.ReactNode;
  color?: string;
  strokeWidth?: number;
  delay?: number;
  duration?: number;
  className?: string;
}

const HandDrawnUnderline = ({ 
  children, 
  color = 'var(--color-primary)',
  delay = 0,
  duration = 2,
  className = ''
}: HandDrawnUnderlineProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
          }
        });
      },
      { 
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [delay, isVisible]);

  return (
    <span 
      ref={containerRef}
      className={`relative inline-block ${className}`}
      style={{ paddingBottom: '12px' }}
    >
      {children}
      
      <svg 
        className="absolute left-0 bottom-0 w-[110%] pointer-events-none"
        style={{
          height: '15px',
          opacity: isVisible ? 1 : 0,
          transition: `opacity ${duration * 0.2}s linear ${duration * 0.1}s`
        }}
        viewBox="0 0 109 13" 
        fill="none" 
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M0.5 0.5L93.6809 1.5L7.18088 4.5L88.6809 6L53.2419 8L57.2604 11.75L51.2327 14L52.2373 18.5" 
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          style={{
            strokeDasharray: 400,
            strokeDashoffset: isVisible ? 0 : 400,
            transition: `stroke-dashoffset ${duration}s cubic-bezier(0.65, 0, 0.35, 1)`
          }}
        />
      </svg>
    </span>
  );
};

export default HandDrawnUnderline;