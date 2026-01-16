import { prisma } from "@/lib/prisma"
import { SkillCategory } from "@/components/skills/skill-category"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Award, Target } from "lucide-react"

async function getSkillCategories() {
  return await prisma.skillCategory.findMany({
    include: {
      skills: true,
    },
    orderBy: {
      order: 'asc',
    },
  })
}

async function getSkillStats(categories: any[]) {
  const totalSkills = categories.reduce((acc, cat) => acc + cat.skills.length, 0)
  const completedSkills = categories.reduce(
    (acc, cat) => acc + cat.skills.filter((s: any) => s.completed).length,
    0
  )
  const overallProgress = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0
  
  return { totalSkills, completedSkills, overallProgress }
}

export default async function SkillsPage() {
  const categories = await getSkillCategories()
  const stats = await getSkillStats(categories)

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-white">Skills Tracker</h1>
          <p className="text-gray-400">Master the skills you need for placement success</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-2 border-purple-500 shadow-[4px_4px_0px_0px_rgba(168,85,247,1)] hover:shadow-[6px_6px_0px_0px_rgba(168,85,247,1)] transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300 mb-1">Overall Progress</p>
                <p className="text-3xl font-bold text-white">{stats.overallProgress}%</p>
              </div>
              <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500 shadow-[4px_4px_0px_0px_rgba(34,197,94,1)] hover:shadow-[6px_6px_0px_0px_rgba(34,197,94,1)] transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-300 mb-1">Completed Skills</p>
                <p className="text-3xl font-bold text-white">{stats.completedSkills}</p>
              </div>
              <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-2 border-blue-500 shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] hover:shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300 mb-1">Total Skills</p>
                <p className="text-3xl font-bold text-white">{stats.totalSkills}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {categories.map((category, index) => (
          <SkillCategory key={category.id} category={category} index={index} />
        ))}
      </div>
    </div>
  )
}