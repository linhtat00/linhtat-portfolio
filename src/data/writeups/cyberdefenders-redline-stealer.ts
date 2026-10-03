import { Writeup } from '../../types';

export const redlineStealerWriteup: Writeup = {
  id: 'cyberdefenders-redline-stealer',
  slug: 'cyberdefenders-redline-stealer-artifact-carving',
  code: '[CyberDefenders]',
  title: '[CyberDefenders] RedLine Stealer Artifact Carving',
  category: 'Disk Forensics',
  platform: 'CyberDefenders',
  difficulty: 'EASY',
  date: '3 weeks ago',
  readTime: '9 min read',
  mitreAttack: ['T1555.003', 'T1539', 'T1083'],
  tools: ['Autopsy', 'FTK Imager', 'DB Browser for SQLite'],
  summary: 'Forensic extraction of browser credential caches, cryptocurrency wallet databases, and Discord tokens harvested by RedLine Stealer.',
  content: `## Evidence Analysis
- Carved SQLite databases: \`Login Data\`, \`Cookies\`, \`Web Data\`.
- Located RedLine build version in AppData subfolder.
- Reconstructed attacker exfiltration endpoint and victim credential blast radius.`
};
