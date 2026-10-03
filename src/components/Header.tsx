import React from 'react';
import { ActiveTab } from '../types';
import { Download } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenResume: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenResume
}) => {
  return (
    <header className="header-root">
      <div className="header-container">
        {/* Left: Terminal Identity Prompt */}
        <div className="header-brand-group">
          <button
            onClick={() => setActiveTab('home')}
            className="header-brand-button"
            title="Return to terminal root"
          >
            <span className="text-[#fbbf24] font-['JetBrains_Mono'] text-sm font-bold">&gt;</span>
            <span className="font-['JetBrains_Mono'] text-sm font-medium tracking-tight text-[#fbbf24] hover:text-[#fcd34d] transition-colors">
              ~/linh@analyst:$
            </span>
            <span className="inline-block w-2 h-4 bg-[#fbbf24] animate-pulse"></span>
          </button>

          {/* SOC-RADAR status badge */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-[#18181c] border border-[#27272a] font-['JetBrains_Mono'] text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fbbf24] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fbbf24]"></span>
            </span>
            <span className="text-[#a1a1aa] tracking-wide text-[11px]">SOC-RADAR: ACTIVE</span>
          </div>
        </div>

        {/* Right: Nav Links & Quick Actions */}
        <div className="header-actions-group">
          <nav className="header-desktop-nav">
            <button
              onClick={() => setActiveTab('about')}
              className={`header-nav-button ${activeTab === 'about' ? 'header-nav-button-active' : ''}`}
            >
              /about
            </button>
            <button
              onClick={() => setActiveTab('writeups')}
              className={`header-nav-button ${activeTab === 'writeups' ? 'header-nav-button-active' : ''}`}
            >
              /writeups
            </button>
            <button
              onClick={() => setActiveTab('labs')}
              className={`header-nav-button ${activeTab === 'labs' ? 'header-nav-button-active' : ''}`}
            >
              /labs
            </button>
          </nav>

          {/* Action: Download Resume PDF */}
          <a
            href="/resources/resume.pdf"
            download="Tat_Tieu_Linh_SOC_Analyst_Resume.pdf"
            className="header-resume-download-btn cursor-pointer inline-flex items-center gap-1.5"
            title="Download resume.pdf"
          >
            <Download className="w-3.5 h-3.5" />
            <span>resume.pdf</span>
          </a>
        </div>
      </div>
    </header>
  );
};
