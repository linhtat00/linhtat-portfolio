import React from 'react';
import { Award, BarChart3, Server, CheckCircle2 } from 'lucide-react';

interface StatsBarProps {
  onOpenWriteups: () => void;
  onOpenLabs: () => void;
  onOpenCerts: () => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  onOpenWriteups,
  onOpenLabs,
  onOpenCerts
}) => {
  return (
    <section className="stats-bar-section">
      <div className="stats-bar-container">
        <div className="stats-bar-grid">
          {/* Metric 1: BTLO Standing */}
          <div className="stats-metric-card">
            <div className="stats-card-header">
              <span>BTLO Standing</span>
              <Award className="w-4 h-4 text-[#fbbf24]" />
            </div>
            <div>
              <div className="stats-card-value">Top 2%</div>
              <div className="stats-card-subtitle stats-subtitle-amber">Rank #142 Global</div>
            </div>
          </div>

          {/* Metric 2: Writeups & Dossiers */}
          <div 
            onClick={onOpenWriteups}
            className="stats-metric-card stats-metric-card-interactive"
          >
            <div className="stats-card-header">
              <span>Writeups & Dossiers</span>
              <BarChart3 className="w-4 h-4 text-[#fbbf24]" />
            </div>
            <div>
              <div className="stats-card-value">18+ Dives</div>
              <div className="stats-card-subtitle stats-subtitle-muted">PCAP + Memory Forensics</div>
            </div>
          </div>

          {/* Metric 3: Labs & Ranges */}
          <div 
            onClick={onOpenLabs}
            className="stats-metric-card stats-metric-card-interactive"
          >
            <div className="stats-card-header">
              <span>Labs & Architecture</span>
              <Server className="w-4 h-4 text-[#fbbf24]" />
            </div>
            <div>
              <div className="stats-card-value">500+ Hours</div>
              <div className="stats-card-subtitle stats-subtitle-amber">CEH / CySA+ / Proxmox</div>
            </div>
          </div>

          {/* Metric 4: Certifications */}
          <div 
            onClick={onOpenCerts}
            className="stats-metric-card stats-metric-card-interactive"
          >
            <div className="stats-card-header">
              <span>Certifications</span>
              <CheckCircle2 className="w-4 h-4 text-[#fbbf24]" />
            </div>
            <div>
              <div className="stats-card-value">Sec+ & BTL1</div>
              <div className="stats-card-subtitle stats-subtitle-muted">Verified Active Creds</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
