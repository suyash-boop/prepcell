"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Trash2 } from "lucide-react"
import type { Resume } from "@/types"

interface ResumeUploadProps {
  currentResume: Resume | null
}

export function ResumeUpload({ currentResume }: ResumeUploadProps) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
      } else {
        alert('Please select a PDF file')
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/resume', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setFile(null)
        router.refresh()
      } else {
        alert('Failed to upload resume')
      }
    } catch (error) {
      console.error('Failed to upload resume:', error)
      alert('Failed to upload resume')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentResume) return
    if (!confirm('Are you sure you want to delete your resume?')) return

    try {
      const response = await fetch(`/api/resume?id=${currentResume.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete resume:', error)
    }
  }

  return (
    <Card className="bg-card border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Upload className="h-5 w-5" />
          Upload Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resume" className="text-white">Select PDF File</Label>
          <Input
            id="resume"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="border-2 border-white bg-black text-white file:bg-white file:text-black file:border-0 file:mr-4 file:py-2 file:px-4"
          />
        </div>

        {file && (
          <div className="flex items-center gap-2 p-3 border-2 border-white bg-black">
            <FileText className="h-5 w-5 text-white" />
            <span className="flex-1 text-sm font-medium text-white">{file.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFile(null)}
              className="h-6 w-6 text-white hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full bg-white text-black hover:bg-gray-200 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
        >
          {isUploading ? 'Uploading...' : 'Upload Resume'}
        </Button>

        {currentResume && (
          <Button
            onClick={handleDelete}
            variant="outline"
            className="w-full border-2 border-red-500 bg-black text-red-500 hover:bg-red-500 hover:text-white"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Current Resume
          </Button>
        )}
      </CardContent>
    </Card>
  )
}