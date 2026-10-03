import React, { useState } from 'react';
import { Writeup, CategoryType, PlatformType, DifficultyType } from '../types';
import { Search, Filter, ArrowRight, ArrowLeft, Shield, LayoutGrid, List, FileText, Layers } from 'lucide-react';

interface WriteupOverviewViewProps {
  writeups: Writeup[];
  onSelectWriteup: (writeup: Writeup) => void;
  onBackToHome: () => void;
}

export const WriteupOverviewView: React.FC<WriteupOverviewViewProps> = ({
  writeups,
  onSelectWriteup,
  onBackToHome
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const categories = ['All', 'Memory Forensics', 'Active Directory', 'PCAP Triage', 'Disk Forensics', 'Incident Response'];
  const platforms = ['All', 'Blue Team Labs', 'HackTheBox', 'MTA Labs', 'CyberDefenders', 'Internal Range'];

  const filtered = writeups.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mitreAttack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.tools.some(tool => tool.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesPlatform = selectedPlatform === 'All' || item.platform === selectedPlatform;
    const matchesDifficulty = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesPlatform && matchesDifficulty;
  });

  return (
    <div className="w-full min-h-screen bg-[#0d0d0f] text-[#f4f4f5] pt-24 pb-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Navigation Breadcrumb matching Labs and About pages */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#27272a] pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#18181c] border border-[#27272a] hover:border-[#fbbf24] text-zinc-300 hover:text-[#fbbf24] font-['JetBrains_Mono'] text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <span className="text-zinc-600 font-mono text-xs hidden sm:inline">/</span>

            <div className="font-mono text-xs text-muted-val truncate">
              <span className="text-primary-val">~/linh@analyst:$</span> ls -la /writeups/repository
            </div>
          </div>
        </div>

        {/* Hero Banner Card matching Labs Page */}
        <div className="labs-header-banner">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4">
            {/* Top row: Repository Pill on Left, Dossiers Count on Upper Right */}
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-primary-val font-mono text-xs font-semibold">
                <FileText className="w-3.5 h-3.5" />
                <span>HANDS-ON REPOSITORY // /writeups</span>
              </div>

              <div className="px-3 py-1 rounded-lg bg-container-val border border-surface-val text-zinc-300 font-mono text-xs font-bold shadow-sm">
                <span className="text-primary-val font-bold">{filtered.length}</span> Dossiers Indexed
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-sans text-zinc-100 tracking-tight">
              Operational Dossiers & CTF Writeups
            </h1>

            <p className="font-sans text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
              Deconstructed cyber threat intelligence, forensic memory captures, network packet dissections, and detection signatures published weekly.
            </p>
          </div>
        </div>

        {/* Filter Controls Panel */}
        <div className="writeups-filter-panel">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search writeups by keyword, MITRE ID (e.g. T1574), or tool (Volatility, Zeek, Splunk)..."
                className="writeups-search-input"
              />
            </div>

            {/* View Mode Switcher */}
            <div className="writeups-viewmode-switcher self-start md:self-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`writeups-viewmode-btn ${viewMode === 'grid' ? 'writeups-viewmode-btn-active' : ''}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`writeups-viewmode-btn ${viewMode === 'table' ? 'writeups-viewmode-btn-active' : ''}`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#27272a]/60">
            <span className="text-[11px] font-['JetBrains_Mono'] text-zinc-500 uppercase mr-1">Domain:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs font-['JetBrains_Mono'] transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#fbbf24] text-[#451a03] font-semibold'
                    : 'bg-[#18181c] border border-[#27272a] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="h-4 w-px bg-[#27272a] mx-2 hidden lg:block"></div>

            <span className="text-[11px] font-['JetBrains_Mono'] text-zinc-500 uppercase mr-1 hidden sm:inline">Difficulty:</span>
            {['All', 'HARD', 'MED', 'EASY'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded text-xs font-['JetBrains_Mono'] transition-colors cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-[#fbbf24] text-[#451a03] font-semibold'
                    : 'bg-[#18181c] border border-[#27272a] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-['JetBrains_Mono'] text-zinc-400">
          <span>
            SHOWING <strong className="text-zinc-200">{filtered.length}</strong> ENTRIES
          </span>
          {(searchQuery || selectedCategory !== 'All' || selectedDifficulty !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setSelectedPlatform('All');
              }}
              className="text-[#fbbf24] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Grid Mode */}
        {viewMode === 'grid' && (
          <div className="writeups-grid">
            {filtered.map((item) => (
              <article
                key={item.id}
                onClick={() => onSelectWriteup(item)}
                className="dossier-card-container group"
              >
                <div className="flex flex-col gap-4">
                  <div className="dossier-header-row">
                    <span className="dossier-category-badge">
                      {item.category}
                    </span>
                    <span className="dossier-code-label">{item.code}</span>
                  </div>

                  <h3 className="dossier-card-title">
                    {item.title}
                  </h3>

                  <p className="dossier-card-summary line-clamp-3">
                    {item.summary}
                  </p>

                  <div className="dossier-tags-row">
                    {item.mitreAttack.map((tag) => (
                      <span
                        key={tag}
                        className="dossier-tag-pill text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tools.slice(0, 2).map((tool) => (
                      <span
                        key={tool}
                        className="dossier-tag-pill text-zinc-400"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="dossier-card-footer">
                  <span className="text-zinc-400">{item.readTime}</span>
                  <span className="text-[#fbbf24] group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform font-medium">
                    <span>Read Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Table Mode */}
        {viewMode === 'table' && (
          <div className="writeups-table-card">
            <div className="writeups-table-header grid grid-cols-12">
              <div className="col-span-12 sm:col-span-5">Challenge / Incident</div>
              <div className="hidden sm:block sm:col-span-2">Domain</div>
              <div className="hidden md:block md:col-span-2">Platform</div>
              <div className="hidden md:block md:col-span-1">Difficulty</div>
              <div className="hidden lg:block lg:col-span-2 text-right">Date</div>
            </div>

            {filtered.map((row, idx) => (
              <div
                key={row.id}
                onClick={() => onSelectWriteup(row)}
                className={`writeups-table-row grid grid-cols-12 group ${
                  idx < filtered.length - 1 ? 'border-b border-[#27272a]/50' : ''
                }`}
              >
                <div className="col-span-12 sm:col-span-5 flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] shrink-0"></span>
                  <span className="font-['Geist'] text-sm font-medium text-zinc-200 group-hover:text-[#fbbf24] transition-colors truncate">
                    {row.title}
                  </span>
                </div>
                <div className="hidden sm:block sm:col-span-2 font-['JetBrains_Mono'] text-xs text-zinc-400 truncate">
                  {row.category}
                </div>
                <div className="hidden md:block md:col-span-2 font-['JetBrains_Mono'] text-xs text-zinc-400 truncate">
                  {row.platform}
                </div>
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
                <div className="hidden lg:block lg:col-span-2 text-right font-['JetBrains_Mono'] text-xs text-zinc-500">
                  {row.date}
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="writeups-empty-state">
            <p className="font-['JetBrains_Mono'] text-sm">No writeups found matching your query.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
              }}
              className="text-[#fbbf24] font-['JetBrains_Mono'] text-xs hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
