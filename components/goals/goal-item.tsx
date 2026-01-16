"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Calendar } from "lucide-react"
import type { Goal } from "@/types"
import { GoalDialog } from "./goal-dialog"
import { format } from "date-fns"

interface GoalItemProps {
  goal: Goal
}

export function GoalItem({ goal }: GoalItemProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/goals', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: goal.id,
          completed: checked,
        }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to update goal:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    try {
      const response = await fetch(`/api/goals?id=${goal.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete goal:', error)
    }
  }

  return (
    <Card className="bg-card border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={goal.completed}
            onCheckedChange={handleToggle}
            disabled={isLoading}
            className="mt-1 border-2 border-white"
          />
          
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${goal.completed ? 'line-through text-gray-500' : 'text-white'}`}>
              {goal.title}
            </h3>
            {goal.description && (
              <p className={`text-sm mt-1 ${goal.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                {goal.description}
              </p>
            )}
            {goal.dueDate && (
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>Due: {format(new Date(goal.dueDate), 'MMM dd, yyyy')}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <GoalDialog goal={goal}>
              <Button
                variant="outline"
                size="icon"
                className="border-2 border-white bg-black text-white hover:bg-white hover:text-black h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </GoalDialog>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              className="border-2 border-white bg-black text-white hover:bg-red-500 hover:border-red-500 h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}