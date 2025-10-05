'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { ProductInput } from '../types/product'

interface Props {
  onProductAdded?: (product: ProductInput) => void
}

export default function ProductForm({ onProductAdded }: Props) {
  const [product, setProduct] = useState<ProductInput>({
    name: '',
    category: 'game',
    stock: 'ready',
    price: 0,
    description: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setProduct(prev => ({ ...prev, [name]: value }))
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
    setIsLoading(true)
    
    let imageUrl = product.image
 
    if (imageFile) {
      const { data, error: uploadError } = await supabase.storage
        .from('products')
        .upload(`${Date.now()}_${imageFile.name}`, imageFile)

      if (uploadError) {
        console.error(uploadError)
        setIsLoading(false)
        return
      }
      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(data.path)

      imageUrl = urlData.publicUrl
    }

    const { error } = await supabase.from('products').insert([
      { ...product, image: imageUrl }
    ])

    if (error) {
      console.error(error)
    } else {
      if (onProductAdded) onProductAdded(product)
      setProduct({
        name: '',
        category: 'game',
        stock: 'ready',
        price: 0,
        description: ''
      })
      setImageFile(null)
      setPreview(null)
    }
    
    setIsLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="product-form"
    >
      {/* Header */}
      <div className="form-header">
        <h3><i className="fas fa-plus-circle"></i> Tambah Produk Baru</h3>
        <p className="form-subtitle">Isi detail produk gaming Anda di bawah</p>
      </div>

      <div className="form-content">
        {/* Nama Produk */}
        <div className="form-group">
          <label htmlFor="name">Nama Produk</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Contoh: MLBB Mythic Account | Skin Langka"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Kategori */}
        <div className="form-group">
          <label htmlFor="category">Kategori</label>
          <select
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
          >
            <option value="game">Game Account</option>
            <option value="sosmed">Akaun Sosmed</option>
            <option value="gadget">Gadget</option>
            <option value="other">Lainnya</option>
          </select>
        </div>

        {/* Status Stok */}
        <div className="form-group">
          <label htmlFor="stock">Status Stok</label>
          <select
            id="stock"
            name="stock"
            value={product.stock}
            onChange={handleChange}
          >
            <option value="ready">Ready / Sedia</option>
            <option value="preorder">Pre-order / Pra-pesan</option>
          </select>
        </div>

        {/* Harga */}
        <div className="form-group">
          <label htmlFor="price">Harga (RM)</label>
          <input
            type="number"
            id="price"
            name="price"
            placeholder="0"
            value={product.price}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        {/* Game (Opsional) */}
        <div className="form-group">
          <label htmlFor="game">Game (Opsional)</label>
          <select
            id="game"
            name="game"
            value={product.game || ''}
            onChange={handleChange}
          >
            <option value="">Pilih Social Media</option>
            <option value="tiktok">Tiktok</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="telegram">Telegram</option>
            <option value="other">Lainnya</option>
          </select>
        </div>

        {/* Server (Opsional) */}
        <div className="form-group">
          <label htmlFor="server">Server / Region (Opsional)</label>
          <input
            type="text"
            id="server"
            name="server"
            placeholder="Contoh: Asia, Global, Indonesia"
            value={product.server || ''}
            onChange={handleChange}
          />
        </div>

        {/* Level (Opsional) */}
        <div className="form-group">
          <label htmlFor="level">Level / Rank (Opsional)</label>
          <input
            type="text"
            id="level"
            name="level"
            placeholder="Contoh: Mythic, Level 150, Diamond"
            value={product.level || ''}
            onChange={handleChange}
          />
        </div>

        {/* Jumlah Hero (Opsional) */}
        <div className="form-group">
          <label htmlFor="heroCount">Jumlah Hero / Karakter (Opsional)</label>
          <input
            type="number"
            id="heroCount"
            name="heroCount"
            placeholder="0"
            value={product.heroCount || ''}
            onChange={handleChange}
            min="0"
          />
        </div>

        {/* Deskripsi */}
        <div className="form-group">
          <label htmlFor="description">Deskripsi Produk</label>
          <textarea
            id="description"
            name="description"
            placeholder="Jelaskan detail produk, fitur, keunggulan, dan informasi penting lainnya..."
            value={product.description}
            onChange={handleChange}
            rows={4}
          ></textarea>
        </div>

        {/* Upload Gambar */}
        <div className="form-group">
          <label htmlFor="image">Gambar Produk (Opsional)</label>
          <div className="file-upload">
            <input
              type="file"
              id="image"
              onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
              accept="image/*"
            />
            <label htmlFor="image" className="file-label">
              <i className="fas fa-cloud-upload-alt"></i>
              {preview ? 'Ganti Gambar' : 'Pilih Gambar'}
            </label>
          </div>
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
              <button 
                type="button" 
                className="remove-image"
                onClick={() => handleImageChange(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tombol Submit */}
      <button
        type="submit"
        className="submit-btn"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            Menambahkan...
          </>
        ) : (
          <>
            <i className="fas fa-plus"></i>
            Tambah Produk
          </>
        )}
      </button>

      <style jsx>{`
        .product-form {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          padding: 30px;
          border-radius: 24px;
          border: 1px solid rgba(58, 237, 100, 0.3);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          border-top: 2px solid rgba(58, 237, 100, 0.5);
        }

        .product-form:hover {
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .form-header {
          margin-bottom: 25px;
          text-align: center;
        }

        .form-header h3 {
          font-size: 22px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #e9f9e6;
        }

        .form-header h3 i {
          color: #0bd44c;
        }

        .form-subtitle {
          color: #9bb08a;
          font-size: 14px;
        }

        .form-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 14px;
          color: #9bb08a;
          font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px 15px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          color: #e9f9e6;
          font-size: 14px;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #0bd44c;
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 0 2px rgba(11, 212, 76, 0.1);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #9bb08a;
          opacity: 0.7;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .file-upload {
          position: relative;
        }

        .file-upload input[type="file"] {
          position: absolute;
          left: -9999px;
          opacity: 0;
        }

        .file-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(11, 212, 76, 0.1);
          color: #0bd44c;
          border: 1px dashed rgba(11, 212, 76, 0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .file-label:hover {
          background: rgba(11, 212, 76, 0.2);
          border-color: rgba(11, 212, 76, 0.5);
        }

        .image-preview {
          position: relative;
          margin-top: 10px;
          max-width: 200px;
        }

        .image-preview img {
          width: 100%;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .remove-image {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 0, 0, 0.8);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #3aed47, #0bd44c);
          color: white;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 10px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(58, 237, 100, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .product-form {
            padding: 20px;
            border-radius: 16px;
          }

          .form-header h3 {
            font-size: 20px;
          }

          .form-content {
            gap: 15px;
          }
        }
      `}</style>
    </form>
  )
}