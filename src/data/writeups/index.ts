/// <reference types="vite/client" />
import { Writeup } from '../../types';
import { qakbotWriteup } from './qakbot-dll-side-loading';
import { kerberoastingWriteup } from './kerberoasting-ad';
import { cobaltStrikeWriteup } from './cobalt-strike-dns-tunnel';

// Export legacy static writeups for backward compatibility
export {
  qakbotWriteup,
  kerberoastingWriteup,
  cobaltStrikeWriteup,
};

// ----------------------------------------------------------------------
// Dynamic Auto-Discovery of Writeup Files (Vite import.meta.glob)
// ----------------------------------------------------------------------
// Automatically scans, imports, and reactive-bundles ALL *.ts files in this directory.
// Any new file pushed by the CMS or GitHub API, edited, or removed will be
// automatically reflected in the Portfolio showcase without requiring manual edits to index.ts!
const writeupModules = import.meta.glob<{ [key: string]: any; default?: Writeup }>('./*.ts', { eager: true });

function loadAllWriteups(): Writeup[] {
  const writeupsList: Writeup[] = [];
  const seenSlugs = new Set<string>();

  for (const filePath in writeupModules) {
    if (filePath === './index.ts' || filePath.endsWith('/index.ts')) {
      continue;
    }

    const mod = writeupModules[filePath];
    if (!mod) continue;

    // Check default export
    if (mod.default && typeof mod.default === 'object' && 'title' in mod.default && 'category' in mod.default) {
      const item = mod.default as Writeup;
      const key = item.slug || item.id || filePath;
      if (!seenSlugs.has(key)) {
        seenSlugs.add(key);
        writeupsList.push(item);
      }
      continue;
    }

    // Check named exports (e.g. export const xxxWriteup: Writeup = { ... })
    for (const exportKey in mod) {
      if (exportKey === 'default') continue;
      const val = mod[exportKey];
      if (
        val &&
        typeof val === 'object' &&
        'title' in val &&
        'category' in val
      ) {
        const item = val as Writeup;
        const key = item.slug || item.id || filePath;
        if (!seenSlugs.has(key)) {
          seenSlugs.add(key);
          writeupsList.push(item);
        }
      }
    }
  }

  // Fallback to static array if glob somehow found none
  if (writeupsList.length === 0) {
    return [
      qakbotWriteup,
      kerberoastingWriteup,
      cobaltStrikeWriteup,
    ];
  }

  return writeupsList;
}

// Automatically populated and live-updated catalog
export const INITIAL_WRITEUPS: Writeup[] = loadAllWriteups();
