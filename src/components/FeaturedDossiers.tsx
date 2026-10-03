import React from 'react';
import { Writeup } from '../types';
import { Shield, ArrowRight } from 'lucide-react';

interface FeaturedDossiersProps {
  writeups: Writeup[];
  onSelectWriteup: (writeup: Writeup) => void;
  onViewAll: () => void;
}

export const FeaturedDossiers: React.FC<FeaturedDossiersProps> = ({
  writeups,
  onSelectWriteup,
  onViewAll
}) => {
  const featured = writeups.filter(w => w.featured).slice(0, 3);

  return (
    <section className="writeups-section" id="writeups">
      <div className="writeups-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#27272a] pb-4">
          <div>
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#fbbf24] uppercase tracking-widest">
              <Shield className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>Operational Dossiers & Case Studies</span>
            </div>
            <h2 className="text-2xl font-bold font-['Geist'] text-[#f4f4f5] mt-1">
              Featured Threat Analyses
            </h2>
          </div>
          <button
            onClick={onViewAll}
            className="text-[#fbbf24] hover:text-amber-300 font-['JetBrains_Mono'] text-xs inline-flex items-center gap-1 group cursor-pointer transition-colors"
          >
            <span>View complete archive ({writeups.length})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Clean Dossier Cards */}
        <div className="writeups-grid">
          {featured.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectWriteup(item)}
              className="dossier-card group"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-primary-val font-mono text-xs font-medium">
                    {item.category}
                  </span>
                  <span className="font-mono text-xs text-zinc-400">{item.code}</span>
                </div>

                <h3 className="dossier-title">
                  {item.title}
                </h3>

                <p className="dossier-synopsis">
                  {item.summary}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {item.mitreAttack.slice(0, 1).map(tag => (
                    <span
                      key={tag}
                      className="dossier-tag text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tools.slice(0, 1).map(tool => (
                    <span
                      key={tool}
                      className="dossier-tag text-zinc-400"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="dossier-footer">
                <span className="dossier-action-link">
                  <span>Read Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="dossier-readtime">{item.readTime}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
