import { useState } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Slider } from '../../ui/slider';
import { Progress } from '../../ui/progress';
import { TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../AppContext';
import { toast } from 'sonner@2.0.3';

interface CanaryDeployDialogProps {
  open: boolean;
  onClose: () => void;
  data: {
    service: string;
    version: string;
    environment: string;
    percentage: number;
  };
}

export function CanaryDeployDialog({ open, onClose, data }: CanaryDeployDialogProps) {
  const [canaryPercentage, setCanaryPercentage] = useState(data.percentage);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentPhase, setDeploymentPhase] = useState<'config' | 'deploying' | 'monitoring' | 'complete'>('config');
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState({
    errorRate: 0.12,
    latency: 145,
    throughput: 1250
  });

  const { addPipeline, addLog } = useAppContext();

  const handleDeploy = () => {
    setIsDeploying(true);
    setDeploymentPhase('deploying');
    setProgress(0);

    // Add pipeline
    addPipeline({
      name: `${data.service}-canary-${data.environment}`,
      status: 'running',
      branch: 'main',
      lastRun: 'just now',
      duration: '0m 0s',
      commit: `Canary deploy v${data.version}`,
      author: 'ai-assistant',
      version: `v${data.version}`,
      environment: data.environment,
      canaryPercentage: canaryPercentage
    });

    addLog({
      type: 'info',
      pipeline: `${data.service}-canary`,
      message: `Canary deployment started with ${canaryPercentage}% traffic`,
      details: `Deploying ${data.service} v${data.version} to ${data.environment} with canary strategy`
    });

    // Simulate deployment progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(interval);
          setDeploymentPhase('monitoring');
          simulateMonitoring();
        }
        return Math.min(next, 100);
      });
    }, 500);
  };

  const simulateMonitoring = () => {
    // Simulate metric changes
    setTimeout(() => {
      setMetrics({
        errorRate: 0.10,
        latency: 142,
        throughput: 1280
      });
    }, 2000);

    setTimeout(() => {
      setDeploymentPhase('complete');
      addLog({
        type: 'success',
        pipeline: `${data.service}-canary`,
        message: 'Canary deployment completed successfully',
        details: `All metrics within acceptable range. Ready to proceed with full deployment.`
      });
      toast.success('Canary deployment successful!');
    }, 4000);
  };

  const handlePromote = () => {
    addLog({
      type: 'success',
      pipeline: `${data.service}-canary`,
      message: 'Promoting canary to 100% traffic',
      details: `${data.service} v${data.version} promoted to full production deployment`
    });
    toast.success('Promoted to full deployment!');
    onClose();
  };

  const handleRollback = () => {
    addLog({
      type: 'warning',
      pipeline: `${data.service}-canary`,
      message: 'Rolling back canary deployment',
      details: `Reverting ${data.service} canary deployment due to user request`
    });
    toast.info('Canary deployment rolled back');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f172a] border-[#1e293b] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Canary Deployment: {data.service} v{data.version}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Gradually roll out to {data.environment} with traffic splitting
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {deploymentPhase === 'config' && (
            <>
              {/* Traffic Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-white">Canary Traffic Percentage</label>
                  <span className="text-blue-400 text-2xl">{canaryPercentage}%</span>
                </div>
                <Slider
                  value={[canaryPercentage]}
                  onValueChange={(value) => setCanaryPercentage(value[0])}
                  min={5}
                  max={50}
                  step={5}
                  className="w-full"
                />
                <p className="text-gray-400 text-sm">
                  {100 - canaryPercentage}% of traffic will remain on the current version
                </p>
              </div>

              {/* Deployment Plan */}
              <div className="bg-[#1e293b] rounded-lg p-4 space-y-2">
                <h3 className="text-white mb-2">Deployment Plan</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Service:</span>
                    <span className="text-white">{data.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Version:</span>
                    <span className="text-white">v{data.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Environment:</span>
                    <span className="text-white">{data.environment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Strategy:</span>
                    <span className="text-blue-400">Canary ({canaryPercentage}%)</span>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-yellow-400 mb-1">Deployment will be monitored</p>
                  <p className="text-gray-400">
                    Metrics will be tracked. You can promote to 100% or rollback based on performance.
                  </p>
                </div>
              </div>
            </>
          )}

          {deploymentPhase === 'deploying' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="inline-block mb-4"
                >
                  <TrendingUp className="w-12 h-12 text-blue-400" />
                </motion.div>
                <h3 className="text-white mb-2">Deploying Canary...</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Routing {canaryPercentage}% of traffic to v{data.version}
                </p>
                <Progress value={progress} className="w-full" />
                <p className="text-gray-400 text-sm mt-2">{progress}% complete</p>
              </div>
            </div>
          )}

          {(deploymentPhase === 'monitoring' || deploymentPhase === 'complete') && (
            <div className="space-y-4">
              {deploymentPhase === 'complete' && (
                <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-green-400">Canary deployment successful</p>
                    <p className="text-gray-400 text-sm">All metrics are within acceptable range</p>
                  </div>
                </div>
              )}

              {/* Real-time Metrics */}
              <div className="bg-[#1e293b] rounded-lg p-4">
                <h3 className="text-white mb-4">Live Metrics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-1">Error Rate</p>
                    <p className="text-2xl text-green-400">{metrics.errorRate}%</p>
                    <p className="text-xs text-gray-500 mt-1">Target: &lt; 0.5%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-1">Latency</p>
                    <p className="text-2xl text-blue-400">{metrics.latency}ms</p>
                    <p className="text-xs text-gray-500 mt-1">Target: &lt; 200ms</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-1">Throughput</p>
                    <p className="text-2xl text-purple-400">{metrics.throughput}</p>
                    <p className="text-xs text-gray-500 mt-1">req/sec</p>
                  </div>
                </div>
              </div>

              {deploymentPhase === 'monitoring' && (
                <p className="text-gray-400 text-sm text-center">
                  Monitoring canary deployment... Please wait for analysis to complete.
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[#1e293b]">
            {deploymentPhase === 'config' && (
              <>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-[#334155] text-gray-400 hover:text-white hover:bg-[#1e293b]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeploy}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
                >
                  Start Canary Deployment
                </Button>
              </>
            )}
            {deploymentPhase === 'complete' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleRollback}
                  className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  Rollback
                </Button>
                <Button
                  onClick={handlePromote}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
                >
                  Promote to 100%
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
