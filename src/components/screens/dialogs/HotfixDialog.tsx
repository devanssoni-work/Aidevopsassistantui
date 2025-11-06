import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { AlertTriangle, GitBranch, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../AppContext';
import { toast } from 'sonner@2.0.3';

interface HotfixDialogProps {
  open: boolean;
  onClose: () => void;
  data: {
    version: string;
  };
}

export function HotfixDialog({ open, onClose, data }: HotfixDialogProps) {
  const [hotfixName, setHotfixName] = useState('');
  const [description, setDescription] = useState('');
  const [approvalRequired, setApprovalRequired] = useState(true);
  const { addPipeline, addLog } = useAppContext();

  const handleCreateHotfix = () => {
    if (!hotfixName.trim()) {
      toast.error('Hotfix name is required');
      return;
    }

    const branchName = `hotfix/${data.version}-${hotfixName.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Create hotfix pipeline
    addPipeline({
      name: `hotfix-${hotfixName}`,
      status: 'running',
      branch: branchName,
      lastRun: 'just now',
      duration: '0m 0s',
      commit: description || 'Hotfix deployment',
      author: 'ai-assistant',
      version: `${data.version}-hotfix`,
      environment: approvalRequired ? 'staging' : 'production'
    });

    addLog({
      type: 'warning',
      pipeline: `hotfix-${hotfixName}`,
      message: `Hotfix branch created from v${data.version}`,
      details: `Branch: ${branchName}\nTarget: ${approvalRequired ? 'Staging (pending approval)' : 'Production (auto-deploy)'}`
    });

    if (approvalRequired) {
      addLog({
        type: 'info',
        pipeline: `hotfix-${hotfixName}`,
        message: 'Awaiting approval for production deployment',
        details: 'Hotfix deployed to staging. Requires approval before production deployment.'
      });
    }

    toast.success(`Hotfix branch created: ${branchName}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f172a] border-[#1e293b] text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            Create Hotfix from v{data.version}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a hotfix branch and optionally deploy to production
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Hotfix Name */}
          <div className="space-y-2">
            <Label htmlFor="hotfix-name" className="text-white">
              Hotfix Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="hotfix-name"
              placeholder="e.g., critical-auth-fix"
              value={hotfixName}
              onChange={(e) => setHotfixName(e.target.value)}
              className="bg-[#1e293b] border-[#334155] text-white placeholder:text-gray-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the hotfix..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#1e293b] border-[#334155] text-white placeholder:text-gray-500 min-h-[80px]"
            />
          </div>

          {/* Branch Info */}
          <div className="bg-[#1e293b] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <GitBranch className="w-4 h-4 text-blue-400" />
              <h3 className="text-white">Branch Details</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Base Version:</span>
                <span className="text-white">v{data.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Branch Name:</span>
                <span className="text-blue-400 font-mono text-xs">
                  hotfix/{data.version}-{hotfixName || 'name'}
                </span>
              </div>
            </div>
          </div>

          {/* Deployment Options */}
          <div className="space-y-3">
            <Label className="text-white">Deployment Options</Label>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 rounded-lg bg-[#1e293b] cursor-pointer hover:bg-[#293548] transition-colors">
                <input
                  type="radio"
                  name="deployment"
                  checked={approvalRequired}
                  onChange={() => setApprovalRequired(true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="text-white text-sm">Deploy to Staging (Requires Approval)</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Deploy to staging first, then require approval for production
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 rounded-lg bg-[#1e293b] cursor-pointer hover:bg-[#293548] transition-colors">
                <input
                  type="radio"
                  name="deployment"
                  checked={!approvalRequired}
                  onChange={() => setApprovalRequired(false)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="text-white text-sm">Direct to Production</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Deploy directly to production (emergency only)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-orange-400 mb-1">Critical Hotfix</p>
              <p className="text-gray-400">
                Hotfixes bypass normal CI/CD processes. Ensure proper testing and documentation.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[#1e293b]">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#334155] text-gray-400 hover:text-white hover:bg-[#1e293b]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateHotfix}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              Create Hotfix
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
