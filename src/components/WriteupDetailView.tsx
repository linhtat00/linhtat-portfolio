import React, { useState, useMemo } from 'react';
import { Writeup } from '../types';
import { ArrowLeft, Share2, Copy, Check, Download, Shield, Terminal, FileCode, Database, Clock, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { VerticalReadingProgress, ProgressSectionItem } from './VerticalReadingProgress';

interface WriteupDetailViewProps {
  writeup: Writeup;
  onBack: () => void;
  onSelectOtherWriteup?: (w: Writeup) => void;
  allWriteups: Writeup[];
}

const slugify = (text: string) => {
  return 'heading-' + text
    .replace(/[*_`\[\]]/g, '')
    .replace(/\(http[^)]+\)/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const extractNodeText = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractNodeText).join('');
  }
  if (node && typeof node === 'object' && 'props' in node) {
    return extractNodeText((node as { props: { children?: React.ReactNode } }).props.children);
  }
  return '';
};

export const WriteupDetailView: React.FC<WriteupDetailViewProps> = ({
  writeup,
  onBack,
  onSelectOtherWriteup,
  allWriteups
}) => {
  const [activeTab, setActiveTab] = useState<'dossier' | 'detection' | 'iocs' | 'telemetry'>('dossier');
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
  const [copiedIOC, setCopiedIOC] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyQuery = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedQuery(id);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  const handleCopyIOC = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedIOC(val);
    setTimeout(() => setCopiedIOC(null), 2000);
  };

  const handleExportMarkdown = () => {
    const mdContent = `# ${writeup.code} - ${writeup.title}
Domain: ${writeup.category}
Platform: ${writeup.platform}
Difficulty: ${writeup.difficulty}
Date: ${writeup.date}
MITRE ATT&CK: ${writeup.mitreAttack.join(', ')}
Tools: ${writeup.tools.join(', ')}

${writeup.summary}

---

${writeup.content}
`;
    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${writeup.slug || writeup.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const currentIndex = allWriteups.findIndex(w => w.id === writeup.id);
  const prevWriteup = currentIndex > 0 ? allWriteups[currentIndex - 1] : null;
  const nextWriteup = currentIndex < allWriteups.length - 1 ? allWriteups[currentIndex + 1] : null;

  // Compute navigation sections for the vertical progress bar
  const progressSections: ProgressSectionItem[] = useMemo(() => {
    const list: ProgressSectionItem[] = [
      { id: 'writeup-header', label: 'Dossier Overview', number: '01' },
      { id: 'writeup-tabs-bar', label: 'Investigation Tabs', number: '02' }
    ];

    if (activeTab === 'dossier') {
      const h2Matches = writeup.content ? writeup.content.match(/^##\s+(.+)$/gm) : null;
      if (h2Matches && h2Matches.length > 0) {
        h2Matches.slice(0, 10).forEach((match, idx) => {
          const rawText = match.replace(/^##\s+/, '').trim();
          const cleanText = rawText.replace(/[*_`\[\]]/g, '').replace(/\(http[^)]+\)/g, '').trim();
          const slug = slugify(cleanText);
          list.push({
            id: slug,
            label: cleanText.length > 20 ? cleanText.substring(0, 18) + '...' : cleanText,
            number: `0${idx + 3}`.slice(-2)
          });
        });
      } else {
        list.push({ id: 'writeup-tab-card', label: 'Technical Analysis', number: '03' });
      }
    } else if (activeTab === 'detection') {
      list.push({ id: 'writeup-tab-card', label: 'SIEM Detections', number: '03' });
    } else if (activeTab === 'iocs') {
      list.push({ id: 'writeup-tab-card', label: 'IOC Artifacts', number: '03' });
    } else if (activeTab === 'telemetry') {
      list.push({ id: 'writeup-tab-card', label: 'Raw Telemetry', number: '03' });
    }

    list.push({ id: 'writeup-footer-nav', label: 'Related Dossiers', number: `0${list.length + 1}`.slice(-2) });
    return list;
  }, [writeup, activeTab]);

  return (
    <article className="writeup-detail-root">
      {/* Right Vertical Reading Progress Bar */}
      <VerticalReadingProgress
        sections={progressSections}
        title="DOSSIER"
      />

      <div className="writeup-detail-container">
        {/* Navigation & Breadcrumb */}
        <div className="writeup-detail-nav">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="writeup-back-btn"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>

            <span className="text-zinc-600 font-mono text-xs hidden sm:inline">|</span>

            <div className="font-mono text-xs text-muted-val truncate">
              <span className="text-primary-val">~/linh@analyst:$</span> cat /writeups/{writeup.id}.md
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportMarkdown}
              className="writeup-action-btn"
              title="Download raw markdown file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .md</span>
            </button>

            <button
              onClick={handleShare}
              className="writeup-action-btn"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-primary-val" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Dossier Header Card */}
        <header id="writeup-header" className="writeup-detail-header">
          {/* Subtle amber backdrop glow */}
          <div className="writeup-detail-glow"></div>

          {/* Badges row */}
          <div className="writeup-badges-row">
            <span className="writeup-badge-primary">
              {writeup.category}
            </span>

            <span className="writeup-badge-code">
              {writeup.code}
            </span>

            <span className="writeup-badge-platform">
              Platform: <strong className="text-zinc-100">{writeup.platform}</strong>
            </span>

            {writeup.difficulty === 'HARD' && (
              <span className="px-2 py-0.5 rounded bg-red-950/60 text-error-val font-mono text-xs font-bold border border-red-900/40">
                HARD
              </span>
            )}
            {writeup.difficulty === 'MED' && (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-primary-val font-mono text-xs font-bold border border-amber-500/30">
                MED
              </span>
            )}
            {writeup.difficulty === 'EASY' && (
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-xs font-bold border border-zinc-700">
                EASY
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="writeup-detail-title">
            {writeup.title}
          </h1>

          {/* Summary */}
          <p className="writeup-detail-summary">
            {writeup.summary}
          </p>

          {/* Meta & Tags */}
          <div className="writeup-detail-meta-bar">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary-val" />
                <span>{writeup.date}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary-val" />
                <span>{writeup.readTime}</span>
              </span>
            </div>

            {/* MITRE ATT&CK and Tools Tags */}
            <div className="flex flex-wrap items-center gap-1.5">
              {writeup.mitreAttack.map(t => (
                <span key={t} className="px-2 py-0.5 rounded bg-container-val border border-surface-val text-zinc-300 text-xs font-mono">
                  ATT&CK: {t}
                </span>
              ))}
              {writeup.tools.map(tool => (
                <span key={tool} className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 text-xs font-mono">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Section Tabs */}
        <div id="writeup-tabs-bar" className="writeup-tabs-bar">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`writeup-tab-btn ${activeTab === 'dossier' ? 'writeup-tab-btn-active' : ''}`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Investigation Dossier</span>
          </button>

          <button
            onClick={() => setActiveTab('detection')}
            className={`writeup-tab-btn ${activeTab === 'detection' ? 'writeup-tab-btn-active' : ''}`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>SIEM Detection & Rules ({writeup.detectionQueries?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('iocs')}
            className={`writeup-tab-btn ${activeTab === 'iocs' ? 'writeup-tab-btn-active' : ''}`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>IOC Artifacts ({writeup.iocs?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`writeup-tab-btn ${activeTab === 'telemetry' ? 'writeup-tab-btn-active' : ''}`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Raw Telemetry Feed {writeup.rawTelemetry?.trim() ? '(Available)' : '(None)'}</span>
          </button>
        </div>

        {/* Tab 1: Dossier Body */}
        {activeTab === 'dossier' && (
          <div id="writeup-tab-card" className="writeup-tab-content-card">
            {writeup.content?.trim() ? (
              <div className="prose prose-invert max-w-none space-y-6 text-main-val leading-relaxed">
                <ReactMarkdown
                  components={{
                    h2: ({ node, children, ...props }) => {
                      const text = extractNodeText(children);
                      const slug = slugify(text);
                      return (
                        <h2
                          id={slug}
                          className="text-xl sm:text-2xl font-bold font-sans text-zinc-100 border-b border-surface-val pb-2 mt-8 mb-4 flex items-center gap-2"
                          {...props}
                        >
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ node, ...props }) => (
                      <h3 className="text-lg font-semibold font-sans text-primary-val mt-6 mb-3" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-muted-val font-sans text-sm sm:text-base leading-relaxed mb-4" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-5 space-y-2 text-muted-val text-sm sm:text-base my-3" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal pl-5 space-y-2 text-muted-val text-sm sm:text-base my-3" {...props} />
                    ),
                    li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                    code: ({ className, children, ...props }) => {
                      const isInline = !className && typeof children === 'string' && !children.includes('\n');
                      if (isInline) {
                        return (
                          <code
                            className="px-1.5 py-0.5 rounded bg-container-val border border-surface-val text-primary-val font-mono text-xs"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }
                      return (
                        <div className="my-4 rounded-lg border border-surface-val bg-surface-var overflow-hidden">
                          <div className="px-4 py-1.5 bg-container-val border-b border-surface-val flex items-center justify-between text-2xs font-mono text-muted-val">
                            <span>terminal / artifact execution</span>
                            <span className="text-primary-val">READ-ONLY</span>
                          </div>
                          <pre className="p-4 font-mono text-xs text-zinc-200 overflow-x-auto leading-relaxed">
                            <code>{children}</code>
                          </pre>
                        </div>
                      );
                    }
                  }}
                >
                  {writeup.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="p-12 text-center space-y-3 font-sans">
                <Shield className="w-8 h-8 text-zinc-600 mx-auto" />
                <div className="text-zinc-200 font-medium text-sm">
                  Investigation Dossier In Progress
                </div>
                <p className="text-xs text-muted-val max-w-md mx-auto leading-relaxed">
                  The step-by-step forensic walkthrough and technical analysis for this investigation are currently being compiled. Refer to the executive summary above for initial incident triage findings.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: SIEM Detection Rules */}
        {activeTab === 'detection' && (
          <div id="writeup-tab-card" className="space-y-6">
            {writeup.detectionQueries && writeup.detectionQueries.length > 0 ? (
              writeup.detectionQueries.map((dq, idx) => (
                <div key={idx} className="rounded-xl bg-surface-val border border-surface-val overflow-hidden">
                  <div className="p-4 bg-container-val border-b border-surface-val flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-zinc-100 font-sans text-sm sm:text-base">{dq.title}</h3>
                      <p className="text-xs text-muted-val font-sans">{dq.description}</p>
                    </div>
                    <button
                      onClick={() => handleCopyQuery(dq.code, `query-${idx}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-val border border-surface-val hover:border-amber-400/40 text-zinc-300 hover:text-primary-val font-mono text-xs transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      {copiedQuery === `query-${idx}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-primary-val" />
                          <span>Copied SPL</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Rule</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-5 font-mono text-xs text-amber-200/90 bg-black/60 overflow-x-auto leading-relaxed">
                    <code>{dq.code}</code>
                  </pre>
                </div>
              ))
            ) : (
              <div className="p-10 text-center rounded-xl bg-surface-val border border-surface-val space-y-3 font-sans">
                <FileCode className="w-8 h-8 text-zinc-600 mx-auto" />
                <div className="text-zinc-200 font-medium text-sm">
                  No Dedicated SIEM Detection Rules Archived
                </div>
                <p className="text-xs text-muted-val max-w-md mx-auto leading-relaxed">
                  No standalone Splunk SPL, Elastic KQL, or Sigma rules were archived for this scenario. Query strings and filter parameters are documented directly in the main Investigation Dossier.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: IOC Artifacts */}
        {activeTab === 'iocs' && (
          <div id="writeup-tab-card" className="rounded-xl bg-surface-val border border-surface-val overflow-hidden">
            <div className="p-4 bg-container-val border-b border-surface-val flex items-center justify-between">
              <h3 className="font-semibold text-zinc-100 font-sans text-sm">
                Threat Artifacts & Indicators of Compromise
              </h3>
              <span className="font-mono text-xs text-muted-val">
                {writeup.iocs && writeup.iocs.length > 0 ? 'TLP:CLEAR // Verified Malicious' : 'STATUS: NO_EXTERNAL_IOCS'}
              </span>
            </div>

            {writeup.iocs && writeup.iocs.length > 0 ? (
              <div className="divide-y divide-surface-val">
                {writeup.iocs.map((ioc, idx) => (
                  <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-container-val transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-container-val border border-surface-val text-primary-val font-mono text-2xs font-bold uppercase">
                          {ioc.type}
                        </span>
                        <code className="font-mono text-xs text-zinc-200 select-all">
                          {ioc.value}
                        </code>
                      </div>
                      <p className="text-xs text-muted-val font-sans">{ioc.description}</p>
                    </div>

                    <button
                      onClick={() => handleCopyIOC(ioc.value)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-primary-val text-xs font-mono transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      {copiedIOC === ioc.value ? (
                        <>
                          <Check className="w-3 h-3 text-primary-val" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Value</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center space-y-3 font-sans">
                <Database className="w-8 h-8 text-zinc-600 mx-auto" />
                <div className="text-zinc-200 font-medium text-sm">
                  No External IOC Records Registered
                </div>
                <p className="text-xs text-muted-val max-w-md mx-auto leading-relaxed">
                  No external file hashes, command-and-control IP nodes, or malicious registry keys were flagged for this lab or internal range challenge.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Raw Telemetry */}
        {activeTab === 'telemetry' && (
          <div id="writeup-tab-card" className="rounded-xl bg-black/60 border border-surface-val overflow-hidden font-mono text-xs">
            <div className="px-4 py-2 bg-container-val border-b border-surface-val flex items-center justify-between text-muted-val">
              <span>raw_stream_capture.log // Wireshark / Volatility / Sysmon Telemetry</span>
              <span className={writeup.rawTelemetry?.trim() ? "text-primary-val" : "text-dim-val"}>
                {writeup.rawTelemetry?.trim() ? "FILTER: PASS" : "FEED: NO_STREAM"}
              </span>
            </div>
            
            {writeup.rawTelemetry?.trim() ? (
              <div className="p-5 text-zinc-300 space-y-2 overflow-x-auto">
                <div className="text-dim-val font-mono text-2xs">
                  # Stream Capture & Forensic Raw Artifacts
                </div>
                <pre className="text-amber-300/80 font-mono text-xs whitespace-pre-wrap break-all leading-relaxed">
                  {writeup.rawTelemetry.trim()}
                </pre>
              </div>
            ) : (
              <div className="p-10 text-center space-y-3 font-sans">
                <Terminal className="w-8 h-8 text-zinc-600 mx-auto" />
                <div className="text-zinc-200 font-medium text-sm">
                  No Raw Telemetry Stream Logged
                </div>
                <p className="text-xs text-muted-val max-w-md mx-auto leading-relaxed">
                  This investigation did not archive raw hex stream dumps or volatile memory packet captures. All relevant artifacts, evidence logs, and triage steps are cataloged under the Investigation Dossier and IOC Artifacts tabs.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Previous / Next Writeup Footer Navigation */}
        <div id="writeup-footer-nav" className="pt-6 border-t border-surface-val grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevWriteup ? (
            <button
              onClick={() => onSelectOtherWriteup && onSelectOtherWriteup(prevWriteup)}
              className="p-4 rounded-lg bg-surface-val border border-surface-val hover:border-amber-400/40 text-left transition-colors cursor-pointer group"
            >
              <div className="text-2xs font-mono text-dim-val uppercase">← Previous Dossier</div>
              <div className="font-sans text-sm font-semibold text-zinc-200 group-hover:text-primary-val truncate mt-1">
                {prevWriteup.title}
              </div>
            </button>
          ) : <div />}

          {nextWriteup ? (
            <button
              onClick={() => onSelectOtherWriteup && onSelectOtherWriteup(nextWriteup)}
              className="p-4 rounded-lg bg-surface-val border border-surface-val hover:border-amber-400/40 text-right transition-colors cursor-pointer group sm:col-start-2"
            >
              <div className="text-2xs font-mono text-dim-val uppercase">Next Dossier →</div>
              <div className="font-sans text-sm font-semibold text-zinc-200 group-hover:text-primary-val truncate mt-1">
                {nextWriteup.title}
              </div>
            </button>
          ) : <div />}
        </div>
      </div>
    </article>
  );
};
