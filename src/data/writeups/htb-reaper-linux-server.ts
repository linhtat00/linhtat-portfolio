import { Writeup } from '../../types';

export const htbReaperWriteup: Writeup = {
  id: 'htb-reaper-linux-server',
  slug: 'htb-sherlocks-reaper-compromised-linux',
  code: '[HTB Sherlocks]',
  title: '[HTB Sherlocks] Reaper: Compromised Linux Server',
  category: 'Memory Forensics',
  platform: 'HackTheBox',
  difficulty: 'MED',
  date: '1 week ago',
  readTime: '10 min read',
  mitreAttack: ['T1053.003', 'T1059.004', 'T1505.003'],
  tools: ['LiME', 'Volatility 3', 'auditd', 'Grep'],
  summary: 'Investigation of a Linux web server compromise involving a hidden cronjob, webshell persistence, and an obfuscated Perl reverse shell.',
  content: `## Challenge Summary
In this HackTheBox Sherlock scenario, a Linux Apache server began sending outbound traffic to an unauthorized VPS. Using the acquired \`lime.dump\` and \`/var/log/audit/audit.log\`, we traced the root cause.

### Findings:
- Found backdoor in \`/var/www/html/assets/nav.php\` accepting base64 encoded eval parameters.
- Reconstructed the attacker IP, user agent, and command timeline.
- Analyzed volatile memory with Volatility 3 Linux symbols to recover the socket descriptor.`
};
