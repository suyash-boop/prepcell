"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SkillItem } from "./skill-item"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { SkillCategory as SkillCategoryType } from "@/types"
import { useState } from "react"

interface SkillCategoryProps {
  category: SkillCategoryType
  index: number
}

const categoryColors = [
  { bg: "from-purple-500/10 to-purple-500/5", border: "border-purple-500", text: "text-purple-400", progress: "bg-purple-500" },
  { bg: "from-blue-500/10 to-blue-500/5", border: "border-blue-500", text: "text-blue-400", progress: "bg-blue-500" },
  { bg: "from-green-500/10 to-green-500/5", border: "border-green-500", text: "text-green-400", progress: "bg-green-500" },
  { bg: "from-orange-500/10 to-orange-500/5", border: "border-orange-500", text: "text-orange-400", progress: "bg-orange-500" },
  { bg: "from-pink-500/10 to-pink-500/5", border: "border-pink-500", text: "text-pink-400", progress: "bg-pink-500" },
]

export function SkillCategory({ category, index }: SkillCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const completedCount = category.skills.filter(s => s.completed).length
  const totalCount = category.skills.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  const color = categoryColors[index % categoryColors.length]

  return (
    <Card className={`bg-gradient-to-br ${color.bg} border-2 ${color.border} shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] transition-all`}>
      <CardHeader 
        className="cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-2xl font-bold text-white">{category.name}</CardTitle>
              <div className="flex items-center gap-3">
                <div className={`text-sm font-medium ${color.text}`}>
                  {completedCount}/{totalCount} completed
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-white" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-white" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={progress} className={`h-3 ${color.progress}`} />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{Math.round(progress)}% Complete</span>
                <span>{totalCount - completedCount} remaining</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-3 animate-in fade-in-50 slide-in-from-top-2 duration-300">
          <div className="grid gap-3 md:grid-cols-2">
            {category.skills.map((skill) => (
              <SkillItem key={skill.id} skill={skill} />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}