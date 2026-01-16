import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const goals = await prisma.goal.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(goals)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, dueDate } = await req.json()

    const goal = await prisma.goal.create({
      data: {
        title,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error("Failed to create goal:", error)
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, title, description, dueDate } = await req.json()

    const goal = await prisma.goal.update({
      where: { id },
      data: {
        title,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error("Failed to update goal:", error)
    return NextResponse.json(
      { error: "Failed to update goal" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { goalId, completed } = await req.json()

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: { completed },
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error("Failed to update goal:", error)
    return NextResponse.json(
      { error: "Failed to update goal" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Goal ID is required" },
        { status: 400 }
      )
    }

    await prisma.goal.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete goal:", error)
    return NextResponse.json(
      { error: "Failed to delete goal" },
      { status: 500 }
    )
  }
}