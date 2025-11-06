import { motion } from 'motion/react';
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp,
  GitBranch
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { useAppContext } from '../AppContext';

interface DashboardHomeProps {
  onNavigateToPipelines: (filter: 'all' | 'running' | 'success' | 'failed') => void;
}

export function DashboardHome({ onNavigateToPipelines }: DashboardHomeProps) {
  const { pipelines } = useAppContext();
  
  const runningCount = pipelines.filter(p => p.status === 'running').length;
  const successCount = pipelines.filter(p => p.status === 'success').length;
  const failedCount = pipelines.filter(p => p.status === 'failed').length;
  
  const stats = [
    {
      label: 'Active Pipelines',
      value: runningCount.toString(),
      change: '+' + runningCount,
      icon: GitBranch,
      color: 'blue',
      filter: 'running' as const,
    },
    {
      label: 'Successful Builds',
      value: successCount.toString(),
      change: '+12%',
      icon: CheckCircle2,
      color: 'green',
      filter: 'success' as const,
    },
    {
      label: 'Failed Builds',
      value: failedCount.toString(),
      change: failedCount > 0 ? '+' + failedCount : '0',
      icon: XCircle,
      color: 'red',
      filter: 'failed' as const,
    },
    {
      label: 'Total Pipelines',
      value: pipelines.length.toString(),
      change: '+' + pipelines.length,
      icon: Clock,
      color: 'purple',
      filter: 'all' as const,
    },
  ];

  const recentPipelines = pipelines.slice(0, 5);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Monitor your CI/CD pipelines in real-time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onNavigateToPipelines(stat.filter)}
              className="cursor-pointer h-full"
            >
              <Card className="bg-[#0f172a] border-[#1e293b] hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 h-full">
                <CardContent className="p-6 h-full">
                  <div className="flex items-start justify-between h-full">
                    <div className="flex flex-col justify-between h-full">
                      <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                      <div>
                        <h3 className="text-white mb-1">{stat.value}</h3>
                        <span className={`text-sm ${
                          stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.color}-500/10 flex-shrink-0`}>
                      <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Pipelines */}
        <Card className="lg:col-span-2 bg-[#0f172a] border-[#1e293b]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Recent Pipeline Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPipelines.map((pipeline, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-[#1e293b] rounded-lg hover:bg-[#293548] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        pipeline.status === 'success'
                          ? 'bg-green-400 animate-pulse'
                          : pipeline.status === 'running'
                          ? 'bg-blue-400 animate-pulse'
                          : 'bg-red-400'
                      }`}
                    />
                    <div>
                      <p className="text-white">{pipeline.name}</p>
                      <p className="text-gray-400 text-sm">{pipeline.branch}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${
                      pipeline.status === 'success'
                        ? 'text-green-400'
                        : pipeline.status === 'running'
                        ? 'text-blue-400'
                        : 'text-red-400'
                    }`}>
                      {pipeline.status}
                    </p>
                    <p className="text-gray-400 text-sm">{pipeline.duration}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="bg-[#0f172a] border-[#1e293b]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">CPU Usage</span>
                <span className="text-white text-sm">42%</span>
              </div>
              <Progress value={42} className="bg-[#1e293b]" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">Memory</span>
                <span className="text-white text-sm">68%</span>
              </div>
              <Progress value={68} className="bg-[#1e293b]" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">Storage</span>
                <span className="text-white text-sm">35%</span>
              </div>
              <Progress value={35} className="bg-[#1e293b]" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">Network</span>
                <span className="text-white text-sm">23%</span>
              </div>
              <Progress value={23} className="bg-[#1e293b]" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
