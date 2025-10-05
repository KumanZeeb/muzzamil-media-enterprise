'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import ProductForm from '../../components/ProductForm'
import ProductCard from '../../components/ProductCard'
import { Product } from '../../types/product'

type Feedback = {
  id: number
  name: string
  message: string
  image?: string
  created_at?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingFeedback, setLoadingFeedback] = useState(false)

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isFormExpanded, setIsFormExpanded] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'description' | 'date'>('name')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // ✅ Auth check
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/admin/login')
      } else {
        setUser(data.user)
      }
    }
    checkAuth()
  }, [router])

  // ✅ Fetch products
  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*')
    if (error) console.error('Fetch error:', error)
    else setProducts(data as Product[])
    setLoading(false)
  }

  // ✅ Fetch feedbacks
  const fetchFeedbacks = async () => {
    setLoadingFeedback(true)
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error('Fetch feedback error:', error)
    else setFeedbacks(data as Feedback[])
    setLoadingFeedback(false)
  }

  useEffect(() => {
    fetchProducts()
    fetchFeedbacks()
  }, [])

  // ✅ Handle submit (tambah / edit produk)
  const handleSubmit = async (productData: Partial<Product>) => {
    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id)

      if (error) {
        console.error('Gagal update:', error)
        alert('Gagal update produk')
      } else {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? { ...p, ...productData } : p
          )
        )
        setEditingProduct(null)
        setIsFormExpanded(false)
      }
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()

      if (error) {
        console.error('Gagal tambah:', error)
        alert('Gagal tambah produk')
      } else if (data) {
        setProducts((prev) => [...prev, data[0]])
        setIsFormExpanded(false)
      }
    }
  }

  // ✅ Handle delete
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      console.error('Gagal hapus:', error)
      alert('Gagal hapus produk: ' + error.message)
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  // ✅ Filter + sort
  const filteredProducts = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'description')
        return (a.description || '').localeCompare(b.description || '')
      return (
        new Date(a.created_at || 0).getTime() -
        new Date(b.created_at || 0).getTime()
      )
    })

  if (!user) return <p className="loading-text">Checking auth...</p>

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <button
          className="menu-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <button className="notification-btn">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/admin/login')
            }}
            className="logout-btn"
          >
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="admin-content">
        {/* Product Stats */}
        <div className="stats-grid">
          {[
            { icon: '📦', value: products.length, label: 'Total Products' },
            { icon: '💰', value: 24, label: 'Total Sales' },
            { icon: '⭐', value: 4.8, label: 'Average Rating' }
          ].map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Product Form */}
        <div className="admin-panel">
          <div className="panel-header">
            <h2>
              <i className={`fas ${editingProduct ? 'fa-edit' : 'fa-plus'}`}></i>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              className="toggle-btn"
              onClick={() => {
                if (editingProduct) {
                  setEditingProduct(null)
                } else {
                  setIsFormExpanded(!isFormExpanded)
                }
              }}
            >
              {editingProduct ? 'Cancel' : isFormExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
          {(isFormExpanded || editingProduct) && (
            <div className="panel-body">
              <ProductForm
                key={editingProduct ? editingProduct.id : 'new'}
                onProductAdded={handleSubmit}
              />
            </div>
          )}
        </div>

        {/* Product List */}
        <div className="admin-panel">
          <div className="panel-header">
            <h2>
              <i className="fas fa-list"></i>
              Product List
              <span className="count-badge">{products.length}</span>
            </h2>

            {/* Controls */}
            <div className="controls">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="control-select"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="description">Sort by Description</option>
                <option value="date">Sort by Date</option>
              </select>
              
              <div className="view-toggle">
                <button
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'active' : ''}
                >
                  <i className="fas fa-th"></i>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'active' : ''}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
              
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading products...</p>
            </div>
          ) : (
            <>
              <div className={`products-container ${viewMode}`}>
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    {...p}
                    viewMode={viewMode}
                    isAdmin={true}
                    onDelete={() => handleDelete(p.id)}
                    onEdit={() => {
                      setEditingProduct(p)
                      setIsFormExpanded(true)
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* 💬 Feedback Form */}
        <div className="admin-panel">
          <div className="panel-body">
            <h2>
              <i className="fas fa-comment"></i>
              Kirim Feedback
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const name = formData.get('name') as string
                const message = formData.get('message') as string
                const image = formData.get('image') as File

                if (!name || !message) {
                  alert('Isi dulu nama sama pesannya bre!')
                  return
                }

                let imageUrl = null
                if (image && image.size > 0) {
                  const fileName = `${Date.now()}-${image.name}`
                  const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('feedbacks')
                    .upload(fileName, image)

                  if (uploadError) {
                    alert('Gagal upload gambar 😢')
                    return
                  }

                  const { data: publicUrl } = supabase.storage
                    .from('feedbacks')
                    .getPublicUrl(uploadData.path)
                  imageUrl = publicUrl.publicUrl
                }

                const { error } = await supabase.from('feedbacks').insert([
                  { name, message, image: imageUrl }
                ])

                if (error) {
                  alert('Gagal kirim feedback!')
                } else {
                  alert('Feedback terkirim 🫶')
                  e.currentTarget.reset()
                  fetchFeedbacks()
                }
              }}
              className="feedback-form"
            >
              <div className="form-row">
                <input
                  name="name"
                  type="text"
                  placeholder="Masukkan nama lu..."
                  className="form-input"
                />
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="file-input"
                />
              </div>

              <textarea
                name="message"
                placeholder="Tulis pesan feedback lu di sini..."
                className="form-textarea"
              />

              <button type="submit" className="submit-btn">
                <i className="fas fa-paper-plane"></i>
                Kirim Feedback
              </button>
            </form>
          </div>

          {/* Feedback Gallery */}
          <div className="panel-body">
            <h2>
              <i className="fas fa-images"></i>
              Feedback Gallery
            </h2>

            {loadingFeedback ? (
              <p className="loading-text">Loading feedback...</p>
            ) : feedbacks.length === 0 ? (
              <p className="empty-state">Belum ada feedback 😭</p>
            ) : (
              <div className="feedback-gallery">
                {feedbacks.map((f) => (
                  <div key={f.id} className="feedback-card">
                    {f.image && (
                      <img
                        src={f.image}
                        alt="feedback"
                        className="feedback-image"
                      />
                    )}
                    <p className="feedback-message">"{f.message}"</p>
                    <p className="feedback-author">— {f.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }

        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 20px;
          background: rgba(15, 21, 32, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(58, 123, 237, 0.3);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: var(--shadow);
        }

        .menu-toggle {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
        }

        .menu-toggle span {
          width: 25px;
          height: 3px;
          background: var(--accent-1);
          border-radius: 2px;
          transition: var(--transition);
        }

        .menu-toggle:hover span:nth-child(1) {
          width: 30px;
        }

        .menu-toggle:hover span:nth-child(3) {
          width: 20px;
        }

        .admin-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(90deg, var(--accent-1), var(--accent-2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .notification-btn {
          position: relative;
          background: none;
          border: none;
          color: var(--text);
          font-size: 1.2rem;
          cursor: pointer;
          padding: 5px;
        }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--accent-1);
          color: white;
          font-size: 0.7rem;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logout-btn {
          background: var(--accent-1);
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: var(--radius);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
        }

        .logout-btn:hover {
          background: var(--accent-2);
          transform: translateY(-2px);
        }

        .admin-content {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: var(--glass);
          backdrop-filter: var(--blur);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: var(--transition);
          box-shadow: var(--shadow);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          border-color: rgba(58, 123, 237, 0.3);
          box-shadow: var(--shadow-hover);
        }

        .stat-icon {
          font-size: 2.5rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(58, 123, 237, 0.1);
          border-radius: 50%;
        }

        .stat-content h3 {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text);
          margin: 0;
        }

        .stat-content p {
          color: var(--muted);
          margin: 5px 0 0 0;
          font-size: 0.9rem;
        }

        .admin-panel {
          background: var(--glass);
          backdrop-filter: var(--blur);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          padding: 25px;
          margin-bottom: 25px;
          box-shadow: var(--shadow);
          transition: var(--transition);
        }

        .admin-panel:hover {
          border-color: rgba(58, 123, 237, 0.2);
          box-shadow: var(--shadow-hover);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .panel-header h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.3rem;
          color: var(--text);
          margin: 0;
        }

        .panel-header h2 i {
          color: var(--accent-2);
        }

        .count-badge {
          background: rgba(58, 123, 237, 0.2);
          color: var(--accent-1);
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .toggle-btn {
          background: rgba(58, 123, 237, 0.1);
          border: 1px solid rgba(58, 123, 237, 0.3);
          color: var(--accent-1);
          padding: 8px 15px;
          border-radius: var(--radius);
          cursor: pointer;
          transition: var(--transition);
          font-size: 0.9rem;
        }

        .toggle-btn:hover {
          background: rgba(58, 123, 237, 0.2);
        }

        .controls {
          display: flex;
          gap: 15px;
          align-items: center;
          flex-wrap: wrap;
        }

        .control-select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text);
          padding: 8px 12px;
          border-radius: var(--radius);
          cursor: pointer;
          transition: var(--transition);
        }

        .control-select:focus {
          outline: none;
          border-color: var(--accent-1);
        }

        .view-toggle {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius);
          padding: 4px;
        }

        .view-toggle button {
          background: none;
          border: none;
          color: var(--muted);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition);
        }

        .view-toggle button.active {
          background: var(--accent-1);
          color: white;
        }

        .view-toggle button:hover:not(.active) {
          background: rgba(255, 255, 255, 0.1);
        }

        .search-box {
          position: relative;
          min-width: 200px;
        }

        .search-box i {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
        }

        .search-box input {
          width: 100%;
          padding: 8px 12px 8px 35px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius);
          color: var(--text);
          transition: var(--transition);
        }

        .search-box input:focus {
          outline: none;
          border-color: var(--accent-1);
        }

        .products-container.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .products-container.list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .loading-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--muted);
        }

        .loading-state i {
          font-size: 2rem;
          margin-bottom: 15px;
          color: var(--accent-1);
        }

        .loading-text {
          color: var(--accent-1);
          text-align: center;
          padding: 20px;
        }

        .empty-state {
          color: var(--muted);
          text-align: center;
          padding: 40px 20px;
          font-style: italic;
        }

        .feedback-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .form-input, .file-input, .form-textarea {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius);
          padding: 12px 15px;
          color: var(--text);
          transition: var(--transition);
          flex: 1;
          min-width: 200px;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--accent-1);
        }

        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .file-input {
          background: rgba(58, 123, 237, 0.1);
          border: 1px solid rgba(58, 123, 237, 0.3);
          color: var(--accent-1);
        }

        .submit-btn {
          background: var(--accent-1);
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: var(--radius);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          width: fit-content;
        }

        .submit-btn:hover {
          background: var(--accent-2);
          transform: translateY(-2px);
        }

        .feedback-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .feedback-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius);
          padding: 20px;
          transition: var(--transition);
        }

        .feedback-card:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-3px);
        }

        .feedback-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: var(--radius);
          margin-bottom: 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .feedback-message {
          color: var(--text);
          font-style: italic;
          margin-bottom: 10px;
          line-height: 1.5;
        }

        .feedback-author {
          color: var(--muted);
          font-size: 0.9rem;
          text-align: right;
          margin: 0;
        }

        .panel-body {
          margin-bottom: 30px;
        }

        .panel-body:last-child {
          margin-bottom: 0;
        }

        .panel-body h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.2rem;
          color: var(--text);
          margin-bottom: 20px;
        }

        .panel-body h2 i {
          color: var(--accent-2);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .admin-content {
            padding: 15px;
          }

          .panel-header {
            flex-direction: column;
            align-items: stretch;
          }

          .controls {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            min-width: auto;
          }

          .form-row {
            flex-direction: column;
          }

          .form-input, .file-input {
            min-width: auto;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .products-container.grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .admin-header {
            padding: 10px 15px;
          }

          .admin-header h1 {
            font-size: 1.3rem;
          }

          .admin-panel {
            padding: 20px;
          }

          .stat-card {
            padding: 15px;
          }

          .stat-icon {
            font-size: 2rem;
            width: 50px;
            height: 50px;
          }

          .stat-content h3 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}