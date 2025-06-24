'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  X, 
  Download, 
  Eye,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { fileUpload, UploadedFile, FileUploadError } from '@/lib/file-upload'

interface FileUploadProps {
  userId: string
  folder?: string
  maxFiles?: number
  maxSize?: number // in MB
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
  maxSize = 10,
  allowedTypes,
  onFileUploaded,
  onFileRemoved,
  className = ''
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    setError('')
    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        try {
          const uploadedFile = await fileUpload.uploadFile(file, userId, {
            folder,
            maxSize: maxSize * 1024 * 1024,
            allowedTypes
          })
          
          setUploadProgress(((index + 1) / files.length) * 100)
          return uploadedFile
        } catch (error) {
          if (error instanceof FileUploadError) {
            throw new Error(`${file.name}: ${error.message}`)
          }
          throw error
        }
      })

      const results = await Promise.all(uploadPromises)
      
      setUploadedFiles(prev => [...prev, ...results])
      results.forEach(file => onFileUploaded?.(file))
      
    } catch (error: any) {
      setError(error.message || 'Upload failed')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
    onFileRemoved?.(fileId)
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-4 w-4" />
    } else if (fileType === 'application/pdf' || fileType.includes('document')) {
      return <FileText className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop files here, or{' '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 underline"
            onClick={() => fileInputRef.current?.click()}
          >
            browse
          </button>
        </p>
        <p className="text-xs text-gray-500">
          Maximum {maxFiles} files, up to {maxSize}MB each
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept={allowedTypes?.join(',')}
        />
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading files...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <FileDisplay
          files={uploadedFiles}
          onRemove={removeFile}
        />
      )}
    </div>
  )
}

export function FileDisplay({ 
  files, 
  onDownload, 
  onRemove, 
  className = '' 
}: FileDisplayProps) {
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-4 w-4 text-blue-600" />
    } else if (fileType === 'application/pdf') {
      return <FileText className="h-4 w-4 text-red-600" />
    } else if (fileType.includes('document') || fileType.includes('word')) {
      return <FileText className="h-4 w-4 text-blue-600" />
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return <FileText className="h-4 w-4 text-green-600" />
    }
    return <File className="h-4 w-4 text-gray-600" />
  }

  const formatFileSize = (bytes: number) => {
    return fileUpload.formatFileSize(bytes)
  }

  const handleDownload = async (file: UploadedFile) => {
    try {
      await fileUpload.downloadFile(file.id)
      window.open(file.file_url, '_blank')
      onDownload?.(file)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-gray-900">
        Attached Files ({files.length})
      </h4>
      <div className="space-y-2">
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
                  {formatFileSize(file.file_size)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {onDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(file)}
                  className="h-8 w-8 p-0"
                >
                  <Download className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(file.file_url, '_blank')}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-3 w-3" />
              </Button>
              {onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(file.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}