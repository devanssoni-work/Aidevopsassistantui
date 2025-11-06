import { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1f2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1f2e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      
      {/* Gradient orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-[#1e293b] rounded-2xl p-8 shadow-2xl">
          {/* Logo and title */}
          <div className="flex items-center justify-center mb-8">
            <motion.div
              className="relative"
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl blur-lg opacity-50" />
              <div className="relative bg-gradient-to-br from-blue-500 to-green-500 p-3 rounded-xl">
                <Terminal className="w-8 h-8 text-white" />
              </div>
            </motion.div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-white mb-2 flex items-center justify-center gap-2">
              AI DevOps Assistant
              <Sparkles className="w-5 h-5 text-green-400" />
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your CI/CD pipelines with AI
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="dev@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1e293b] border-[#334155] text-white placeholder:text-gray-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1e293b] border-[#334155] text-white placeholder:text-gray-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white transition-all duration-300 shadow-lg shadow-blue-500/20"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-6 p-3 bg-[#1e293b]/50 border border-[#334155] rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              Demo: Use any email/password to login
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
