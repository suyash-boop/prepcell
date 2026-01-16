"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Briefcase, Target, BookOpen, Lightbulb, ChevronDown, ChevronUp } from "lucide-react"
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
  const [isExpanded, setIsExpanded] = useState(false)

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

  // Extract difficulty from notes
  const difficultyMatch = company.notes?.match(/Difficulty:\s*(\w+)/i)
  const difficulty = difficultyMatch ? difficultyMatch[1] : null

  const getDifficultyColor = (diff: string | null) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500'
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500'
    }
  }

  return (
    <Card className="bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 border-2 border-white/20 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] hover:border-white/30 transition-all duration-300">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-2xl">{company.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{company.name}</h3>
              <div className="flex items-center gap-2">
                {difficulty && (
                  <Badge className={`${getDifficultyColor(difficulty)} border-2 font-semibold`}>
                    {difficulty}
                  </Badge>
                )}
                <Badge className="bg-purple-500/20 text-purple-400 border-2 border-purple-500">
                  AI Generated
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <CompanyDialog company={company}>
              <Button
                variant="outline"
                size="icon"
                className="border-2 border-white/20 bg-black text-white hover:bg-purple-500 hover:border-purple-500 h-10 w-10"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </CompanyDialog>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              className="border-2 border-white/20 bg-black text-white hover:bg-red-500 hover:border-red-500 h-10 w-10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          {/* Interview Rounds */}
          {company.examPattern && (
            <div className="bg-black/30 border-2 border-blue-500/30 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-blue-400">Interview Rounds</h4>
              </div>
              <div className="space-y-1">
                {company.examPattern.split('\n').slice(0, isExpanded ? undefined : 3).map((round, idx) => (
                  <p key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{round}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Important Topics */}
          {company.importantTopics && (
            <div className="bg-black/30 border-2 border-purple-500/30 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-purple-400">Key Topics</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {company.importantTopics.split(',').slice(0, isExpanded ? undefined : 5).map((topic, idx) => (
                  <Badge
                    key={idx}
                    className="bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
                  >
                    {topic.trim()}
                  </Badge>
                ))}
                {!isExpanded && company.importantTopics.split(',').length > 5 && (
                  <Badge className="bg-white/10 text-gray-400 border border-white/20">
                    +{company.importantTopics.split(',').length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Expandable Notes Section */}
        {company.notes && (
          <div className="bg-black/30 border-2 border-green-500/30 rounded-lg overflow-hidden">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between p-4 hover:bg-green-500/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-green-400">Preparation Tips & Questions</h4>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-green-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-green-400" />
              )}
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-3 animate-in fade-in-50 slide-in-from-top-2 duration-300">
                <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed border-t-2 border-green-500/20 pt-4">
                  {company.notes}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer with Quick Actions */}
        <div className="mt-4 pt-4 border-t-2 border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <BookOpen className="h-4 w-4" />
            <span>Click expand to see full preparation guide</span>
          </div>
          <CompanyDialog company={company}>
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
            >
              Chat with AI
            </Button>
          </CompanyDialog>
        </div>
      </CardContent>
    </Card>
  )
}