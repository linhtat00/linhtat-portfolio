import React, { useState } from 'react';
import { ArrowRight, Network, Server, ShieldAlert, Database, Cpu, HardDrive, Layers, CheckCircle } from 'lucide-react';

interface HomelabSectionProps {
  onExploreHomelabPage?: () => void;
}

export const HomelabSection: React.FC<HomelabSectionProps> = ({ onExploreHomelabPage }) => {
  const [showTopologyModal, setShowTopologyModal] = useState(false);

  return (
    <section className="homelab-section" id="labs">
      <div className="homelab-banner-card">
        {/* Background glow accent */}
        <div className="homelab-glow-accent"></div>

        <div className="homelab-content">
          <div className="homelab-badge">
            <Network className="w-4 h-4 text-[#fbbf24]" />
            <span>Technical Labs & Research Ranges // /labs</span>
          </div>

          <h2 className="homelab-title">
            Engineering Labs: Academic, CEH Practical, CySA+ & Proxmox Cluster
          </h2>

          <p className="homelab-desc">
            Hands-on defensive architecture and adversary emulation ranges. Includes university capstone projects, CEH Practical malware disassembly sandboxes, CompTIA CySA+ vulnerability triage enclaves, and high-availability Proxmox virtualization with SPAN mirroring.
          </p>

          {/* Stack Preview Grid */}
          <div className="homelab-stack-grid">
            <div className="homelab-stack-item">
              <div className="homelab-stack-tag">CAPSTONE / SOC</div>
              <div className="homelab-stack-name">Proxmox VE 8.2</div>
            </div>

            <div className="homelab-stack-item">
              <div className="homelab-stack-tag">CEH LAB</div>
              <div className="homelab-stack-name text-[#fbbf24]">Ghidra + YARA</div>
            </div>

            <div className="homelab-stack-item">
              <div className="homelab-stack-tag">CYSA+ ENCLAVE</div>
              <div className="homelab-stack-name">Nessus + CVSS</div>
            </div>

            <div className="homelab-stack-item">
              <div className="homelab-stack-tag">IDS GRID</div>
              <div className="homelab-stack-name">Suricata + Zeek</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="homelab-actions-row">
            {onExploreHomelabPage ? (
              <button
                onClick={onExploreHomelabPage}
                className="homelab-primary-btn phosphor-glow"
              >
                <span>Enter Dedicated /labs Archive</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
            <button
              onClick={() => setShowTopologyModal(true)}
              className="homelab-secondary-btn"
            >
              <span>Quick Topology Modal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Homelab Architecture Details Modal */}
      {showTopologyModal && (
        <div className="modal-backdrop">
          <div className="modal-container-lg">
            {/* Modal Header */}
            <div className="modal-header">
              <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#fbbf24]">
                <Layers className="w-4 h-4" />
                <span>TOPOLOGY // PROXMOX DEFENSIVE BLUE RANGE</span>
              </div>
              <button
                onClick={() => setShowTopologyModal(false)}
                className="modal-close-btn"
              >
                [ESC] Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body space-y-6">
              <div>
                <h3 className="text-lg font-bold text-zinc-100 font-['Geist'] mb-1">
                  Defensive Range Network Segmentation
                </h3>
                <p className="leading-relaxed">
                  The homelab environment runs on two bare-metal Intel NUC nodes configured as a High-Availability Proxmox VE cluster. Traffic between internal subnets is routed via a dedicated pfSense virtual appliance with SPAN mirroring.
                </p>
              </div>

              {/* Subnet Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-['JetBrains_Mono'] text-xs">
                <div className="p-4 rounded bg-[#18181c] border border-[#27272a]">
                  <div className="text-[#fbbf24] font-semibold mb-1">VLAN 10: Management & SOC</div>
                  <p className="text-zinc-400 text-[11px] mb-2">10.0.10.0/24</p>
                  <ul className="text-zinc-300 space-y-1 text-[11px]">
                    <li>• Splunk Enterprise 9.2 (Indexer + Search Head)</li>
                    <li>• Velociraptor Server</li>
                    <li>• FleetDM / Osquery Manager</li>
                  </ul>
                </div>

                <div className="p-4 rounded bg-[#18181c] border border-[#27272a]">
                  <div className="text-[#fbbf24] font-semibold mb-1">VLAN 20: Enterprise AD Range</div>
                  <p className="text-zinc-400 text-[11px] mb-2">10.0.20.0/24</p>
                  <ul className="text-zinc-300 space-y-1 text-[11px]">
                    <li>• Windows Server 2022 Primary DC</li>
                    <li>• Win11 Pro Endpoint (Sysmon v15 + Splunk UF)</li>
                    <li>• Win10 Pro Finance Workstation</li>
                  </ul>
                </div>

                <div className="p-4 rounded bg-[#18181c] border border-[#27272a]">
                  <div className="text-[#fbbf24] font-semibold mb-1">VLAN 30: Sensor & Tap Node</div>
                  <p className="text-zinc-400 text-[11px] mb-2">Promiscuous TAP</p>
                  <ul className="text-zinc-300 space-y-1 text-[11px]">
                    <li>• Suricata 7.0 (ET Open & custom rules)</li>
                    <li>• Zeek Network Security Monitor</li>
                    <li>• Moloch / Arkime Full Packet Capture</li>
                  </ul>
                </div>
              </div>

              {/* Telemetry Ingestion Flow */}
              <div className="p-4 rounded bg-[#09090b] border border-[#27272a]">
                <div className="text-xs font-['JetBrains_Mono'] text-[#fbbf24] uppercase mb-2 font-semibold">
                  // Telemetry Ingestion Pipeline
                </div>
                <div className="font-['JetBrains_Mono'] text-xs text-zinc-300 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#202025] text-zinc-200">Endpoint Telemetry</span>
                    <span className="text-[#fbbf24]">→</span>
                    <span className="text-zinc-400">Sysmon Modular (SwiftOnSecurity) + PowerShell ScriptBlock Logging</span>
                    <span className="text-[#fbbf24]">→</span>
                    <span className="text-zinc-200">Splunk Universal Forwarder (TLS 9997)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#202025] text-zinc-200">Network Wire</span>
                    <span className="text-[#fbbf24]">→</span>
                    <span className="text-zinc-400">pfSense SPAN Port</span>
                    <span className="text-[#fbbf24]">→</span>
                    <span className="text-zinc-200">Suricata EVE JSON + Zeek conn/dns/http logs to Splunk</span>
                  </div>
                </div>
              </div>

              {/* Verified Defensive Scenarios */}
              <div>
                <h4 className="font-semibold text-zinc-200 mb-2 font-['Geist'] text-sm">
                  Simulated Adversarial Scenarios Conducted in this Lab:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#fbbf24]" />
                    <span>Kerberoasting & AS-REP Roasting detection tuning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#fbbf24]" />
                    <span>Pass-the-Hash & Overpass-the-Hash NTLM analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#fbbf24]" />
                    <span>Cobalt Strike SMB/DNS malleable C2 profile hunting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#fbbf24]" />
                    <span>Process hollowing & parent PID spoofing evasion testing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
