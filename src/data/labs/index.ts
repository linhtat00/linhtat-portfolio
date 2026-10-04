/// <reference types="vite/client" />
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

// ----------------------------------------------------------------------
// Dynamic Auto-Discovery of Lab Project Files (Vite import.meta.glob)
// ----------------------------------------------------------------------
const labModules = import.meta.glob<{ [key: string]: any; default?: LabProject }>('./*.ts', { eager: true });

function loadAllLabs(): LabProject[] {
  const labsList: LabProject[] = [];
  const seenSlugs = new Set<string>();

  for (const filePath in labModules) {
    if (filePath === './index.ts' || filePath.endsWith('/index.ts')) {
      continue;
    }

    const mod = labModules[filePath];
    if (!mod) continue;

    // Check default export
    if (mod.default && typeof mod.default === 'object' && 'title' in mod.default && 'track' in mod.default) {
      const item = mod.default as LabProject;
      const key = item.slug || item.id || filePath;
      if (!seenSlugs.has(key)) {
        seenSlugs.add(key);
        labsList.push(item);
      }
      continue;
    }

    // Check named exports
    for (const exportKey in mod) {
      if (exportKey === 'default') continue;
      const val = mod[exportKey];
      if (
        val &&
        typeof val === 'object' &&
        'title' in val &&
        'track' in val
      ) {
        const item = val as LabProject;
        const key = item.slug || item.id || filePath;
        if (!seenSlugs.has(key)) {
          seenSlugs.add(key);
          labsList.push(item);
        }
      }
    }
  }

  if (labsList.length === 0) {
    return [
      proxmoxEnterpriseSocLab,
      cysaVulnerabilityManagementLab,
      cehMalwareAnalysisReconLab,
      suricataZeekIdsSensorLab,
      activeDirectoryHardeningLab
    ];
  }

  return labsList;
}

export const INITIAL_LABS: LabProject[] = loadAllLabs();
