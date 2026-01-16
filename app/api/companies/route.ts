import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(companies)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, examPattern, importantTopics, notes } = await req.json()

    const company = await prisma.company.create({
      data: {
        name,
        examPattern: examPattern || null,
        importantTopics: importantTopics || null,
        notes: notes || null,
      },
    })

    return NextResponse.json(company)
  } catch (error) {
    console.error('Failed to create company:', error)
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, examPattern, importantTopics, notes } = await req.json()

    const company = await prisma.company.update({
      where: { id },
      data: {
        name,
        examPattern: examPattern || null,
        importantTopics: importantTopics || null,
        notes: notes || null,
      },
    })

    return NextResponse.json(company)
  } catch (error) {
    console.error('Failed to update company:', error)
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    await prisma.company.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete company:', error)
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    )
  }
}