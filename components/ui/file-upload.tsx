'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, X, File, Image, FileText, Download } from 'lucide-react'
import { fileUpload, UploadedFile, FileUploadError } from '@/lib/file-upload'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  userId: string
  folder?: string
  maxFiles?: number
  maxSize?: number
  allowedTypes?: string[]
  onFileUploaded?: (file: UploadedFile) => void
  onFileRemoved?: (fileId: string) => void
  className?: string
}

interface FileDisplayProps {
  files: UploadedFile[]
  onDownload?: (file: UploadedFile) => void
  onRemove?: (fileId: string) => void
  className?: string
}

export function FileUpload({
  userId,
  folder = 'general',
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  allowedTypes,
  onFileUploaded,
  onFileRemoved,
  className
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    // Check file count limit
    if (uploadedFiles.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    setUploading(true)
    setError('')

    try {
      for (const file of files) {
        const uploadedFile = await fileUpload.uploadFile(file, userId, {
          folder,
          maxSize,
          allowedTypes
        })
        
        setUploadedFiles(prev => [...prev, uploadedFile])
        onFileUploaded?.(uploadedFile)
      }
    } catch (error) {
      if (error instanceof FileUploadError) {
        setError(error.message)
      } else {
        setError('Upload failed. Please try again.')
      }
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveFile = async (fileId: string) => {
    try {
      await fileUpload.deleteFile(fileId)
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
      onFileRemoved?.(fileId)
    } catch (error) {
      setError('Failed to remove file')
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />
    if (fileType === 'application/pdf') return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-gray-500">
                Max {maxFiles} files, {fileUpload.formatFileSize(maxSize)} each
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || uploadedFiles.length >= maxFiles}
            >
              {uploading ? 'Uploading...' : 'Choose Files'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept={allowedTypes?.join(',')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <FileDisplay
          files={uploadedFiles}
          onRemove={handleRemoveFile}
          className="mt-4"
        />
      )}
    </div>
  )
}

export function FileDisplay({ files, onDownload, onRemove, className }: FileDisplayProps) {
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />
    if (fileType === 'application/pdf') return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  if (files.length === 0) return null

  return (
    <div className={cn("space-y-2", className)}>
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {getFileIcon(file.file_type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.file_name}
              </p>
              <p className="text-xs text-gray-500">
                {fileUpload.formatFileSize(file.file_size)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onDownload(file)
                  fileUpload.downloadFile(file.id)
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(file.id)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}