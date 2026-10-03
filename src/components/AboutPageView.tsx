import React, { useState } from 'react';
import { 
  Award, 
  GraduationCap, 
  Cpu, 
  Terminal, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  CheckCircle2, 
  Flame, 
  Trophy, 
  Layers, 
  ArrowLeft, 
  FileText,
  Mail,
  Globe,
  Zap,
  Maximize2,
  X
} from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  category: string;
  scoreOrLevel: string;
  date: string;
  image: string;
  verificationUrl?: string;
  description: string;
  curriculum: string[];
  keySkills: string[];
  badgeColor: string;
}

const CERTIFICATES: Certificate[] = [
  {
    id: 'thm-soc-1',
    title: 'SOC Level 1 Path Certification',
    issuer: 'TryHackMe',
    category: 'Blue Team Security Operations',
    scoreOrLevel: 'Path Completed',
    date: 'Accomplished in June 2026',
    image: '/resources/THM-SOC1-cert.jpg',
    description: 'Comprehensive defensive operations path covering foundational and intermediate security monitoring, SIEM log analysis, network intrusion triage, and endpoint threat hunting.',
    curriculum: [
      'Cyber Defense Frameworks & MITRE ATT&CK',
      'SIEM Operations: Splunk Enterprise & ELK Stack',
      'Network Security: Wireshark Packet Dissection, Zeek Bro Logs, Snort NIDS',
      'Endpoint Monitoring: Windows Event Logs, Sysmon telemetry, Linux Logs',
      'Phishing Incident Triage & Malicious Email Header Deconstruction'
    ],
    keySkills: ['Elasticsearch', 'Wireshark', 'Sysmon', 'Snort IDS', 'Phishing Triage', 'Log Analysis'],
    badgeColor: '#34d399'
  },
  {
    id: 'thm-soc-2',
    title: 'SOC Level 2 Path Certification',
    issuer: 'TryHackMe',
    category: 'Advanced Incident Response & Hunting',
    scoreOrLevel: 'Path Completed',
    date: 'Accomplished in August 2026',
    image: '/resources/THM-SOC2-cert.jpg',
    description: 'Specialized deep-dive into active adversary emulation, memory carving, parent-child process anomalies, living-off-the-land techniques, and Active Directory threat defense.',
    curriculum: [
      'Memory Forensics: Volatility 3 In-Flight Process Triage & Malfind',
      'Advanced Threat Hunting: LOLbins, Process Injection, Parent-Child Spoofing',
      'Active Directory Attacks: Kerberoasting, AS-REP Roasting, Pass-the-Hash',
      'Detection Engineering: Writing Sigma Rules & Splunk Correlation Searches',
      'Malware Analysis Fundamentals: Dynamic Sandbox Triage & YARA Signature Drafting',
      'Threat Emulation: Atomic Red Team, MITRE ATT&CK Adversary Simulation, Purple Team Exercises'
    ],
    keySkills: ['Digital Forensics', 'Process Carving', 'Sigma Rules', 'YARA', 'Threat Emulation'],
    badgeColor: '#34d399'
  },
  {
    id: 'google-cyber',
    title: 'Google Cybersecurity Professional Certificate',
    issuer: 'Google / Coursera',
    category: 'Enterprise Security & Operations',
    scoreOrLevel: 'Specialization Completed · 8 Courses',
    date: 'Accomplished in October 2024',
    image: '/resources/google-cybersecurity-cert.jpg',
    description: 'Rigorous 8-course professional program developed by Google security experts, teaching hands-on defensive tools, SIEM pipelines, network security, and security automation with Python and SQL.',
    curriculum: [
      'Foundations of Cybersecurity & Enterprise Defense Principles',
      'Play It Safe: Manage Security Risks & NIST Cybersecurity Framework',
      'Connect & Protect: Networks, Firewalls, and TCP/IP Architecture',
      'Tools of the Trade: Linux Command Line & SQL for Security Analysts',
      'Assets, Threats, and Vulnerabilities: CVE Triage & Attack Vectors',
      'Sound the Alarm: Detection and Incident Response Playbooks',
      'Automate Cybersecurity Tasks with Python: Scripting Log Parsers'
    ],
    keySkills: ['NIST CSF', 'Linux Hardening', 'SQL for InfoSec', 'Python Automation', 'Incident Response Playbooks'],
    badgeColor: '#60a5fa'
  },
  {
    id: 'toeic-930',
    title: 'TOEIC Listening & Reading',
    issuer: 'Educational Testing Service (ETS)',
    category: 'International Technical Communication',
    scoreOrLevel: 'Total Score: 930 / 990 (L: 475 | R: 455)',
    date: 'Accomplished in June 2024',
    image: '/resources/TOEIC-cert.jpg',
    description: 'Near-native English proficiency score certifying full technical fluency for multinational security teams, cross-border incident response collaboration, and international DFIR documentation.',
    curriculum: [
      'Listening Comprehension (475/495): Real-time audio triage, conference coordination',
      'Reading Comprehension (455/495): Complex threat intel reports, RFC standards, CVE analysis'
    ],
    keySkills: ['Technical English Fluency', 'Reading Comprehension', 'Technical Reporting'],
    badgeColor: '#60a5fa'
  }
];

