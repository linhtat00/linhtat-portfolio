import React, { useState, useEffect } from 'react';
import { Writeup, ActiveTab } from './types';
import { INITIAL_WRITEUPS } from './data/writeups';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { StatsBar } from './components/StatsBar';
import { FeaturedDossiers } from './components/FeaturedDossiers';
import { RecentWriteupsTable } from './components/RecentWriteupsTable';
import { HomelabSection } from './components/HomelabSection';
import { WriteupDetailView } from './components/WriteupDetailView';
import { WriteupOverviewView } from './components/WriteupOverviewView';
import { AboutPageView } from './components/AboutPageView';
import { LabsPageView } from './components/LabsPageView';
import { ResumeModal } from './components/ResumeModal';
import { Footer } from './components/Footer';

export default function App() {
  const [writeups] = useState<Writeup[]>(INITIAL_WRITEUPS);

 // 1. Define the GitHub Pages repository base path
  const BASE_PATH = '/portfolio';

  // 2. Helper function to normalize the URL path
  const getNormalizedPath = () => {
    let path = window.location.pathname.toLowerCase();
    if (path.startsWith(BASE_PATH)) {
      path = path.slice(BASE_PATH.length) || '/';
    }
    return path;
  };

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const path = getNormalizedPath();
      if (path === '/about' || path.startsWith('/about')) return 'about';
      if (path === '/labs' || path.startsWith('/labs') || path === '/homelab' || path.startsWith('/homelab')) return 'labs';
      if (path === '/writeups' || path.startsWith('/writeup')) return 'writeups';
    }
    return 'home';
  });

  const [selectedWriteup, setSelectedWriteup] = useState<Writeup | null>(null);
  const [selectedLabSlug, setSelectedLabSlug] = useState<string | null>(null);

  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => {
      const path = getNormalizedPath();
      
      if (path === '/about') {
        setActiveTab('about');
        setSelectedWriteup(null);
      } else if (path === '/labs' || path === '/homelab') {
        setActiveTab('labs');
        setSelectedWriteup(null);
      } else if (path === '/writeups') {
        setActiveTab('writeups');
      } else if (path === '/' || path === '') {
        setActiveTab('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleSelectWriteup = (w: Writeup) => {
    setSelectedWriteup(w);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    setSelectedWriteup(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: ActiveTab) => {
    setSelectedWriteup(null);
    setActiveTab(tab);
    
    try {
      // 3. Prepend BASE_PATH when pushing to browser history
      const newPath = tab === 'home' ? `${BASE_PATH}/` : `${BASE_PATH}/${tab}`;
      window.history.pushState(null, '', newPath);
    } catch (e) {
      // ignore
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
 

  // PUBLIC SHOWCASE PORTFOLIO (Pure Read-Only, 100% Static & Secure)
  return (
    <div className="app-root">
      {/* Top Fixed Header */}
      <Header
        activeTab={selectedWriteup ? 'writeups' : activeTab}
        setActiveTab={handleTabChange}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Main Content Area */}
      <main className="app-main">
        {selectedWriteup ? (
          /* View 1: Detailed Threat Dossier / Specific Challenge Reader */
          <WriteupDetailView
            writeup={selectedWriteup}
            onBack={handleBackFromDetail}
            onSelectOtherWriteup={handleSelectWriteup}
            allWriteups={writeups}
          />
        ) : activeTab === 'writeups' ? (
          /* View 2: /writeup Overview Blog Catalog Page (Showcase) */
          <WriteupOverviewView
            writeups={writeups}
            onSelectWriteup={handleSelectWriteup}
            onBackToHome={() => handleTabChange('home')}
          />
        ) : activeTab === 'about' ? (
          /* View 3: /about Dedicated Personal Profile & Certifications Page */
          <AboutPageView
            onBackToHome={() => handleTabChange('home')}
            onOpenResume={() => setIsResumeOpen(true)}
            onExploreWriteups={() => handleTabChange('writeups')}
            onExploreHomelab={() => handleTabChange('labs')}
            onExploreLabs={(labSlug) => {
              setSelectedLabSlug(labSlug || null);
              handleTabChange('labs');
            }}
          />
        ) : activeTab === 'labs' ? (
          /* View 4: /labs Dedicated Academic, Cert & Engineering Ranges Page */
          <LabsPageView
            initialSelectedLabSlug={selectedLabSlug}
            onBackToHome={() => {
              setSelectedLabSlug(null);
              handleTabChange('home');
            }}
            onExploreWriteups={() => handleTabChange('writeups')}
            onOpenResume={() => setIsResumeOpen(true)}
          />
        ) : (
          /* View 5: Primary Portfolio Homepage - Showcase Projects & Skills */
          <div className="flex flex-col w-full">
            {/* Hero Section */}
            <HeroSection
              onExploreWriteups={() => handleTabChange('writeups')}
              onDownloadResume={() => setIsResumeOpen(true)}
            />

            {/* Metrics / Stats Bar */}
            <StatsBar
              onOpenWriteups={() => handleTabChange('writeups')}
              onOpenLabs={() => {
                setSelectedLabSlug(null);
                handleTabChange('labs');
              }}
              onOpenCerts={() => handleTabChange('about')}
            />

            {/* Featured Threat Analyses Dossiers */}
            <FeaturedDossiers
              writeups={writeups}
              onSelectWriteup={handleSelectWriteup}
              onViewAll={() => handleTabChange('writeups')}
            />

            {/* Recent Lab Triage & CTF Writeups Table */}
            <RecentWriteupsTable
              writeups={writeups}
              onSelectWriteup={handleSelectWriteup}
              onViewAll={() => handleTabChange('writeups')}
            />

            {/* Labs & Research Architecture Section with direct link to /labs */}
            <HomelabSection onExploreHomelabPage={() => {
              setSelectedLabSlug(null);
              handleTabChange('labs');
            }} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}
