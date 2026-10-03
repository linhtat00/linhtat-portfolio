import { Writeup } from '../../types';
import { qakbotWriteup } from './qakbot-dll-side-loading';
import { kerberoastingWriteup } from './kerberoasting-ad';
import { cobaltStrikeWriteup } from './cobalt-strike-dns-tunnel';
import { blackbyteWriteup } from './btlo-blackbyte-ransomware';
import { htbReaperWriteup } from './htb-reaper-linux-server';
import { hancitorWriteup } from './mta-hancitor-pcap';
import { redlineStealerWriteup } from './cyberdefenders-redline-stealer';

// Export all individual writeups so they can be referenced or imported directly
export {
  qakbotWriteup,
  kerberoastingWriteup,
  cobaltStrikeWriteup,
  blackbyteWriteup,
  htbReaperWriteup,
  hancitorWriteup,
  redlineStealerWriteup
};

// Aggregated initial catalog
export const INITIAL_WRITEUPS: Writeup[] = [
  qakbotWriteup,
  kerberoastingWriteup,
  cobaltStrikeWriteup,
  blackbyteWriteup,
  htbReaperWriteup,
  hancitorWriteup,
  redlineStealerWriteup
];
