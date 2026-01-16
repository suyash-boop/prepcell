import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const skills = await prisma.skill.findMany()
    const goals = await prisma.goal.findMany()

    const totalSkills = skills.length
    const completedSkills = skills.filter(s => s.completed).length

    const totalGoals = goals.length
    const completedGoals = goals.filter(g => g.completed).length

    const skillScore = totalSkills > 0 ? (completedSkills / totalSkills) * 70 : 0
    const goalScore = totalGoals > 0 ? (completedGoals / totalGoals) * 30 : 0
    const overallScore = Math.round(skillScore + goalScore)

    return NextResponse.json({
      totalSkills,
      completedSkills,
      totalGoals,
      completedGoals,
      overallScore,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to calculate readiness' }, { status: 500 })
  }
}