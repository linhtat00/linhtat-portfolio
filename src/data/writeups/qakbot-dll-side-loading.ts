import { Writeup } from '../../types';

export const qakbotWriteup: Writeup = {
  id: 'ir-2024-09',
  slug: 'qakbot-dll-side-loading-c2-beaconing',
  code: '#IR-2024-09',
  title: 'QakBot DLL Side-Loading & Encrypted C2 Beaconing',
  category: 'Memory Forensics',
  platform: 'Internal Range',
  difficulty: 'HARD',
  date: 'Sep 2024',
  readTime: '8 min read',
  mitreAttack: ['T1574.002', 'T1055.012', 'T1071.001'],
  tools: ['Volatility 3', 'Ghidra', 'Wireshark', 'YARA'],
  featured: true,
  summary: 'Extracted rogue encrypted payload injected via process hollowing in svchost.exe memory space. Reconstructed TLS session keys from heap artifacts to isolate raw beacons.',
  iocs: [
    { type: 'SHA256', value: '4a1b8c9d0e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b', description: 'Malicious DLL drop payload (wermgr_hook.dll)' },
    { type: 'IPv4', value: '185.156.73.49:443', description: 'QakBot primary Tier-2 C2 node' },
    { type: 'NamedPipe', value: '\\\\.\\pipe\\spoolss_svc_proxy', description: 'IPC channel used for hollowed child thread synchronization' },
    { type: 'Registry', value: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\WbemSysInit', description: 'Persistence autorun key' }
  ],
  detectionQueries: [
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
  ],
  content: `## 1. Executive Summary & Objective

During an active defensive triage scenario simulating an advanced affiliate intrusion, an endpoint alert flagged anomalous thread initialization within \`svchost.exe\` (PID 4892). This incident analysis dissects the execution flow of **QakBot (QBot)** variant delivering modular payloads via dynamic-link library side-loading and subsequent process injection.

### Key Milestones
- Isolated infected workstation **WKSTN-FIN-08** within 4 minutes of beacon establishment.
- Dumped physical RAM using FTK Imager CLI; acquired a 16GB snapshot for triage.
- Leveraged **Volatility 3** to isolate injected VAD nodes and recover the unpacked PE header.
- Extracted ephemeral RC4/AES session secrets from the process heap to decrypt captured TLS streams.

---

## 2. Memory Forensics via Volatility 3

Initial triage began with verifying process lineage to identify rogue parentage:

\`\`\`bash
# Identify rogue process tree
python3 vol.py -f memory.dmp windows.pstree

# Output snippet:
# PID   PPID  ImageFileName     CreateTime
# 1024  892   explorer.exe      2024-09-12 14:02:11
#  └── 4892 1024  svchost.exe   2024-09-12 14:15:33  <-- CRITICAL ANOMALY: Explorer is parent!
\`\`\`

The legitimate parent of \`svchost.exe\` should strictly be \`services.exe\`. An instance spawned directly from \`explorer.exe\` immediately indicates process injection or masquerading.

### Inspecting Virtual Address Descriptors (VAD)
Using \`windows.malfind\`, we scanned for memory pages configured with **PAGE_EXECUTE_READWRITE (0x40)**:

\`\`\`bash
python3 vol.py -f memory.dmp windows.malfind --pid 4892
\`\`\`

\`\`\`
PID   Process      Start Address      CommitCharge  Protection             Hex Dump
4892  svchost.exe  0x0000018f2040000  12            PAGE_EXECUTE_READWRITE 4d 5a 90 00 03 00 00 ... (MZ Header)
\`\`\`

The memory region at address \`0x0000018f2040000\` contained an unmapped PE header (\`4D 5A\`). We dumped this segment to perform static artifact analysis with Ghidra.

---

## 3. Network Beacon De-obfuscation

While analyzing network captures in Wireshark, traffic to \`185.156.73.49:443\` appeared encrypted under standard TLS 1.3. However, utilizing process memory carving, the ephemeral premaster secret was reconstructed from the heap buffer:

\`\`\`
CLIENT_RANDOM 3a89bc21... 4f2910ba...
\`\`\`

Injecting this key into Wireshark revealed an HTTP POST beacon with encoded telemetry:

\`\`\`http
POST /t4/beacon.php HTTP/1.1
Host: 185.156.73.49
Content-Type: application/octet-stream
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)

[Decrypted Payload: { "bot_id": "BB12_WIN10_PRO", "ver": "404.12", "campaign": "spx14" }]
\`\`\`

---

## 4. Defensive Hardening & Recommendations

1. **Attack Surface Reduction (ASR):** Enforce the rule *"Block executable content from email client and webmail"* (GUID: \`be9ba2d9-53ea-44a7-8f60-5b0cf0abc137\`).
2. **Sysmon Monitoring:** Monitor for Sysmon Event 7 (Image Loaded) targeting untrusted unsigned binaries in \`%AppData%\`.
3. **Network Boundary:** Ingest threat intelligence IP blocklists into perimeter firewalls to reject Tier-2 botnet rendezvous points.`
};
