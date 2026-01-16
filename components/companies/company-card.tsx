"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import type { Company } from "@/types"
import { CompanyDialog } from "./company-dialog"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this company?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/companies?id=${company.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete company:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="bg-card border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold text-white">{company.name}</CardTitle>
          <div className="flex gap-2">
            <CompanyDialog company={company}>
              <Button
                variant="outline"
                size="icon"
                className="border-2 border-white bg-black text-white hover:bg-white hover:text-black h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </CompanyDialog>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              className="border-2 border-white bg-black text-white hover:bg-red-500 hover:border-red-500 h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {company.examPattern && (
          <div>
            <h4 className="font-semibold mb-1 text-white">Exam Pattern</h4>
            <p className="text-sm text-gray-400 whitespace-pre-wrap">
              {company.examPattern}
            </p>
          </div>
        )}
        {company.importantTopics && (
          <div>
            <h4 className="font-semibold mb-1 text-white">Important Topics</h4>
            <p className="text-sm text-gray-400 whitespace-pre-wrap">
              {company.importantTopics}
            </p>
          </div>
        )}
        {company.notes && (
          <div>
            <h4 className="font-semibold mb-1 text-white">Notes</h4>
            <p className="text-sm text-gray-400 whitespace-pre-wrap">
              {company.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}