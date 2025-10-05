export interface Product {
  id: number
  name: string
  category: 'game' | 'gadget' | 'sosmed'
  game?: string
  stock: 'ready' | 'preorder'
  level?: number
  server?: string
  heroCount?: number
  rank?: string
  price: number
  image?: string
  description?: string
  created_at?: string
}

// ⬇️ Tambahan khusus buat form input
export type ProductInput = Omit<Product, 'id' | 'created_at'>
