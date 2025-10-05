'use client'
import { useState, useEffect } from 'react';

interface ProductFilterProps {
  onFilter: (q: string, game: string, stock: string) => void;
}

export default function ProductFilter({ onFilter }: ProductFilterProps) {
  const [q, setQ] = useState('');
  const [game, setGame] = useState('all');
  const [stock, setStock] = useState('all');

  useEffect(() => {
    onFilter(q, game, stock);
  }, [q, game, stock]);

  return (
    <div className="controls">
      <div className="search">
        <i className="fas fa-search"></i>
        <input
          placeholder="Cari nama game, jenis akaun, atau harga..."
          aria-label="carian"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="filter">
        <select value={game} onChange={(e) => setGame(e.target.value)}>
          <option value="all">Semua Social Media</option>
          <option value="tiktok">TIKTOK</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="telegram">Telegram</option>
        </select>
        <select value={stock} onChange={(e) => setStock(e.target.value)}>
          <option value="all">Semua Stok</option>
          <option value="ready">Sedia</option>
          <option value="preorder">Pra-tempah</option>
        </select>
      </div>
    </div>
  );
}
