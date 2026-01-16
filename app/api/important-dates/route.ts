import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, date, description } = await req.json()

    const importantDate = await prisma.importantDate.create({
      data: {
        title,
        date: new Date(date),
        description: description || null,
        userId: session.user.id,
      },
    })

    return NextResponse.json(importantDate)
  } catch (error) {
    console.error('Failed to create important date:', error)
    return NextResponse.json(
      { error: 'Failed to create important date' },
      { status: 500 }
    )
  }
}