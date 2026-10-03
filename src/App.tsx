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
import { UploadCMSPortal } from './components/UploadCMSPortal';
import { ResumeModal } from './components/ResumeModal';
import { Footer } from './components/Footer';

export default function App() {
  const [writeups, setWriteups] = useState<Writeup[]>(() => {
    try {
      const saved = localStorage.getItem('blue_team_writeups');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load local writeups', e);
    }
    return INITIAL_WRITEUPS;
  });

  // URL / Route handling: separate /upload CMS from public showcase
  const [isUploadPortal, setIsUploadPortal] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      return path === '/upload' || path.startsWith('/upload') || search.includes('portal=upload');
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/about' || path.startsWith('/about')) return 'about';
      if (path === '/labs' || path.startsWith('/labs') || path === '/homelab' || path.startsWith('/homelab')) return 'labs';
      if (path === '/writeups' || path.startsWith('/writeup')) return 'writeups';
    }
    return 'home';
  });

  const [selectedWriteup, setSelectedWriteup] = useState<Writeup | null>(null);
  const [selectedLabSlug, setSelectedLabSlug] = useState<string | null>(null);

  // Modals
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  // Listen to browser navigation (back/forward)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      setIsUploadPortal(path === '/upload' || path.startsWith('/upload') || search.includes('portal=upload'));
      
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

  // Persist writeups on change
  useEffect(() => {
    try {
      localStorage.setItem('blue_team_writeups', JSON.stringify(writeups));
    } catch (e) {
      console.warn('Failed to save writeups to localStorage', e);
    }
  }, [writeups]);

  // Routing actions
  const navigateToUpload = () => {
    try {
      window.history.pushState(null, '', '/upload');
    } catch (e) {
      // fallback if in restricted iframe
    }
    setIsUploadPortal(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPublic = () => {
    try {
      window.history.pushState(null, '', '/');
    } catch (e) {
      // fallback
    }
    setIsUploadPortal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CMS: Handle saving (create or update) writeup
  const handleSaveWriteup = (savedWriteup: Writeup) => {
    setWriteups((prev) => {
      const existsIndex = prev.findIndex((item) => item.id === savedWriteup.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = savedWriteup;
        return updated;
      }
      return [savedWriteup, ...prev];
    });
  };

  // CMS: Handle deleting writeup
  const handleDeleteWriteup = (id: string) => {
    setWriteups((prev) => prev.filter((item) => item.id !== id));
    if (selectedWriteup?.id === id) {
      setSelectedWriteup(null);
    }
  };

  // Showcase Navigation
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
    
    // Update browser URL to reflect individual pages
    try {
      const newPath = tab === 'home' ? '/' : `/${tab}`;
      window.history.pushState(null, '', newPath);
    } catch (e) {
      // ignore if iframe security blocks pushState
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in dedicated CMS Portal (/upload)
  if (isUploadPortal) {
    return (
      <UploadCMSPortal
        writeups={writeups}
        onSaveWriteup={handleSaveWriteup}
        onDeleteWriteup={handleDeleteWriteup}
        onExitToPublic={navigateToPublic}
        onViewWriteupInPublic={(w) => {
          navigateToPublic();
          handleSelectWriteup(w);
        }}
      />
    );
  }

  // PUBLIC SHOWCASE PORTFOLIO (www.myportfolio.io)
  return (
    <div className="app-root">
      {/* Top Fixed Header - Showcase Only */}
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
              onOpenUploadCMS={navigateToUpload}
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
