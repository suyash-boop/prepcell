"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AddInterviewDialogProps {
  open: boolean
  onClose: () => void
}

export function AddInterviewDialog({ open, onClose }: AddInterviewDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    company: "",
    type: "",
    date: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to add interview")

      toast.success("Interview added successfully!")
      router.refresh()
      onClose()
      setFormData({ company: "", type: "", date: "", notes: "" })
    } catch (error) {
      toast.error("Failed to add interview")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-black border-2 border-green-500/50">
        <DialogHeader>
          <DialogTitle className="text-white">Add Interview</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company" className="text-white">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="bg-black/50 border-white/20 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className="text-white">Interview Type</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="bg-black/50 border-white/20 text-white"
              placeholder="e.g., Technical, HR, Behavioral"
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
            <Label htmlFor="notes" className="text-white">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-black/50 border-white/20 text-white"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-500 hover:bg-green-600 border-2 border-green-600"
            >
              {isLoading ? "Adding..." : "Add Interview"}
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