import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Building, 
  MapPin, 
  Calendar,
  Github,
  Linkedin,
  Globe,
  Award,
  TrendingUp,
  GitBranch,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

export function ProfileScreen() {
  const achievements = [
    { title: 'Pipeline Master', description: '100+ successful deployments', icon: GitBranch, color: 'blue' },
    { title: 'Speed Runner', description: 'Average build time under 5 minutes', icon: Clock, color: 'green' },
    { title: 'Early Adopter', description: 'Using AI DevOps for 6+ months', icon: Award, color: 'purple' },
    { title: 'Zero Downtime', description: '99.9% uptime achieved', icon: TrendingUp, color: 'yellow' },
  ];

  const activityData = [
    { date: 'Nov 3, 2025', action: 'Deployed frontend-prod', status: 'success' },
    { date: 'Nov 3, 2025', action: 'Updated API keys', status: 'success' },
    { date: 'Nov 2, 2025', action: 'Created new pipeline: ml-training', status: 'success' },
    { date: 'Nov 2, 2025', action: 'Rolled back backend-api', status: 'warning' },
    { date: 'Nov 1, 2025', action: 'Team member added: sarah.jones', status: 'info' },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white mb-2">Profile</h1>
        <p className="text-gray-400">Manage your account and view your activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-[#0f172a] border-[#1e293b]">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative mb-4"
                >
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=DevOps" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-[#0f172a]" />
                </motion.div>

                <h3 className="text-white mb-1">John Doe</h3>
                <p className="text-gray-400 text-sm mb-4">DevOps Engineer</p>

                <div className="flex gap-2 mb-4">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                    Pro Plan
                  </Badge>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                    Verified
                  </Badge>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white mb-2">
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-[#334155] text-gray-400 hover:text-white hover:bg-[#1e293b]"
                >
                  Upload Photo
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-[#1e293b] space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">john.doe@example.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Acme Corporation</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Joined May 2025</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#1e293b]">
                <p className="text-gray-400 text-sm mb-3">Connect</p>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-[#334155] text-gray-400 hover:text-white hover:bg-[#1e293b]"
                  >
                    <Github className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-[#334155] text-gray-400 hover:text-white hover:bg-[#1e293b]"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-[#334155] text-gray-400 hover:text-white hover:bg-[#1e293b]"
                  >
                    <Globe className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="bg-[#0f172a] border-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-white">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Total Deployments</span>
                <span className="text-white">847</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Success Rate</span>
                <span className="text-green-400">97.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Active Pipelines</span>
                <span className="text-white">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Team Members</span>
                <span className="text-white">8</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-[#0f172a] border-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">First Name</Label>
                  <Input
                    defaultValue="John"
                    className="bg-[#1e293b] border-[#334155] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Last Name</Label>
                  <Input
                    defaultValue="Doe"
                    className="bg-[#1e293b] border-[#334155] text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Email</Label>
                <Input
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="bg-[#1e293b] border-[#334155] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Role</Label>
                <Input
                  defaultValue="DevOps Engineer"
                  className="bg-[#1e293b] border-[#334155] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Bio</Label>
                <Textarea
                  defaultValue="Passionate DevOps engineer with 5+ years of experience in CI/CD automation, cloud infrastructure, and containerization."
                  className="bg-[#1e293b] border-[#334155] text-white min-h-[100px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="border-[#334155] text-gray-400 hover:text-white hover:bg-[#1e293b]"
                >
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-[#0f172a] border-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-[#1e293b] border border-[#334155] hover:border-blue-500/30 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-${achievement.color}-500/10`}>
                          <Icon className={`w-5 h-5 text-${achievement.color}-400`} />
                        </div>
                        <div>
                          <h4 className="text-white text-sm mb-1">{achievement.title}</h4>
                          <p className="text-gray-400 text-xs">{achievement.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-[#0f172a] border-[#1e293b]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activityData.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#1e293b] hover:bg-[#293548] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.status === 'success'
                            ? 'bg-green-400'
                            : activity.status === 'warning'
                            ? 'bg-yellow-400'
                            : 'bg-blue-400'
                        }`}
                      />
                      <div>
                        <p className="text-white text-sm">{activity.action}</p>
                        <p className="text-gray-400 text-xs">{activity.date}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        activity.status === 'success'
                          ? 'bg-green-500/10 text-green-400 border-green-500/30'
                          : activity.status === 'warning'
                          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      }
                    >
                      {activity.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
