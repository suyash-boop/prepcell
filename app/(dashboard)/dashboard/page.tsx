import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
  Target, 
  CheckCircle2, 
  Building2, 
  TrendingUp, 
  Calendar,
  Zap,
  Trophy,
  Clock,
  Plus,
  ArrowRight,
  Flame
} from "lucide-react"
import Link from "next/link"
import { CompanyDialog } from "@/components/companies/company-dialog"
import { GoalDialog } from "@/components/goals/goal-dialog"
import { CalendarView } from "@/components/dashboard/calendar-view"

async function getDashboardData(userId: string) {
  const [skillCategories, companies, goals] = await Promise.all([
    prisma.skillCategory.findMany({
      where: { userId },
      include: { skills: true },
    }),
    prisma.company.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.goal.findMany({
      where: { userId },
      orderBy: { targetDate: 'asc' },
    }),
  ])

  const totalSkills = skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0)
  const completedSkills = skillCategories.reduce(
    (acc, cat) => acc + cat.skills.filter((s) => s.completed).length,
    0
  )
  const skillProgress = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0

  const totalGoals = goals.length
  const completedGoals = goals.filter((g) => g.completed).length
  const goalProgress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0

  const recentActivity = completedSkills > 0 ? Math.min(completedSkills, 30) : 0

  return {
    skillCategories,
    companies,
    goals,
    stats: {
      totalSkills,
      completedSkills,
      skillProgress,
      totalGoals,
      completedGoals,
      goalProgress,
      totalCompanies: companies.length,
      streak: recentActivity,
    },
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const data = await getDashboardData(session!.user!.id!)

  const upcomingGoals = data.goals.filter(g => !g.completed && new Date(g.targetDate) >= new Date())
  const todayGoals = upcomingGoals.filter(g => {
    const today = new Date()
    const goalDate = new Date(g.targetDate)
    return goalDate.toDateString() === today.toDateString()
  })

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="text-gray-400 text-lg">
          Here's your placement preparation progress today
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Skills Progress */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-2 border-purple-500 shadow-[4px_4px_0px_0px_rgba(168,85,247,1)] hover:shadow-[6px_6px_0px_0px_rgba(168,85,247,1)] transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{data.stats.skillProgress}%</p>
                <p className="text-sm text-purple-300">Skills Mastered</p>
              </div>
            </div>
            <Progress value={data.stats.skillProgress} className="h-2 bg-purple-500" />
            <p className="text-xs text-gray-400 mt-2">
              {data.stats.completedSkills} of {data.stats.totalSkills} completed
            </p>
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500 shadow-[4px_4px_0px_0px_rgba(34,197,94,1)] hover:shadow-[6px_6px_0px_0px_rgba(34,197,94,1)] transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{data.stats.completedGoals}</p>
                <p className="text-sm text-green-300">Goals Achieved</p>
              </div>
            </div>
            <Progress value={data.stats.goalProgress} className="h-2 bg-green-500" />
            <p className="text-xs text-gray-400 mt-2">
              {data.stats.totalGoals - data.stats.completedGoals} goals remaining
            </p>
          </CardContent>
        </Card>

        {/* Companies Tracked */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-2 border-blue-500 shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] hover:shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{data.stats.totalCompanies}</p>
                <p className="text-sm text-blue-300">Companies</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span>Ready for interviews</span>
            </div>
          </CardContent>
        </Card>

        {/* Streak */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-2 border-orange-500 shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] hover:shadow-[6px_6px_0px_0px_rgba(249,115,22,1)] transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{data.stats.streak}</p>
                <p className="text-sm text-orange-300">Day Streak</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Zap className="h-4 w-4 text-orange-400" />
              <span>Keep the momentum!</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Section */}
      <CalendarView goals={data.goals} />

      {/* Motivational Quote */}
      <Card className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border-2 border-white/20 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)]">
        <CardContent className="p-6 text-center">
          <p className="text-xl font-semibold text-white mb-2">
            "The expert in anything was once a beginner."
          </p>
          <p className="text-gray-400 text-sm">Keep pushing forward! 🚀</p>
        </CardContent>
      </Card>
    </div>
  )
}