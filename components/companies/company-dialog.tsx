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
import type { Company } from "@/types"

interface CompanyDialogProps {
  company?: Company
  children: React.ReactNode
}

export function CompanyDialog({ company, children }: CompanyDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: company?.name || "",
    examPattern: company?.examPattern || "",
    importantTopics: company?.importantTopics || "",
    notes: company?.notes || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = '/api/companies'
      const method = company ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...(company && { id: company.id }),
        }),
      })

      if (response.ok) {
        setOpen(false)
        setFormData({ name: "", examPattern: "", importantTopics: "", notes: "" })
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to save company:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-card border-2 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {company ? 'Edit Company' : 'Add Company'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Company Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="border-2 border-white bg-black text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="examPattern" className="text-white">Exam Pattern</Label>
            <Textarea
              id="examPattern"
              value={formData.examPattern}
              onChange={(e) => setFormData({ ...formData, examPattern: e.target.value })}
              placeholder="e.g., 3 rounds - Aptitude, Technical, HR"
              rows={3}
              className="border-2 border-white bg-black text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="importantTopics" className="text-white">Important Topics</Label>
            <Textarea
              id="importantTopics"
              value={formData.importantTopics}
              onChange={(e) => setFormData({ ...formData, importantTopics: e.target.value })}
              placeholder="e.g., Arrays, Dynamic Programming, System Design"
              rows={3}
              className="border-2 border-white bg-black text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
              rows={4}
              className="border-2 border-white bg-black text-white"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-gray-200 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
          >
            {isLoading ? 'Saving...' : company ? 'Update Company' : 'Add Company'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}