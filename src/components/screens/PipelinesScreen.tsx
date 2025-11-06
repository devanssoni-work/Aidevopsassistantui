import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Trash2, 
  GitBranch,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  X,
  Plus,
  StopCircle
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';
import { useAppContext } from '../AppContext';

interface PipelinesScreenProps {
  initialFilter?: 'all' | 'running' | 'success' | 'failed' | 'stopped';
}

export function PipelinesScreen({ initialFilter = 'all' }: PipelinesScreenProps) {
  const [filter, setFilter] = useState<'all' | 'running' | 'success' | 'failed' | 'stopped'>(initialFilter);
  const [showNewPipelineDialog, setShowNewPipelineDialog] = useState(false);
  const { pipelines, addPipeline, updatePipeline, deletePipeline, addLog } = useAppContext();

  const [formData, setFormData] = useState({
    name: '',
    branch: 'main',
    repoUrl: ''
  });

  // Update filter when initialFilter prop changes
  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  const filteredPipelines = pipelines.filter(
    (p) => filter === 'all' || p.status === filter
  );

  const handleRunPipeline = (id: number, name: string) => {
    updatePipeline(id, {
      status: 'running',
      lastRun: 'just now'
    });
    
    addLog({
      type: 'info',
      pipeline: name,
      message: 'Pipeline started manually',
      details: `${name} execution started by user`
    });
    
    toast.success(`Pipeline "${name}" started successfully`);
    
    // Simulate pipeline completion after 3 seconds
    setTimeout(() => {
      updatePipeline(id, {
        status: 'success',
        lastRun: 'just now',
        duration: '2m 15s'
      });
      
      addLog({
        type: 'success',
        pipeline: name,
        message: 'Pipeline completed successfully',
        details: `${name} finished execution`
      });
      
      toast.success(`Pipeline "${name}" completed successfully`);
    }, 3000);
  };

  const handleRetryPipeline = (id: number, name: string) => {
    updatePipeline(id, {
      status: 'running',
      lastRun: 'just now'
    });
    
    addLog({
      type: 'info',
      pipeline: name,
      message: 'Pipeline retry initiated',
      details: `Retrying ${name} execution`
    });
    
    toast.info(`Retrying pipeline "${name}"...`);
    
    // Simulate pipeline completion after 3 seconds
    setTimeout(() => {
      updatePipeline(id, {
        status: 'success',
        lastRun: 'just now',
        duration: '2m 18s'
      });
      
      addLog({
        type: 'success',
        pipeline: name,
        message: 'Pipeline retry completed',
        details: `${name} retry finished successfully`
      });
      
      toast.success(`Pipeline "${name}" completed successfully`);
    }, 3000);
  };

  const handleDeletePipeline = (id: number, name: string) => {
    deletePipeline(id);
    
    addLog({
      type: 'warning',
      pipeline: name,
      message: 'Pipeline deleted',
      details: `${name} was removed from the system`
    });
    
    toast.success(`Pipeline "${name}" deleted successfully`);
  };

  const handleCreatePipeline = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Pipeline name is required');
      return;
    }

    addPipeline({
      name: formData.name,
      status: 'success',
      branch: formData.branch || 'main',
      lastRun: 'just now',
      duration: '0m 0s',
      commit: 'Initial setup',
      author: 'current.user',
    });
    
    addLog({
      type: 'success',
      pipeline: formData.name,
      message: 'Pipeline created',
      details: `New pipeline ${formData.name} created successfully`
    });
    
    toast.success(`Pipeline "${formData.name}" created successfully`);
    
    // Reset form and close dialog
    setFormData({ name: '', branch: 'main', repoUrl: '' });
    setShowNewPipelineDialog(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'stopped':
        return <StopCircle className="w-5 h-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'running':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'stopped':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white mb-2">CI/CD Pipelines</h1>
          <p className="text-gray-400">Manage and monitor your deployment pipelines</p>
        </div>
        <Button 
          onClick={() => setShowNewPipelineDialog(true)}
          className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Pipeline
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {['all', 'running', 'success', 'failed', 'stopped'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status as any)}
            className={
              filter === status
                ? 'bg-[#1e293b] border-blue-500 text-white'
                : 'border-[#334155] text-gray-400 hover:text-white hover:bg-[#1e293b]'
            }
          >
            <Filter className="w-4 h-4 mr-2" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Pipelines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredPipelines.map((pipeline, index) => (
            <motion.div
              key={pipeline.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <Card className="bg-[#0f172a] border-[#1e293b] hover:border-blue-500/30 transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(pipeline.status)}
                      <div>
                        <h3 className="text-white">{pipeline.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <GitBranch className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-400 text-sm">{pipeline.branch}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(pipeline.status)}>
                        {pipeline.status}
                      </Badge>
                      {pipeline.canaryPercentage && (
                        <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-xs">
                          Canary {pipeline.canaryPercentage}%
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Last Run:</span>
                      <span className="text-white">{pipeline.lastRun}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {pipeline.duration}
                      </span>
                    </div>
                    {pipeline.version && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Version:</span>
                        <span className="text-white">{pipeline.version}</span>
                      </div>
                    )}
                    {pipeline.environment && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Environment:</span>
                        <span className="text-white capitalize">{pipeline.environment}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Commit:</span>
                      <span className="text-white truncate ml-2">{pipeline.commit}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Author:</span>
                      <span className="text-white">{pipeline.author}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-[#1e293b]">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-[#334155] text-gray-400 hover:text-white hover:bg-[#1e293b]"
                      onClick={() => handleRunPipeline(pipeline.id, pipeline.name)}
                      disabled={pipeline.status === 'running'}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Run
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-[#334155] text-gray-400 hover:text-white hover:bg-[#1e293b]"
                      onClick={() => handleRetryPipeline(pipeline.id, pipeline.name)}
                      disabled={pipeline.status === 'running'}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#334155] text-gray-400 hover:text-red-400 hover:bg-[#1e293b]"
                      onClick={() => handleDeletePipeline(pipeline.id, pipeline.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* New Pipeline Dialog */}
      <Dialog open={showNewPipelineDialog} onOpenChange={setShowNewPipelineDialog}>
        <DialogContent className="bg-[#0f172a] border-[#1e293b] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-400" />
              Create New Pipeline
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the basic details for your new pipeline
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePipeline} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="pipeline-name" className="text-white">
                Pipeline Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="pipeline-name"
                placeholder="e.g., frontend-production"
                className="bg-[#1e293b] border-[#334155] text-white placeholder:text-gray-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch" className="text-white">
                Branch
              </Label>
              <Input
                id="branch"
                placeholder="main"
                className="bg-[#1e293b] border-[#334155] text-white placeholder:text-gray-500"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="repo-url" className="text-white">
                Repository URL
              </Label>
              <Input
                id="repo-url"
                placeholder="https://github.com/username/repo.git"
                className="bg-[#1e293b] border-[#334155] text-white placeholder:text-gray-500"
                value={formData.repoUrl}
                onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-[#1e293b]">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowNewPipelineDialog(false);
                  setFormData({ name: '', branch: 'main', repoUrl: '' });
                }}
                className="flex-1 border-[#334155] text-gray-400 hover:text-white hover:bg-[#1e293b]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
              >
                Create Pipeline
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
