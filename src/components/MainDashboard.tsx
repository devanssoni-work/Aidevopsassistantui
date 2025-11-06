import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  GitBranch, 
  Mic, 
  ScrollText, 
  Settings,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import { DashboardHome } from './screens/DashboardHome';
import { PipelinesScreen } from './screens/PipelinesScreen';
import { VoiceCommandsScreen } from './screens/VoiceCommandsScreen';
import { LogsScreen } from './screens/LogsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface MainDashboardProps {
  onLogout: () => void;
}

type Screen = 'dashboard' | 'pipelines' | 'voice' | 'logs' | 'settings' | 'profile';

export function MainDashboard({ onLogout }: MainDashboardProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [pipelineFilter, setPipelineFilter] = useState<'all' | 'running' | 'success' | 'failed'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard' as Screen, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pipelines' as Screen, label: 'Pipelines', icon: GitBranch },
    { id: 'voice' as Screen, label: 'AI Commands', icon: Mic },
    { id: 'logs' as Screen, label: 'Logs', icon: ScrollText },
    { id: 'settings' as Screen, label: 'Settings', icon: Settings },
  ];

  const navigateToPipelines = (filter: 'all' | 'running' | 'success' | 'failed' = 'all') => {
    setPipelineFilter(filter);
    setCurrentScreen('pipelines');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardHome onNavigateToPipelines={navigateToPipelines} />;
      case 'pipelines':
        return <PipelinesScreen initialFilter={pipelineFilter} />;
      case 'voice':
        return <VoiceCommandsScreen />;
      case 'logs':
        return <LogsScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <DashboardHome onNavigateToPipelines={navigateToPipelines} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 256 : 80,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-[#0f172a] border-r border-[#1e293b] flex flex-col relative"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#1e293b]">
          <motion.div
            animate={{
              opacity: sidebarOpen ? 1 : 0,
            }}
            className="flex items-center gap-2"
          >
            <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <span className="text-white">AI DevOps</span>
            )}
          </motion.div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white hover:bg-[#1e293b]"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Profile Section */}
        <div className="p-4 border-b border-[#1e293b]">
          <motion.button
            onClick={() => setCurrentScreen('profile')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all relative ${
              currentScreen === 'profile'
                ? 'text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#1e293b]'
            }`}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            {currentScreen === 'profile' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-blue-500/30 rounded-lg"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Avatar className="w-8 h-8 relative z-10">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=DevOps" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-xs">
                JD
              </AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="flex flex-col items-start relative z-10">
                <span className="text-sm">John Doe</span>
                <span className="text-xs text-gray-500">View Profile</span>
              </div>
            )}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all relative ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white hover:bg-[#1e293b]'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-blue-500/30 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-blue-400' : ''}`} />
                {sidebarOpen && (
                  <span className="relative z-10">{item.label}</span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#1e293b]">
          <motion.button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-[#1e293b] transition-all"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
