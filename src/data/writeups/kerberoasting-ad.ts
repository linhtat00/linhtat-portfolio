import { Writeup } from '../../types';

export const kerberoastingWriteup: Writeup = {
  id: 'ir-2024-11',
  slug: 'kerberoasting-bloodhound-attack-pathing-ad',
  code: '#IR-2024-11',
  title: 'Kerberoasting & BloodHound Attack Pathing in AD',
  category: 'Active Directory',
  platform: 'Internal Range',
  difficulty: 'MED',
  date: 'Nov 2024',
  readTime: '12 min read',
  mitreAttack: ['T1558.003', 'T1087.002', 'T1069.002'],
  tools: ['Splunk SPL', 'BloodHound', 'PowerView', 'Zeek'],
  featured: true,
  summary: 'Simulated RC4-HMAC ticket requests from non-domain workstations. Built high-fidelity detection rules correlating Sysmon Event ID 13 with AD Event 4769 SPN spikes.',
  iocs: [
    { type: 'IPv4', value: '10.0.10.145', description: 'Compromised workstation issuing anomalous TGS requests' },
    { type: 'Registry', value: 'ms-DS-MachineAccountQuota=10', description: 'AD Domain level misconfiguration leveraged for persistence' }
  ],
  detectionQueries: [
    {
      title: 'Splunk SPL: Kerberoasting Anomaly Detection (Event 4769)',
      language: 'spl',
      description: 'Detects spikes in TGS ticket requests with weak RC4-HMAC encryption (Ticket_Encryption_Type=0x17).',
      code: `index=windows sourcetype="WinEventLog:Security" EventCode=4769
| eval encryption_type=case(Ticket_Encryption_Type=="0x17","RC4-HMAC", Ticket_Encryption_Type=="0x12","AES256-CTS", true(),"Other")
| where encryption_type="RC4-HMAC" AND Service_Name!="krbtgt" AND Service_Name!="*$*"
| bin _time span=5m
| stats count dc(Service_Name) as distinct_spns values(Service_Name) as targets by _time, Client_Address, Account_Name
| where distinct_spns > 3
| sort - distinct_spns`
    }
  ],
  content: `## 1. Attack Vector & Threat Model

In Active Directory environments, **Kerberoasting** (MITRE ATT&CK T1558.003) enables an adversary with low-privilege domain user access to request Kerberos Ticket-Granting Service (TGS) tickets for any service principal name (SPN). Because the ticket is encrypted using the NTLM hash of the service account, the adversary can crack the password offline without generating brute-force lockouts.

This lab simulates the full attack chain within our Proxmox-hosted dual-node virtual defensive range:
1. Reconnaissance via **BloodHound** to uncover high-value attack paths leading to \`Tier-0 Domain Admins\`.
2. Extracting Kerberos tickets with weak encryption formats (\`0x17\` / RC4).
3. Architecting real-time SIEM alerts and Group Policy mitigations to neutralize the threat.

---

## 2. Telemetry & Log Correlation

When an attacker queries domain controllers for service tickets, Windows Security Event **4769** (*A Kerberos service ticket was requested*) is generated on the Domain Controller.

Key audit fields to monitor:
- **Service Name:** Target SPN (e.g. \`MSSQLSvc/db01.corp.internal:1433\`).
- **Ticket Options:** Often includes \`0x40810000\` (forwardable, renewable, canonicalize).
- **Ticket Encryption Type:** \`0x17\` indicates the vulnerable RC4-HMAC cipher instead of modern AES (\`0x12\`).

\`\`\`json
{
  "EventCode": 4769,
  "TargetUserName": "svc_mssql_prod@CORP.INTERNAL",
  "ServiceName": "MSSQLSvc/sql01.corp.internal",
  "TicketEncryptionType": "0x17",
  "IpAddress": "::ffff:10.0.10.145",
  "Status": "0x0"
}
\`\`\`

---

## 3. Remediation & GPO Hardening

1. **Migrate to Group Managed Service Accounts (gMSA):** gMSAs automate 128-character complex password rotation, rendering offline cracking statistically impossible.
2. **Disable RC4 in Kerberos:** Enforce AES-128 and AES-256 via GPO:
   \`Computer Configuration > Windows Settings > Security Settings > Local Policies > Security Options > Network security: Configure encryption types allowed for Kerberos\`.
3. **Decoy SPNs (HoneySPNs):** Register an unassigned SPN like \`HTTP/testportal.corp.internal\` associated with a disabled honeypot user account. Any TGS request immediately flags Tier-1 containment alerts.`
};
