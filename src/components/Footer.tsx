import React, { useState } from 'react';
import { Mail, ShieldCheck, Github, Linkedin } from 'lucide-react';
import { IndeedIcon } from './icons/IndeedIcon';

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const email = 'linhtatblue@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <footer className="footer-root">
      <div className="footer-container">
        {/* Left: Verified Analyst Identity */}
        <div className="footer-identity-group">
          <div className="footer-analyst-badge">
            <ShieldCheck className="w-3 h-3 text-[#fbbf24]" />
            <span>ANALYST IDENTITY</span>
          </div>

          <button
            onClick={handleCopyEmail}
            className="footer-email-copy-btn"
            title="Click to copy contact email"
          >
            <Mail className="w-3 h-3 text-zinc-400" />
            <span className="font-mono text-xs">{email}</span>
            {copiedEmail ? (
              <span className="text-[#fbbf24] text-[10px] font-semibold">✓ Copied</span>
            ) : (
              <span className="text-zinc-500 text-[10px] hidden sm:inline">(copy)</span>
            )}
          </button>
        </div>

        {/* Right: Profiles (GitHub, LinkedIn, Indeed only) with matching icons */}
        <div className="footer-social-links">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          <span className="footer-divider-pipe">|</span>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </a>

          <span className="footer-divider-pipe">|</span>

          <a
            href="https://indeed.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
          >
            <IndeedIcon className="w-3.5 h-3.5" />
            <span>Indeed</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

