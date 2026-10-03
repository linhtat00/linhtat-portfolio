import React, { useState } from 'react';
import { ArrowRight, Download, Terminal as TerminalIcon, ShieldCheck, CornerDownLeft } from 'lucide-react';

interface HeroSectionProps {
  onExploreWriteups: () => void;
  onDownloadResume: () => void;
  onOpenUploadCMS?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreWriteups,
  onDownloadResume,
  onOpenUploadCMS
}) => {
  const [terminalInput, setTerminalInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<Array<{ cmd: string; output: React.ReactNode }>>([]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = terminalInput.trim().toLowerCase();
    if (!cleanCmd) return;

    let output: React.ReactNode = null;

    switch (cleanCmd) {
      case 'help':
        output = (
          <div className="text-zinc-300 space-y-1">
            <p className="text-primary-val font-semibold">Available commands:</p>
            <p>• <strong className="text-zinc-100">whoami</strong>: View profile & academic background</p>
            <p>• <strong className="text-zinc-100">skills</strong>: List SIEM, Forensics, and Scripting toolsets</p>
            <p>• <strong className="text-zinc-100">certs</strong>: Active cybersecurity certifications</p>
            <p>• <strong className="text-zinc-100">labs</strong>: Academic, CEH & Proxmox defensive ranges</p>
            <p>• <strong className="text-zinc-100">contact</strong>: Direct email & profiles</p>
            <p>• <strong className="text-zinc-100">clear</strong>: Reset console output</p>
          </div>
        );
        break;
      case 'whoami':
        output = (
          <p className="text-zinc-300">
            Tất Tiểu Linh · 3rd-Year InfoSec Undergrad @ Academy of Cryptography Techniques (3.43 GPA). Aspiring SOC Analyst / Blue Team Member.
          </p>
        );
        break;
      case 'skills':
        output = (
          <div className="text-zinc-300 space-y-0.5 font-mono text-[11px]">
            <p><span className="text-primary-val">SIEM/EDR:</span> Splunk Enterprise Security, Elastic SIEM, Sysmon</p>
            <p><span className="text-primary-val">Toolkits:</span> Volatility 3, Autopsy, KAPE, Wireshark, Zeek, FTK Imager, Burpsuite</p>
            <p><span className="text-primary-val">Languages:</span> Python 3, Bash, PowerShell, Splunk SPL, KQL, C++</p>
          </div>
        );
        break;
      case 'certs':
        output = (
          <div className="text-zinc-300 space-y-0.5">
            <p>✓ TryHackMe: SOC Level 1 & Level 2 Certified</p>
            <p>✓ Google Cybersecurity Professional Certificate</p>
            <p>✓ TOEIC Listening & Reading: 930 / 990</p>
          </div>
        );
        break;
      case 'labs':
      case 'homelab':
        output = (
          <p className="text-zinc-300">
            5 Documented Engineering Ranges | Proxmox VE 8.2 dual-node cluster | CEH Practical Malware Sandbox | CySA+ Vulnerability Enclave | Suricata + Zeek SPAN tap | 500+ hrs live uptime.
          </p>
        );
        break;
      case 'contact':
        output = (
          <div className="text-zinc-300 space-y-0.5">
            <p>Email: linhtatblue@gmail.com</p>
            <p>Identity: Verified Blue Team Candidate (TryHackMe Top 1% | CyberDefenders)</p>
            <p>GitHub: github.com/linhtat00 | LinkedIn: linkedin.com/in/tieu-linh-tat-8009b7437</p>
          </div>
        );
        break;
      case 'clear':
        setCommandHistory([]);
        setTerminalInput('');
        return;
      default:
        output = (
          <p className="text-error-val">
            zsh: command not found: {cleanCmd}. Type <span className="text-primary-val">help</span> for valid commands.
          </p>
        );
        break;
    }

    setCommandHistory(prev => [...prev, { cmd: terminalInput, output }]);
    setTerminalInput('');
  };

  return (
    <section className="hero-section" id="about">
      {/* Top Subtle Amber Scanline Accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="hero-container">
        <div className="hero-grid">
          {/* Left Column: Identity & Defensive Mission */}
          <div className="hero-content-col">
            {/* Seeking Internship Pill */}
            <div className="hero-badge-pill">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-val opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-val"></span>
              </span>
              <span className="hero-badge-text">
                Seeking Summer / Fall 2027 Blue Team / SOC Internship
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-headline">
              Defending endpoints, analyzing{' '}
              <span className="hero-gradient-text">
                PCAPs
              </span>
              , hunting threats.
            </h1>

            {/* Subtext */}
            <p className="hero-description">
              <span className="hero-gradient-text font-semibold">
                3rd-year InfoSec
              </span>  undergraduate at <span className="hero-gradient-text font-semibold">
                Academy of Cryptography Techniques 
              </span> specializing in DFIR, Splunk SIEM detection engineering, and memory triage. Documenting hands-on investigations and adversarial simulations.
            </p>

            {/* Clean CTAs */}
            <div className="hero-cta-group">
              <button
                onClick={onExploreWriteups}
                className="hero-btn-primary"
              >
                <span>Explore Writeups</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="/resources/resume.pdf"
                download="Tat_Tieu_Linh_SOC_Analyst_Resume.pdf"
                className="hero-btn-secondary inline-flex items-center gap-2 cursor-pointer"
                title="Download Resume [PDF]"
              >
                <Download className="w-4 h-4 text-primary-val" />
                <span>Download Resume [PDF]</span>
              </a>
            </div>

            {/* Snapshot Meta */}
            <div className="hero-meta-bar">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary-val" />
                <span>Station: <strong className="text-zinc-200">SOC Analyst</strong></span>
              </div>
              <span className="text-zinc-700 hidden sm:inline">|</span>
              <span className="text-zinc-400">UTC+07:00</span>
            </div>
          </div>

          {/* Right Column: Decluttered Interactive Terminal Window */}
          <div className="hero-terminal-col">
            <div className="terminal-window">
              {/* Title Bar */}
              <div className="terminal-header">
                <div className="terminal-controls">
                  <span className="terminal-dot terminal-dot-red"></span>
                  <span className="terminal-dot terminal-dot-amber"></span>
                  <span className="terminal-dot terminal-dot-green"></span>
                  <span className="ml-2 terminal-title truncate">
                    telemetry_session@analyst [bash]
                  </span>
                </div>
                <div className="terminal-title">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-val"></span>
                  <span>pts/0</span>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="terminal-body">
                {/* Command 1: whoami */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="terminal-prompt-prefix">linh@analyst:~$</span>
                    <span className="terminal-prompt-cmd">whoami</span>
                  </div>
                  <div className="terminal-block-output space-y-0.5">
                    <p><span className="text-zinc-300 font-medium">Tất Tiểu Linh</span> · B.S. Information Security, Junior (3.43 GPA)</p>
                    <p className="text-zinc-400">Academy of Cryptography Techniques · Focus: DFIR · Threat Hunting · Log Analysis · Memory Triage</p>
                  </div>
                </div>

                {/* Command 2: cat skills.json */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="terminal-prompt-prefix">linh@analyst:~$</span>
                    <span className="terminal-prompt-cmd">cat ~/skills.json</span>
                  </div>
                  <div className="terminal-block-output font-mono text-xs space-y-0.5">
                    <p><span className="text-primary-val">siem_edr</span>: ["Splunk ES", "Elastic SIEM", "Sysmon"]</p>
                    <p><span className="text-primary-val">forensics</span>: ["Volatility 3", "Autopsy", "KAPE", "Wireshark", "Zeek"]</p>
                    <p><span className="text-primary-val">languages</span>: ["Python", "PowerShell", "KQL", "Bash", "Sigma"]</p>
                  </div>
                </div>

                {/* Command 3: alert */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="terminal-prompt-prefix">linh@analyst:~$</span>
                    <span className="terminal-prompt-cmd">./triage_alert.sh</span>
                  </div>
                  <div className="mt-2 p-2.5 rounded bg-container-val border border-surface-val flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#450a0a] text-error-val font-mono text-[10px] font-bold tracking-wider uppercase">
                        Active Triage
                      </span>
                      <span className="text-zinc-200 font-medium text-[11px] sm:text-xs">
                        QakBot C2 Beaconing (T1071.001)
                      </span>
                    </div>
                    <span className="text-primary-val font-mono text-[11px]">PID: 4892 ISOLATED</span>
                  </div>
                </div>

                {/* Interactive history */}
                {commandHistory.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="terminal-prompt-prefix">linh@analyst:~$</span>
                      <span className="text-zinc-200">{item.cmd}</span>
                    </div>
                    <div className="terminal-block-output">{item.output}</div>
                  </div>
                ))}

                {/* Interactive input line */}
                <form onSubmit={handleCommandSubmit} className="terminal-input-form">
                  <span className="terminal-prompt-prefix">linh@analyst:~$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="type 'help', 'skills', 'certs'..."
                    className="terminal-input-field"
                  />
                  <button type="submit" className="text-zinc-500 hover:text-primary-val cursor-pointer" aria-label="Execute command">
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Terminal Footer */}
              <div className="terminal-footer-status">
                <span>BUFFER: NOMINAL</span>
                <span>MEM: 1.48GB / 16GB</span>
                <span className="text-primary-val font-semibold">READY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
