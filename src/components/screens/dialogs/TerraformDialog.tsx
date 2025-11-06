import { useState } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import { FileCode, Plus, Minus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../AppContext';
import { toast } from 'sonner@2.0.3';

interface TerraformDialogProps {
  open: boolean;
  onClose: () => void;
  data: {
    stack: string;
    environment: string;
  };
}

export function TerraformDialog({ open, onClose, data }: TerraformDialogProps) {
  const [phase, setPhase] = useState<'planning' | 'review' | 'applying'>('planning');
  const [progress, setProgress] = useState(0);
  const { addLog, addPipeline } = useAppContext();

  const terraformPlan = {
    toAdd: [
      { resource: 'aws_instance.web_server', type: 'EC2 Instance', details: 't3.medium, us-east-1a' },
      { resource: 'aws_security_group.web_sg', type: 'Security Group', details: 'HTTP/HTTPS ingress' },
      { resource: 'aws_eip.web_ip', type: 'Elastic IP', details: 'Associated with web_server' },
    ],
    toChange: [
      { resource: 'aws_db_instance.main', type: 'RDS Instance', details: 'Storage: 100GB → 200GB' },
      { resource: 'aws_iam_role.lambda_role', type: 'IAM Role', details: 'Add CloudWatch permissions' },
    ],
    toDestroy: [
      { resource: 'aws_instance.old_worker', type: 'EC2 Instance', details: 't2.micro, deprecated' },
    ],
  };

  const handlePlanComplete = () => {
    setPhase('review');
    addLog({
      type: 'info',
      pipeline: `terraform-${data.stack}`,
      message: `Terraform plan generated for ${data.stack}`,
      details: `Environment: ${data.environment}\nChanges: +${terraformPlan.toAdd.length} ~${terraformPlan.toChange.length} -${terraformPlan.toDestroy.length}`
    });
  };

  const handleApply = () => {
    setPhase('applying');
    setProgress(0);

    addPipeline({
      name: `terraform-${data.stack}-${data.environment}`,
      status: 'running',
      branch: 'main',
      lastRun: 'just now',
      duration: '0m 0s',
      commit: `Apply terraform changes for ${data.stack}`,
      author: 'ai-assistant',
      environment: data.environment
    });

    addLog({
      type: 'info',
      pipeline: `terraform-${data.stack}`,
      message: 'Applying Terraform changes',
      details: `Executing terraform apply for ${data.stack} in ${data.environment}`
    });

    // Simulate apply progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(interval);
          addLog({
            type: 'success',
            pipeline: `terraform-${data.stack}`,
            message: 'Terraform apply completed successfully',
            details: `All infrastructure changes applied to ${data.environment}`
          });
          toast.success('Infrastructure changes applied!');
          setTimeout(() => onClose(), 2000);
        }
        return Math.min(next, 100);
      });
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f172a] border-[#1e293b] text-white max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-purple-400" />
            Terraform Plan: {data.stack}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Environment: {data.environment}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {phase === 'planning' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="inline-block mb-4"
              >
                <FileCode className="w-12 h-12 text-purple-400" />
              </motion.div>
              <h3 className="text-white mb-2">Generating Terraform Plan...</h3>
              <p className="text-gray-400 text-sm mb-4">
                Analyzing infrastructure changes for {data.stack}
              </p>
              <Button
                onClick={handlePlanComplete}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                View Plan
              </Button>
            </motion.div>
          )}

          {phase === 'review' && (
            <>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                  <Plus className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl text-green-400">{terraformPlan.toAdd.length}</p>
                  <p className="text-gray-400 text-sm">To Add</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl text-yellow-400">{terraformPlan.toChange.length}</p>
                  <p className="text-gray-400 text-sm">To Change</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                  <Minus className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <p className="text-2xl text-red-400">{terraformPlan.toDestroy.length}</p>
                  <p className="text-gray-400 text-sm">To Destroy</p>
                </div>
              </div>

              {/* Detailed Changes */}
              <ScrollArea className="h-[300px] rounded-lg border border-[#1e293b] p-4">
                <div className="space-y-4">
                  {/* Resources to Add */}
                  {terraformPlan.toAdd.length > 0 && (
                    <div>
                      <h3 className="text-green-400 mb-3 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Resources to Add
                      </h3>
                      <div className="space-y-2">
                        {terraformPlan.toAdd.map((resource, index) => (
                          <div key={index} className="bg-[#1e293b] rounded p-3 border-l-2 border-green-500">
                            <p className="text-white text-sm font-mono">{resource.resource}</p>
                            <p className="text-gray-400 text-xs mt-1">{resource.type}</p>
                            <p className="text-gray-500 text-xs mt-1">{resource.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources to Change */}
                  {terraformPlan.toChange.length > 0 && (
                    <div>
                      <h3 className="text-yellow-400 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Resources to Change
                      </h3>
                      <div className="space-y-2">
                        {terraformPlan.toChange.map((resource, index) => (
                          <div key={index} className="bg-[#1e293b] rounded p-3 border-l-2 border-yellow-500">
                            <p className="text-white text-sm font-mono">{resource.resource}</p>
                            <p className="text-gray-400 text-xs mt-1">{resource.type}</p>
                            <p className="text-gray-500 text-xs mt-1">{resource.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resources to Destroy */}
                  {terraformPlan.toDestroy.length > 0 && (
                    <div>
                      <h3 className="text-red-400 mb-3 flex items-center gap-2">
                        <Minus className="w-4 h-4" />
                        Resources to Destroy
                      </h3>
                      <div className="space-y-2">
                        {terraformPlan.toDestroy.map((resource, index) => (
                          <div key={index} className="bg-[#1e293b] rounded p-3 border-l-2 border-red-500">
                            <p className="text-white text-sm font-mono">{resource.resource}</p>
                            <p className="text-gray-400 text-xs mt-1">{resource.type}</p>
                            <p className="text-gray-500 text-xs mt-1">{resource.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Warning */}
              <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-orange-400 mb-1">Review Carefully</p>
                  <p className="text-gray-400">
                    These changes will be applied to your {data.environment} environment. Ensure all changes are expected.
                  </p>
                </div>
              </div>
            </>
          )}

          {phase === 'applying' && (
            <div className="text-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="inline-block mb-4"
              >
                <FileCode className="w-12 h-12 text-purple-400" />
              </motion.div>
              <h3 className="text-white mb-2">Applying Changes...</h3>
              <p className="text-gray-400 text-sm mb-4">
                {progress < 100 ? `Updating infrastructure (${progress}%)` : 'Changes applied successfully!'}
              </p>
              <div className="w-full max-w-md mx-auto bg-[#1e293b] rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              {progress === 100 && (
                <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Infrastructure updated successfully</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {phase === 'review' && (
            <div className="flex gap-3 pt-4 border-t border-[#1e293b]">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-[#334155] text-gray-400 hover:text-white hover:bg-[#1e293b]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                Apply Changes
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
