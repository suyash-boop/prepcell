"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Goal } from "@/types"

interface GoalDialogProps {
  goal?: Goal
  children: React.ReactNode
}

export function GoalDialog({ goal, children }: GoalDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: goal?.title || "",
    description: goal?.description || "",
    dueDate: goal?.dueDate ? new Date(goal.dueDate).toISOString().split('T')[0] : "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const method = goal ? 'PUT' : 'POST'
      const response = await fetch('/api/goals', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...(goal && { id: goal.id }),
          dueDate: formData.dueDate || null,
        }),
      })

      if (response.ok) {
        setOpen(false)
        setFormData({ title: "", description: "", dueDate: "" })
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to save goal:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-card border-2 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {goal ? 'Edit Goal' : 'Add Goal'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Goal Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Solve 5 DSA problems"
              required
              className="border-2 border-white bg-black text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details..."
              rows={3}
              className="border-2 border-white bg-black text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-white">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="border-2 border-white bg-black text-white"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-gray-200 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
          >
            {isLoading ? 'Saving...' : goal ? 'Update Goal' : 'Add Goal'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}