interface AboutPageViewProps {
  onBackToHome: () => void;
  onOpenResume: () => void;
  onExploreWriteups: () => void;
  onExploreHomelab: () => void;
  onExploreLabs?: (labSlug?: string) => void;
}

export const AboutPageView: React.FC<AboutPageViewProps> = ({
  onBackToHome,
  onOpenResume,
  onExploreWriteups,
  onExploreHomelab
}) => {
  // Carousel State
  const [currentCertIndex, setCurrentCertIndex] = useState(0);
  const [selectedCertImage, setSelectedCertImage] = useState<Certificate | null>(null);

  const nextCert = () => {
    setCurrentCertIndex((prev) => (prev + 1) % CERTIFICATES.length);
  };

  const prevCert = () => {
    setCurrentCertIndex((prev) => (prev - 1 + CERTIFICATES.length) % CERTIFICATES.length);
  };

  const currentCert = CERTIFICATES[currentCertIndex];

  return (
    <div className="w-full min-h-screen bg-[#0d0d0f] text-[#f4f4f5] pt-24 pb-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Navigation Breadcrumb matching Labs page */}
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

            <div className="font-mono text-xs text-zinc-400 truncate">
              <span className="text-[#fbbf24]">~/linh@analyst:$</span> cat /about/profile
            </div>
          </div>
        </div>

        {/* SECTION 1: Profile & Identity Card */}
        <div className="rounded-2xl bg-[#141417] border border-[#27272a] p-6 sm:p-8 lg:p-10 relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#fbbf24]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            {/* Profile Picture Frame (Linked to /resources/profile.jpg) */}
            <div className="relative flex-shrink-0">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-[#fbbf24]/40 bg-[#1c1c22] relative shadow-xl shadow-amber-500/5">
                <img
                  src="/resources/profile.jpg"
                  alt="Tất Tiểu Linh"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallbackEl = document.getElementById('avatar-fallback');
                    if (fallbackEl) fallbackEl.style.display = 'flex';
                  }}
                />
                <div
                  id="avatar-fallback"
                  style={{ display: 'none' }}
                  className="w-full h-full flex-col items-center justify-center bg-gradient-to-b from-[#18181c] to-[#09090b] p-4 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/30 flex items-center justify-center mb-2">
                    <ShieldCheck className="w-10 h-10 text-[#fbbf24]" />
                  </div>
                  <span className="font-['JetBrains_Mono'] text-xs font-bold text-zinc-300">
                    Tất Tiểu Linh
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-amber-400/80">
                    [BLUE_TEAM_SOC]
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-[#0d0d0f] border border-emerald-500/40 text-emerald-400 font-['JetBrains_Mono'] text-[10px] flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>available</span>
              </div>
            </div>

            {/* Profile Bio Details */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#fbbf24]/10 border border-[#fbbf24]/30 text-[#fbbf24] font-['JetBrains_Mono'] text-xs font-semibold">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>INVESTIGATOR BIO</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold font-['Geist'] text-zinc-100 tracking-tight">
                  Tất Tiểu Linh
                </h1>
                <p className="text-sm sm:text-base font-medium text-[#fbbf24] font-['JetBrains_Mono']">
                  3rd-Year Information Security Undergraduate · Aspiring SOC Analyst & Blue Team Member
                </p>
              </div>

              <p className="font-['Geist'] text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
                Dedicated defensive security practitioner with extensive hands-on experience in security operations, threat triage, and memory forensics. Passionate about incident response, detection engineering, and continuous purple-team sharpening.
              </p>

              {/* Quick Metadata Chips */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 font-['JetBrains_Mono'] text-xs">
                <div className="px-3 py-1.5 rounded-lg bg-[#1a1a20] border border-[#27272a] text-zinc-300 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#fbbf24]" />
                  <span>GPA 3.43/4.0</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[#1a1a20] border border-[#27272a] text-zinc-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#fbbf24]" />
                  <span>Vietnam</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[#1a1a20] border border-[#27272a] text-zinc-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#fbbf24]" />
                  <span>linhtatblue@gmail.com</span>
                </div>
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3 font-['JetBrains_Mono'] text-xs">
                <a
                  href="mailto:linhtatblue@gmail.com"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#fbbf24] text-[#451a03] font-semibold hover:bg-amber-400 transition-colors shadow-sm"
                >
                  <Mail className="w-4 h-4 text-[#451a03]" />
                  <span>Direct Inquiries</span>
                </a>
                <button
                  onClick={onExploreWriteups}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#1f1f26] border border-[#27272a] hover:border-[#fbbf24] text-zinc-200 hover:text-[#fbbf24] transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Read Threat Writeups</span>
                </button>
                <button
                  onClick={onExploreHomelab}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#1f1f26] border border-[#27272a] hover:border-[#fbbf24] text-zinc-200 hover:text-[#fbbf24] transition-colors cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Inspect Homelab Cluster</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Carousel of Certificates */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
            <div>
              {/* Single Big Title with Yellow Icon and White Text */}
              <h2 className="flex items-center gap-2.5 text-2xl sm:text-3xl font-bold font-['Geist'] text-zinc-100">
                <Award className="w-6 h-6 text-[#fbbf24] flex-shrink-0" />
                <span>Certifications & Academic Achievements</span>
              </h2>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center gap-3 font-['JetBrains_Mono'] text-xs">
              <span className="text-zinc-400">
                [ 0{currentCertIndex + 1} / 0{CERTIFICATES.length} ]
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevCert}
                  className="p-2 rounded bg-[#18181c] border border-[#27272a] hover:border-[#fbbf24] text-zinc-300 hover:text-[#fbbf24] transition-colors cursor-pointer"
                  title="Previous certificate"
                  aria-label="Previous certificate"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextCert}
                  className="p-2 rounded bg-[#18181c] border border-[#27272a] hover:border-[#fbbf24] text-zinc-300 hover:text-[#fbbf24] transition-colors cursor-pointer"
                  title="Next certificate"
                  aria-label="Next certificate"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Carousel Card Display */}
          <div className="rounded-2xl bg-[#141417] border border-[#27272a] p-6 sm:p-8 relative overflow-hidden transition-all duration-300 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Cert Badge & Details (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-5 sm:p-6 rounded-xl bg-[#0e0e11] border border-[#27272a] flex flex-col items-center text-center space-y-4 relative group">
                  {/* Real Certificate Image Preview */}
                  <div
                    onClick={() => setSelectedCertImage(currentCert)}
                    className="w-full relative rounded-lg overflow-hidden border border-[#27272a] bg-[#18181e] cursor-pointer shadow-lg group/cert hover:border-[#fbbf24]/60 transition-all"
                  >
                    <img
                      src={currentCert.image}
                      alt={currentCert.title}
                      className="w-full aspect-[4/3] object-cover object-center transition-transform duration-300 group-hover/cert:scale-[1.03]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/resources/cert-thm-soc1.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/cert:opacity-100 transition-opacity flex items-center justify-center gap-2 text-zinc-100 font-['JetBrains_Mono'] text-xs backdrop-blur-[1px]">
                      <Maximize2 className="w-4 h-4 text-[#fbbf24]" />
                      <span>Click to Enlarge Certificate</span>
                    </div>
                  </div>

                  <div>
                    <span
                      className="px-2.5 py-0.5 rounded-full font-['JetBrains_Mono'] text-[11px] font-bold tracking-wide uppercase"
                      style={{ color: currentCert.badgeColor, backgroundColor: `${currentCert.badgeColor}20` }}
                    >
                      {currentCert.issuer}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold font-['Geist'] text-zinc-100 mt-2">
                      {currentCert.title}
                    </h3>
                    <p className="text-xs font-semibold text-amber-300 font-['JetBrains_Mono'] mt-1">
                      {currentCert.scoreOrLevel}
                    </p>
                  </div>

                  {/* Footer: Verified date*/}
                  <div className="w-full pt-4 border-t border-[#222228] flex items-center justify-between font-['JetBrains_Mono'] text-xs">
                    <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{currentCert.date}</span>
                    </span>
                    <button
                      onClick={() => setSelectedCertImage(currentCert)}
                      className="inline-flex items-center gap-1 text-zinc-400 hover:text-[#fbbf24] transition-colors cursor-pointer text-xs"
                      title="Inspect high-resolution certificate"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Enlarge</span>
                    </button>
                  </div>
                </div>

                {/* Skills Learned Badges */}
                <div className="space-y-2">
                  <div className="text-xs font-['JetBrains_Mono'] text-zinc-400 font-semibold uppercase">
                    Competencies Validated:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentCert.keySkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#1c1c22] border border-[#27272a] font-['JetBrains_Mono'] text-[11px] text-zinc-200"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: In-Depth Curriculum & Course Modules (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h4 className="text-xs font-['JetBrains_Mono'] text-[#fbbf24] font-semibold uppercase tracking-wider">
                    Course Scope & Rigor
                  </h4>
                  <p className="text-sm font-['Geist'] text-zinc-300 mt-1 leading-relaxed">
                    {currentCert.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-['JetBrains_Mono'] text-zinc-400 font-semibold uppercase">
                    Detailed Curriculum Modules Covered:
                  </h4>
                  <div className="space-y-2 font-['Geist'] text-xs sm:text-sm">
                    {currentCert.curriculum.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[#18181e] border border-[#222228] flex items-start gap-2.5 text-zinc-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Carousel Selector Pills (with active indicator & hover effects) */}
            <div className="mt-8 pt-6 border-t border-[#222228] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {CERTIFICATES.map((cert, index) => {
                  const isActive = index === currentCertIndex;
                  return (
                    <button
                      key={cert.id}
                      onClick={() => setCurrentCertIndex(index)}
                      className={`px-3 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#fbbf24] text-[#451a03] font-bold shadow-md shadow-amber-500/20 scale-[1.02]'
                          : 'bg-[#1a1a20] border border-[#27272a] text-zinc-400 hover:text-zinc-100 hover:border-amber-400/50 hover:bg-[#22222a]'
                      }`}
                    >
                      {cert.issuer}: {cert.title.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Platform Profiles & Stats */}
        <div className="space-y-6">
          <div className="border-b border-[#27272a] pb-4">
            {/* Single Big Title with Yellow Icon and White Text */}
            <h2 className="flex items-center gap-2.5 text-2xl sm:text-3xl font-bold font-['Geist'] text-zinc-100">
              <Trophy className="w-6 h-6 text-[#fbbf24] flex-shrink-0" />
              <span>Platform Profiles & Stats</span>
            </h2>
          </div>

          {/* Auto-scaling Responsive Grid for Platforms (scales cleanly whether 1, 2, or 3 cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-['Geist']">
            {/* TryHackMe Profile Card (Original Card Background Color Kept) */}
            <div className="p-6 rounded-2xl bg-[#141417] border border-[#27272a] hover:border-[#fbbf24]/50 transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* TryHackMe Authentic Cloud + Binary Logo in Green Square (Matching User Image) */}
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 p-1">
                      <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 36 36" fill="none">
                        {/* Cloud Outline */}
                        <path
                          d="M12 14C12 11 14.5 8.5 17.5 8.5C20.1 8.5 22.3 10.2 22.9 12.7C23.5 12.3 24.2 12 25 12C27.2 12 29 13.8 29 16C29 16.3 28.9 16.7 28.8 17C30.7 17.5 32 19.1 32 21C32 23.2 30.2 25 28 25H24"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M13 25H10.5C8 25 6 23 6 20.5C6 18.3 7.6 16.4 9.8 16.1C10.3 15.5 10.9 15.1 11.5 14.7"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                        {/* Binary Matrix Code matching Image 1 */}
                        <text x="13" y="20.5" fill="currentColor" fontSize="3.8" fontFamily="monospace" fontWeight="bold">10 10</text>
                        <text x="13.5" y="25" fill="currentColor" fontSize="3.8" fontFamily="monospace" fontWeight="bold">1110</text>
                        <text x="13" y="29.5" fill="currentColor" fontSize="3.4" fontFamily="monospace" fontWeight="bold">0101</text>
                        <text x="14" y="33.5" fill="currentColor" fontSize="3.4" fontFamily="monospace" fontWeight="bold">01</text>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-100 text-base">TryHackMe</h3>
                      <span className="text-xs text-zinc-400 font-mono">@itsrinnieee</span>
                    </div>
                  </div>

                  {/* Top 1% in Authentic Green */}
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-['JetBrains_Mono'] text-xs font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>TOP 1%</span>
                  </span>
                </div>

                {/* Original Stat Boxes Structure */}
                <div className="grid grid-cols-2 gap-2 pt-1 font-['JetBrains_Mono'] text-xs">
                  <div className="p-2.5 rounded bg-[#18181e] border border-[#222228]">
                    <div className="text-zinc-500 text-[10px]">GLOBAL RANK</div>
                    <div className="text-zinc-100 font-bold text-sm mt-0.5">Top 5421</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#18181e] border border-[#222228]">
                    <div className="text-zinc-500 text-[10px]">ROOMS SOLVED</div>
                    <div className="text-[#fbbf24] font-bold text-sm mt-0.5">331 Rooms</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#18181e] border border-[#222228]">
                    <div className="text-zinc-500 text-[10px]">ACTIVE STREAK</div>
                    <div className="text-emerald-400 font-bold text-sm mt-0.5">128 Days</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#18181e] border border-[#222228]">
                    <div className="text-zinc-500 text-[10px]">PATHS CLEARED</div>
                    <div className="text-zinc-100 font-bold text-sm mt-0.5">SOC 1, 2, CD</div>
                  </div>
                </div>

                <div className="text-xs text-zinc-400 leading-relaxed border-t border-[#222228] pt-3">
                  Extensive completion of realistic Windows endpoint investigation, Wireshark packet dissection, and Splunk core triage rooms.
                </div>
              </div>

              <a
                href="https://tryhackme.com/p/itsrinnieee"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded bg-[#1a1a22] hover:bg-[#23232c] border border-[#2d2d38] text-zinc-300 hover:text-emerald-400 font-['JetBrains_Mono'] text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View TryHackMe Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* CyberDefenders Profile Card (Original Card Background Color Kept) */}
            <div className="p-6 rounded-2xl bg-[#141417] border border-[#27272a] hover:border-[#fbbf24]/50 transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* CyberDefenders Authentic Fedora Hat + D Logo in Blue Square (Matching User Image) */}
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 p-1">
                      <svg className="w-6 h-6 text-blue-400" viewBox="0 0 32 32" fill="none">
                        {/* Fedora Hat Crown */}
                        <path
                          d="M10 13C10 10.2 11.5 7.5 13.5 7.5C14.5 8.5 15.5 8.5 16.5 7.5C18.5 7.5 20 10.2 20 13H10Z"
                          fill="currentColor"
                        />
                        {/* Hat Band Ribbon */}
                        <path
                          d="M10 12.5H20V13.8H10V12.5Z"
                          fill="#0c1724"
                          opacity="0.9"
                        />
                        {/* Fedora Hat Brim */}
                        <path
                          d="M6.5 13.5C8 13 11 12.5 15 12.5C19 12.5 22 13 23.5 13.5C24.5 13.8 24.2 15.2 22.5 15.2C18.5 15.2 11.5 15.2 7.5 15.2C5.8 15.2 5.5 13.8 6.5 13.5Z"
                          fill="currentColor"
                        />
                        {/* The curved letter D below the hat */}
                        <path
                          d="M11 17.5V26H16.5C20 26 22.5 23.5 22.5 20C22.5 17.5 20 17.5 18 17.5H11Z"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-100 text-base">CyberDefenders</h3>
                      <span className="text-xs text-zinc-400 font-mono">@itsrinnieee_00</span>
                    </div>
                  </div>

                  {/* Tier Badge in Authentic Blue */}
                  <span className="px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 font-['JetBrains_Mono'] text-xs font-bold">
                    ADVANCED
                  </span>
                </div>

                {/* Original Stat Boxes Structure */}
                <div className="grid grid-cols-2 gap-2 pt-1 font-['JetBrains_Mono'] text-xs">
                  <div className="p-2.5 rounded bg-[#18181e] border border-[#222228]">
                    <div className="text-zinc-500 text-[10px]">SOLVED LABS</div>
                    <div className="text-zinc-100 font-bold text-sm mt-0.5">28 Labs</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#18181e] border border-[#222228]">
                    <div className="text-zinc-500 text-[10px]">TOTAL SCORE</div>
                    <div className="text-[#fbbf24] font-bold text-sm mt-0.5">4,850 Pts</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#18181e] border border-[#222228]">
                    <div className="text-zinc-500 text-[10px]">PRIMARY FOCUS</div>
                    <div className="text-emerald-400 font-bold text-sm mt-0.5">DFIR / PCAP</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#18181e] border border-[#222228]">
                    <div className="text-zinc-500 text-[10px]">TIER STATUS</div>
                    <div className="text-zinc-100 font-bold text-sm mt-0.5">Investigator</div>
                  </div>
                </div>

                <div className="text-xs text-zinc-400 leading-relaxed border-t border-[#222228] pt-3">
                  Solved high-fidelity forensic challenges: memory artifact extraction (Volatility 3), malicious macros, and lateral movement traces.
                </div>
              </div>

              <a
                href="https://cyberdefenders.org/p/itsrinnieee_00/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded bg-[#1a1a22] hover:bg-[#23232c] border border-[#2d2d38] text-zinc-300 hover:text-blue-400 font-['JetBrains_Mono'] text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View CyberDefenders Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* SECTION 4: Technical Stack */}
        <div className="space-y-6">
          <div className="border-b border-[#27272a] pb-4">
            {/* Single Big Title with Yellow Icon and White Text */}
            <h2 className="flex items-center gap-2.5 text-2xl sm:text-3xl font-bold font-['Geist'] text-zinc-100">
              <Cpu className="w-6 h-6 text-[#fbbf24] flex-shrink-0" />
              <span>Technical Stack</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-['Geist'] text-xs">
            {/* SIEM & EDR */}
            <div className="p-5 rounded-2xl bg-[#141417] border border-[#27272a] space-y-3">
              <div className="font-bold text-[#fbbf24] font-['JetBrains_Mono'] flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>SIEM, EDR & Central Logging</span>
              </div>
              <ul className="space-y-1.5 text-zinc-300">
                <li className="p-2 rounded bg-[#18181e] border border-[#222228]">
                  <strong>Splunk Enterprise / ES:</strong> SPL query syntax, correlation searches, indexers & heavy forwarders.
                </li>
                <li className="p-2 rounded bg-[#18181e] border border-[#222228]">
                  <strong>Elastic SIEM:</strong> Kibana dashboards, winlogbeat, metricbeat pipeline.
                </li>
                <li className="p-2 rounded bg-[#18181e] border border-[#222228]">
                  <strong>Sysmon & Osquery:</strong> SwiftOnSecurity modular XML rule tuning for process execution & network connections.
                </li>
                <li className="p-2 rounded bg-[#18181e] border border-[#222228]">
                  <strong>Velociraptor:</strong> Endpoint live forensics, VQL artifact hunting.
                </li>
              </ul>
            </div>

            {/* Forensics & PCAP */}
            <div className="p-5 rounded-2xl bg-[#141417] border border-[#27272a] space-y-3">
              <div className="font-bold text-[#fbbf24] font-['JetBrains_Mono'] flex items-center gap-1.5 text-xs">
                <Terminal className="w-4 h-4" />
                <span>DFIR, Memory & PCAP Tools</span>
              </div>
              <ul className="space-y-1.5 text-zinc-300">
                <li className="p-2 rounded bg-[#18181e] border border-[#222228]">
                  <strong>Volatility 3:</strong> windows.malfind, windows.pslist, windows.netscan, injected code dumps.
                </li>
                <li className="p-2 rounded bg-[#18181e] border border-[#222228]">
                  <strong>Wireshark & Zeek:</strong> TCP session reassembly, TLS SNI filtering, HTTP payload extraction.
                </li>
                <li className="p-2 rounded bg-[#18181e] border border-[#222228]">
                  <strong>Autopsy, KAPE & FTK Imager:</strong> Triage image acquisition, MFT parsing, shellbags analysis.
                </li>
                <li className="p-2 rounded bg-[#18181e] border border-[#222228]">
                  <strong>Ghidra & CyberChef:</strong> Basic string recovery, payload deobfuscation, base64/rot13 decoding.
                </li>
              </ul>
            </div>

            {/* Detection & Automation */}
            <div className="p-5 rounded-2xl bg-[#141417] border border-[#27272a] space-y-3">
              <div className="font-bold text-[#fbbf24] font-['JetBrains_Mono'] flex items-center gap-1.5 text-xs">
                <Zap className="w-4 h-4" />
                <span>Scripting & Detection Engineering</span>
              </div>
              <ul className="space-y-1.5 text-zinc-300">
                <li className="p-2 rounded bg-[#18181e] border border-[#222228]">
                  <strong>Python 3 & PowerShell:</strong> Automated log parsing, regex IOC extraction, API threat intelligence enrichment.
                </li>
                <li className="p-2 rounded bg-[#18181e] border border-[#222228]">
                  <strong>Sigma & YARA:</strong> Writing portable detection rules for process injection and file-based threats.
                </li>
                <li className="p-2 rounded bg-[#18181e] border border-[#222228]">
                  <strong>Suricata & Snort:</strong> Custom NIDS signatures for beaconing detection and suspicious user-agents.
                </li>
                <li className="p-2 rounded bg-[#18181e] border border-[#222228]">
                  <strong>Bash & Linux CLI:</strong> Log carving with awk, sed, grep, jq, and journalctl.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Contact Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#18181c] to-[#121215] border border-[#27272a] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold font-['Geist'] text-zinc-100">
              Ready to Contribute to Your SOC or DFIR Team
            </h3>
            <p className="text-sm font-['Geist'] text-zinc-400">
              Actively seeking Summer / Fall 2027 Blue Team, SOC Analyst, or Threat Hunting Internships.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="mailto:linhtatblue@gmail.com"
              className="px-5 py-2.5 rounded-lg bg-[#fbbf24] text-[#451a03] font-['JetBrains_Mono'] text-xs font-bold hover:bg-amber-400 transition-colors shadow-sm"
            >
              Contact: linhtatblue@gmail.com
            </a>
            <a
              href="/resources/resume.pdf"
              download="Tat_Tieu_Linh_SOC_Analyst_Resume.pdf"
              className="px-4 py-2.5 rounded-lg bg-[#202026] border border-[#383842] text-zinc-200 hover:text-[#fbbf24] font-['JetBrains_Mono'] text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              Download Resume [PDF]
            </a>
          </div>
        </div>
      </div>

      {/* High-Resolution Certificate Lightbox Modal */}
      {selectedCertImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedCertImage(null)}
        >
          <div 
            className="bg-[#121215] border border-[#27272a] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-[#15151a] border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[11px] font-bold uppercase"
                  style={{ color: selectedCertImage.badgeColor, backgroundColor: `${selectedCertImage.badgeColor}20` }}
                >
                  {selectedCertImage.issuer}
                </span>
                <h3 className="font-['Geist'] text-sm sm:text-base font-bold text-zinc-100 truncate">
                  {selectedCertImage.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={selectedCertImage.image}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded hover:bg-[#202026] text-zinc-400 hover:text-amber-300 transition-colors"
                  title="Open image directly"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setSelectedCertImage(null)}
                  className="p-1.5 rounded hover:bg-[#202026] text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Certificate Display Area */}
            <div className="p-4 sm:p-6 overflow-y-auto flex flex-col items-center justify-center bg-[#0a0a0d]">
              <div className="relative rounded-xl overflow-hidden border border-[#27272a] shadow-2xl max-h-[70vh]">
                <img
                  src={selectedCertImage.image}
                  alt={selectedCertImage.title}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#15151a] border-t border-[#27272a] flex flex-wrap items-center justify-between gap-3 font-['JetBrains_Mono'] text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{selectedCertImage.date}</span>
                <span className="text-zinc-600 hidden sm:inline">•</span>
                <span className="text-zinc-400 hidden sm:inline">{selectedCertImage.scoreOrLevel}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-zinc-500 text-[11px] hidden md:inline">
                  File: {selectedCertImage.image}
                </span>
                <a
                  href={selectedCertImage.image}
                  download={selectedCertImage.image.split('/').pop()}
                  className="px-3 py-1.5 rounded bg-[#1c1c22] border border-[#27272a] hover:border-[#fbbf24] text-zinc-200 hover:text-[#fbbf24] transition-colors"
                >
                  Download Certificate Image
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
