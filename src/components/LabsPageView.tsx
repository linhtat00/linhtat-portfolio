import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  Server, 
  Network, 
  ShieldCheck, 
  Terminal, 
  CheckCircle2, 
  Search, 
  Check, 
  Copy, 
  ChevronRight, 
  Calendar, 
  Clock, 
  AlertTriangle,
  FolderGit2
} from 'lucide-react';
import { LabProject, LabTrack } from '../types';
import { INITIAL_LABS } from '../data/labs';
import { VerticalReadingProgress, ProgressSectionItem } from './VerticalReadingProgress';

interface LabsPageViewProps {
  onBackToHome: () => void;
  onExploreWriteups: () => void;
  onOpenResume: () => void;
  initialSelectedLabSlug?: string | null;
}

export const LabsPageView: React.FC<LabsPageViewProps> = ({
  onBackToHome,
  onExploreWriteups,
  initialSelectedLabSlug = null
}) => {
  const [labs] = useState<LabProject[]>(INITIAL_LABS);
  const [selectedLabSlug, setSelectedLabSlug] = useState<string | null>(initialSelectedLabSlug);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('ALL');
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  useEffect(() => {
    if (initialSelectedLabSlug) {
      setSelectedLabSlug(initialSelectedLabSlug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialSelectedLabSlug]);

  // Tracks list
  const tracks: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Labs' },
    { id: 'Academic / School Project', label: 'School Projects' },
    { id: 'CompTIA CySA+', label: 'CompTIA CySA+' },
    { id: 'CEH Practical', label: 'CEH Practical' },
    { id: 'Defensive Infrastructure', label: 'Infrastructure' }
  ];

  // Filtered labs
  const filteredLabs = useMemo(() => {
    return labs.filter((lab) => {
      const matchesTrack = selectedTrack === 'ALL' || lab.track === selectedTrack;
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        lab.title.toLowerCase().includes(query) ||
        lab.code.toLowerCase().includes(query) ||
        lab.summary.toLowerCase().includes(query) ||
        lab.tools.some(t => t.toLowerCase().includes(query)) ||
        lab.category.toLowerCase().includes(query);
      return matchesTrack && matchesSearch;
    });
  }, [labs, selectedTrack, searchQuery]);

  const activeLab = useMemo(() => {
    if (!selectedLabSlug) return null;
    return labs.find(l => l.slug === selectedLabSlug) || null;
  }, [labs, selectedLabSlug]);

  const handleCopySnippet = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Helper for track badge colors
  const getTrackBadgeClass = (track: LabTrack) => {
    switch (track) {
      case 'CompTIA CySA+':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      case 'CEH Practical':
        return 'text-rose-400 bg-rose-400/10 border-rose-400/30';
      case 'Academic / School Project':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'Defensive Infrastructure':
      default:
        return 'text-sky-400 bg-sky-400/10 border-sky-400/30';
    }
  };

  const labProgressSections: ProgressSectionItem[] = [
    { id: 'lab-hero', label: 'Lab Overview', number: '01' },
    { id: 'lab-objectives', label: 'Engineering Goals', number: '02' },
    { id: 'lab-architecture', label: 'Topology & Nodes', number: '03' },
    { id: 'lab-implementation', label: 'CLI & Phases', number: '04' },
    { id: 'lab-takeaways', label: 'Key Insights', number: '05' },
    { id: 'lab-actions', label: 'Related Actions', number: '06' }
  ];

  return (
    <div className="labs-page-root">
      {/* Vertical Reading Progress Bar on Specific Lab Page */}
      {activeLab && (
        <VerticalReadingProgress
          sections={labProgressSections}
          title="LAB INDEX"
        />
      )}

      <div className="labs-page-container">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-val pb-4">
          <div className="flex items-center gap-3">
            {activeLab ? (
              <button
                onClick={() => setSelectedLabSlug(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-container-val border border-surface-val hover:border-amber-400 text-zinc-300 hover:text-primary-val font-mono text-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Labs</span>
              </button>
            ) : (
              <button
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#18181c] border border-[#27272a] hover:border-[#fbbf24] text-zinc-300 hover:text-[#fbbf24] font-['JetBrains_Mono'] text-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
            )}

            <span className="text-zinc-600 font-mono text-xs hidden sm:inline">/</span>

            <div className="font-mono text-xs text-muted-val truncate">
              <span className="text-primary-val">~/linh@analyst:$</span>{' '}
              {activeLab ? `cat /labs/${activeLab.slug}.spec` : 'ls -la /labs/projects'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExploreWriteups}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-container-val border border-surface-val hover:border-amber-400 text-zinc-200 hover:text-primary-val font-mono text-xs font-medium transition-colors cursor-pointer"
            >
              <span>Threat Writeups</span>
            </button>
          </div>
        </div>

        {/* VIEW A: DEDICATED SPECIFIC LAB DETAIL VIEW */}
        {activeLab ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Lab Detail Hero Card */}
            <div id="lab-hero" className="lab-detail-header-card">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded font-mono text-xs font-bold bg-container-val border border-surface-val text-zinc-300">
                      {activeLab.code}
                    </span>
                    <span className={`px-2.5 py-1 rounded font-mono text-xs font-bold border ${getTrackBadgeClass(activeLab.track)}`}>
                      {activeLab.track}
                    </span>
                    <span className="px-2.5 py-1 rounded font-mono text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{activeLab.status}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-muted-val">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary-val" />
                      <span>{activeLab.date}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary-val" />
                      <span>{activeLab.duration}</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sans text-zinc-100 tracking-tight">
                    {activeLab.title}
                  </h1>
                  <p className="text-sm sm:text-base font-mono text-amber-300/90 font-medium">
                    Category: {activeLab.category} · Difficulty: {activeLab.difficulty}
                  </p>
                </div>

                <p className="text-zinc-300 text-sm sm:text-base font-sans leading-relaxed max-w-4xl">
                  {activeLab.summary}
                </p>

                {/* Applied Tools Badges */}
                <div className="pt-2">
                  <div className="text-xs font-mono text-muted-val font-semibold uppercase mb-2">
                    Verified Tools & Technologies:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeLab.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-container-val border border-surface-val text-zinc-300 text-xs font-mono font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Lab Objectives Checklist */}
            <div id="lab-objectives" className="p-6 rounded-2xl bg-surface-val border border-surface-val space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-primary-val font-semibold uppercase">
                <CheckCircle2 className="w-4 h-4 text-primary-val" />
                <span>Lab Engineering Objectives & Defense Goals</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeLab.objectives.map((obj, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 flex items-start gap-3 text-xs sm:text-sm text-zinc-300"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono text-xs flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-relaxed">{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture & Topology Breakdown */}
            <div id="lab-architecture" className="p-6 sm:p-8 rounded-2xl bg-surface-val border border-surface-val space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-val pb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-primary-val font-semibold uppercase">
                  <Network className="w-4 h-4 text-primary-val" />
                  <span>Network Topology & Nodes Infrastructure</span>
                </div>
                <span className="text-xs font-mono text-muted-val">
                  {activeLab.topology.architectureType}
                </span>
              </div>

              {/* Subnets Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-muted-val font-semibold uppercase">
                  Network Segmentation & VLANs:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {activeLab.topology.networkSubnets.map((subnet, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 space-y-1.5">
                      <div className="text-xs font-bold text-amber-300 font-mono truncate">
                        {subnet.name}
                      </div>
                      <div className="text-xs font-mono text-zinc-100 bg-container-val px-2 py-0.5 rounded border border-surface-val inline-block">
                        {subnet.cidr}
                      </div>
                      <p className="text-2xs text-muted-val leading-normal">
                        {subnet.purpose}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nodes Table */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono text-muted-val font-semibold uppercase">
                  Provisioned Systems & Security Roles:
                </h4>
                <div className="overflow-x-auto rounded-xl border border-surface-val">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-container-val text-muted-val uppercase text-2xs border-b border-surface-val">
                      <tr>
                        <th className="py-3 px-4">Node Hostname</th>
                        <th className="py-3 px-4">Assigned IP</th>
                        <th className="py-3 px-4">Operating System</th>
                        <th className="py-3 px-4">Security Role & Telemetry Duty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 bg-black/40 text-zinc-300">
                      {activeLab.topology.nodes.map((node, idx) => (
                        <tr key={idx} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3 px-4 font-semibold text-primary-val whitespace-nowrap">
                            {node.name}
                          </td>
                          <td className="py-3 px-4 text-emerald-400 whitespace-nowrap font-mono">
                            {node.ip}
                          </td>
                          <td className="py-3 px-4 text-muted-val whitespace-nowrap">
                            {node.os}
                          </td>
                          <td className="py-3 px-4 text-zinc-200">
                            {node.role}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Implementation Steps & Verification Snippets */}
            <div id="lab-implementation" className="p-6 sm:p-8 rounded-2xl bg-surface-val border border-surface-val space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono text-primary-val font-semibold uppercase border-b border-surface-val pb-4">
                <Terminal className="w-4 h-4 text-primary-val" />
                <span>Technical Implementation Phases & CLI Telemetry</span>
              </div>

              <div className="space-y-6">
                {activeLab.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-black/40 border border-zinc-800 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-primary-val font-mono text-xs font-bold">
                          {step.phase}
                        </span>
                        <h4 className="text-base font-bold text-zinc-100 font-sans">
                          {step.title}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                      {step.description}
                    </p>

                    {step.commandSnippet && (
                      <div className="relative rounded-lg overflow-hidden border border-surface-val bg-black/60 mt-3">
                        <div className="bg-container-val px-3.5 py-1.5 border-b border-surface-val flex items-center justify-between text-2xs font-mono text-muted-val">
                          <span className="flex items-center gap-1.5">
                            <Terminal className="w-3 h-3 text-primary-val" />
                            <span>Verification CLI / Script</span>
                          </span>
                          <button
                            onClick={() => handleCopySnippet(step.commandSnippet!, idx)}
                            className="inline-flex items-center gap-1 text-muted-val hover:text-primary-val transition-colors cursor-pointer"
                          >
                            {copiedCodeIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400 text-2xs">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-2xs">Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3.5 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                          <code>{step.commandSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Defense Takeaways */}
            <div id="lab-takeaways" className="p-6 rounded-2xl bg-surface-val border border-surface-val space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-primary-val font-semibold uppercase">
                <ShieldCheck className="w-4 h-4 text-primary-val" />
                <span>Key Blue Team Insights & Operational Takeaways</span>
              </div>

              <div className="space-y-2.5">
                {activeLab.takeaways.map((takeaway, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 flex items-start gap-3 text-xs sm:text-sm text-zinc-300"
                  >
                    <span className="w-5 h-5 rounded bg-amber-400/10 border border-amber-400/30 text-primary-val flex items-center justify-center font-mono text-xs flex-shrink-0 font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div id="lab-actions" className="p-6 rounded-2xl bg-surface-val border border-surface-val flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => setSelectedLabSlug(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-container-val border border-surface-val hover:border-amber-400 text-zinc-200 hover:text-primary-val font-mono text-xs font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Lab Projects</span>
              </button>

              <button
                onClick={onExploreWriteups}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-val text-black font-mono text-xs font-bold hover:bg-amber-400 transition-colors cursor-pointer shadow-md"
              >
                <span>Read Correlated Threat Writeups</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* VIEW B: ALL LABS CATALOG & SEARCH GRID */
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="labs-header-banner">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-primary-val font-mono text-xs font-semibold">
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>HANDS-ON REPOSITORY // /labs</span>
                </div>

                <h1 className="labs-banner-title">
                  Cybersecurity Labs & Technical Ranges
                </h1>

                <p className="text-sm sm:text-base font-sans text-zinc-300 leading-relaxed">
                  A centralized technical archive of hands-on lab environments from university coursework, capstones, and rigorous guideline certification programs (CEH Practical, CompTIA CySA+, and enterprise Proxmox virtualization).
                </p>

                {/* Quick Stat Chips */}
                <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                  <div className="px-3 py-1.5 rounded-lg bg-container-val border border-surface-val text-zinc-300 flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-primary-val" />
                    <span>{labs.length} Documented Labs</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-container-val border border-surface-val text-zinc-300 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-primary-val" />
                    <span>150+ Total Lab Hours</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-container-val border border-surface-val text-zinc-300 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CEH / CySA+ / Capstone Standards</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search & Track Filters Bar */}
            <div className="labs-filter-nav">
              {/* Track Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {tracks.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => setSelectedTrack(track.id)}
                    className={`labs-filter-btn ${
                      selectedTrack === track.id ? 'labs-filter-btn-active' : ''
                    }`}
                  >
                    {track.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search labs, tools, CVEs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/40 border border-surface-val text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Labs Cards Grid */}
            <div className="labs-grid">
              {filteredLabs.map((lab) => (
                <div
                  key={lab.id}
                  onClick={() => setSelectedLabSlug(lab.slug)}
                  className="lab-card group"
                >
                  <div className="space-y-3.5">
                    {/* Header Chips */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-mono text-2xs font-bold bg-container-val border border-surface-val text-zinc-300">
                          {lab.code}
                        </span>
                        <span className={`px-2 py-0.5 rounded font-mono text-2xs font-bold border ${getTrackBadgeClass(lab.track)}`}>
                          {lab.track}
                        </span>
                      </div>
                      <span className="text-2xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{lab.status}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="lab-card-title group-hover:text-primary-val">
                        {lab.title}
                      </h3>
                      <p className="text-xs font-mono text-muted-val mt-1">
                        Category: {lab.category} · {lab.duration}
                      </p>
                    </div>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed line-clamp-3">
                      {lab.summary}
                    </p>

                    {/* Quick Specs / Subnets */}
                    <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800 flex items-center justify-between font-mono text-2xs text-muted-val">
                      <span>Nodes: <strong className="text-zinc-200">{lab.topology.nodes.length} VM/Sensors</strong></span>
                      <span>•</span>
                      <span>Subnets: <strong className="text-zinc-200">{lab.topology.networkSubnets.length} Segments</strong></span>
                      <span>•</span>
                      <span>Phases: <strong className="text-zinc-200">{lab.steps.length} Steps</strong></span>
                    </div>

                    {/* Tools */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {lab.tools.slice(0, 5).map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-container-val border border-surface-val text-muted-val text-2xs font-mono"
                        >
                          {tool}
                        </span>
                      ))}
                      {lab.tools.length > 5 && (
                        <span className="px-1.5 py-0.5 text-2xs font-mono text-dim-val">
                          +{lab.tools.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-dim-val">
                      Last Updated: {lab.date}
                    </span>
                    <span className="text-primary-val flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                      <span>Inspect Lab Report</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredLabs.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-surface-val border border-surface-val space-y-3">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                <h3 className="text-base font-bold text-zinc-200 font-sans">
                  No lab projects match your search filter
                </h3>
                <p className="text-xs font-mono text-dim-val">
                  Try clearing your search query or selecting "All Labs" above.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedTrack('ALL'); }}
                  className="px-4 py-2 rounded bg-container-val border border-surface-val text-xs font-mono text-primary-val hover:bg-zinc-800 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
