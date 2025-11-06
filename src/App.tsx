import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { MainDashboard } from './components/MainDashboard';
import { AppProvider } from './components/AppContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#0a0e1a]">
        {!isLoggedIn ? (
          <LoginPage onLogin={() => setIsLoggedIn(true)} />
        ) : (
          <MainDashboard onLogout={() => setIsLoggedIn(false)} />
        )}
        <Toaster position="top-right" />
      </div>
    </AppProvider>
  );
}
