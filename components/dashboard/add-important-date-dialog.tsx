"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AddImportantDateDialogProps {
  open: boolean
  onClose: () => void
}

export function AddImportantDateDialog({ open, onClose }: AddImportantDateDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/important-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to add important date")

      toast.success("Important date added successfully!")
      router.refresh()
      onClose()
      setFormData({ title: "", date: "", description: "" })
    } catch (error) {
      toast.error("Failed to add important date")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-black border-2 border-purple-500/50">
        <DialogHeader>
          <DialogTitle className="text-white">Add Important Date</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-black/50 border-white/20 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-white">Date</Label>
            <Input
              id="date"
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="bg-black/50 border-white/20 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-black/50 border-white/20 text-white"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-purple-500 hover:bg-purple-600 border-2 border-purple-600"
            >
              {isLoading ? "Adding..." : "Add Date"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-2 border-white/20"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}