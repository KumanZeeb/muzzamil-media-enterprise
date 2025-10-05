'use client'

interface FeedbackCardProps {
  image: string
  name?: string
  onDelete?: () => void
}

export default function FeedbackCard({ image, name, onDelete }: FeedbackCardProps) {
  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-lg group border border-blue-600/20"
    >
      <img
        src={image}
        alt={name || 'Feedback'}
        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        onClick={() => window.open(image, '_blank')}
      />

      {/* overlay name */}
      {name && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center py-1 text-sm text-blue-200">
          {name}
        </div>
      )}

      {/* delete button */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-500 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          🗑️
        </button>
      )}
    </div>
  )
}
