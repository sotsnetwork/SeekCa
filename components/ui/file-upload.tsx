'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { fileUpload, UploadedFile, FileUploadError } from '@/lib/file-upload'
import { X, Upload, File, FileText, Image, Download } from 'lucide-react'

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

export function FileUpload({
  userId,
  folder = 'general',
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  allowedTypes,
  onFileUploaded,
  onFileRemoved,
  className = ''
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return
    
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files`)
      return
    }
    
    setUploading(true)
    setError(null)
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      
      try {
        // Update progress
        setProgress(Math.round((i / selectedFiles.length) * 100))
        
        // Upload file
        const uploadedFile = await fileUpload.uploadFile(file, userId, {
          folder,
          maxSize,
          allowedTypes
        })
        
        // Add to state
        setFiles(prev => [...prev, uploadedFile])
        
        // Callback
        if (onFileUploaded) {
          onFileUploaded(uploadedFile)
        }
      } catch (error) {
        if (error instanceof FileUploadError) {
          setError(error.message)
        } else {
          setError('Failed to upload file')
        }
        break
      }
    }
    
    setUploading(false)
    setProgress(0)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
    
    if (onFileRemoved) {
      onFileRemoved(fileId)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />
    } else if (fileType === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500" />
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-5 w-5 text-blue-500" />
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return <FileText className="h-5 w-5 text-green-500" />
    } else {
      return <File className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className={className}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
          accept={allowedTypes?.join(',')}
        />
        
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-2">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-gray-500 mb-4">
          {allowedTypes 
            ? `${allowedTypes.map(t => t.split('/')[1]).join(', ')} up to ${maxSize / (1024 * 1024)}MB`
            : `Files up to ${maxSize / (1024 * 1024)}MB`
          }
        </p>
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || files.length >= maxFiles}
        >
          Select Files
        </Button>
      </div>
      
      {uploading && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Uploading...</p>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Uploaded Files</h4>
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center">
                  {getFileIcon(file.file_type)}
                  <div className="ml-2">
                    <p className="text-sm font-medium">{file.file_name}</p>
                    <p className="text-xs text-gray-500">{fileUpload.formatFileSize(file.file_size)}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemoveFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface FileDisplayProps {
  files: UploadedFile[]
  onDownload?: (file: UploadedFile) => void
  className?: string
}

export function FileDisplay({ files, onDownload, className = '' }: FileDisplayProps) {
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />
    } else if (fileType === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500" />
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-5 w-5 text-blue-500" />
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return <FileText className="h-5 w-5 text-green-500" />
    } else {
      return <File className="h-5 w-5 text-gray-500" />
    }
  }

  if (files.length === 0) return null

  return (
    <div className={className}>
      <div className="space-y-2">
        {files.map((file) => (
          <div key={file.id} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
            <div className="flex items-center">
              {getFileIcon(file.file_type)}
              <div className="ml-2">
                <p className="text-sm font-medium">{file.file_name}</p>
                <p className="text-xs text-gray-500">{fileUpload.formatFileSize(file.file_size)}</p>
              </div>
            </div>
            {onDownload && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onDownload(file)}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}