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

    const { company, type, date, notes } = await req.json()

    const interview = await prisma.interview.create({
      data: {
        company,
        type,
        date: new Date(date),
        notes: notes || null,
        userId: session.user.id,
      },
    })

    return NextResponse.json(interview)
  } catch (error) {
    console.error('Failed to create interview:', error)
    return NextResponse.json(
      { error: 'Failed to create interview' },
      { status: 500 }
    )
  }
}