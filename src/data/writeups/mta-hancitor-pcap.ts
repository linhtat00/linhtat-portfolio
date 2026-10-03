import { Writeup } from '../../types';

export const hancitorWriteup: Writeup = {
  id: 'mta-hancitor-pcap',
  slug: 'mta-2024-11-hancitor-fiddler-pcap',
  code: '[MTA]',
  title: '[MTA] 2024-11 Hancitor with Fiddler PCAP',
  category: 'PCAP Triage',
  platform: 'MTA Labs',
  difficulty: 'MED',
  date: '2 weeks ago',
  readTime: '7 min read',
  mitreAttack: ['T1566.001', 'T1204.002', 'T1071.001'],
  tools: ['Wireshark', 'NetworkMiner', 'CyberChef'],
  summary: 'Malware Traffic Analysis of a malicious Word macro dropping Hancitor (Chanitor) followed by Cobalt Strike and Fiddler proxy injection.',
  content: `## Traffic Analysis Breakdown
- Malicious macro fetched initial DLL from \`hxxp://api.ipify[.]org\` to verify external gateway IP.
- Second-stage payload delivered via encrypted HTTP POST using specific RC4 key.
- Extracted certificate fingerprints and created Suricata IDS rule to block future campaigns.`
};
