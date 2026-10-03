import { LabProject } from '../../types';
import { proxmoxEnterpriseSocLab } from './proxmox-enterprise-soc';
import { cysaVulnerabilityManagementLab } from './cysa-vulnerability-management';
import { cehMalwareAnalysisReconLab } from './ceh-malware-analysis-recon';
import { suricataZeekIdsSensorLab } from './suricata-zeek-ids-sensor';
import { activeDirectoryHardeningLab } from './active-directory-hardening';

export {
  proxmoxEnterpriseSocLab,
  cysaVulnerabilityManagementLab,
  cehMalwareAnalysisReconLab,
  suricataZeekIdsSensorLab,
  activeDirectoryHardeningLab
};

export const INITIAL_LABS: LabProject[] = [
  proxmoxEnterpriseSocLab,
  cysaVulnerabilityManagementLab,
  cehMalwareAnalysisReconLab,
  suricataZeekIdsSensorLab,
  activeDirectoryHardeningLab
];
