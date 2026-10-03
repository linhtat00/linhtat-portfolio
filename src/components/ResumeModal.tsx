import React from 'react';
import { X, Download, Shield, Award, Terminal, CheckCircle2, FileText, ExternalLink, Sparkles, Trophy } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    const a = document.createElement('a');
    a.href = '/resources/resume.pdf';
    a.download = 'Tat_Tieu_Linh_SOC_Analyst_Resume.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenPdf = () => {
    window.open('/resources/resume.pdf', '_blank');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container-lg">
        {/* Top-Right Conventional Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="modal-close-btn"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Title and Actions */}
        <div className="modal-header pr-14 sm:pr-16">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-[#fbbf24]" />
            <h2 className="modal-title">
              RESUME_PREVIEW // TAT_TIEU_LINH_SOC_ANALYST.PDF
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#202025] hover:bg-[#272730] border border-[#3f3f46] text-zinc-200 font-['JetBrains_Mono'] text-xs font-medium cursor-pointer transition-colors"
              title="Open full PDF in browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in New Tab</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#fbbf24] text-[#451a03] font-['JetBrains_Mono'] text-xs font-semibold hover:bg-amber-400 cursor-pointer transition-colors shadow-sm"
              title="Download real PDF document"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Real PDF</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="modal-body space-y-6">
          {/* Header Identity */}
          <div className="border-b border-[#27272a] pb-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-zinc-100 font-['Geist']">Tất Tiểu Linh</h1>
                <p className="text-[#fbbf24] font-['JetBrains_Mono'] text-xs mt-1">
                  3rd-Year Information Security Undergraduate · Aspiring SOC Analyst & Blue Team Member
                </p>
                <p className="text-xs text-zinc-400 font-['JetBrains_Mono'] mt-1">
                  linhtatblue@gmail.com · Vietnam · Seeking Summer / Fall 2027 Blue Team Internships
                </p>
                <p className="text-xs text-zinc-500 font-['JetBrains_Mono'] mt-0.5">
                  GitHub: github.com/linhtat00 · LinkedIn: linkedin.com/in/tieu-linh-tat-8009b7437
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-['JetBrains_Mono'] text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE PROFILE
              </span>
            </div>
          </div>

          {/* Education & Certs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded bg-[#141417] border border-[#27272a]">
              <div className="text-xs font-['JetBrains_Mono'] text-[#fbbf24] font-semibold mb-1">
                EDUCATION
              </div>
              <div className="text-zinc-200 font-semibold text-sm">Academy of Cryptography Techniques</div>
              <div className="text-xs text-zinc-300 mt-0.5">B.S. in Information Security · Junior (3rd-Year)</div>
              <div className="text-xs text-[#fbbf24] mt-1 font-['JetBrains_Mono']">GPA: 3.43 / 4.0</div>
            </div>

            <div className="p-4 rounded bg-[#141417] border border-[#27272a]">
              <div className="text-xs font-['JetBrains_Mono'] text-[#fbbf24] font-semibold mb-1">
                CERTIFICATIONS & CREDENTIALS
              </div>
              <ul className="text-xs text-zinc-300 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#fbbf24] flex-shrink-0" />
                  <span>TryHackMe SOC Level 1 (Accomplished June 2026)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#fbbf24] flex-shrink-0" />
                  <span>TryHackMe SOC Level 2 (Accomplished August 2026)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#fbbf24] flex-shrink-0" />
                  <span>Google Cybersecurity Professional Certificate (Oct 2024)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#fbbf24] flex-shrink-0" />
                  <span>TOEIC: <strong>930 / 990</strong> (L: 475, R: 455 · June 2024)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-2">
            <div className="text-xs font-['JetBrains_Mono'] text-[#fbbf24] font-semibold">
              TECHNICAL COMPETENCIES
            </div>
            <div className="p-4 rounded bg-[#141417] border border-[#27272a] font-['JetBrains_Mono'] text-xs text-zinc-300 space-y-2">
              <div>
                <span className="text-zinc-400">SIEM & EDR: </span>
                <span>Splunk Enterprise Security, Elastic SIEM, Sysmon, Central Log Correlation</span>
              </div>
              <div>
                <span className="text-zinc-400">DFIR & Toolkits: </span>
                <span>Volatility 3, Autopsy, KAPE, Wireshark, Zeek, FTK Imager, Burpsuite</span>
              </div>
              <div>
                <span className="text-zinc-400">Languages & Scripting: </span>
                <span>Python 3, Bash, PowerShell, Splunk SPL, KQL, C++</span>
              </div>
            </div>
          </div>

          {/* Competitive Platform Standing */}
          <div className="space-y-2">
            <div className="text-xs font-['JetBrains_Mono'] text-[#fbbf24] font-semibold flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>DEFENSIVE PLATFORM RANKINGS</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-['JetBrains_Mono']">
              <div className="p-3 rounded bg-[#141417] border border-[#27272a]">
                <div className="text-emerald-400 font-bold">TryHackMe: Top 1% Global</div>
                <p className="text-zinc-400 mt-1">
                  Top 2,480 Global Rank · 184 Rooms Solved · 128 Days Active Streak · Paths: SOC 1 & 2
                </p>
              </div>
              <div className="p-3 rounded bg-[#141417] border border-[#27272a]">
                <div className="text-sky-400 font-bold">CyberDefenders: Advanced Tier</div>
                <p className="text-zinc-400 mt-1">
                  28 Solved Forensic Labs · 4,850 Total Points · Focus: In-Flight Memory & PCAP Triage
                </p>
              </div>
            </div>
          </div>

          {/* Projects & Ranges */}
          <div className="space-y-2">
            <div className="text-xs font-['JetBrains_Mono'] text-[#fbbf24] font-semibold">
              DOCUMENTED RANGES & CAPSTONES
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded bg-[#141417] border border-[#27272a]">
                <div className="font-semibold text-zinc-200">Proxmox VE 8.2 Dual-Node Defensive Homelab</div>
                <p className="text-zinc-400 mt-0.5 font-['Geist']">
                  Dual-node virtualization cluster with isolated VLANs, Suricata IDS SPAN mirroring, and active attack simulation.
                </p>
              </div>
              <div className="p-3 rounded bg-[#141417] border border-[#27272a]">
                <div className="font-semibold text-zinc-200">Threat Investigation Dossiers</div>
                <p className="text-zinc-400 mt-0.5 font-['Geist']">
                  Deconstructed real-world attack chains: QakBot DLL side-loading, Kerberoasting detection rules, and Cobalt Strike PCAP extraction.
                </p>
              </div>
            </div>
          </div>

          {/* User Guide Box */}
          <div className="p-3 rounded-lg bg-[#141417] border border-[#27272a] text-[11px] font-['JetBrains_Mono'] text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>Real PDF is served from <code className="text-amber-300">/resources/resume.pdf</code>.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
