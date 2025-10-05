'use client'

import FeedbackCard from './FeedbackCard'
import { supabase } from '../lib/supabaseClient'

interface Props {
  feedbacks?: { id: number; image_url: string; name?: string }[]
  onDelete?: () => void
}

export default function FeedbackList({ feedbacks = [], onDelete }: Props) {
  const handleDelete = async (id: number, imageUrl: string) => {
    const confirm = window.confirm('Yakin mau hapus feedback ini?')
    if (!confirm) return

    const filename = imageUrl.split('/').pop()
    if (!filename) return

    // hapus di storage
    await supabase.storage.from('feedbacks').remove([filename])

    // hapus di table
    const { error } = await supabase.from('feedbacks').delete().eq('id', id)
    if (error) console.error('Gagal hapus feedback:', error)
    else if (onDelete) onDelete()
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {feedbacks.map(f => (
        <FeedbackCard
          key={f.id}
          image={f.image_url}
          name={f.name}
          onDelete={() => handleDelete(f.id, f.image_url)}
        />
      ))}
    </div>
  )
}
