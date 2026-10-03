import { Writeup } from '../../types';

export const blackbyteWriteup: Writeup = {
  id: 'btlo-blackbyte-ransomware',
  slug: 'btlo-operation-blackbyte-ransomware-triage',
  code: '[BTLO]',
  title: '[BTLO] Operation BlackByte Ransomware Triage',
  category: 'Incident Response',
  platform: 'Blue Team Labs',
  difficulty: 'HARD',
  date: '3 days ago',
  readTime: '15 min read',
  mitreAttack: ['T1486', 'T1059.001', 'T1562.001'],
  tools: ['Velociraptor', 'Splunk ES', 'KAPE', 'Wireshark'],
  summary: 'Full post-compromise DFIR investigation following an enterprise BlackByte ransomware incident. Traced initial access, service termination scripts, and encryption keys.',
  content: `## Scenario Overview
A mid-sized logistics company suffered widespread file encryption across their file servers. The threat actor left a ransom note \`blackbyte_readme.txt\` demanding payment.

### Investigation Steps:
1. **Initial Access:** Located vulnerable Microsoft Exchange server compromised via ProxyShell (CVE-2021-34473).
2. **Privilege Escalation:** Exploited PrintNightmare to spawn SYSTEM shell.
3. **Defense Evasion:** Executed batch scripts to stop 80+ security services including Windows Defender and EDR sensors.
4. **Impact:** Deployed BlackByte decryptor analysis using known raw key material in raw memory buffers.`
};
