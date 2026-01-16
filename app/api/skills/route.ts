import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.skillCategory.findMany({
      include: {
        skills: true,
      },
      orderBy: {
        order: 'asc',
      },
    })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { skillId, completed } = await req.json()

    const skill = await prisma.skill.update({
      where: { id: skillId },
      data: { completed },
    })

    return NextResponse.json(skill)
  } catch (error) {
    console.error('Failed to update skill:', error)
    return NextResponse.json(
      { error: 'Failed to update skill' },
      { status: 500 }
    )
  }
}