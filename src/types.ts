export type CategoryType = 
  | 'Memory Forensics'
  | 'Active Directory'
  | 'PCAP Triage'
  | 'Disk Forensics'
  | 'Threat Hunting'
  | 'SIEM & Detection'
  | 'Incident Response';

export type PlatformType = 
  | 'Blue Team Labs'
  | 'HackTheBox'
  | 'MTA Labs'
  | 'CyberDefenders'
  | 'Internal Range'
  | 'Sherlocks';

export type DifficultyType = 'EASY' | 'MED' | 'HARD';

export interface IOCItem {
  type: 'SHA256' | 'MD5' | 'IPv4' | 'Domain' | 'Registry' | 'NamedPipe' | 'File';
  value: string;
  description: string;
}

export interface DetectionQuery {
  title: string;
  language: string;
  code: string;
  description: string;
}

export interface Writeup {
  id: string;
  slug: string;
  title: string;
  code: string; // e.g. "#IR-2024-09" or "[BTLO]"
  category: CategoryType;
  platform: PlatformType;
  difficulty: DifficultyType;
  date: string;
  readTime: string;
  mitreAttack: string[];
  tools: string[];
  summary: string;
  content: string;
  featured?: boolean;
  iocs?: IOCItem[];
  detectionQueries?: DetectionQuery[];
  rawTelemetry?: string;
}

export type LabTrack = 
  | 'Academic / School Project' 
  | 'CompTIA CySA+' 
  | 'CEH Practical' 
  | 'Defensive Infrastructure';

export interface LabNode {
  name: string;
  ip: string;
  role: string;
  os: string;
}

export interface LabSubnet {
  name: string;
  cidr: string;
  purpose: string;
}

export interface LabStep {
  phase: string;
  title: string;
  description: string;
  commandSnippet?: string;
  evidenceNote?: string;
}

export interface LabProject {
  id: string;
  slug: string;
  code: string;
  title: string;
  track: LabTrack;
  category: string;
  difficulty: 'Intermediate' | 'Advanced' | 'Expert';
  date: string;
  duration: string;
  status: 'Completed & Documented' | 'Active Defense Range';
  tools: string[];
  summary: string;
  objectives: string[];
  topology: {
    architectureType: string;
    nodes: LabNode[];
    networkSubnets: LabSubnet[];
  };
  steps: LabStep[];
  takeaways: string[];
  verificationEvidence?: string;
}

export type ActiveTab = 'home' | 'writeups' | 'labs' | 'about';

