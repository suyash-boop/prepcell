import { prisma } from "@/lib/prisma"
import { GoalItem } from "@/components/goals/goal-item"
import { GoalDialog } from "@/components/goals/goal-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"

async function getGoals() {
  return await prisma.goal.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function GoalsPage() {
  const goals = await getGoals()
  const completedGoals = goals.filter(g => g.completed).length

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-white">Daily Goals</h1>
          <p className="text-gray-400">
            {completedGoals}/{goals.length} goals completed
          </p>
        </div>
        <GoalDialog>
          <Button className="bg-white text-black hover:bg-gray-200 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            <Plus className="mr-2 h-4 w-4" />
            Add Goal
          </Button>
        </GoalDialog>
      </div>

      {goals.length === 0 ? (
        <Card className="bg-card border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] p-12 text-center">
          <p className="text-gray-400 mb-4">No goals added yet</p>
          <GoalDialog>
            <Button className="bg-white text-black hover:bg-gray-200 border-2 border-white">
              Add Your First Goal
            </Button>
          </GoalDialog>
        </Card>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <GoalItem key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  )
}