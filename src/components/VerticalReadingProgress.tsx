import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Compass, X } from 'lucide-react';

export interface ProgressSectionItem {
  id: string;
  label: string;
  number?: string;
}

interface VerticalReadingProgressProps {
  sections: ProgressSectionItem[];
  title?: string;
}

export const VerticalReadingProgress: React.FC<VerticalReadingProgressProps> = ({
  sections,
  title = 'INDEX'
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id || '');
  // Start collapsed on small desktop (<1536px), tablets, and phones so it doesn't cover content
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1536;
    }
    return false;
  });

  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const calculateProgressAndActive = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollTop / scrollHeight) * 100))) : 0;
      setScrollProgress(progress);

      if (fillRef.current) {
        fillRef.current.style.setProperty('--scroll-height-pct', `${progress}%`);
      }

      // Determine active section based on proximity to top of screen
      const headerOffset = 140; // compensation for fixed header
      let currentActive = sections[0]?.id || '';

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerOffset) {
            currentActive = section.id;
          }
        }
      }
      setActiveSectionId(currentActive);
    };

    window.addEventListener('scroll', calculateProgressAndActive, { passive: true });
    calculateProgressAndActive();

    return () => {
      window.removeEventListener('scroll', calculateProgressAndActive);
    };
  }, [sections]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSectionId(id);
    }
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="reading-progress-container" aria-label="Reading progress and table of contents">
      {!isOpen ? (
        /* Collapsed Floating Compass Button with Progress % */
        <button
          onClick={() => setIsOpen(true)}
          className="reading-progress-toggle-btn"
          title={`Open Table of Contents (${scrollProgress}%)`}
          aria-label="Open Table of Contents"
        >
          <Compass className="w-4 h-4 text-primary-val" />
          <span className="reading-progress-toggle-pct">{scrollProgress}%</span>
        </button>
      ) : (
        /* Expanded Table of Contents Panel */
        <nav ref={navRef} className="reading-progress-nav">
          {/* Header Row: Title on Left, Close (X) on Right */}
          <div className="reading-progress-header">
            <div className="reading-progress-title">
              <Compass className="w-3.5 h-3.5" />
              <span>{title}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="reading-progress-close-btn"
              title="Close Table of Contents"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Vertical Track and Nodes */}
          <div className="reading-progress-track-wrapper" ref={railRef}>
            <div className="reading-progress-rail" />
            <div
              ref={fillRef}
              className="reading-progress-bar-fill"
            />

            {sections.map((sec, index) => {
              const isActive = activeSectionId === sec.id;
              const displayNumber = sec.number || `0${index + 1}`.slice(-2);

              return (
                <button
                  key={sec.id}
                  onClick={() => handleScrollTo(sec.id)}
                  className={`reading-progress-item ${isActive ? 'is-active' : ''}`}
                  title={`Jump to ${sec.label}`}
                >
                  <span className="reading-progress-label">
                    <span className="opacity-60 mr-1.5">{displayNumber}.</span>
                    {sec.label}
                  </span>
                  <span className="reading-progress-dot" />
                </button>
              );
            })}
          </div>

          {/* Footer: TOP on Left, Percentage Progress on Right */}
          <div className="reading-progress-footer">
            <button
              onClick={handleScrollTop}
              className="reading-progress-top-btn"
              title="Scroll to top of document"
            >
              <ArrowUp className="w-3 h-3" />
              <span>TOP</span>
            </button>
            <span className="reading-progress-footer-pct">
              {scrollProgress}%
            </span>
          </div>
        </nav>
      )}
    </aside>
  );
};
