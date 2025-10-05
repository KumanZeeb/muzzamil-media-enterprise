'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface FeedbackInput {
  name?: string
  message?: string
  image?: string
}

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState<FeedbackInput>({ name: '', message: '' })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFeedback(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (file: File | null) => {
    setImageFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.message) return alert('Isi dulu pesannya bre 🗣️')
    if (!imageFile) return alert('Pilih gambar dulu bree 🖼️')

    setIsLoading(true)

    // Upload image ke bucket feedbacks/uploads
    const filePath = `uploads/${Date.now()}_${imageFile.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('feedbacks')
      .upload(filePath, imageFile)

    if (uploadError) {
      console.error(uploadError)
      alert('Upload gagal: ' + uploadError.message)
      setIsLoading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('feedbacks')
      .getPublicUrl(uploadData.path)

    const imageUrl = urlData.publicUrl

    const { error } = await supabase.from('feedbacks').insert([
      {
        name: feedback.name || 'Anonymous',
        message: feedback.message,
        image: imageUrl
      }
    ])

    if (error) {
      console.error(error)
      alert('Insert gagal: ' + error.message)
    } else {
      alert('Feedback terkirim 🫶')
      setFeedback({ name: '', message: '' })
      setImageFile(null)
      setPreview(null)
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Nama (optional)"
        name="name"
        value={feedback.name}
        onChange={handleChange}
        className="w-full bg-gray-800 border border-blue-600/30 rounded-md px-3 py-2 text-sm"
      />

      <textarea
        placeholder="Tulis pesan feedback lu di sini..."
        name="message"
        value={feedback.message}
        onChange={handleChange}
        className="w-full bg-gray-800 border border-blue-600/30 rounded-md px-3 py-2 text-sm"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
        className="w-full text-blue-300 text-sm"
      />

      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="preview"
            className="w-full rounded-lg border border-blue-600/30"
          />
        </div>
      )}

      <button
        disabled={isLoading}
        type="submit"
        className="bg-blue-500/80 hover:bg-blue-400 text-black font-semibold px-4 py-2 rounded-md w-full"
      >
        {isLoading ? 'Uploading...' : 'Upload Feedback 🚀'}
      </button>
    </form>
  )
}
