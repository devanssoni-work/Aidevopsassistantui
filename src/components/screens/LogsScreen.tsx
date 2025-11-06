import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Filter, 
  Download, 
  Search,
  AlertCircle,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useAppContext } from '../AppContext';

export function LogsScreen() {
  const [filter, setFilter] = useState<'all' | 'info' | 'success' | 'error' | 'warning'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { logs } = useAppContext();

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === 'all' || log.type === filter;
    const matchesSearch = 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.pipeline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return <Terminal className="w-5 h-5 text-gray-400" />;
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30';
      case 'error':
        return 'bg-red-500/10 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30';
      default:
        return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'info':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const handleDownloadLogs = () => {
    const logData = filteredLogs.map(log => 
      `[${log.timestamp}] [${log.type.toUpperCase()}] [${log.pipeline}] ${log.message}${log.details ? `\n  Details: ${log.details}` : ''}`
    ).join('\n\n');
    
    const blob = new Blob([logData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white mb-2">Pipeline Logs</h1>
          <p className="text-gray-400">View and analyze pipeline execution logs</p>
        </div>
        <Button
          onClick={handleDownloadLogs}
          className="bg-[#1e293b] hover:bg-[#293548] border border-[#334155]"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1e293b] border-[#334155] text-white placeholder:text-gray-500"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'info', 'success', 'warning', 'error'].map((type) => (
            <Button
              key={type}
              variant={filter === type ? 'default' : 'outline'}
              onClick={() => setFilter(type as any)}
              size="sm"
              className={
                filter === type
                  ? 'bg-[#1e293b] border-blue-500 text-white'
                  : 'border-[#334155] text-gray-400 hover:text-white hover:bg-[#1e293b]'
              }
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-[#0f172a] border-[#1e293b]">
          <CardContent className="p-4">
            <p className="text-gray-400 text-sm mb-1">Total</p>
            <p className="text-white text-2xl">{logs.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0f172a] border-blue-500/30">
          <CardContent className="p-4">
            <p className="text-gray-400 text-sm mb-1">Info</p>
            <p className="text-blue-400 text-2xl">
              {logs.filter(l => l.type === 'info').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#0f172a] border-green-500/30">
          <CardContent className="p-4">
            <p className="text-gray-400 text-sm mb-1">Success</p>
            <p className="text-green-400 text-2xl">
              {logs.filter(l => l.type === 'success').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#0f172a] border-yellow-500/30">
          <CardContent className="p-4">
            <p className="text-gray-400 text-sm mb-1">Warnings</p>
            <p className="text-yellow-400 text-2xl">
              {logs.filter(l => l.type === 'warning').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#0f172a] border-red-500/30">
          <CardContent className="p-4">
            <p className="text-gray-400 text-sm mb-1">Errors</p>
            <p className="text-red-400 text-2xl">
              {logs.filter(l => l.type === 'error').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Logs List */}
      <Card className="bg-[#0f172a] border-[#1e293b]">
        <CardContent className="p-6">
          <div className="space-y-3">
            <AnimatePresence>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <motion.div
                    key={`${log.id}-${log.timestamp}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.02 }}
                    className={`border rounded-lg p-4 ${getLogColor(log.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getLogIcon(log.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={getTypeColor(log.type)}>
                              {log.type}
                            </Badge>
                            <Badge variant="outline" className="border-[#334155] text-gray-400">
                              {log.pipeline}
                            </Badge>
                          </div>
                          <span className="text-gray-400 text-xs whitespace-nowrap">
                            {log.timestamp}
                          </span>
                        </div>
                        <p className="text-white mb-2">{log.message}</p>
                        {log.details && (
                          <p className="text-gray-400 text-sm whitespace-pre-line">
                            {log.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Terminal className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No logs found matching your criteria</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
