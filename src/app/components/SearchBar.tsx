'use client'

interface SearchBarProps {
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ placeholder = "Cari nama game, jenis akaun, atau harga...", onChange }: SearchBarProps) {
  return (
    <div className="search">
      <i className="fas fa-search"></i>
      <input
        type="text"
        placeholder={placeholder}
        aria-label="carian"
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
    </div>
  )
}
