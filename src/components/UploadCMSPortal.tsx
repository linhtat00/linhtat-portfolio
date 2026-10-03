import React, { useState, useEffect } from 'react';
import { Writeup, CategoryType, PlatformType, DifficultyType, IOCItem, DetectionQuery } from '../types';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Plus, 
  Trash2, 
  FileText, 
  Eye, 
  Edit3, 
  Sparkles, 
  Database, 
  Shield, 
  Terminal, 
  Check, 
  ExternalLink,
  Code2, 
  ListPlus,
  RefreshCw,
  Search,
  Hash,
  Clock,
  Binary,
  Layers,
  Copy,
  X,
  HelpCircle,
  GitBranch
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface UploadCMSPortalProps {
  writeups: Writeup[];
  onSaveWriteup: (writeup: Writeup) => void;
  onDeleteWriteup: (id: string) => void;
  onExitToPublic: () => void;
  onViewWriteupInPublic: (writeup: Writeup) => void;
}

// Platform prefix mapping
const getPlatformPrefix = (plat: PlatformType): string => {
  switch (plat) {
    case 'HackTheBox': return '#HTB';
    case 'Blue Team Labs': return '#BTLO';
    case 'CyberDefenders': return '#CD';
    case 'MTA Labs': return '#MTA';
    case 'Sherlocks': return '#SHERLOCK';
    case 'Internal Range': return '#IR';
    default: return '#LAB';
  }
};

const formatCurrentTimestamp = (d = new Date()) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}${mm}${dd}-${hh}${min}`;
};

const generatePlatformCode = (plat: PlatformType): string => {
  return `${getPlatformPrefix(plat)}-${formatCurrentTimestamp()}`;
};

// Realistic read time algorithm for cybersecurity documentation
const calculateRealisticReadTime = (
  contentTxt: string,
  summaryTxt: string,
  queries: DetectionQuery[],
  iocList: IOCItem[],
  telemetryTxt: string
): { readTimeStr: string; words: number; codeBlocksCount: number } => {
  const combined = `${summaryTxt} ${contentTxt}`;
  const words = combined.trim().split(/\s+/).filter(Boolean).length;
  const codeBlocksCount = (contentTxt.match(/```[\s\S]*?```/g) || []).length;

  // Technical DFIR reading speed: ~180 wpm
  const proseMinutes = words / 180;
  // Scrutinizing code blocks: ~0.4 min each
  const codeMinutes = codeBlocksCount * 0.4;
  // Scrutinizing SIEM queries / Sigma rules: ~0.5 min each
  const queryMinutes = queries.filter(q => q.code?.trim()).length * 0.5;
  // Scanning IOC tables: ~0.1 min per artifact
  const iocMinutes = iocList.filter(i => i.value?.trim()).length * 0.1;
  // Inspecting raw telemetry hex/stream: ~0.5 min if present
  const telemetryMinutes = telemetryTxt?.trim() ? 0.5 : 0;

  const totalMinutes = proseMinutes + codeMinutes + queryMinutes + iocMinutes + telemetryMinutes;
  const rounded = Math.max(1, Math.round(totalMinutes));
  return {
    readTimeStr: `${rounded} min read`,
    words,
    codeBlocksCount
  };
};

export const UploadCMSPortal: React.FC<UploadCMSPortalProps> = ({
  writeups,
  onSaveWriteup,
  onDeleteWriteup,
  onExitToPublic,
  onViewWriteupInPublic
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'manage'>('editor');
  
  // Editor State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<PlatformType>('Internal Range');
  const [code, setCode] = useState(() => generatePlatformCode('Internal Range'));
  const [isCodeManuallyModified, setIsCodeManuallyModified] = useState(false);
  const [category, setCategory] = useState<CategoryType>('Memory Forensics');
  const [difficulty, setDifficulty] = useState<DifficultyType>('HARD');
  const [readTime, setReadTime] = useState('8 min read');
  const [isManualReadTime, setIsManualReadTime] = useState(false);
  const [mitreInput, setMitreInput] = useState('T1055.012, T1574.002, T1071.001');
  const [toolsInput, setToolsInput] = useState('Volatility 3, Splunk ES, Wireshark, Ghidra');
  const [summary, setSummary] = useState('');

  // 4 Core Parts
  // Part 1: Technical Dossier Markdown
  const [content, setContent] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // Part 2: SIEM Detection Queries & Rules (Empty by default)
  const [detectionQueries, setDetectionQueries] = useState<DetectionQuery[]>([]);

  // Part 3: Threat Artifacts & IOCs (Empty by default)
  const [iocs, setIocs] = useState<IOCItem[]>([]);

  // Part 4: Raw Telemetry Feed (Empty by default)
  const [rawTelemetry, setRawTelemetry] = useState<string>('');

  const [activeDossierSection, setActiveDossierSection] = useState<'dossier' | 'siem' | 'iocs' | 'telemetry'>('dossier');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Auto-calculate read time when content changes (unless user explicitly entered custom)
  useEffect(() => {
    if (!isManualReadTime) {
      const stats = calculateRealisticReadTime(content, summary, detectionQueries, iocs, rawTelemetry);
      setReadTime(stats.readTimeStr);
    }
  }, [content, summary, detectionQueries, iocs, rawTelemetry, isManualReadTime]);

  // Handle platform change: update code prefix if not manually customized
  const handlePlatformChange = (newPlatform: PlatformType) => {
    setPlatform(newPlatform);
    if (!isCodeManuallyModified) {
      setCode(generatePlatformCode(newPlatform));
    }
  };

  // Re-generate auto prefix on demand
  const handleRegenerateCode = () => {
    const newCode = generatePlatformCode(platform);
    setCode(newCode);
    setIsCodeManuallyModified(false);
  };

  // Template Loaders
  const loadDfirTemplate = () => {
    setEditingId(null);
    setPlatform('Internal Range');
    setCode(generatePlatformCode('Internal Range'));
    setIsCodeManuallyModified(false);
    setTitle('Lumma Stealer Memory Evasion & TLS C2 Dissection');
    setCategory('Memory Forensics');
    setDifficulty('HARD');
    setMitreInput('T1566.002, T1059.001, T1055.012, T1071.001');
    setToolsInput('Volatility 3, Splunk ES, KAPE, YARA, Wireshark');
    setSummary('Investigated an in-memory process hollowing infection delivering Lumma Stealer. Carved raw memory dumps, reconstructed encrypted TLS command channels, and engineered high-confidence Sysmon correlation rules.');
    setContent(`## Executive Summary
