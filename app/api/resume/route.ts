import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'

export async function GET() {
  try {
    const resume = await prisma.resume.findFirst({
      orderBy: {
        uploadedAt: 'desc',
      },
    })
    return NextResponse.json(resume)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'prepcell/resumes',
          format: 'pdf',
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    const uploadResult = result as any

    const resume = await prisma.resume.create({
      data: {
        fileName: file.name,
        fileUrl: uploadResult.secure_url,
        cloudinaryId: uploadResult.public_id,
      },
    })

    return NextResponse.json(resume)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Resume ID required' }, { status: 400 })
    }
    
    const resume = await prisma.resume.findUnique({
      where: { id },
    })
    
    if (resume) {
      await cloudinary.uploader.destroy(resume.cloudinaryId)
      await prisma.resume.delete({
        where: { id },
      })
    }
    
    return NextResponse.json({ message: 'Resume deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 })
  }
}