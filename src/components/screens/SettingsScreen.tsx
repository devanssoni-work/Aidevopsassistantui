import { motion } from 'motion/react';
import { 
  Bell,
  Shield,
  Key
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';

export function SettingsScreen() {
  const settingsSections = [
    {
      icon: Bell,
      title: 'Notifications',
      items: [
        { label: 'Email notifications', description: 'Receive email alerts for pipeline events', enabled: true },
        { label: 'Slack integration', description: 'Send notifications to Slack channels', enabled: true },
        { label: 'Build failure alerts', description: 'Get notified when builds fail', enabled: true },
        { label: 'Deployment success', description: 'Confirm successful deployments', enabled: false },
      ],
    },
    {
      icon: Shield,
      title: 'Security',
      items: [
        { label: 'Two-factor authentication', description: 'Add an extra layer of security', enabled: true },
        { label: 'API key rotation', description: 'Automatically rotate API keys', enabled: false },
        { label: 'IP whitelist', description: 'Restrict access to specific IPs', enabled: false },
        { label: 'Audit logging', description: 'Track all system changes', enabled: true },
      ],
    },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white mb-2">Settings</h1>
        <p className="text-gray-400">Configure your AI DevOps Assistant</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Sections */}
        <div className="lg:col-span-2 space-y-6">
          {settingsSections.map((section, sectionIndex) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <Card className="bg-[#0f172a] border-[#1e293b]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Icon className="w-5 h-5 text-blue-400" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Label className="text-white">{item.label}</Label>
                            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                          </div>
                          <Switch defaultChecked={item.enabled} />
                        </div>
                        {itemIndex < section.items.length - 1 && (
                          <Separator className="mt-4 bg-[#1e293b]" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {/* API Configuration */}
          <Card className="bg-[#0f172a] border-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-400" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value="••••••••••••••••••••••••"
                    readOnly
                    className="bg-[#1e293b] border-[#334155] text-white"
                  />
                  <Button
                    variant="outline"
                    className="border-[#334155] text-gray-400 hover:text-white hover:bg-[#1e293b]"
                  >
                    Regenerate
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Webhook URL</Label>
                <Input
                  placeholder="https://your-app.com/webhook"
                  className="bg-[#1e293b] border-[#334155] text-white placeholder:text-gray-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Usage Stats */}
          <Card className="bg-[#0f172a] border-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-white">Usage Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">Pipelines</span>
                  <span className="text-white">12 / 50</span>
                </div>
                <div className="w-full h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <div className="h-full w-[24%] bg-gradient-to-r from-blue-500 to-green-500" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">Build Minutes</span>
                  <span className="text-white">2.4k / 10k</span>
                </div>
                <div className="w-full h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <div className="h-full w-[24%] bg-gradient-to-r from-blue-500 to-green-500" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">Storage</span>
                  <span className="text-white">8.2 GB / 50 GB</span>
                </div>
                <div className="w-full h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <div className="h-full w-[16.4%] bg-gradient-to-r from-blue-500 to-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-[#0f172a] border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-400">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                Clear All Logs
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                Reset Configuration
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