An endpoint alert triggered on workstation \`WKSTN-FIN-09\` following anomalous outbound TLS traffic over non-standard port 8443. Memory forensics revealed process injection into \`explorer.exe\` carrying the Lumma Stealer credential harvesting routine.

## 1. Initial Triage & Evidence Acquisition
- Acquired memory dump: \`wkstn-fin-09-mem.raw\` (16 GB)
- Triaged active network sockets at time of acquisition:
\`\`\`bash
vol.py -f wkstn-fin-09-mem.raw windows.netscan | grep -E "ESTABLISHED|SYN_SENT"
\`\`\`
Identified anomalous connection to remote IP \`194.87.139.12:8443\` initiated by PID 4120 (\`explorer.exe\`).

## 2. Deep Dive Memory Carving
Scanning with \`windows.malfind\` revealed an unbacked executable memory allocation with \`PAGE_EXECUTE_READWRITE\` permissions inside PID 4120:
\`\`\`bash
vol.py -f wkstn-fin-09-mem.raw windows.malfind --pid 4120 --dump
\`\`\`

Disassembly of the dumped chunk confirmed the familiar Lumma payload header and routine searching for Chromium \`Local State\` files and cryptocurrency extension wallets.

## 3. SIEM Correlation & Detection Engineering
To catch future variations of this injection, we deployed a Splunk correlation rule targeting Sysmon Event ID 8 (CreateRemoteThread) originating from unauthorized temp folders.

## 4. Key Takeaways & Hardening
- Enforced strict Application Control rules preventing script interpreters from launching binaries located in \`%AppData%\\Local\\Temp\`.
- Deployed TLS SNI inspection at perimeter firewall to drop known dynamic DNS domains.`);

    setDetectionQueries([
      {
        title: 'Splunk SPL: Svchost Process Hollowing with Anomalous Parent',
        language: 'spl',
        description: 'Detects svchost.exe spawned by non-services.exe parent or loading unsigned dynamic libraries from AppData/Temp.',
        code: `index=edr_telemetry sourcetype="sysmon:process_creation" Image="*\\\\svchost.exe"
| eval is_anomalous_parent=if(ParentImage!="*\\\\services.exe", 1, 0)
| eval is_suspicious_path=if(match(CommandLine, "(?i)(AppData|LocalLow|Temp)"), 1, 0)
| where is_anomalous_parent=1 OR is_suspicious_path=1
| stats count min(_time) as first_seen max(_time) as last_seen by host, User, ParentImage, CommandLine, ProcessGuid
| sort - count`
      },
      {
        title: 'Sigma Rule: Suspect svchost.exe Module Load',
        language: 'yaml',
        description: 'Sigma generic rule to detect untrusted DLL injection in svchost.',
        code: `title: Suspicious Module Loaded in svchost
id: a78d1052-192a-4a21-9923-qakbot001
status: test
logsource:
    category: image_load
    product: windows
detection:
    selection:
        Image|endswith: '\\svchost.exe'
        ImageLoaded|contains:
            - '\\AppData\\Local\\Temp\\'
            - '\\ProgramData\\'
        Signed: 'false'
    condition: selection
level: high`
      }
    ]);

    setIocs([
      { type: 'SHA256', value: '4a1b8c9d0e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b', description: 'Malicious DLL drop payload (wermgr_hook.dll)' },
      { type: 'IPv4', value: '185.156.73.49:443', description: 'QakBot primary Tier-2 C2 node' },
      { type: 'NamedPipe', value: '\\\\.\\pipe\\spoolss_svc_proxy', description: 'IPC channel used for hollowed child thread synchronization' },
      { type: 'Registry', value: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\WbemSysInit', description: 'Persistence autorun key' }
    ]);

    setRawTelemetry(`00000000: 4d 5a 90 00 03 00 00 00 04 00 00 00 ff ff 00 00  MZ..............
00000010: b8 00 00 00 00 00 00 00 40 00 00 00 00 00 00 00  ........@.......
00000020: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
00000030: 00 00 00 00 00 00 00 00 00 00 00 00 f8 00 00 00  ................
00000040: 0e 1f ba 0e 00 b4 09 cd 21 b8 01 4c cd 21 54 68  ........!..L.!Th
00000050: 69 73 20 70 72 6f 67 72 61 6d 20 63 61 6e 6e 6f  is program canno
00000060: 74 20 62 65 20 72 75 6e 20 69 6e 20 44 4f 53 20  t be run in DOS 
00000070: 6d 6f 64 65 2e 0d 0d 0a 24 00 00 00 00 00 00 00  mode....$.......`);
  };

  const loadCtfTemplate = () => {
    setEditingId(null);
    setPlatform('HackTheBox');
    setCode(generatePlatformCode('HackTheBox'));
    setIsCodeManuallyModified(false);
    setTitle('Sherlock: CrownJewel Active Directory Persistence Triage');
    setCategory('Active Directory');
    setDifficulty('MED');
    setMitreInput('T1078.002, T1098, T1003.006');
    setToolsInput('Splunk ES, BloodHound, Impacket, Mimikatz, Karkinos');
    setSummary('Dissected compromised Domain Controller event logs to reconstruct an adversary ticket-granting compromise. Traced Golden Ticket generation and forged Kerberos delegation rights.');
    setContent(`## Challenge Overview
The security operations center received alert \`SEC-ALERT-AD-4769\` representing anomalous Kerberos Service Ticket requests with RC4 encryption against krbtgt.

### Step 1: Querying Kerberos Ticket Logs (Event 4769)
\`\`\`spl
index=wineventlog EventCode=4769 TicketEncryptionType=0x17
| stats count by TargetUserName, IpAddress, ServiceName
| sort - count
\`\`\`

### Step 2: Correlating with Malicious Replication
Investigated directory service replication calls (Event 4662) from untrusted workstation IP \`10.10.14.35\`.`);

    setDetectionQueries([
      {
        title: 'Splunk SPL: Kerberoasting Ticket Requests with Weak RC4 Encryption',
        language: 'spl',
        description: 'Detects EventCode 4769 ticket requests using legacy 0x17 encryption algorithm.',
        code: `index=wineventlog EventCode=4769 TicketEncryptionType=0x17 ServiceName!="*$*"
| stats count values(ServiceName) as requested_spns by TargetUserName, IpAddress
| where count > 3`
      }
    ]);

    setIocs([
      { type: 'IPv4', value: '10.10.14.35', description: 'Rogue attacker kali IP requesting SPN tickets' },
      { type: 'Domain', value: 'corp.crownjewel.local', description: 'Compromised Active Directory realm' }
    ]);

    setRawTelemetry(`EventCode: 4769
ComputerName: DC01.corp.crownjewel.local
TargetUserName: admin_backup@corp.crownjewel.local
ServiceName: MSSQLSvc/db01.corp.crownjewel.local:1433
TicketOptions: 0x40810000
TicketEncryptionType: 0x17
Status: 0x0`);
  };

  const handleEditExisting = (item: Writeup) => {
    setEditingId(item.id);
    setCode(item.code);
    setIsCodeManuallyModified(true);
    setTitle(item.title);
    setCategory(item.category);
    setPlatform(item.platform);
    setDifficulty(item.difficulty);
    setReadTime(item.readTime);
    setIsManualReadTime(true);
    setMitreInput(item.mitreAttack.join(', '));
    setToolsInput(item.tools.join(', '));
    setSummary(item.summary);
    setContent(item.content);
    if (item.detectionQueries) {
      setDetectionQueries(item.detectionQueries);
    } else {
      setDetectionQueries([]);
    }
    if (item.iocs) {
      setIocs(item.iocs);
    } else {
      setIocs([]);
    }
    setRawTelemetry(item.rawTelemetry || '');
    setActiveSubTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setEditingId(null);
    setPlatform('Internal Range');
    setCode(generatePlatformCode('Internal Range'));
    setIsCodeManuallyModified(false);
    setTitle('');
    setCategory('Memory Forensics');
    setDifficulty('MED');
    setIsManualReadTime(false);
    setMitreInput('T1055, T1071');
    setToolsInput('Volatility 3, Splunk ES, Wireshark');
    setSummary('');
    setContent('');
    setDetectionQueries([]);
    setIocs([]);
    setRawTelemetry('');
  };

  // Helper to add detection query
  const handleAddQuery = () => {
    setDetectionQueries(prev => [
      ...prev,
      {
        title: 'New SIEM / Detection Rule',
        language: 'spl',
        description: 'Describe detection logic and trigger criteria...',
        code: `index=sysmon EventCode=1 Image="*\\\\powershell.exe" CommandLine="*bypass*"`
      }
    ]);
  };

  const handleUpdateQuery = (index: number, field: keyof DetectionQuery, value: string) => {
    setDetectionQueries(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveQuery = (index: number) => {
    setDetectionQueries(prev => prev.filter((_, i) => i !== index));
  };

  // Helper to add IOC
  const handleAddIoc = () => {
    setIocs(prev => [
      ...prev,
      {
        type: 'SHA256',
        value: '',
        description: 'Malicious payload / artifact indicator'
      }
    ]);
  };

  const handleUpdateIoc = (index: number, field: keyof IOCItem, value: string) => {
    setIocs(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveIoc = (index: number) => {
    setIocs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please fill out at least Title and Markdown Dossier Content.');
      return;
    }

    const mitreAttack = mitreInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const tools = toolsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const savedWriteup: Writeup = {
      id: editingId || `writeup-${Date.now()}`,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      code: code.trim() || generatePlatformCode(platform),
      title: title.trim(),
      category,
      platform,
      difficulty,
      date: editingId ? (writeups.find(w => w.id === editingId)?.date || 'Updated Today') : 'Published Today',
      readTime: readTime.trim() || '6 min read',
      mitreAttack: mitreAttack.length ? mitreAttack : ['T1059'],
      tools: tools.length ? tools : ['Wireshark'],
      summary: summary.trim() || title.trim(),
      content: content.trim(),
      featured: false,
      detectionQueries: detectionQueries.filter(q => q.title && q.code),
      iocs: iocs.filter(i => i.value),
      rawTelemetry: rawTelemetry.trim()
    };

    onSaveWriteup(savedWriteup);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportMarkdown = () => {
    if (!title.trim() || !content.trim()) {
      alert('Please enter a title and content before exporting.');
      return;
    }

    // Build comprehensive markdown with all 4 parts
    const queriesMarkdown = detectionQueries.length > 0 
      ? `\n## SIEM Detection & Correlation Rules\n` + detectionQueries.map(q => 
          `### ${q.title}\n*Format: ${q.language.toUpperCase()}*\n> ${q.description}\n\n\`\`\`${q.language}\n${q.code}\n\`\`\`\n`
        ).join('\n')
      : '';

    const iocMarkdown = iocs.length > 0
      ? `\n## Threat Artifacts & Indicators of Compromise (IOCs)\n| Type | Indicator Value | Description |\n| :--- | :--- | :--- |\n` +
        iocs.map(i => `| **${i.type}** | \`${i.value}\` | ${i.description || 'Artifact'} |`).join('\n') + '\n'
      : '';

    const telemetryMarkdown = rawTelemetry.trim()
      ? `\n## Raw Telemetry & Forensic Dump\n\`\`\`text\n${rawTelemetry.trim()}\n\`\`\`\n`
      : '';

    const mdContent = `---
code: "${code}"
title: "${title}"
category: "${category}"
platform: "${platform}"
difficulty: "${difficulty}"
readTime: "${readTime}"
mitreAttack: [${mitreInput}]
tools: [${toolsInput}]
date: "${new Date().toISOString().split('T')[0]}"
---

# ${code} - ${title}

> **Domain**: ${category} | **Platform**: ${platform} | **Difficulty**: ${difficulty} | **Read Time**: ${readTime}

## Executive Summary
${summary}

---

## 1. Investigation Dossier
${content}
${queriesMarkdown}
${iocMarkdown}
${telemetryMarkdown}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${code.replace(/[^a-zA-Z0-9_-]/g, '') || 'writeup'}_${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // State for decoupled export and architecture guide modals
  const [showTsModal, setShowTsModal] = useState(false);
  const [tsSnippet, setTsSnippet] = useState('');
  const [copiedTs, setCopiedTs] = useState(false);

  const handleOpenTsExport = () => {
    const mitreAttack = mitreInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const tools = toolsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'investigation';
    const varName = slug.replace(/-([a-z0-9])/g, (_, g) => g.toUpperCase()) + 'Writeup';

    const activeObj: Partial<Writeup> = {
      id: editingId || `writeup-${Date.now()}`,
      slug,
      code: code.trim() || generatePlatformCode(platform),
      title: title.trim() || 'Untitled Investigation',
      category,
      platform,
      difficulty,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      readTime: readTime.trim() || '6 min read',
      mitreAttack: mitreAttack.length ? mitreAttack : ['T1059'],
      tools: tools.length ? tools : ['Wireshark'],
      featured: false,
      summary: summary.trim(),
      iocs: iocs.filter(i => i.value?.trim()),
      detectionQueries: detectionQueries.filter(q => q.title?.trim() && q.code?.trim()),
      rawTelemetry: rawTelemetry.trim() || undefined,
      content: content.trim()
    };

    const formattedCode = `// ----------------------------------------------------------------------
// 1. Create a dedicated file: src/data/writeups/${slug}.ts
// 2. Add 'export { ${varName} } from "./${slug}";' in src/data/writeups/index.ts
// ----------------------------------------------------------------------
import { Writeup } from '../../types';

export const ${varName}: Writeup = {
  id: ${JSON.stringify(activeObj.id)},
  slug: ${JSON.stringify(activeObj.slug)},
  code: ${JSON.stringify(activeObj.code)},
  title: ${JSON.stringify(activeObj.title)},
  category: ${JSON.stringify(activeObj.category)},
  platform: ${JSON.stringify(activeObj.platform)},
  difficulty: ${JSON.stringify(activeObj.difficulty)},
  date: ${JSON.stringify(activeObj.date)},
  readTime: ${JSON.stringify(activeObj.readTime)},
  mitreAttack: ${JSON.stringify(activeObj.mitreAttack)},
  tools: ${JSON.stringify(activeObj.tools)},
  featured: false,
  summary: ${JSON.stringify(activeObj.summary)},
  iocs: ${JSON.stringify(activeObj.iocs, null, 4)},
  detectionQueries: ${JSON.stringify(activeObj.detectionQueries, null, 4)},
  ${activeObj.rawTelemetry ? `rawTelemetry: ${JSON.stringify(activeObj.rawTelemetry)},\n  ` : ''}content: \`${(activeObj.content || '').replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`
};
`;

    setTsSnippet(formattedCode);
    setShowTsModal(true);
  };

  const calculatedStats = calculateRealisticReadTime(content, summary, detectionQueries, iocs, rawTelemetry);

  return (
    <div className="cms-portal-root">
      {/* Top CMS Header Bar */}
      <div className="cms-portal-topbar">
        <div className="cms-portal-topbar-inner">
          <div className="flex items-center gap-3">
            <button
              onClick={onExitToPublic}
              className="cms-portal-back-btn"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Showcase</span>
            </button>

            <span className="text-zinc-700 hidden sm:inline">|</span>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="cms-portal-badge">
                PORTFOLIO CMS
              </span>
              <span className="text-zinc-400 hidden md:inline">Route: /upload</span>
            </div>
          </div>

          {/* Quick Sub-navigation */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveSubTab('editor')}
              className={`cms-portal-nav-btn ${
                activeSubTab === 'editor' ? 'cms-portal-nav-btn-active' : ''
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{editingId ? 'Edit Active Dossier' : 'Writeup Editor'}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('manage')}
              className={`cms-portal-nav-btn ${
                activeSubTab === 'manage' ? 'cms-portal-nav-btn-active' : ''
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Manage Writeups ({writeups.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="cms-portal-container">
        {/* Banner Alert */}
        <div className="cms-banner-card">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary-val" />
              <h1 className="font-mono text-sm font-bold text-zinc-100 uppercase tracking-wide">
                Authoring Workbench // 4-Part Threat Dossier System
              </h1>
            </div>
            <p className="text-xs text-zinc-400 max-w-3xl">
              Writeups are composed of 4 key components: <strong className="text-zinc-300">Technical Dossier (Markdown)</strong>, <strong className="text-zinc-300">SIEM Detections & Rules</strong>, <strong className="text-zinc-300">Threat Artifacts & IOCs</strong>, and <strong className="text-zinc-300">Raw Telemetry</strong>. When published, each part powers its respective tab in the public viewer.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={loadDfirTemplate}
              className="px-2.5 py-1.5 rounded bg-container-val border border-surface-val hover:border-amber-400/50 text-zinc-300 hover:text-primary-val transition-colors flex items-center gap-1 cursor-pointer"
              title="Load full 4-part DFIR Incident Response Template"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary-val" />
              <span>DFIR Template</span>
            </button>

            <button
              onClick={loadCtfTemplate}
              className="px-2.5 py-1.5 rounded bg-container-val border border-surface-val hover:border-amber-400/50 text-zinc-300 hover:text-primary-val transition-colors flex items-center gap-1 cursor-pointer"
              title="Load full 4-part CTF / Active Directory Template"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary-val" />
              <span>CTF Template</span>
            </button>

            {editingId && (
              <button
                onClick={handleResetForm}
                className="px-2.5 py-1.5 rounded bg-zinc-800/80 hover:bg-[#27272a] text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New Blank</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: EDITOR */}
        {activeSubTab === 'editor' && (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Metadata & Classification Box */}
            <div className="p-6 rounded-xl bg-surface-val border border-surface-val space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-xs font-semibold text-primary-val uppercase tracking-wider flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5" />
                  <span>Dossier Classification & Automated Tagging</span>
                </h2>
                <span className="text-zinc-500 font-mono text-[11px]">
                  Prefix & Read-Time are auto-synchronized
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
                {/* Platform Selector */}
                <div>
                  <label className="text-zinc-400 text-[11px] block mb-1 font-semibold">
                    Target Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => handlePlatformChange(e.target.value as PlatformType)}
                    className="w-full px-3 py-2 rounded bg-black/80 border border-surface-val text-zinc-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="HackTheBox">HackTheBox (#HTB)</option>
                    <option value="Blue Team Labs">Blue Team Labs (#BTLO)</option>
                    <option value="CyberDefenders">CyberDefenders (#CD)</option>
                    <option value="MTA Labs">MTA Labs (#MTA)</option>
                    <option value="Sherlocks">Sherlocks (#SHERLOCK)</option>
                    <option value="Internal Range">Internal Range (#IR)</option>
                  </select>
                </div>

                {/* Code / Prefix with Auto-generation & Manual Modification */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-zinc-400 text-[11px] font-semibold">
                      Code / Prefix
                    </label>
                    <button
                      type="button"
                      onClick={handleRegenerateCode}
                      className="text-[10px] text-primary-val hover:underline flex items-center gap-0.5 cursor-pointer"
                      title="Generate new prefix based on platform and timestamp"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Auto-Generate</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        setIsCodeManuallyModified(true);
                      }}
                      placeholder="#HTB-YYYYMMDD-HHmm"
                      className="w-full px-3 py-2 rounded bg-black/80 border border-surface-val text-zinc-200 focus:outline-none focus:border-amber-400 font-mono"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 font-sans">
                    {isCodeManuallyModified ? 'Custom modified code' : '⚡ Auto-generated from platform + timestamp'}
                  </p>
                </div>

                {/* Category Selector */}
                <div>
                  <label className="text-zinc-400 text-[11px] block mb-1 font-semibold">Domain / Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 rounded bg-black/80 border border-surface-val text-zinc-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Memory Forensics">Memory Forensics</option>
                    <option value="Active Directory">Active Directory</option>
                    <option value="PCAP Triage">PCAP Triage</option>
                    <option value="Disk Forensics">Disk Forensics</option>
                    <option value="Threat Hunting">Threat Hunting</option>
                    <option value="SIEM & Detection">SIEM & Detection</option>
                    <option value="Incident Response">Incident Response</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-zinc-400 text-[11px] block mb-1 font-semibold">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyType)}
                    className="w-full px-3 py-2 rounded bg-black/80 border border-surface-val text-zinc-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MED">MED</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-zinc-400 text-[11px] font-mono block mb-1 font-semibold">
                  Dossier Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Lumma Stealer Memory Evasion & TLS C2 Dissection"
                  className="w-full px-3.5 py-2.5 rounded bg-black/80 border border-surface-val text-zinc-100 font-sans text-base focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* Summary */}
              <div>
                <label className="text-zinc-400 text-[11px] font-mono block mb-1 font-semibold">
                  Executive Summary (Recruiter preview paragraph)
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="High-level narrative summarizing initial detection, forensic triage techniques, and remediation outcomes..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded bg-black/80 border border-surface-val text-zinc-300 font-sans text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Tags & Estimated Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                {/* Auto Read Time with Manual Override */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-zinc-400 text-[11px] font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-primary-val" />
                      <span>Estimated Read Time</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsManualReadTime(!isManualReadTime);
                        if (isManualReadTime) {
                          setReadTime(calculatedStats.readTimeStr);
                        }
                      }}
                      className="text-[10px] text-primary-val hover:underline cursor-pointer"
                    >
                      {isManualReadTime ? 'Use Auto-Calc' : 'Manual Override'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => {
                      setReadTime(e.target.value);
                      setIsManualReadTime(true);
                    }}
                    placeholder="8 min read"
                    className="w-full px-3 py-2 rounded bg-black/80 border border-surface-val text-zinc-200 focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1 font-sans">
                    {isManualReadTime 
                      ? 'Manual time set' 
                      : `⚡ Auto: ~${calculatedStats.words} words, ${calculatedStats.codeBlocksCount} code blocks, ${detectionQueries.length} rules, ${iocs.length} IOCs`}
                  </p>
                </div>

                <div>
                  <label className="text-zinc-400 text-[11px] block mb-1 font-semibold">
                    MITRE ATT&CK IDs (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={mitreInput}
                    onChange={(e) => setMitreInput(e.target.value)}
                    placeholder="T1055, T1071.001"
                    className="w-full px-3 py-2 rounded bg-black/80 border border-surface-val text-zinc-300 focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1 font-sans">
                    E.g., T1055.012, T1574.002
                  </p>
                </div>

                <div>
                  <label className="text-zinc-400 text-[11px] block mb-1 font-semibold">
                    Tools Used (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={toolsInput}
                    onChange={(e) => setToolsInput(e.target.value)}
                    placeholder="Volatility 3, Splunk, Wireshark"
                    className="w-full px-3 py-2 rounded bg-black/80 border border-surface-val text-zinc-300 focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1 font-sans">
                    E.g., Volatility 3, Ghidra, Splunk ES
                  </p>
                </div>
              </div>
            </div>

            {/* 4-PART INTERACTIVE WORKBENCH */}
            <div className="p-6 rounded-xl bg-surface-val border border-surface-val space-y-6">
              {/* Section Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-val pb-4">
                <div>
                  <h2 className="font-mono text-xs font-semibold text-primary-val uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Dossier Sections (All 4 Parts)</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Switch between sections below to write each component of your investigation.
                  </p>
                </div>

                {/* 4 Part Selector Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs bg-black/80 p-1.5 rounded-lg border border-surface-val">
                  <button
                    type="button"
                    onClick={() => setActiveDossierSection('dossier')}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeDossierSection === 'dossier'
                        ? 'bg-container-val text-primary-val font-bold border border-amber-400/30'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>1. Technical Dossier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveDossierSection('siem')}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeDossierSection === 'siem'
                        ? 'bg-container-val text-primary-val font-bold border border-amber-400/30'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>2. SIEM & Rules ({detectionQueries.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveDossierSection('iocs')}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeDossierSection === 'iocs'
                        ? 'bg-container-val text-primary-val font-bold border border-amber-400/30'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>3. IOC Artifacts ({iocs.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveDossierSection('telemetry')}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeDossierSection === 'telemetry'
                        ? 'bg-container-val text-primary-val font-bold border border-amber-400/30'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Binary className="w-3.5 h-3.5" />
                    <span>4. Raw Telemetry</span>
                  </button>
                </div>
              </div>

              {/* PART 1: TECHNICAL DOSSIER (MARKDOWN) */}
              {activeDossierSection === 'dossier' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-zinc-100">
                        Part 1: Investigation Narrative & Forensic Steps (Markdown)
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Write in Markdown with command blocks, headers, bullet points, and analysis.
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-black/80 p-1 rounded-lg border border-surface-val font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => setPreviewMode(false)}
                        className={`px-3 py-1 rounded flex items-center gap-1.5 cursor-pointer ${
                          !previewMode ? 'bg-container-val text-primary-val font-medium' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Raw Markdown</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode(true)}
                        className={`px-3 py-1 rounded flex items-center gap-1.5 cursor-pointer ${
                          previewMode ? 'bg-container-val text-primary-val font-medium' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Rendered Preview</span>
                      </button>
                    </div>
                  </div>

                  {!previewMode ? (
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="# 1. Scenario Overview&#10;Describe your incident response workflow here...&#10;&#10;```bash&#10;vol.py -f memory.raw windows.malfind&#10;```"
                      rows={14}
                      className="w-full p-4 rounded-lg bg-black/80 border border-surface-val text-zinc-200 font-mono text-xs focus:outline-none focus:border-amber-400 leading-relaxed font-mono"
                      required
                    />
                  ) : (
                    <div className="p-6 rounded-lg bg-black/80 border border-surface-val min-h-[300px] prose prose-invert max-w-none text-zinc-300">
                      <ReactMarkdown>{content || '*No markdown content provided yet.*'}</ReactMarkdown>
                    </div>
                  )}
                </div>
              )}

              {/* PART 2: SIEM DETECTION & RULES */}
              {activeDossierSection === 'siem' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-zinc-100">
                        Part 2: SIEM Detection Engineering & Correlation Rules
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Add Splunk SPL queries, Elastic KQL, Sigma rules, or YARA rules that detect this attack.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddQuery}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary-val text-black font-mono text-xs font-bold hover:bg-amber-400 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Detection Rule</span>
                    </button>
                  </div>

                  {detectionQueries.length === 0 ? (
                    <div className="p-8 rounded-lg bg-black/80 border border-dashed border-surface-val text-center space-y-2">
                      <Code2 className="w-8 h-8 text-zinc-500 mx-auto" />
                      <p className="text-xs text-zinc-400">No detection queries added yet.</p>
                      <button
                        type="button"
                        onClick={handleAddQuery}
                        className="text-xs text-primary-val hover:underline font-mono cursor-pointer"
                      >
                        + Add your first Splunk SPL or Sigma rule
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {detectionQueries.map((query, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-black/80 border border-surface-val space-y-3 font-mono text-xs">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <label className="text-zinc-500 text-[10px] block mb-1">Rule Title</label>
                              <input
                                type="text"
                                value={query.title}
                                onChange={(e) => handleUpdateQuery(idx, 'title', e.target.value)}
                                placeholder="e.g., Splunk SPL: Process Injection into Svchost"
                                className="w-full px-3 py-1.5 rounded bg-container-val border border-surface-val text-zinc-200 focus:outline-none focus:border-amber-400"
                              />
                            </div>

                            <div className="w-40">
                              <label className="text-zinc-500 text-[10px] block mb-1">Format / Language</label>
                              <select
                                value={query.language}
                                onChange={(e) => handleUpdateQuery(idx, 'language', e.target.value)}
                                className="w-full px-3 py-1.5 rounded bg-container-val border border-surface-val text-zinc-200 focus:outline-none focus:border-amber-400"
                              >
                                <option value="spl">Splunk SPL</option>
                                <option value="kql">Elastic KQL / Sentinel</option>
                                <option value="yaml">Sigma YAML</option>
                                <option value="yara">YARA</option>
                                <option value="snort">Suricata / Snort</option>
                                <option value="powershell">PowerShell</option>
                              </select>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveQuery(idx)}
                              className="self-end p-2 rounded bg-zinc-900 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete rule"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div>
                            <label className="text-zinc-500 text-[10px] block mb-1">Detection Logic / Description</label>
                            <input
                              type="text"
                              value={query.description}
                              onChange={(e) => handleUpdateQuery(idx, 'description', e.target.value)}
                              placeholder="Describe what anomalous behavior or telemetry EventCode this catches..."
                              className="w-full px-3 py-1.5 rounded bg-container-val border border-surface-val text-zinc-300 font-sans text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>

                          <div>
                            <label className="text-zinc-500 text-[10px] block mb-1">Rule Code / Query Syntax</label>
                            <textarea
                              value={query.code}
                              onChange={(e) => handleUpdateQuery(idx, 'code', e.target.value)}
                              rows={4}
                              placeholder="index=sysmon EventCode=8 TargetImage=... | stats count by ..."
                              className="w-full p-3 rounded bg-surface-val border border-surface-val text-amber-300/90 font-mono text-xs focus:outline-none focus:border-amber-400 leading-relaxed"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PART 3: THREAT ARTIFACTS & IOCS */}
              {activeDossierSection === 'iocs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-zinc-100">
                        Part 3: Threat Artifacts & Indicators of Compromise (IOCs)
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Document extracted file hashes, rogue C2 IP addresses, named pipes, and registry persistence keys.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddIoc}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary-val text-black font-mono text-xs font-bold hover:bg-amber-400 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add IOC Artifact</span>
                    </button>
                  </div>

                  {iocs.length === 0 ? (
                    <div className="p-8 rounded-lg bg-black/80 border border-dashed border-surface-val text-center space-y-2">
                      <Shield className="w-8 h-8 text-zinc-500 mx-auto" />
                      <p className="text-xs text-zinc-400">No threat indicators added yet.</p>
                      <button
                        type="button"
                        onClick={handleAddIoc}
                        className="text-xs text-primary-val hover:underline font-mono cursor-pointer"
                      >
                        + Add your first SHA256, IPv4, or Registry IOC
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 font-mono text-xs">
                      {iocs.map((ioc, idx) => (
                        <div key={idx} className="p-3.5 rounded-lg bg-black/80 border border-surface-val flex flex-col md:flex-row items-start md:items-center gap-3">
                          <div className="w-full md:w-36">
                            <label className="text-zinc-500 text-[10px] block mb-1">Indicator Type</label>
                            <select
                              value={ioc.type}
                              onChange={(e) => handleUpdateIoc(idx, 'type', e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded bg-container-val border border-surface-val text-primary-val font-bold focus:outline-none focus:border-amber-400"
                            >
                              <option value="SHA256">SHA256</option>
                              <option value="MD5">MD5</option>
                              <option value="IPv4">IPv4</option>
                              <option value="Domain">Domain</option>
                              <option value="Registry">Registry Key</option>
                              <option value="NamedPipe">Named Pipe</option>
                              <option value="File">File Path</option>
                            </select>
                          </div>

                          <div className="flex-1 w-full">
                            <label className="text-zinc-500 text-[10px] block mb-1">Artifact Value (Hash, IP, Path)</label>
                            <input
                              type="text"
                              value={ioc.value}
                              onChange={(e) => handleUpdateIoc(idx, 'value', e.target.value)}
                              placeholder="e.g., 4a1b8c9d... or 185.156.73.49:443"
                              className="w-full px-3 py-1.5 rounded bg-container-val border border-surface-val text-zinc-200 focus:outline-none focus:border-amber-400 font-mono"
                            />
                          </div>

                          <div className="flex-1 w-full">
                            <label className="text-zinc-500 text-[10px] block mb-1">Description / Context</label>
                            <input
                              type="text"
                              value={ioc.description}
                              onChange={(e) => handleUpdateIoc(idx, 'description', e.target.value)}
                              placeholder="e.g., QakBot primary Tier-2 C2 node"
                              className="w-full px-3 py-1.5 rounded bg-container-val border border-surface-val text-zinc-300 font-sans text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveIoc(idx)}
                            className="self-end md:self-center mt-2 md:mt-4 p-2 rounded bg-zinc-900 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete IOC"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PART 4: RAW TELEMETRY FEED */}
              {activeDossierSection === 'telemetry' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-zinc-100">
                        Part 4: Raw Telemetry Stream & Hex Evidence
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Paste hex dumps, Wireshark stream transcripts, Sysmon Event XML, or Volatility memory carving output.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setRawTelemetry(`00000000: 4d 5a 90 00 03 00 00 00 04 00 00 00 ff ff 00 00  MZ..............
00000010: b8 00 00 00 00 00 00 00 40 00 00 00 00 00 00 00  ........@.......
00000020: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
00000030: 00 00 00 00 00 00 00 00 00 00 00 00 f8 00 00 00  ................
00000040: 0e 1f ba 0e 00 b4 09 cd 21 b8 01 4c cd 21 54 68  ........!..L.!Th
00000050: 69 73 20 70 72 6f 67 72 61 6d 20 63 61 6e 6e 6f  is program canno
00000060: 74 20 62 65 20 72 75 6e 20 69 6e 20 44 4f 53 20  t be run in DOS 
00000070: 6d 6f 64 65 2e 0d 0d 0a 24 00 00 00 00 00 00 00  mode....$.......`)}
                      className="px-2.5 py-1.5 rounded bg-container-val border border-surface-val text-zinc-300 hover:text-primary-val font-mono text-xs transition-colors cursor-pointer"
                    >
                      Insert Sample Volatility Hex
                    </button>
                  </div>

                  <textarea
                    value={rawTelemetry}
                    onChange={(e) => setRawTelemetry(e.target.value)}
                    placeholder="Paste raw packet hexdump, Sysmon XML, or memory output here..."
                    rows={12}
                    className="w-full p-4 rounded-lg bg-black/80 border border-surface-val text-amber-300/85 font-mono text-xs focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                </div>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div className="p-4 rounded-xl bg-surface-val border border-surface-val flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-val text-black hover:bg-amber-400 transition-all font-mono text-xs sm:text-sm font-semibold rounded phosphor-glow cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingId ? 'Update & Publish Dossier' : 'Publish Writeup (All 4 Parts)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportMarkdown}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-container-val border border-surface-val hover:border-amber-400/50 text-zinc-300 hover:text-primary-val font-mono text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Comprehensive .md</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenTsExport}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-container-val border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-amber-200 font-mono text-xs transition-colors cursor-pointer"
                  title="Generate TypeScript snippet to commit into src/data/writeups.ts for GitOps publishing"
                >
                  <Code2 className="w-4 h-4 text-primary-val" />
                  <span>Export for writeups.ts (GitOps)</span>
                </button>
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-2 text-primary-val font-mono text-xs">
                  <Check className="w-4 h-4" />
                  <span>Successfully saved and updated writeup!</span>
                </div>
              )}

              <div className="text-[11px] font-mono text-zinc-500">
                Synchronized across all 4 viewer tabs & local storage
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: MANAGE EXISTING WRITEUPS */}
        {activeSubTab === 'manage' && (
          <div className="rounded-xl bg-surface-val border border-surface-val overflow-hidden space-y-0">
            <div className="p-4 bg-surface-val border-b border-surface-val flex items-center justify-between">
              <div>
                <h3 className="font-sans text-sm font-semibold text-zinc-100">
                  Published Writeup Catalog ({writeups.length})
                </h3>
                <p className="text-xs text-zinc-400">
                  Manage writeups active on your public portfolio showcase.
                </p>
              </div>
              <button
                onClick={() => {
                  handleResetForm();
                  setActiveSubTab('editor');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary-val text-black font-mono text-xs font-bold hover:bg-amber-400 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New</span>
              </button>
            </div>

            <div className="divide-y divide-[#27272a]">
              {writeups.map((w) => (
                <div key={w.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-container-val transition-colors">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-primary-val font-mono text-xs font-medium">
                        {w.code}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-container-val border border-surface-val text-zinc-400 font-mono text-xs">
                        {w.category}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">
                        {w.difficulty}
                      </span>
                      <span className="text-zinc-500 font-mono text-xs">
                        {w.date}
                      </span>
                      <span className="text-zinc-500 font-mono text-xs">
                        • {w.readTime}
                      </span>
                    </div>

                    <h4 className="font-sans text-base font-semibold text-zinc-100">
                      {w.title}
                    </h4>

                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {w.summary}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 pt-1">
                      <span>Rules: {w.detectionQueries?.length || 0}</span>
                      <span>•</span>
                      <span>IOCs: {w.iocs?.length || 0}</span>
                      <span>•</span>
                      <span>Telemetry: {w.rawTelemetry ? 'Included' : 'None'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-center font-mono text-xs">
                    <button
                      onClick={() => onViewWriteupInPublic(w)}
                      className="px-2.5 py-1.5 rounded bg-container-val border border-surface-val hover:border-amber-400/40 text-zinc-300 hover:text-primary-val transition-colors inline-flex items-center gap-1 cursor-pointer"
                      title="View how recruiters see this in the public showcase"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Live</span>
                    </button>

                    <button
                      onClick={() => handleEditExisting(w)}
                      className="px-2.5 py-1.5 rounded bg-container-val border border-surface-val hover:border-amber-400/40 text-primary-val transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit (All 4 Parts)</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${w.title}"?`)) {
                          onDeleteWriteup(w.id);
                        }
                      }}
                      className="px-2.5 py-1.5 rounded bg-zinc-800/80 hover:bg-red-950/40 border border-surface-val hover:border-red-500/40 text-zinc-400 hover:text-red-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      title="Delete from showcase"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: TypeScript GitOps Export */}
      {showTsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-val border border-surface-val rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-surface-val border-b border-surface-val flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary-val" />
                <h3 className="font-sans text-sm font-semibold text-zinc-100">
                  GitOps Export // TypeScript Code for <code className="text-primary-val font-mono text-xs">src/data/writeups.ts</code>
                </h3>
              </div>
              <button
                onClick={() => setShowTsModal(false)}
                className="p-1.5 rounded hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 font-sans text-xs">
              <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1 leading-relaxed">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>How GitOps Publishing Works:</span>
                </div>
                <p>
                  Create a dedicated file in <strong className="text-zinc-100 font-mono">src/data/writeups/&lt;slug&gt;.ts</strong> and paste the standalone TypeScript module below. Then add it to <strong className="text-zinc-100 font-mono">src/data/writeups/index.ts</strong>. Each writeup is cleanly isolated in its own file for effortless maintenance.
                </p>
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(tsSnippet);
                    setCopiedTs(true);
                    setTimeout(() => setCopiedTs(false), 2000);
                  }}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded bg-zinc-800/80 hover:bg-[#282830] border border-surface-val text-zinc-200 hover:text-primary-val font-mono text-xs transition-colors flex items-center gap-1.5 cursor-pointer z-10"
                >
                  {copiedTs ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-primary-val" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>

                <pre className="p-4 rounded-xl bg-black/80 border border-surface-val font-mono text-[11px] text-amber-200/90 overflow-x-auto max-h-[50vh] leading-relaxed select-all">
                  <code>{tsSnippet}</code>
                </pre>
              </div>
            </div>

            <div className="p-4 bg-surface-val border-t border-surface-val flex items-center justify-end gap-3 font-mono text-xs">
              <button
                onClick={() => setShowTsModal(false)}
                className="px-4 py-2 rounded bg-container-val border border-surface-val text-zinc-300 hover:text-zinc-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
