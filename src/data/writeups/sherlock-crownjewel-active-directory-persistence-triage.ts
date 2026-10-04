import { Writeup } from '../../types';

export const sherlockCrownjewelActiveDirectoryPersistenceTriageWriteup: Writeup = {
  "id": "writeup-1791091928514",
  "slug": "sherlock-crownjewel-active-directory-persistence-triage",
  "code": "#HTB-20261004-1232",
  "title": "Sherlock: CrownJewel Active Directory Persistence Triage",
  "category": "Active Directory",
  "platform": "HackTheBox",
  "difficulty": "MED",
  "date": "Published Today",
  "readTime": "2 min read",
  "mitreAttack": [
    "T1078.002",
    "T1098",
    "T1003.006"
  ],
  "tools": [
    "Splunk ES",
    "BloodHound",
    "Impacket",
    "Mimikatz",
    "Karkinos"
  ],
  "summary": "Dissected compromised Domain Controller event logs to reconstruct an adversary ticket-granting compromise. Traced Golden Ticket generation and forged Kerberos delegation rights.",
  "content": "## Challenge Overview\nThe security operations center received alert `SEC-ALERT-AD-4769` representing anomalous Kerberos Service Ticket requests with RC4 encryption against krbtgt.\n\n### Step 1: Querying Kerberos Ticket Logs (Event 4769)\n```spl\nindex=wineventlog EventCode=4769 TicketEncryptionType=0x17\n| stats count by TargetUserName, IpAddress, ServiceName\n| sort - count\n```\n\n### Step 2: Correlating with Malicious Replication\nInvestigated directory service replication calls (Event 4662) from untrusted workstation IP `10.10.14.35`.",
  "featured": false,
  "detectionQueries": [
    {
      "title": "Splunk SPL: Kerberoasting Ticket Requests with Weak RC4 Encryption",
      "language": "spl",
      "description": "Detects EventCode 4769 ticket requests using legacy 0x17 encryption algorithm.",
      "code": "index=wineventlog EventCode=4769 TicketEncryptionType=0x17 ServiceName!=\"*$*\"\n| stats count values(ServiceName) as requested_spns by TargetUserName, IpAddress\n| where count > 3"
    }
  ],
  "iocs": [
    {
      "type": "IPv4",
      "value": "10.10.14.35",
      "description": "Rogue attacker kali IP requesting SPN tickets"
    },
    {
      "type": "Domain",
      "value": "corp.crownjewel.local",
      "description": "Compromised Active Directory realm"
    }
  ],
  "rawTelemetry": "EventCode: 4769\nComputerName: DC01.corp.crownjewel.local\nTargetUserName: admin_backup@corp.crownjewel.local\nServiceName: MSSQLSvc/db01.corp.crownjewel.local:1433\nTicketOptions: 0x40810000\nTicketEncryptionType: 0x17\nStatus: 0x0"
};
