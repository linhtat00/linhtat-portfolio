import { Writeup } from '../../types';

export const cobaltStrikeWriteup: Writeup = {
  id: 'ir-2024-12',
  slug: 'cobalt-strike-dns-tunneling-zeek-wireshark',
  code: '#IR-2024-12',
  title: 'Dissecting Cobalt Strike DNS Tunnel via Zeek & Wireshark',
  category: 'PCAP Triage',
  platform: 'Internal Range',
  difficulty: 'HARD',
  date: 'Dec 2024',
  readTime: '6 min read',
  mitreAttack: ['T1071.004', 'T1572', 'T1048.003'],
  tools: ['Zeek Engine', 'Wireshark', 'Python', 'Suricata'],
  featured: true,
  summary: 'Hunted slow data exfiltration bypassing perimeter firewalls. Developed Shannon entropy threshold scripts in Python and Zeek event listeners to catch anomalous subdomains.',
  iocs: [
    { type: 'Domain', value: 'ns1.telemetry-cloud-sync.net', description: 'Authoritative DNS nameserver configured for DNS beaconing' },
    { type: 'IPv4', value: '91.215.85.17', description: 'Malicious external resolver relay' }
  ],
  detectionQueries: [
    {
      title: 'Zeek Event Handler: High Entropy DNS Subdomain',
      language: 'zeek',
      description: 'Calculates length and frequency of TXT and A-record subdomains to isolate covert DNS channels.',
      code: `event dns_request(c: connection, msg: dns_msg, query: string, qtype: count, qclass: count) {
    if ( |query| > 52 && (qtype == 16 || qtype == 1) ) {
        NOTICE([$note=Covert_DNS_Tunnel,
                $msg=fmt("High length DNS query detected: %s from %s", query, c$id$orig_h),
                $conn=c]);
    }
}`
    }
  ],
  content: `## 1. Case Overview

When all standard outbound egress ports (TCP 80, 443, 8080) are strictly restricted by stateful perimeter firewalls, sophisticated adversaries resort to **DNS Tunneling** (MITRE ATT&CK T1071.004). 

In this investigation, a simulated Cobalt Strike team utilized DNS \`A\` and \`TXT\` record queries to send heartbeats and exfiltrate staging scripts under the guise of ordinary name resolution.

---

## 2. Statistical Analysis & Shannon Entropy

Covert channels encode binary data into DNS query labels (Base64, Base32, or Hex), leading to:
1. Unusually long fully-qualified domain names (FQDNs > 50 characters).
2. High Shannon entropy in subdomain prefixes (greater than 3.8).
3. Low Time-To-Live (TTL) values (0 or 1 second) preventing DNS caching.

### Python Entropy Analyzer Script
\`\`\`python
import math
from collections import Counter

def calculate_shannon_entropy(data: str) -> float:
    if not data:
        return 0.0
    entropy = 0
    length = len(data)
    for count in Counter(data).values():
        p = count / length
        entropy -= p * math.log2(p)
    return entropy

# Sample captured query:
subdomain = "7a89f01bc49a88e2d31c00fa44"
print(f"Entropy: {calculate_shannon_entropy(subdomain):.2f}") # Output: 3.94
\`\`\`

---

## 3. Wireshark PCAP Dissection

Filtering the packet capture with \`dns.flags.response == 0 and dns.qry.name contains "telemetry-cloud-sync.net"\`:

- **Query Pattern:** \`a19bc8f01.ns1.telemetry-cloud-sync.net\` (Type A)
- **Response Pattern:** Return address contained hex encoded status codes rather than reachable infrastructure IPs.
- **Data Channel:** DNS TXT requests requesting chunked Base64 staging blocks.

---

## 4. Detection & Containment

1. **DNS Sinkholing:** Redirect the apex domain \`telemetry-cloud-sync.net\` to an internal loopback logging address.
2. **Recursive Resolver Policy:** Restrict internal endpoints from querying external root resolvers directly; all DNS must pass through vetted internal resolvers with logging enabled.`
};
