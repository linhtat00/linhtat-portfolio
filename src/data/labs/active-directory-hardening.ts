import { LabProject } from '../../types';

export const activeDirectoryHardeningLab: LabProject = {
  id: 'lab-ad-05',
  slug: 'active-directory-hardening',
  code: 'LAB-DEF-05',
  title: 'Enterprise Active Directory Defensive Forest Hardening',
  track: 'Defensive Infrastructure',
  category: 'Identity Architecture & Tiered Administration',
  difficulty: 'Advanced',
  date: 'October 2024',
  duration: '35 Lab Hours',
  status: 'Completed & Documented',
  tools: ['Active Directory DS', 'PowerShell', 'Windows LAPS', 'GPO', 'Sysmon', 'BloodHound / SharpHound'],
  summary: 'Implementation of Microsoft Tiered Administration Model (Tier 0/1/2) inside a multi-domain forest. Enforces Local Administrator Password Solution (Windows LAPS), protects Kerberos KRBTGT keys, and eliminates unconstrained delegation attack paths.',
  objectives: [
    'Implement three-tier administrative boundaries preventing credential theft and lateral movement.',
    'Deploy Windows LAPS with Azure AD / AD DS schema integration for automated local admin rotation.',
    'Execute pre-and-post BloodHound auditing to systematically eliminate Shortest Path to Domain Admin attacks.',
    'Configure Kerberos AES-256 encryption enforcement and Kerberoasting tripwire accounts.'
  ],
  topology: {
    architectureType: 'Tiered Enterprise Active Directory Forest',
    nodes: [
      { name: 'DC01.CORP.LOCAL', ip: '10.0.20.5', role: 'Primary Domain Controller (Tier 0)', os: 'Windows Server 2022 Datacenter' },
      { name: 'PAW-T0-01', ip: '10.0.10.100', role: 'Privileged Access Workstation (Tier 0 only)', os: 'Windows 11 Enterprise (Hardened)' },
      { name: 'FS01.CORP.LOCAL', ip: '10.0.20.50', role: 'Enterprise File Server (Tier 1)', os: 'Windows Server 2022' },
      { name: 'WS-FINANCE-01', ip: '10.0.20.101', role: 'User Endpoint (Tier 2)', os: 'Windows 11 Pro' }
    ],
    networkSubnets: [
      { name: 'Tier 0 Management', cidr: '10.0.10.0/24', purpose: 'Restricted PAW workstations with IPSec isolation' },
      { name: 'Tier 1 Server Subnet', cidr: '10.0.20.0/24', purpose: 'Enterprise application and member servers' },
      { name: 'Tier 2 User Subnet', cidr: '10.0.30.0/24', purpose: 'End-user workstations and laptops' }
    ]
  },
  steps: [
    {
      phase: 'Phase 1',
      title: 'Baseline Attack Path Audit with BloodHound',
      description: 'Executed SharpHound collector across test domain. Discovered 14 critical shortest paths to Domain Admin stemming from local admin password reuse and excessive rights on GPOs.',
      commandSnippet: `Invoke-BloodHound -CollectionMethod All -Domain CORP.LOCAL -ZipFileName baseline-audit.zip
# BloodHound Cypher Query:
# MATCH p=shortestPath((u:User)-[r:AdminTo|MemberOf|GenericAll*1..]->(g:Group {name:'DOMAIN ADMINS@CORP.LOCAL'})) RETURN p`
    },
    {
      phase: 'Phase 2',
      title: 'Windows LAPS Deployment & Schema Update',
      description: 'Integrated modern Windows LAPS into domain schema. Enforced automatic 24-character randomized passwords for local accounts on all member servers and workstations, rotated every 30 days.',
      commandSnippet: `Update-LapsADSchema -Verbose
Set-LapsADComputerSelfPermission -Identity "OU=Workstations,DC=corp,DC=local"
Get-LapsDiagnostics`
    },
    {
      phase: 'Phase 3',
      title: 'Authentication Policies & Tiered Silos',
      description: 'Configured Authentication Silos preventing Domain Admin (Tier 0) accounts from logging into Tier 1 application servers or Tier 2 user workstations, eliminating LSASS memory dumping vectors.',
      commandSnippet: `New-ADAuthenticationPolicy -Name "Tier0_Admins_Policy" \\
  -Enforce -UserAllowedToAuthenticateFrom "OU=PAW,DC=corp,DC=local"
New-ADAuthenticationPolicySilo -Name "Tier0_Silo" -AuthenticationPolicy "Tier0_Admins_Policy"
Grant-ADAuthenticationPolicySiloAccess -Identity "Tier0_Silo" -Account "Tier0_Admins"`
    },
    {
      phase: 'Phase 4',
      title: 'Kerberoasting Tripwire Decoy Setup',
      description: 'Created a decoy Service Principal Name (SPN) with a 45-character randomized password. Configured real-time Splunk alerting on Windows Event ID 4769 requesting ticket with RC4 encryption for this decoy SPN.',
      commandSnippet: `setspn -A MSSQLSvc/sql-decoy.corp.local:1433 fake-sql-svc
# Splunk SPL Alert Rule:
# index=wineventlog EventCode=4769 Service_Name="fake-sql-svc" Ticket_Encryption_Type=0x17`
    }
  ],
  takeaways: [
    'Enforcing Tiered Administration eradicates 95% of lateral movement paths without expensive third-party software.',
    'Honey SPN tripwires are virtually invisible to attackers running automated SharpHound or PowerView recon until triggered.',
    'Windows LAPS completely eliminates pass-the-hash vectors across heterogeneous endpoint fleets.'
  ],
  verificationEvidence: 'Post-hardening BloodHound scan confirmed zero exploitable paths from compromised workstation to Domain Admin.'
};
