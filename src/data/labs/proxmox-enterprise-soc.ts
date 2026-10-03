import { LabProject } from '../../types';

export const proxmoxEnterpriseSocLab: LabProject = {
  id: 'lab-soc-01',
  slug: 'proxmox-enterprise-soc',
  code: 'LAB-INFRA-01',
  title: 'Proxmox Virtual SOC & Enterprise SPAN Mirror Cluster',
  track: 'Academic / School Project',
  category: 'Virtualization & Blue Team Telemetry',
  difficulty: 'Advanced',
  date: 'September 2024',
  duration: '40+ Lab Hours',
  status: 'Active Defense Range',
  tools: ['Proxmox VE 8', 'pfSense', 'Splunk Enterprise', 'Zeek', 'Suricata IDS', 'Ubuntu Server'],
  summary: 'Dual-node Proxmox VE high-availability cluster virtualizing an enterprise SOC telemetry pipeline. Features dedicated pfSense routing, virtual SPAN traffic mirror taps, and automated Splunk log shippers.',
  objectives: [
    'Design an isolated multi-vLAN virtualization range on two bare-metal Intel NUC nodes.',
    'Implement virtual SPAN (Port Mirroring) via Open vSwitch (OVS) to feed raw packets to NIDS.',
    'Deploy and tune dual network inspection sensors: Suricata (signature NIDS) and Zeek (metadata extraction).',
    'Standardize log ingestion with Splunk Universal Forwarders across Windows Active Directory and Linux ranges.'
  ],
  topology: {
    architectureType: 'Dual-Node Proxmox VE High-Availability Hypervisor Cluster',
    nodes: [
      { name: 'nuc-core-01', ip: '192.168.10.2', role: 'Primary Proxmox Node (AD DC, pfSense VM, Splunk Indexer)', os: 'Debian / Proxmox VE 8.1' },
      { name: 'nuc-core-02', ip: '192.168.10.3', role: 'Secondary Node (Zeek Sensor, Suricata IDS, Victim Workstations)', os: 'Debian / Proxmox VE 8.1' },
      { name: 'pfsense-gw', ip: '10.0.0.1', role: 'Virtual Firewall / Router & DHCP Gateway', os: 'FreeBSD 14 / pfSense CE' },
      { name: 'splunk-es-srv', ip: '10.0.10.50', role: 'Splunk Enterprise Core & Correlation Engine', os: 'Ubuntu 22.04 LTS' },
      { name: 'sensor-grid', ip: '10.0.99.10', role: 'SPAN Tap Ingestion: Zeek 6.0 + Suricata 7.0', os: 'Debian 12 Bookworm' }
    ],
    networkSubnets: [
      { name: 'VLAN 10 - MGMT', cidr: '10.0.10.0/24', purpose: 'Hypervisor management, SSH jumpboxes, and Proxmox cluster sync' },
      { name: 'VLAN 20 - CORP_AD', cidr: '10.0.20.0/24', purpose: 'Windows Server 2022 DC, Domain joined Win11 victim endpoints' },
      { name: 'VLAN 30 - DMZ', cidr: '10.0.30.0/24', purpose: 'Vulnerable Apache & Nginx test targets exposed to internal attacks' },
      { name: 'VLAN 99 - SENSOR_SPAN', cidr: '10.0.99.0/24', purpose: 'Dedicated promiscuous mirror capture interface for Zeek & Suricata' }
    ]
  },
  steps: [
    {
      phase: 'Phase 1',
      title: 'Hypervisor Provisioning & Corosync Clustered Quorum',
      description: 'Configured Proxmox VE 8.1 on dual Intel NUCs with dedicated Corosync cluster heartbeat and ZFS pooled storage for rapid VM snapshotting prior to malware execution.',
      commandSnippet: `pvecm create soc-defense-cluster
pvecm add 192.168.10.2 --link0 192.168.10.3
zfs list -t snapshot`
    },
    {
      phase: 'Phase 2',
      title: 'pfSense Virtual Router & Open vSwitch (OVS) SPAN Mirroring',
      description: 'Configured Open vSwitch on Proxmox to duplicate all egress and ingress frames traversing VLAN 20 and VLAN 30 into a virtual promiscuous TAP attached to the Zeek/Suricata interface.',
      commandSnippet: `ovs-vsctl -- --may-exist add-br vmbr0-ovs
ovs-vsctl add-port vmbr0-ovs tap-sensor -- set Interface tap-sensor type=internal
ovs-vsctl -- set Bridge vmbr0-ovs mirrors=@m \\
  -- --id=@m create Mirror name=span-mirror select-all=true output-port=tap-sensor`
    },
    {
      phase: 'Phase 3',
      title: 'Suricata 7.0 & Zeek Pipeline Integration',
      description: 'Tuned Emerging Threats (ET) open rulesets inside Suricata with automated daily rule updates. Configured Zeek to generate DNS, HTTP, SSL, and Conn JSON logs sent directly to Splunk.',
      commandSnippet: `suricata -c /etc/suricata/suricata.yaml -i tap-sensor -D
zeek -i tap-sensor local "Site::local_nets += { 10.0.0.0/16 }"
tail -f /opt/zeek/logs/current/dns.log | jq .`
    },
    {
      phase: 'Phase 4',
      title: 'Splunk Universal Forwarder Automation',
      description: 'Deployed automated Ansible playbooks pushing Splunk Universal Forwarder configs to all Windows and Linux nodes, routing Zeek logs and Windows Event logs (Sysmon) into Splunk.',
      commandSnippet: `/opt/splunkforwarder/bin/splunk add monitor /opt/zeek/logs/current/conn.log -index network -sourcetype zeek_conn
/opt/splunkforwarder/bin/splunk add forward-server 10.0.10.50:9997`
    }
  ],
  takeaways: [
    'Virtual SPAN mirroring allows 100% full packet visibility into adversary lateral movement without expensive hardware TAPs.',
    'Correlating Zeek connection logs with Sysmon ProcessGuid on the endpoint cuts Mean Time to Detect (MTTD) from hours to seconds.',
    'Automated ZFS snapshots make recurring red/blue team simulations safe and effortlessly repeatable.'
  ],
  verificationEvidence: 'Simulated atomic red-team attacks generated 1,420 Splunk alerts with zero packet drop on the OVS mirror bus.'
};
