import React, { useState } from 'react';
import { Writeup } from '../types';

interface RecentWriteupsTableProps {
  writeups: Writeup[];
  onSelectWriteup: (writeup: Writeup) => void;
  onViewAll: () => void;
}

export const RecentWriteupsTable: React.FC<RecentWriteupsTableProps> = ({
  writeups,
  onSelectWriteup,
  onViewAll
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filtered = writeups.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Forensics') {
      return item.category.includes('Forensics') || item.category.includes('Memory') || item.category.includes('Disk');
    }
    if (activeFilter === 'Network') {
      return item.category.includes('PCAP') || item.category.includes('Network');
    }
    if (activeFilter === 'SIEM') {
      return item.category.includes('Active Directory') || item.category.includes('SIEM') || item.category.includes('Incident');
    }
    return true;
  });

  return (
    <section className="recent-writeups-section" id="ctf-feed">
      <div className="recent-writeups-container">
        {/* Header & Controls */}
        <div className="recent-writeups-header">
          <div>
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#fbbf24] uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]"></span>
              <span>Continuous Lab Verification</span>
            </div>
            <h2 className="text-2xl font-bold font-['Geist'] text-[#f4f4f5] mt-1">
              Recent Lab Triage & CTF Writeups
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 font-['JetBrains_Mono'] text-xs">
            {['All', 'Forensics', 'Network', 'SIEM'].map((filterName) => (
              <button
                key={filterName}
                onClick={() => setActiveFilter(filterName)}
                className={`recent-filter-btn ${
                  activeFilter === filterName ? 'recent-filter-btn-active' : ''
                }`}
              >
                {filterName === 'All' ? `All (${writeups.length})` : filterName}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Table View */}
        <div className="writeups-table-container">
          {/* Table Header */}
          <div className="writeups-table-head grid grid-cols-12">
            <div className="col-span-12 sm:col-span-5">Challenge / Target Incident</div>
            <div className="hidden sm:block sm:col-span-2">Domain</div>
            <div className="hidden md:block md:col-span-2">Platform</div>
            <div className="hidden md:block md:col-span-1">Difficulty</div>
            <div className="hidden lg:block lg:col-span-2 text-right">Date</div>
          </div>

          {/* Table Rows */}
          {filtered.map((row, idx) => (
            <div
              key={row.id}
              onClick={() => onSelectWriteup(row)}
              className={`writeups-table-row grid grid-cols-12 group cursor-pointer ${
                idx < filtered.length - 1 ? 'border-b border-[#27272a]/50' : ''
              }`}
            >
              {/* Incident Title */}
              <div className="col-span-12 sm:col-span-5 flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] shrink-0"></span>
                <span className="font-['Geist'] text-sm font-medium text-zinc-200 group-hover:text-[#fbbf24] transition-colors truncate">
                  {row.title}
                </span>
              </div>

              {/* Domain / Category */}
              <div className="hidden sm:block sm:col-span-2 font-['JetBrains_Mono'] text-xs text-zinc-400 truncate">
                {row.category}
              </div>

              {/* Platform */}
              <div className="hidden md:block md:col-span-2 font-['JetBrains_Mono'] text-xs text-zinc-400 truncate">
                {row.platform}
              </div>

              {/* Difficulty Tag */}
              <div className="hidden md:block md:col-span-1">
                {row.difficulty === 'HARD' && (
                  <span className="px-1.5 py-0.5 rounded bg-[#450a0a] text-[#f87171] font-['JetBrains_Mono'] text-[10px] font-bold">
                    HARD
                  </span>
                )}
                {row.difficulty === 'MED' && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-[#fbbf24] font-['JetBrains_Mono'] text-[10px] font-bold">
                    MED
                  </span>
                )}
                {row.difficulty === 'EASY' && (
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-['JetBrains_Mono'] text-[10px] font-bold">
                    EASY
                  </span>
                )}
              </div>

              {/* Date */}
              <div className="hidden lg:block lg:col-span-2 text-right font-['JetBrains_Mono'] text-xs text-zinc-500">
                {row.date}
              </div>
            </div>
          ))}
        </div>

        {/* View all writeups action */}
        <div className="text-center pt-2">
          <button
            onClick={onViewAll}
            className="text-xs font-['JetBrains_Mono'] text-zinc-400 hover:text-[#fbbf24] underline underline-offset-4 cursor-pointer"
          >
            Looking for older challenge writeups? View full library database ({writeups.length}) →
          </button>
        </div>
      </div>
    </section>
  );
};
