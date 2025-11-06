import { useAppContext } from './AppContext';
import { toast } from 'sonner@2.0.3';

export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
  requiresDialog?: 'canary' | 'hotfix' | 'terraform' | 'approval';
}

export function useAICommandProcessor() {
  const { addPipeline, updatePipeline, pipelines, addLog, addCommandHistory, addRelease } = useAppContext();

  const processCommand = (command: string): CommandResult => {
    const lowerCommand = command.toLowerCase();

    // Deploy with tag
    if (lowerCommand.includes('deploy') && lowerCommand.includes('to production with tag')) {
      const match = command.match(/deploy\s+(\S+)\s+to production with tag\s+(\S+)/i);
      if (match) {
        const [, serviceName, tag] = match;
        return handleDeployWithTag(serviceName, tag);
      }
    }

    // Deploy with canary
    if (lowerCommand.includes('deploy') && lowerCommand.includes('canary')) {
      const match = command.match(/deploy\s+(\S+)\s+v?([\d.]+)\s+to\s+(\w+)\s+with canary\s+(\d+)%/i);
      if (match) {
        const [, service, version, environment, percentage] = match;
        return handleCanaryDeploy(service, version, environment, parseInt(percentage));
      }
    }

    // Regular deploy
    if (lowerCommand.includes('deploy') && lowerCommand.includes('to')) {
      const match = command.match(/deploy\s+(\S+)(?:\s+v?([\d.]+))?\s+to\s+(\w+)/i);
      if (match) {
        const [, service, version, environment] = match;
        return handleDeploy(service, version || 'latest', environment);
      }
    }

    // Show status
    if (lowerCommand.includes('show status') || lowerCommand.includes('status of all pipelines')) {
      return handleShowStatus();
    }

    // Rollback
    if (lowerCommand.includes('rollback') && lowerCommand.includes('to previous')) {
      const match = command.match(/rollback\s+(\S+)/i);
      if (match) {
        const [, service] = match;
        return handleRollback(service);
      }
    }

    // Stop running pipelines
    if (lowerCommand.includes('stop') && (lowerCommand.includes('running') || lowerCommand.includes('all'))) {
      return handleStopRunningPipelines();
    }

    // Run tests
    if (lowerCommand.includes('run') && (lowerCommand.includes('test') || lowerCommand.includes('suite'))) {
      const match = command.match(/run.*test.*for\s+(\S+)(?:@(\S+))?/i);
      if (match) {
        const [, service, branch] = match;
        return handleRunTests(service, branch || 'main');
      }
    }

    // Cut release
    if (lowerCommand.includes('cut release') || lowerCommand.includes('create release')) {
      const match = command.match(/cut release\s+v?([\d.]+)\s+for\s+(\S+)/i);
      if (match) {
        const [, version, service] = match;
        return handleCutRelease(version, service);
      }
    }

    // Create hotfix
    if (lowerCommand.includes('hotfix') || lowerCommand.includes('hot fix')) {
      const match = command.match(/create hotfix from\s+v?([\d.]+)/i);
      if (match) {
        const [, version] = match;
        return handleCreateHotfix(version);
      }
    }

    // Terraform plan
    if (lowerCommand.includes('terraform') || lowerCommand.includes('plan')) {
      const match = command.match(/plan terraform for\s+(\S+(?:\s+\S+)?)\s+in\s+(\w+)/i);
      if (match) {
        const [, stack, environment] = match;
        return handleTerraformPlan(stack, environment);
      }
    }

    // Observability query
    if (lowerCommand.includes('why') || lowerCommand.includes('error rate') || lowerCommand.includes('spike')) {
      const match = command.match(/why.*(?:after|for)\s+v?([\d.]+)?/i);
      if (match) {
        const version = match[1] || 'recent deployment';
        return handleObservabilityQuery(version);
      }
    }

    // Compliance/Audit
    if (lowerCommand.includes('show') && (lowerCommand.includes('change ticket') || lowerCommand.includes('approval'))) {
      return handleShowCompliance();
    }

    return {
      success: false,
      message: "I couldn't understand that command. Try commands like:\n• Deploy [service] to [environment]\n• Show status of all pipelines\n• Rollback [service] to previous version\n• Stop all running pipelines"
    };
  };

  const handleDeployWithTag = (serviceName: string, tag: string): CommandResult => {
    const pipelineName = `${serviceName}-deploy`;
    
    // Add pipeline
    addPipeline({
      name: pipelineName,
      status: 'running',
      branch: tag,
      lastRun: 'just now',
      duration: '0m 0s',
      commit: `Deploy with tag ${tag}`,
      author: 'ai-assistant',
      version: tag,
      environment: 'production'
    });

    // Add log
    addLog({
      type: 'info',
      pipeline: pipelineName,
      message: `Deployment initiated with tag ${tag}`,
      details: `Starting deployment of ${serviceName} to production with tag ${tag}`
    });

    // Simulate completion
    setTimeout(() => {
      const pipeline = pipelines.find(p => p.name === pipelineName);
      if (pipeline) {
        updatePipeline(pipeline.id, {
          status: 'success',
          duration: '2m 45s',
          lastRun: 'just now'
        });
        
        addLog({
          type: 'success',
          pipeline: pipelineName,
          message: `Deployment completed successfully`,
          details: `${serviceName} ${tag} deployed to production successfully`
        });
        
        toast.success(`${serviceName} deployed successfully!`);
      }
    }, 3000);

    return {
      success: true,
      message: `✅ Deployment initiated for ${serviceName} with tag ${tag} to production.\n\nPipeline created and logs are being recorded. Check the Pipelines tab for live status.`
    };
  };

  const handleDeploy = (service: string, version: string, environment: string): CommandResult => {
    const pipelineName = `${service}-${environment}-deploy`;
    
    addPipeline({
      name: pipelineName,
      status: 'running',
      branch: 'main',
      lastRun: 'just now',
      duration: '0m 0s',
      commit: `Deploy v${version} to ${environment}`,
      author: 'ai-assistant',
      version: `v${version}`,
      environment: environment
    });

    addLog({
      type: 'info',
      pipeline: pipelineName,
      message: `Deployment initiated to ${environment}`,
      details: `Starting deployment of ${service} v${version} to ${environment} environment`
    });

    setTimeout(() => {
      const pipeline = pipelines.find(p => p.name === pipelineName);
      if (pipeline) {
        updatePipeline(pipeline.id, {
          status: 'success',
          duration: '2m 30s'
        });
        
        addLog({
          type: 'success',
          pipeline: pipelineName,
          message: `Deployment completed`,
          details: `${service} v${version} successfully deployed to ${environment}`
        });
        
        toast.success(`${service} deployed to ${environment}!`);
      }
    }, 3000);

    return {
      success: true,
      message: `✅ Deploying ${service} v${version} to ${environment}.\n\nPipeline created and deployment is in progress.`
    };
  };

  const handleCanaryDeploy = (service: string, version: string, environment: string, percentage: number): CommandResult => {
    return {
      success: true,
      message: `🚀 Initiating canary deployment for ${service} v${version} to ${environment} with ${percentage}% traffic.`,
      requiresDialog: 'canary',
      data: { service, version, environment, percentage }
    };
  };

  const handleShowStatus = (): CommandResult => {
    const statusReport = pipelines.map(p => {
      const icon = p.status === 'success' ? '✅' : p.status === 'running' ? '🔄' : p.status === 'failed' ? '❌' : '⏸️';
      return `${icon} ${p.name}: ${p.status.toUpperCase()} (${p.environment || 'unknown'})`;
    }).join('\n');

    const summary = {
      total: pipelines.length,
      running: pipelines.filter(p => p.status === 'running').length,
      success: pipelines.filter(p => p.status === 'success').length,
      failed: pipelines.filter(p => p.status === 'failed').length,
      stopped: pipelines.filter(p => p.status === 'stopped').length
    };

    return {
      success: true,
      message: `📊 Pipeline Status Overview:\n\nTotal: ${summary.total} | Running: ${summary.running} | Success: ${summary.success} | Failed: ${summary.failed} | Stopped: ${summary.stopped}\n\n${statusReport}`
    };
  };

  const handleRollback = (service: string): CommandResult => {
    const pipeline = pipelines.find(p => 
      p.name.toLowerCase().includes(service.toLowerCase()) && 
      p.environment === 'production'
    );

    if (!pipeline) {
      return {
        success: false,
        message: `❌ Could not find a production pipeline for ${service}`
      };
    }

    // Create rollback pipeline
    addPipeline({
      name: `${service}-rollback`,
      status: 'running',
      branch: 'main',
      lastRun: 'just now',
      duration: '0m 0s',
      commit: 'Rollback to previous stable version',
      author: 'ai-assistant',
      environment: 'production'
    });

    addLog({
      type: 'warning',
      pipeline: `${service}-rollback`,
      message: 'Rollback initiated',
      details: `Rolling back ${service} to previous stable version in production`
    });

    setTimeout(() => {
      const rollbackPipeline = pipelines.find(p => p.name === `${service}-rollback`);
      if (rollbackPipeline) {
        updatePipeline(rollbackPipeline.id, {
          status: 'success',
          duration: '1m 20s'
        });
        
        addLog({
          type: 'success',
          pipeline: `${service}-rollback`,
          message: 'Rollback completed successfully',
          details: `${service} has been rolled back to previous stable version`
        });
        
        toast.success(`${service} rolled back successfully!`);
      }
    }, 2500);

    return {
      success: true,
      message: `⏮️ Rolling back ${service} to previous stable version in production.\n\nRollback pipeline created and executing...`
    };
  };

  const handleStopRunningPipelines = (): CommandResult => {
    const runningPipelines = pipelines.filter(p => p.status === 'running');
    
    if (runningPipelines.length === 0) {
      return {
        success: false,
        message: '⚠️ No running pipelines found.'
      };
    }

    runningPipelines.forEach(pipeline => {
      updatePipeline(pipeline.id, { status: 'stopped' });
      addLog({
        type: 'warning',
        pipeline: pipeline.name,
        message: 'Pipeline stopped by user command',
        details: `${pipeline.name} was manually stopped via AI command`
      });
    });

    toast.success(`Stopped ${runningPipelines.length} running pipeline(s)`);

    return {
      success: true,
      message: `🛑 Stopped ${runningPipelines.length} running pipeline(s):\n${runningPipelines.map(p => `• ${p.name}`).join('\n')}`
    };
  };

  const handleRunTests = (service: string, branch: string): CommandResult => {
    const pipelineName = `${service}-test-${branch.replace('/', '-')}`;
    
    addPipeline({
      name: pipelineName,
      status: 'running',
      branch: branch,
      lastRun: 'just now',
      duration: '0m 0s',
      commit: `Running full test suite`,
      author: 'ai-assistant',
      environment: 'testing'
    });

    addLog({
      type: 'info',
      pipeline: pipelineName,
      message: 'Test suite initiated',
      details: `Running full test suite for ${service} on branch ${branch}`
    });

    setTimeout(() => {
      const pipeline = pipelines.find(p => p.name === pipelineName);
      if (pipeline) {
        updatePipeline(pipeline.id, {
          status: 'success',
          duration: '4m 12s'
        });
        
        addLog({
          type: 'success',
          pipeline: pipelineName,
          message: 'All tests passed',
          details: `Test suite completed: 156 tests passed, 0 failed, 0 skipped`
        });
        
        toast.success(`Test suite completed for ${service}!`);
      }
    }, 4000);

    return {
      success: true,
      message: `🧪 Running full test suite for ${service} on branch ${branch}.\n\nTest pipeline created and executing...`
    };
  };

  const handleCutRelease = (version: string, service: string): CommandResult => {
    addRelease({
      version: `v${version}`,
      service: service,
      timestamp: new Date().toISOString(),
      status: 'released'
    });

    addLog({
      type: 'success',
      pipeline: service,
      message: `Release v${version} created`,
      details: `Release v${version} for ${service} has been tagged and published`
    });

    toast.success(`Release v${version} created for ${service}!`);

    return {
      success: true,
      message: `🎉 Release v${version} created for ${service}.\n\nRelease has been tagged and is ready for deployment.`
    };
  };

  const handleCreateHotfix = (version: string): CommandResult => {
    return {
      success: true,
      message: `🔥 Creating hotfix pipeline from v${version}...`,
      requiresDialog: 'hotfix',
      data: { version }
    };
  };

  const handleTerraformPlan = (stack: string, environment: string): CommandResult => {
    return {
      success: true,
      message: `📋 Generating Terraform plan for ${stack} in ${environment}...`,
      requiresDialog: 'terraform',
      data: { stack, environment }
    };
  };

  const handleObservabilityQuery = (version: string): CommandResult => {
    const analysis = `
📊 Error Rate Analysis for ${version}:

**Root Cause**: Database connection pool exhaustion
**Timeline**:
• 14:23 - Deployment completed
• 14:25 - Error rate spike detected (0.2% → 4.5%)
• 14:27 - Connection pool saturated
• 14:30 - Auto-scaling triggered

**Key Metrics**:
• Peak error rate: 4.5%
• Affected requests: ~1,200
• Average response time: +250ms
• Database connections: 95/100 (max)

**Recommendation**: Increase connection pool size from 100 to 150 before next deployment.
    `.trim();

    addLog({
      type: 'warning',
      pipeline: 'observability',
      message: `Error rate spike analyzed for ${version}`,
      details: 'Database connection pool exhaustion identified as root cause'
    });

    return {
      success: true,
      message: analysis
    };
  };

  const handleShowCompliance = (): CommandResult => {
    const compliance = `
📋 Last Production Deployment - Compliance Report:

**Change Ticket**: CHG-2024-1104-001
**Service**: frontend-production v1.2.3
**Deployed**: Nov 4, 2024 14:23:45

**Approval Chain**:
✅ Developer: john.doe (Requested)
✅ Tech Lead: sarah.chen (Approved - Nov 4, 13:45)
✅ DevOps: mike.wilson (Approved - Nov 4, 14:10)
✅ Security Scan: Passed (No vulnerabilities)
✅ QA Sign-off: jane.smith (Approved - Nov 4, 14:15)

**Compliance Status**: ✅ APPROVED
**Risk Level**: LOW
**Rollback Plan**: Available
    `.trim();

    return {
      success: true,
      message: compliance
    };
  };

  return { processCommand };
}
