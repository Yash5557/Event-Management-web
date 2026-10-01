import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ViewportWrapper } from './components/ViewportWrapper';
import { AuthScreen } from './components/auth/AuthScreen';
import { StudentCatalog } from './components/student/StudentCatalog';
import { MyPassesView } from './components/student/MyPassesView';
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard';
import { DesignSystemView } from './components/design-system/DesignSystemView';
import { DigitalPassModal } from './components/pass/DigitalPassModal';
import { ToastContainer } from './components/ToastContainer';
import { GraduationCap, Heart, Shield } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeScreen, currentUser } = useApp();

  const renderScreen = () => {
    switch (activeScreen) {
      case 'auth':
        return <AuthScreen />;
      case 'catalog':
        return <StudentCatalog />;
      case 'my-passes':
        return <MyPassesView />;
      case 'organizer-dashboard':
        return <OrganizerDashboard />;
      case 'design-system':
        return <DesignSystemView />;
      default:
        return <StudentCatalog />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Viewport Container (Handles Fluid, 1440px Desktop, and 375px Mobile Frame variants) */}
      <ViewportWrapper>
        {renderScreen()}
      </ViewportWrapper>

      {/* Global Modals & Notifications */}
      <DigitalPassModal />
      <ToastContainer />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">Apex University CampusPass</span>
            <span>· Academic Year 2026-2027</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Inter & JetBrains Mono Typography</span>
            <span>·</span>
            <span>Zero-Slop Token Architecture</span>
            <span>·</span>
            <span className="text-emerald-400 font-medium">Gate Verification Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
