'use client'
import { useState } from 'react'
import { Product } from '../types/product'

export interface ProductCardProps extends Product {
  viewMode?: 'grid' | 'list'
  isAdmin?: boolean
  onDelete?: () => void
  onEdit?: () => void
}

export default function ProductCard({
  name,
  category,
  game,
  stock,
  level,
  server,
  price,
  image,
  heroCount,
  rank,
  description,
  viewMode = 'grid',
  isAdmin = false,
  onDelete,
  onEdit
}: ProductCardProps) {
  // Handle image error dengan state
  const [imgSrc, setImgSrc] = useState(image || '/logo.png')
  const [imgError, setImgError] = useState(false)
  
  const handleImageError = () => {
    if (!imgError) {
      setImgSrc('/logo.png')
      setImgError(true)
    }
  }

  const formatPrice = (price: number) => {
    return `RM ${price.toLocaleString('my-MY', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      numberingSystem: 'latn',
      useGrouping: true
    })}`
  }

  // Fungsi untuk membuka WhatsApp dengan pesan produk
  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault()

    const orderId = `ORD-${String(Date.now()).slice(-6)}`
    const ts = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' })

    const message = `
  🧾 *ORDER BARU*
  Order ID : ${orderId}
  Waktu    : ${ts}

  ━━━━━━━━━━━━━━━
  🛒 Produk : ${name}
  💰 Harga  : ${formatPrice(price)}
  📦 Status : ${stock === 'ready' ? 'Ready Stock ✅' : 'Preorder ⏳'}
  ━━━━━━━━━━━━━━━

  🙏 Mohon konfirmasi ketersediaan & detail pembayaran.
  Terima kasih banyak 🙌
  *(Pesan otomatis dari website)*
  `

    window.open(
      `https://wa.me/60178031775?text=${encodeURIComponent(message)}`,
      '_blank'
    )
  }

  return (
    <article
      className={`
        product
        ${viewMode === 'grid' ? 'product-grid' : 'product-list'}
        ${stock === 'ready' ? 'stock-ready' : 'stock-preorder'}
      `}
      data-game={game}
      data-stock={stock}
    >
      {/* Media/Image Section */}
      <div className="product-media">
        <img
          src={imgSrc}
          alt={name}
          onError={handleImageError}
          loading="lazy"
        />
        <div className="media-overlay"></div>
        
        {/* Stock Badge */}
        <div className={`stock-tag ${stock === 'ready' ? 'ready' : 'preorder'}`}>
          <i className={`fas ${stock === 'ready' ? 'fa-check-circle' : 'fa-clock'}`}></i>
          {stock === 'ready' ? 'Ready' : 'Pre-order'}
        </div>
      </div>

      {/* Body/Content Section */}
      <div className="product-body">
        {/* Product Name */}
        <h4>{name}</h4>

        {/* Meta Information */}
        <div className="meta">
          {server && (
            <span><i className="fas fa-server"></i> {server}</span>
          )}
          {level !== undefined && (
            <span><i className="fas fa-level-up-alt"></i> Level {level}</span>
          )}
          {heroCount && (
            <span><i className="fas fa-user"></i> Hero: {heroCount}+</span>
          )}
          {rank && (
            <span><i className="fas fa-trophy"></i> {rank}</span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="product-description">{description}</p>
        )}

        {/* Price */}
        <div className="price">{formatPrice(price)}</div>

        {/* Buy Row */}
        <div className="buy-row">
          <div className={`stock-indicator ${stock === 'ready' ? 'ready' : 'preorder'}`}>
            <i className={`fas ${stock === 'ready' ? 'fa-check-circle' : 'fa-clock'}`}></i>
            {stock === 'ready' ? 'Ready' : 'Pre-order'}
          </div>
          
          {isAdmin ? (
            <div className="admin-actions">
              <button className="btn-edit" onClick={onEdit}>
                <i className="fas fa-edit"></i> Edit
              </button>
              <button className="btn-delete" onClick={onDelete}>
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          ) : (
            <a 
              className="buy" 
              href="#kontak"
              onClick={handleBuyClick}
            >
              <i className={`fas ${stock === 'ready' ? 'fa-shopping-cart' : 'fa-clock'}`}></i>
              {stock === 'ready' ? 'Beli' : 'Pesan'}
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        .product {
          background: linear-gradient(180deg, rgba(255,255,255,0.03), transparent);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.3s ease;
          position: relative;
          box-shadow: 0 2px 16px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .product:hover {
          transform: translateY(-5px);
          border-color: rgba(58, 123, 237, 0.3);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .product-grid {
          max-width: 100%;
        }

        .product-list {
          flex-direction: row;
        }

        .product-media {
          height: 160px;
          position: relative;
          overflow: hidden;
        }

        .product-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product:hover .product-media img {
          transform: scale(1.1);
        }

        .media-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 60%, #182230);
        }

        .stock-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 5px;
          z-index: 2;
        }

        .stock-tag.ready {
          background: rgba(16, 105, 185, 0.2);
          color: #1069b9;
        }

        .stock-tag.preorder {
          background: rgba(11, 143, 243, 0.2);
          color: #0b8ff3;
        }

        .product-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex-grow: 1;
        }

        .product-body h4 {
          font-size: 18px;
          font-weight: 600;
          line-height: 1.3;
          color: #e6f0ff;
          margin: 0;
        }

        .meta {
          display: flex;
          gap: 12px;
          align-items: center;
          font-size: 14px;
          color: #8aa0c8;
          flex-wrap: wrap;
        }

        .meta span {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .product-description {
          color: #8aa0c8;
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .price {
          color: #0b6bd4;
          font-weight: 700;
          font-size: 20px;
          margin: 5px 0;
        }

        .buy-row {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-top: 10px;
        }

        .stock-indicator {
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .stock-indicator.ready {
          color: #1069b9;
        }

        .stock-indicator.preorder {
          color: #0b8ff3;
        }

        .buy {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          background: linear-gradient(135deg, #3a7bed, #0b6bd4);
          color: white;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .buy:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(58, 123, 237, 0.3);
        }

        .admin-actions {
          display: flex;
          gap: 8px;
          flex: 1;
        }

        .btn-edit, .btn-delete {
          padding: 10px 15px;
          border-radius: 8px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-size: 14px;
        }

        .btn-edit {
          background: rgba(58, 123, 237, 0.2);
          color: #3a7bed;
          border: 1px solid rgba(58, 123, 237, 0.3);
        }

        .btn-edit:hover {
          background: rgba(58, 123, 237, 0.3);
        }

        .btn-delete {
          background: rgba(255, 0, 0, 0.2);
          color: #ff6b6b;
          border: 1px solid rgba(255, 0, 0, 0.3);
        }

        .btn-delete:hover {
          background: rgba(255, 0, 0, 0.3);
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .product-list {
            flex-direction: column;
          }
          
          .meta {
            gap: 8px;
          }
          
          .meta span {
            font-size: 12px;
          }
          
          .buy-row {
            flex-direction: column;
          }
          
          .stock-indicator {
            align-self: flex-start;
          }
          
          .buy, .admin-actions {
            width: 100%;
          }
        }
      `}</style>
    </article>
  )
}