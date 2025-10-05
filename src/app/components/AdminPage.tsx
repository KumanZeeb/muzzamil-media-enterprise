'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Product } from '../types/product'
import ProductForm from './ProductForm'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*')
    if (data) setProducts(data as Product[])
  }

  useEffect(() => { 
    fetchProducts() 
  }, [])

  // ✅ Gunakan prop yang sesuai: onProductAdded
  const handleProductAdded = () => {
    fetchProducts() // Refresh list produk setelah produk ditambahkan
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      
      {/* ✅ PASTI WORK: Sesuai dengan interface ProductForm */}
      <ProductForm onProductAdded={handleProductAdded} />
      
      <h2>Produk List</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - {p.category} - RM {p.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  )
}