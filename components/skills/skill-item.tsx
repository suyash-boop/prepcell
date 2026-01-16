"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Skill } from "@/types"
import { useRouter } from "next/navigation"
import { CheckCircle2, Circle } from "lucide-react"

interface SkillItemProps {
  skill: Skill
}

export function SkillItem({ skill }: SkillItemProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/skills', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skillId: skill.id,
          completed: checked,
        }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to update skill:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className={`group relative flex items-center space-x-3 p-4 bg-black/30 border-2 rounded-lg transition-all duration-200 ${
        skill.completed 
          ? 'border-green-500/50 bg-green-500/5' 
          : 'border-white/20 hover:border-white/40 hover:bg-white/5'
      } ${isLoading ? 'opacity-50' : ''}`}
    >
      <Checkbox
        id={skill.id}
        checked={skill.completed}
        onCheckedChange={handleToggle}
        disabled={isLoading}
        className="border-2 border-white data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
      />
      
      <Label
        htmlFor={skill.id}
        className={`flex-1 cursor-pointer font-medium transition-all ${
          skill.completed 
            ? 'line-through text-gray-500' 
            : 'text-white group-hover:text-gray-200'
        }`}
      >
        {skill.name}
      </Label>

      {skill.completed ? (
        <CheckCircle2 className="h-5 w-5 text-green-500 animate-in zoom-in-50 duration-200" />
      ) : (
        <Circle className="h-5 w-5 text-gray-600" />
      )}
    </div>
  )
}