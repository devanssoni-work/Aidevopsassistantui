import { createContext, useContext, useState, ReactNode } from 'react';

export interface Pipeline {
  id: number;
  name: string;
  status: 'success' | 'running' | 'failed' | 'stopped';
  branch: string;
  lastRun: string;
  duration: string;
  commit: string;
  author: string;
  version?: string;
  environment?: string;
  canaryPercentage?: number;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  type: 'info' | 'success' | 'error' | 'warning';
  pipeline: string;
  message: string;
  details?: string;
}

export interface CommandHistory {
  id: number;
  command: string;
  timestamp: string;
  response: string;
  status: 'success' | 'error' | 'pending';
}

export interface Release {
  version: string;
  service: string;
  timestamp: string;
  status: 'draft' | 'released';
}

interface AppContextType {
  pipelines: Pipeline[];
  setPipelines: React.Dispatch<React.SetStateAction<Pipeline[]>>;
  addPipeline: (pipeline: Omit<Pipeline, 'id'>) => void;
  updatePipeline: (id: number, updates: Partial<Pipeline>) => void;
  deletePipeline: (id: number) => void;
  
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  
  commandHistory: CommandHistory[];
  addCommandHistory: (command: string, response: string, status: 'success' | 'error' | 'pending') => void;
  
  releases: Release[];
  addRelease: (release: Release) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: 1,
      name: 'frontend-production',
      status: 'success',
      branch: 'main',
      lastRun: '2 minutes ago',
      duration: '3m 24s',
      commit: 'feat: Add new dashboard',
      author: 'john.doe',
      version: 'v1.2.3',
      environment: 'production'
    },
    {
      id: 2,
      name: 'backend-api-deploy',
      status: 'running',
      branch: 'develop',
      lastRun: '30 seconds ago',
      duration: '1m 12s',
      commit: 'fix: Auth middleware bug',
      author: 'jane.smith',
      version: 'v2.1.0',
      environment: 'staging'
    },
    {
      id: 3,
      name: 'mobile-app-build',
      status: 'success',
      branch: 'main',
      lastRun: '15 minutes ago',
      duration: '5m 48s',
      commit: 'chore: Update dependencies',
      author: 'mike.wilson',
      version: 'v3.0.1',
      environment: 'production'
    },
    {
      id: 4,
      name: 'data-pipeline-etl',
      status: 'failed',
      branch: 'feature/analytics',
      lastRun: '1 hour ago',
      duration: '2m 05s',
      commit: 'feat: New analytics module',
      author: 'sarah.jones',
      environment: 'development'
    },
    {
      id: 5,
      name: 'ml-model-training',
      status: 'success',
      branch: 'main',
      lastRun: '3 hours ago',
      duration: '12m 32s',
      commit: 'model: Improve accuracy',
      author: 'alex.chen',
      version: 'v1.5.2',
      environment: 'production'
    },
    {
      id: 6,
      name: 'infrastructure-deploy',
      status: 'running',
      branch: 'staging',
      lastRun: '5 minutes ago',
      duration: '4m 01s',
      commit: 'infra: Scale up resources',
      author: 'chris.lee',
      environment: 'staging'
    },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 1,
      timestamp: '2024-11-04 14:23:45',
      type: 'success',
      pipeline: 'frontend-production',
      message: 'Build completed successfully',
      details: 'All tests passed. Deployed to production.'
    },
    {
      id: 2,
      timestamp: '2024-11-04 14:22:10',
      type: 'info',
      pipeline: 'backend-api-deploy',
      message: 'Starting deployment process',
      details: 'Initiating deployment to staging environment'
    },
    {
      id: 3,
      timestamp: '2024-11-04 14:15:33',
      type: 'error',
      pipeline: 'data-pipeline-etl',
      message: 'Build failed: Test suite errors',
      details: 'Error: Connection timeout in analytics module tests'
    },
    {
      id: 4,
      timestamp: '2024-11-04 14:10:22',
      type: 'warning',
      pipeline: 'mobile-app-build',
      message: 'Deprecated API usage detected',
      details: 'Warning: Legacy authentication method will be removed in v4.0'
    },
    {
      id: 5,
      timestamp: '2024-11-04 13:45:18',
      type: 'success',
      pipeline: 'ml-model-training',
      message: 'Model training completed',
      details: 'Accuracy improved by 3.2%. Model deployed successfully.'
    }
  ]);

  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);

  const addPipeline = (pipeline: Omit<Pipeline, 'id'>) => {
    setPipelines(prev => {
      const newPipeline = {
        ...pipeline,
        id: Math.max(0, ...prev.map(p => p.id)) + 1,
      };
      return [newPipeline, ...prev];
    });
  };

  const updatePipeline = (id: number, updates: Partial<Pipeline>) => {
    setPipelines(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePipeline = (id: number) => {
    setPipelines(prev => prev.filter(p => p.id !== id));
  };

  const addLog = (log: Omit<LogEntry, 'id' | 'timestamp'>) => {
    setLogs(prev => {
      const newLog: LogEntry = {
        ...log,
        id: Math.max(0, ...prev.map(l => l.id)) + 1,
        timestamp: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2')
      };
      return [newLog, ...prev];
    });
  };

  const addCommandHistory = (command: string, response: string, status: 'success' | 'error' | 'pending') => {
    const newCommand: CommandHistory = {
      id: Math.max(0, ...commandHistory.map(c => c.id)) + 1,
      command,
      response,
      timestamp: new Date().toLocaleTimeString(),
      status
    };
    setCommandHistory(prev => [newCommand, ...prev]);
  };

  const addRelease = (release: Release) => {
    setReleases(prev => [release, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        pipelines,
        setPipelines,
        addPipeline,
        updatePipeline,
        deletePipeline,
        logs,
        setLogs,
        addLog,
        commandHistory,
        addCommandHistory,
        releases,
        addRelease,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
