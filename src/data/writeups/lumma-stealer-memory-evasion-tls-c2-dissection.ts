import { Writeup } from '../../types';

export const lummaStealerMemoryEvasionTlsC2DissectionWriteup: Writeup = {
  "id": "writeup-1791092155542",
  "slug": "lumma-stealer-memory-evasion-tls-c2-dissection",
  "code": "#IR-20261004-1235",
  "title": "Lumma Stealer Memory Evasion & TLS C2 Dissection",
  "category": "Memory Forensics",
  "platform": "Internal Range",
  "difficulty": "HARD",
  "date": "Published Today",
  "readTime": "4 min read",
  "mitreAttack": [
    "T1566.002",
    "T1059.001",
    "T1055.012",
    "T1071.001"
  ],
  "tools": [
    "Volatility 3",
    "Splunk ES",
    "KAPE",
    "YARA",
    "Wireshark"
  ],
  "summary": "Investigated an in-memory process hollowing infection delivering Lumma Stealer. Carved raw memory dumps, reconstructed encrypted TLS command channels, and engineered high-confidence Sysmon correlation rules.",
  "content": "## Executive Summary\nAn endpoint alert triggered on workstation `WKSTN-FIN-09` following anomalous outbound TLS traffic over non-standard port 8443. Memory forensics revealed process injection into `explorer.exe` carrying the Lumma Stealer credential harvesting routine.\n\n## 1. Initial Triage & Evidence Acquisition\n- Acquired memory dump: `wkstn-fin-09-mem.raw` (16 GB)\n- Triaged active network sockets at time of acquisition:\n```bash\nvol.py -f wkstn-fin-09-mem.raw windows.netscan | grep -E \"ESTABLISHED|SYN_SENT\"\n```\nIdentified anomalous connection to remote IP `194.87.139.12:8443` initiated by PID 4120 (`explorer.exe`).\n\n## 2. Deep Dive Memory Carving\nScanning with `windows.malfind` revealed an unbacked executable memory allocation with `PAGE_EXECUTE_READWRITE` permissions inside PID 4120:\n```bash\nvol.py -f wkstn-fin-09-mem.raw windows.malfind --pid 4120 --dump\n```\n\nDisassembly of the dumped chunk confirmed the familiar Lumma payload header and routine searching for Chromium `Local State` files and cryptocurrency extension wallets.\n\n## 3. SIEM Correlation & Detection Engineering\nTo catch future variations of this injection, we deployed a Splunk correlation rule targeting Sysmon Event ID 8 (CreateRemoteThread) originating from unauthorized temp folders.\n\n## 4. Key Takeaways & Hardening\n- Enforced strict Application Control rules preventing script interpreters from launching binaries located in `%AppData%\\Local\\Temp`.\n- Deployed TLS SNI inspection at perimeter firewall to drop known dynamic DNS domains.",
  "featured": false,
  "detectionQueries": [
    {
      "title": "Splunk SPL: Svchost Process Hollowing with Anomalous Parent",
      "language": "spl",
      "description": "Detects svchost.exe spawned by non-services.exe parent or loading unsigned dynamic libraries from AppData/Temp.",
      "code": "index=edr_telemetry sourcetype=\"sysmon:process_creation\" Image=\"*\\\\svchost.exe\"\n| eval is_anomalous_parent=if(ParentImage!=\"*\\\\services.exe\", 1, 0)\n| eval is_suspicious_path=if(match(CommandLine, \"(?i)(AppData|LocalLow|Temp)\"), 1, 0)\n| where is_anomalous_parent=1 OR is_suspicious_path=1\n| stats count min(_time) as first_seen max(_time) as last_seen by host, User, ParentImage, CommandLine, ProcessGuid\n| sort - count"
    },
    {
      "title": "Sigma Rule: Suspect svchost.exe Module Load",
      "language": "yaml",
      "description": "Sigma generic rule to detect untrusted DLL injection in svchost.",
      "code": "title: Suspicious Module Loaded in svchost\nid: a78d1052-192a-4a21-9923-qakbot001\nstatus: test\nlogsource:\n    category: image_load\n    product: windows\ndetection:\n    selection:\n        Image|endswith: '\\svchost.exe'\n        ImageLoaded|contains:\n            - '\\AppData\\Local\\Temp\\'\n            - '\\ProgramData\\'\n        Signed: 'false'\n    condition: selection\nlevel: high"
    }
  ],
  "iocs": [
    {
      "type": "SHA256",
      "value": "4a1b8c9d0e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
      "description": "Malicious DLL drop payload (wermgr_hook.dll)"
    },
    {
      "type": "IPv4",
      "value": "185.156.73.49:443",
      "description": "QakBot primary Tier-2 C2 node"
    },
    {
      "type": "NamedPipe",
      "value": "\\\\.\\pipe\\spoolss_svc_proxy",
      "description": "IPC channel used for hollowed child thread synchronization"
    },
    {
      "type": "Registry",
      "value": "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\WbemSysInit",
      "description": "Persistence autorun key"
    }
  ],
  "rawTelemetry": "00000000: 4d 5a 90 00 03 00 00 00 04 00 00 00 ff ff 00 00  MZ..............\n00000010: b8 00 00 00 00 00 00 00 40 00 00 00 00 00 00 00  ........@.......\n00000020: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................\n00000030: 00 00 00 00 00 00 00 00 00 00 00 00 f8 00 00 00  ................\n00000040: 0e 1f ba 0e 00 b4 09 cd 21 b8 01 4c cd 21 54 68  ........!..L.!Th\n00000050: 69 73 20 70 72 6f 67 72 61 6d 20 63 61 6e 6e 6f  is program canno\n00000060: 74 20 62 65 20 72 75 6e 20 69 6e 20 44 4f 53 20  t be run in DOS \n00000070: 6d 6f 64 65 2e 0d 0d 0a 24 00 00 00 00 00 00 00  mode....$......."
};
