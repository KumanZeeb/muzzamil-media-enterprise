'use client'

import { useEffect, useState } from 'react'
import { Product } from './types/product'
import { supabase } from './lib/supabaseClient'

import HeaderNavbar from './components/HeaderNavbar'
import Hero from './components/Hero'
import ProductCard from './components/ProductCard'
import ProductFilter from './components/ProductFilter'
import FAQList from './components/FAQList'
import ContactPanel from './components/ContactPanel'
import BackToTop from './components/BackToTop'
import Footer from './components/Footer'

type Feedback = {
  id: number
  name: string
  message: string
  image?: string
  created_at?: string
}

export default function Page() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loadingFeedback, setLoadingFeedback] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*')
      if (!error && data) {
        setProducts(data)
        setFilteredProducts(data)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setFeedbacks(data)
      }
      setLoadingFeedback(false)
    }

    fetchFeedbacks()
  }, [])

  const handleFilter = (q: string, game: string, stock: string) => {
    const filtered = products.filter((p) => {
      const matchQ =
        q === '' ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        (p.server && p.server.toLowerCase().includes(q.toLowerCase()))
      const matchGame = game === 'all' || p.game === game
      const matchStock = stock === 'all' || p.stock === stock
      return matchQ && matchGame && matchStock
    })
    setFilteredProducts(filtered)
  }

  return (
    <>
      <HeaderNavbar />
      <main className="main">
        <Hero />

        {/* Produk Section */}
        <section className="panel" id="produk">
          <h3>
            <i className="fas fa-gamepad"></i> Stok Akaun & Pakej Perkhidmatan
          </h3>
          <ProductFilter onFilter={handleFilter} />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="products">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <ProductCard key={p.id} {...p} isAdmin={false} viewMode="grid" />
              ))
            ) : (
              <p className="text-center text-gray-400 col-span-full">
                Produk tidak ada
              </p>
            )}
          </div>
        </section>

        {/* 💬 Feedback Gallery */}
        <section className="panel feedback-section" id="feedback">
          <h3>
            <i className="fas fa-images"></i> Feedback Gallery
          </h3>

          {loadingFeedback ? (
            <p className="text-gray-400 text-center">Loading feedback...</p>
          ) : feedbacks.length === 0 ? (
            <p className="text-gray-400 text-center">Belum ada feedback 😭</p>
          ) : (
            <div className="feedback-grid">
              {feedbacks.map((f) => (
                <div key={f.id} className="feedback-card">
                  {f.image && (
                    <img
                      src={f.image}
                      alt={f.name || 'feedback'}
                      className="feedback-image"
                    />
                  )}
                  <div className="feedback-body">
                    <p className="feedback-author">
                      <strong>{f.name || 'Anonim'}</strong>{' '}
                      <span className="feedback-date">
                        {new Date(f.created_at || '').toLocaleDateString()}
                      </span>
                    </p>
                    <p className="feedback-message">"{f.message}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FAQ */}
        <section className="panel" id="faq">
          <h3>
            <i className="fas fa-question-circle"></i> FAQ / Soalan Lazim
          </h3>
          <FAQList />
        </section>

        <ContactPanel />
        <BackToTop />
      </main>
      <Footer />

      <style jsx>{`
        .feedback-section {
          margin-top: 40px;
        }

        .feedback-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .feedback-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.25s ease;
        }

        .feedback-card:hover {
          transform: translateY(-5px);
          border-color: rgba(58, 123, 237, 0.3);
        }

        .feedback-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .feedback-body {
          padding: 15px;
        }

        .feedback-author {
          font-size: 0.95rem;
          color: var(--text);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .feedback-date {
          color: var(--muted);
          font-size: 0.8rem;
        }

        .feedback-message {
          color: var(--muted);
          font-style: italic;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .feedback-grid {
            grid-template-columns: 1fr;
          }

          .feedback-image {
            height: 160px;
          }

          .feedback-message {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  )
}
