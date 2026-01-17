import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resume = await prisma.resume.findFirst({
      where: { userId: session.user.id },
      orderBy: {
        uploadedAt: 'desc',
      },
    })
    return NextResponse.json(resume)
  } catch (error) {
    console.error('Failed to fetch resume:', error)
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('Uploading file:', file.name, 'Size:', file.size)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'prepcell/resumes',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            reject(error)
          }
          else resolve(result)
        }
      ).end(buffer)
    })

    const uploadResult = result as any

    // Delete old resume if exists
    const existingResume = await prisma.resume.findFirst({
      where: { userId: session.user.id },
    })

    if (existingResume) {
      await cloudinary.uploader.destroy(existingResume.cloudinaryId)
      await prisma.resume.delete({
        where: { id: existingResume.id },
      })
    }

    const resume = await prisma.resume.create({
      data: {
        fileName: file.name,
        fileUrl: uploadResult.secure_url,
        cloudinaryId: uploadResult.public_id,
        userId: session.user.id,
      },
    })

    return NextResponse.json(resume)
  } catch (error) {
    console.error('Failed to upload resume:', error)
    return NextResponse.json({ 
      error: 'Failed to upload resume',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Resume ID required' }, { status: 400 })
    }
    
    const resume = await prisma.resume.findUnique({
      where: { 
        id,
        userId: session.user.id,
      },
    })
    
    if (resume) {
      await cloudinary.uploader.destroy(resume.cloudinaryId)
      await prisma.resume.delete({
        where: { id },
      })
    }
    
    return NextResponse.json({ message: 'Resume deleted' })
  } catch (error) {
    console.error('Failed to delete resume:', error)
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 })
  }
}