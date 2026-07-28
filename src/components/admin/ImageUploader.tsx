'use client'

import { useState, useRef, useCallback } from 'react'
import {
  HiOutlineTrash,
  HiOutlineExclamationCircle,
  HiOutlineArrowUpTray,
} from 'react-icons/hi2'

// ─── Types ───────────────────────────────────────────

interface ImageUploaderProps {
  images: string[]
  onImagesChange: (urls: string[]) => void
  maxImages?: number
  maxSizeMB?: number
}

interface UploadingFile {
  id: string
  name: string
}

// ─── Compression utility ─────────────────────────────

async function compressImage(
  file: File,
  maxWidth = 1920,
  quality = 0.8,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Compression failed'))
        },
        'image/webp',
        quality,
      )
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

// ─── Upload function ─────────────────────────────────

async function uploadImage(file: File): Promise<string> {
  // Auto-compress if > 1MB
  let uploadFile = file
  if (file.size > 1024 * 1024) {
    const compressed = await compressImage(file)
    uploadFile = new File(
      [compressed],
      file.name.replace(/\.[^.]+$/, '.webp'),
      { type: 'image/webp' },
    )
  }

  const formData = new FormData()
  formData.append('file', uploadFile)

  const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Upload failed')
  }

  const { url } = await res.json()
  return url
}

// ─── Component ───────────────────────────────────────

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<UploadingFile[]>([])
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const maxBytes = maxSizeMB * 1024 * 1024

  // ── Process files ──────────────────────────────────

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null)
      const fileArray = Array.from(files)
      const remaining = maxImages - images.length

      if (fileArray.length > remaining) {
        setError(`You can only add ${remaining} more image${remaining === 1 ? '' : 's'}`)
        return
      }

      // Validate each file
      for (const file of fileArray) {
        if (!file.type.startsWith('image/')) {
          setError(`"${file.name}" is not an image`)
          return
        }
        if (file.size > maxBytes) {
          setError(`"${file.name}" exceeds the ${maxSizeMB}MB limit`)
          return
        }
      }

      // Track uploading files
      const uploadingState: UploadingFile[] = fileArray.map((f) => ({
        id: crypto.randomUUID(),
        name: f.name,
      }))
      setUploading(uploadingState)

      // Upload each file
      const urls: string[] = []
      for (let i = 0; i < fileArray.length; i++) {
        try {
          const url = await uploadImage(fileArray[i])
          urls.push(url)
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : `Failed to upload "${fileArray[i].name}"`,
          )
          // Mark this one as done (we won't add its URL)
          setUploading((prev) =>
            prev.map((u, idx) => (idx === i ? { ...u, name: u.name } : u)),
          )
          break
        }
      }

      setUploading([])

      if (urls.length > 0) {
        onImagesChange([...images, ...urls])
      }
    },
    [images, onImagesChange, maxImages, maxSizeMB, maxBytes],
  )

  // ── Drop handler ───────────────────────────────────

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files)
      }
    },
    [processFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  // ── Browse handler ─────────────────────────────────

  const handleBrowseClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files)
      }
      // Reset so re-selecting the same file triggers onChange again
      e.target.value = ''
    },
    [processFiles],
  )

  // ── Remove handler ─────────────────────────────────

  const handleRemove = useCallback(
    (index: number) => {
      onImagesChange(images.filter((_, i) => i !== index))
    },
    [images, onImagesChange],
  )

  // ── Determine whether uploading is in progress ─────

  const isUploading = uploading.length > 0
  const atMax = images.length >= maxImages
  const showDropZone = !atMax

  // ── Render ─────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
          <HiOutlineExclamationCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Drop zone */}
      {showDropZone && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleBrowseClick}
          className={`
            flex cursor-pointer flex-col items-center justify-center rounded-xl
            border-2 border-dashed p-8 text-center transition-colors
            ${
              dragOver
                ? 'border-[#FFD700] bg-[#FFD700]/5'
                : 'border-zinc-700 hover:border-[#FFD700]'
            }
            bg-zinc-900/50
          `}
        >
          <HiOutlineArrowUpTray
            className={`mb-2 h-8 w-8 ${
              dragOver ? 'text-[#FFD700]' : 'text-zinc-500'
            }`}
          />
          <p
            className={`text-sm ${
              dragOver ? 'text-[#FFD700]' : 'text-zinc-400'
            }`}
          >
            {isUploading
              ? 'Uploading...'
              : 'Drag images here or click to browse'}
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            PNG, JPG, WebP &middot; Up to {maxSizeMB}MB each &middot; Max{' '}
            {maxImages} images
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Uploading indicators */}
      {isUploading && (
        <div className="space-y-2">
          {uploading.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-[#0f0f0f] px-4 py-2.5"
            >
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FFD700] border-t-transparent" />
              <span className="text-sm text-zinc-400">{file.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((url, index) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-zinc-300 opacity-0 transition-opacity hover:bg-red-500/80 hover:text-white group-hover:opacity-100"
                title="Remove image"
              >
                <HiOutlineTrash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Image count */}
      {images.length > 0 && (
        <p className="text-xs text-zinc-500">
          {images.length} / {maxImages} image{images.length === 1 ? '' : 's'}
        </p>
      )}
    </div>
  )
}
