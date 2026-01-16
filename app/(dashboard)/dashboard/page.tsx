import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckSquare, Target, Building2, TrendingUp } from "lucide-react"

async function getReadinessScore() {
  const skills = await prisma.skill.findMany()
  const goals = await prisma.goal.findMany()

  const totalSkills = skills.length
  const completedSkills = skills.filter(s => s.completed).length

  const totalGoals = goals.length
  const completedGoals = goals.filter(g => g.completed).length

  const skillScore = totalSkills > 0 ? (completedSkills / totalSkills) * 70 : 0
  const goalScore = totalGoals > 0 ? (completedGoals / totalGoals) * 30 : 0
  const overallScore = Math.round(skillScore + goalScore)

  return {
    totalSkills,
    completedSkills,
    totalGoals,
    completedGoals,
    overallScore,
  }
}

async function getDashboardStats() {
  const companies = await prisma.company.count()
  const skills = await prisma.skill.count()
  const completedSkills = await prisma.skill.count({ where: { completed: true } })
  const goals = await prisma.goal.count()
  const completedGoals = await prisma.goal.count({ where: { completed: true } })

  return { companies, skills, completedSkills, goals, completedGoals }
}

export default async function DashboardPage() {
  const readiness = await getReadinessScore()
  const stats = await getDashboardStats()

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-white">Dashboard</h1>
        <p className="text-gray-400">Track your placement preparation progress</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Overall Readiness</CardTitle>
            <TrendingUp className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{readiness.overallScore}%</div>
            <Progress value={readiness.overallScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-card border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Skills Completed</CardTitle>
            <CheckSquare className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.completedSkills}/{stats.skills}</div>
            <p className="text-xs text-gray-400 mt-1">
              {stats.skills > 0 ? Math.round((stats.completedSkills / stats.skills) * 100) : 0}% complete
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Goals Achieved</CardTitle>
            <Target className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.completedGoals}/{stats.goals}</div>
            <p className="text-xs text-gray-400 mt-1">
              {stats.goals > 0 ? Math.round((stats.completedGoals / stats.goals) * 100) : 0}% complete
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Companies Tracked</CardTitle>
            <Building2 className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.companies}</div>
            <p className="text-xs text-gray-400 mt-1">Companies in your list</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}