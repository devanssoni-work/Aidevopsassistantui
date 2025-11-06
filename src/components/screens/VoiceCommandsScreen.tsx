import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  Send, 
  Sparkles, 
  Terminal,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useAICommandProcessor } from '../AICommandProcessor';
import { useAppContext } from '../AppContext';
import { CanaryDeployDialog } from './dialogs/CanaryDeployDialog';
import { HotfixDialog } from './dialogs/HotfixDialog';
import { TerraformDialog } from './dialogs/TerraformDialog';

interface Message {
  type: 'user' | 'ai' | 'system' | 'error';
  content: string;
  timestamp: Date;
}

export function VoiceCommandsScreen() {
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      content: 'Hello! I\'m your AI DevOps Assistant. You can give me commands via text or voice. Try commands like:\n• "Deploy frontend to production with tag v1.2.3"\n• "Show status of all pipelines"\n• "Rollback backend to previous version"\n• "Stop all running pipelines"',
      timestamp: new Date(Date.now() - 300000),
    },
  ]);
  const [dialogType, setDialogType] = useState<'canary' | 'hotfix' | 'terraform' | null>(null);
  const [dialogData, setDialogData] = useState<any>(null);

  const { processCommand } = useAICommandProcessor();
  const { commandHistory } = useAppContext();

  const suggestions = [
    'Deploy frontend to production with tag v1.2.3',
    'Show status of all pipelines',
    'Rollback backend to previous version',
    'Stop all running pipelines',
    'Run full test suite for payments@feature/upi-qr',
    'Cut release v2.3.0 for mobile-api',
    'Deploy inventory-svc v1.12.4 to staging with canary 10%',
    'Create hotfix from v2.3.0',
  ];

  const handleSendCommand = () => {
    if (!command.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        content: command,
        timestamp: new Date(),
      },
    ]);

    // Process command
    setTimeout(() => {
      const result = processCommand(command);
      
      if (result.requiresDialog) {
        setDialogType(result.requiresDialog);
        setDialogData(result.data);
      }
      
      setMessages((prev) => [
        ...prev,
        {
          type: result.success ? 'ai' : 'error',
          content: result.message,
          timestamp: new Date(),
        },
      ]);
    }, 500);

    setCommand('');
  };

  const handleVoiceCommand = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setCommand('Show status of all pipelines');
        setIsListening(false);
      }, 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="p-8 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-white mb-2">AI Command Center</h1>
        <p className="text-gray-400">Control your CI/CD pipelines with natural language</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Chat Area */}
        <Card className="lg:col-span-2 bg-[#0f172a] border-[#1e293b] flex flex-col">
          <CardContent className="p-6 flex-1 flex flex-col min-h-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                          : message.type === 'ai'
                          ? 'bg-[#1e293b] text-white'
                          : message.type === 'error'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        {message.type === 'ai' && <Sparkles className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" />}
                        {message.type === 'system' && <Terminal className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />}
                        {message.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />}
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      </div>
                      <p className="text-xs opacity-60 text-right">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-[#1e293b] text-white rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <Mic className="w-4 h-4 text-red-400" />
                      </motion.div>
                      <p className="text-sm">Listening...</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your command here..."
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendCommand();
                  }
                }}
                className="bg-[#1e293b] border-[#334155] text-white placeholder:text-gray-500 focus:border-blue-500 resize-none"
                rows={2}
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleVoiceCommand}
                  className={`${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-[#1e293b] hover:bg-[#293548]'
                  } border border-[#334155]`}
                >
                  <Mic className="w-5 h-5" />
                </Button>
                <Button
                  onClick={handleSendCommand}
                  className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions & Stats */}
        <div className="space-y-6">
          {/* Quick Commands */}
          <Card className="bg-[#0f172a] border-[#1e293b]">
            <CardContent className="p-6">
              <h3 className="text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-400" />
                Quick Commands
              </h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCommand(suggestion)}
                    className="w-full text-left p-3 rounded-lg bg-[#1e293b] hover:bg-[#293548] text-gray-300 text-sm transition-all"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-[#0f172a] border-[#1e293b]">
            <CardContent className="p-6">
              <h3 className="text-white mb-4">Recent Commands</h3>
              <div className="space-y-3">
                {commandHistory.slice(0, 5).length > 0 ? (
                  commandHistory.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-[#1e293b]"
                    >
                      {item.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{item.command}</p>
                        <p className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {item.timestamp}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No recent commands</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      {dialogType === 'canary' && dialogData && (
        <CanaryDeployDialog
          open={true}
          onClose={() => setDialogType(null)}
          data={dialogData}
        />
      )}
      {dialogType === 'hotfix' && dialogData && (
        <HotfixDialog
          open={true}
          onClose={() => setDialogType(null)}
          data={dialogData}
        />
      )}
      {dialogType === 'terraform' && dialogData && (
        <TerraformDialog
          open={true}
          onClose={() => setDialogType(null)}
          data={dialogData}
        />
      )}
    </div>
  );
}
