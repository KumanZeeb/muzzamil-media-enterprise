'use client'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text fade-in">
          <h2>Jual & Beli Akaun Social Media Premium</h2>
          <p>Safe, trusted, and fast process. Lebih dari 100 transaksi berjaya dengan rating 4.9/5.</p>
        </div>
        <div className="badges">
          <div className="badge fade-in delay-1">
            <i className="fas fa-shield-alt" style={{color: '#3a7bed'}}></i> 
            Verified Seller
          </div>
          <div className="badge fade-in delay-2">
            <i className="fas fa-certificate" style={{color: '#0b6bd4'}}></i> 
            7 Days Guarantee / Jaminan
          </div>
          <div className="badge fade-in delay-3">
            <i className="fas fa-headset" style={{color: '#0e5ee9'}}></i> 
            24/7 Support / Sokongan
          </div>
          <div className="badge fade-in delay-4">
            <i className="fas fa-credit-card" style={{color: '#3a93ed'}}></i> 
            Secure Payment / Bayaran Selamat
          </div>
        </div>
        <div className="cta-row">
          <a href="#produk" className="btn btn-primary fade-in delay-3">
            <i className="fas fa-store"></i> 
            View Stock / Lihat Stok
          </a>
          <a href="#kontak" className="btn btn-outline fade-in delay-4">
            <i className="fas fa-comment-dots"></i> 
            Contact Admin / Hubungi Admin
          </a>
        </div>
      </div>
    </section>
  )
}