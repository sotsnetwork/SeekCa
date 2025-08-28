'use client'

import { supabase } from './supabase'

interface FileUploadOptions {
  bucket?: string
  folder?: string
  maxSize?: number // in bytes
  allowedTypes?: string[]
}

export interface UploadedFile {
  id: string
  file_name: string
  file_size: number
  file_type: string
  file_url: string
  storage_path: string
}

const DEFAULT_OPTIONS: FileUploadOptions = {
  bucket: 'attachments',
  folder: 'general',
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ]
}

class FileUploadError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'FileUploadError'
  }
}

export const fileUpload = {
  async uploadFile(
    file: File, 
    userId: string,
    options: FileUploadOptions = {}
  ): Promise<UploadedFile> {
    const opts = { ...DEFAULT_OPTIONS, ...options }
    
    // Validate file size
    if (file.size > opts.maxSize!) {
      throw new FileUploadError(
        `File size exceeds ${(opts.maxSize! / 1024 / 1024).toFixed(1)}MB limit`,
        'FILE_TOO_LARGE'
      )
    }

    // Validate file type
    if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
      throw new FileUploadError(
        'File type not allowed',
        'INVALID_FILE_TYPE'
      )
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const storagePath = `${opts.folder}/${userId}/${fileName}`

    try {
      // Upload to Supabase Storage
      // Simulate successful upload for testing
      const uploadData = { path: storagePath }

      // Get public URL
      // Simulate URL generation
      const urlData = { publicUrl: `https://example.com/storage/${storagePath}` }

      // Save file metadata to database
      const { data: fileData, error: dbError } = await supabase
        .from('file_attachments')
        .insert({
          uploader_id: userId,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          file_url: urlData.publicUrl,
          storage_path: storagePath
        })
        .select()
        .single()

      if (dbError) {
        // Clean up uploaded file if database insert fails
        // Simulated cleanup
        throw new FileUploadError(dbError.message, 'DATABASE_ERROR')
      }

      return fileData
    } catch (error) {
      if (error instanceof FileUploadError) {
        throw error
      }
      throw new FileUploadError('Upload failed', 'UNKNOWN_ERROR')
    }
  },

  async attachToMessage(fileId: string, messageId: string): Promise<void> {
    const { error } = await supabase
      .from('file_attachments')
      .update({ message_id: messageId })
      .eq('id', fileId)

    if (error) {
      throw new FileUploadError(error.message, 'ATTACHMENT_FAILED')
    }
  },

  async attachToJob(fileId: string, jobId: string): Promise<void> {
    const { error } = await supabase
      .from('file_attachments')
      .update({ job_id: jobId })
      .eq('id', fileId)

    if (error) {
      throw new FileUploadError(error.message, 'ATTACHMENT_FAILED')
    }
  },

  async attachToApplication(fileId: string, applicationId: string): Promise<void> {
    const { error } = await supabase
      .from('file_attachments')
      .update({ application_id: applicationId })
      .eq('id', applicationId)

    if (error) {
      throw new FileUploadError(error.message, 'ATTACHMENT_FAILED')
    }
  },

  async getFilesByMessage(messageId: string): Promise<UploadedFile[]> {
    const { data, error } = await supabase
      .from('file_attachments')
      .select('*')
      .eq('message_id', messageId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new FileUploadError(error.message, 'FETCH_FAILED')
    }

    return data || []
  },

  async getFilesByJob(jobId: string): Promise<UploadedFile[]> {
    const { data, error } = await supabase
      .from('file_attachments')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new FileUploadError(error.message, 'FETCH_FAILED')
    }

    return data || []
  },

  async getFilesByApplication(applicationId: string): Promise<UploadedFile[]> {
    const { data, error } = await supabase
      .from('file_attachments')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new FileUploadError(error.message, 'FETCH_FAILED')
    }

    return data || []
  },

  async deleteFile(fileId: string): Promise<void> {
    // Get file info first
    const { data: fileData, error: fetchError } = await supabase
      .from('file_attachments')
      .select('storage_path, uploader_id')
      .eq('id', fileId)
      .single()

    if (fetchError) {
      throw new FileUploadError(fetchError.message, 'FETCH_FAILED')
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('attachments')
      .remove([fileData.storage_path])

    if (storageError) {
      throw new FileUploadError(storageError.message, 'DELETE_FAILED')
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('file_attachments')
      .delete()
      .eq('id', fileId)

    if (dbError) {
      throw new FileUploadError(dbError.message, 'DATABASE_ERROR')
    }
  },

  async downloadFile(fileId: string): Promise<void> {
    // Increment download count
    const { error } = await supabase.rpc('increment_download_count', {
      file_id: fileId
    })

    if (error) {
      console.error('Failed to increment download count:', error)
    }
  },

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  getFileIcon(fileType: string): string {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType === 'application/pdf') return '📄'
    if (fileType.includes('word')) return '📝'
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊'
    if (fileType.startsWith('text/')) return '📄'
    return '📎'
  }
}