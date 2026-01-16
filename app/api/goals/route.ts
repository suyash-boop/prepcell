import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id },
      orderBy: { targetDate: 'asc' },
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Failed to fetch goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, targetDate, dueDate } = await req.json()

    const finalTargetDate = targetDate || dueDate

    if (!finalTargetDate) {
      return NextResponse.json(
        { error: 'Target date is required' },
        { status: 400 }
      )
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        description: description || null,
        targetDate: new Date(finalTargetDate),
        userId: session.user.id,
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error('Failed to create goal:', error)
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, completed } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      )
    }

    const goal = await prisma.goal.update({
      where: { 
        id,
        userId: session.user.id,
      },
      data: {
        completed: completed ?? false,
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error('Failed to update goal:', error)
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, title, description, targetDate, dueDate, completed } = await req.json()

    const finalTargetDate = targetDate || dueDate

    const goal = await prisma.goal.update({
      where: { 
        id,
        userId: session.user.id,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(finalTargetDate !== undefined && { targetDate: new Date(finalTargetDate) }),
        ...(completed !== undefined && { completed }),
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error('Failed to update goal:', error)
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      )
    }

    await prisma.goal.delete({
      where: { 
        id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete goal:', error)
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    )
  }
}