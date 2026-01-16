import { prisma } from "@/lib/prisma"
import { ResumeUpload } from "@/components/resume/resume-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar } from "lucide-react"
import { format } from "date-fns"

async function getResume() {
  return await prisma.resume.findFirst({
    orderBy: {
      uploadedAt: 'desc',
    },
  })
}

export default async function ResumePage() {
  const resume = await getResume()

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-white">Resume</h1>
        <p className="text-gray-400">Upload and manage your resume</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ResumeUpload currentResume={resume} />

        {resume && (
          <Card className="bg-card border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5" />
                Current Resume
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">File Name</p>
                <p className="font-medium text-white">{resume.fileName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Uploaded On
                </p>
                <p className="font-medium text-white">
                  {format(new Date(resume.uploadedAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              <a
                href={resume.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-white text-black border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all font-medium"
              >
                View Resume
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}