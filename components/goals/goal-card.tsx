"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Pencil, Trash2 } from "lucide-react"
import { GoalDialog } from "./goal-dialog"
import type { Goal } from "@/types"

interface GoalCardProps {
  goal: Goal
}

export function GoalCard({ goal }: GoalCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggleComplete = async () => {
    if (isUpdating) return
    
    setIsUpdating(true)
    try {
      const response = await fetch("/api/goals", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: goal.id,
          completed: !goal.completed,
        }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        console.error("Failed to update goal")
      }
    } catch (error) {
      console.error("Failed to update goal:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this goal?")) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/goals?id=${goal.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to delete goal:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isOverdue = new Date(goal.targetDate) < new Date() && !goal.completed

  return (
    <Card
      className={`bg-gradient-to-br ${
        goal.completed
          ? "from-green-500/10 to-emerald-500/5 border-green-500"
          : isOverdue
          ? "from-red-500/10 to-orange-500/5 border-red-500"
          : "from-purple-500/10 to-blue-500/5 border-purple-500"
      } border-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={goal.completed}
            onCheckedChange={handleToggleComplete}
            disabled={isUpdating}
            className={`mt-1 h-5 w-5 border-2 ${
              goal.completed
                ? "border-green-500 bg-green-500"
                : "border-white"
            }`}
          />
          
          <div className="flex-1 min-w-0">
            <h3
              className={`text-xl font-bold mb-2 ${
                goal.completed
                  ? "text-green-400 line-through"
                  : "text-white"
              }`}
            >
              {goal.title}
            </h3>
            
            {goal.description && (
              <p className="text-gray-400 text-sm mb-3">{goal.description}</p>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className={`h-4 w-4 ${isOverdue ? "text-red-400" : "text-purple-400"}`} />
              <span className={isOverdue ? "text-red-400 font-semibold" : "text-gray-400"}>
                {isOverdue ? "Overdue: " : "Due: "}
                {formatDate(goal.targetDate)}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <GoalDialog goal={goal}>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </GoalDialog>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}