'use client'

import { useState, useEffect } from 'react'

export default function HeaderNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`header-navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Branding */}
      <div className="brand">
        <div className="brand-text">
          <h1>Muzzammil Media Enterprise</h1>
          <p>Premium Portal - Jual Akaun Social media</p>
        </div>
      </div>

      {/* Mobile menu button - Hamburger Icon Modern */}
      <button
        className={`hamburger-menu ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Navbar links */}
      <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <a href="#produk">
          <i className="fas fa-gamepad"></i> 
          <span>Produk / Products</span>
        </a>
        <a href="#feedback">
          <i className="fas fa-star"></i> 
          <span>Feedback / Ulasan</span>
        </a>
        <a href="#faq">
          <i className="fas fa-question-circle"></i> 
          <span>FAQ / Soalan Lazim</span>
        </a>
        <a href="#kontak">
          <i className="fas fa-headset"></i> 
          <span>Contact / Hubungi</span>
        </a>
      </nav>

      <style jsx>{`
        .header-navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          background: rgba(17, 17, 17, 0.95);
          color: #fff;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .header-navbar.scrolled {
          padding: 0.7rem 2rem;
          background: rgba(17, 17, 17, 0.98);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 1001;
        }

        .logo img {
          height: 40px;
          width: auto;
          transition: transform 0.3s ease;
        }
        
        .logo:hover img {
          transform: scale(1.05);
        }

        .brand-text h1 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 700;
          background: linear-gradient(45deg, rgba(20, 160, 80, .95) 0%,, rgba(20, 160, 80, .95) 0%,);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          transition: all 0.3s ease;
        }
        
        .brand:hover h1 {
          background: linear-gradient(45deg, rgba(20, 160, 80, .95) 0%,, rgba(20, 160, 80, .95) 0%,);
          -webkit-background-clip: text;
        }

        .brand-text p {
          margin: 0;
          font-size: 0.8rem;
          color: #aaa;
        }

        /* Hamburger Menu Styling */
        .hamburger-menu {
          display: none;
          flex-direction: column;
          justify-content: space-around;
          width: 30px;
          height: 25px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 1001;
        }
        
        .hamburger-menu span {
          width: 100%;
          height: 3px;
          background: #fff;
          border-radius: 2px;
          transition: all 0.3s ease;
          transform-origin: center;
        }
        
        .hamburger-menu.active span:nth-child(1) {
          transform: translateY(9px) rotate(45deg);
        }
        
        .hamburger-menu.active span:nth-child(2) {
          opacity: 0;
        }
        
        .hamburger-menu.active span:nth-child(3) {
          transform: translateY(-9px) rotate(-45deg);
        }

        .nav-links {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .nav-links a {
          color: #fff;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.8rem;
          border-radius: 6px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .nav-links a:before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(45deg, rgba(20, 160, 80, .95) 0%,, rgba(20, 160, 80, .95) 0%,);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }
        
        .nav-links a:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .nav-links a:hover:before {
          transform: translateX(0);
        }
        
        .nav-links a i {
          font-size: 1.1rem;
          transition: transform 0.3s ease;
        }
        
        .nav-links a:hover i {
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .header-navbar {
            padding: 1rem;
          }
          
          .hamburger-menu {
            display: flex;
          }

          .nav-links {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(17, 17, 17, 0.98);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2rem;
            transition: all 0.4s ease;
            clip-path: circle(0px at calc(100% - 40px) 40px);
            -webkit-clip-path: circle(0px at calc(100% - 40px) 40px);
          }
          
          .nav-links.active {
            clip-path: circle(150% at calc(100% - 40px) 40px);
            -webkit-clip-path: circle(150% at calc(100% - 40px) 40px);
          }

          .nav-links a {
            font-size: 1.2rem;
            padding: 1rem 2rem;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s ease;
          }
          
          .nav-links.active a {
            opacity: 1;
            transform: translateY(0);
          }
          
          .nav-links.active a:nth-child(1) {
            transition-delay: 0.1s;
          }
          
          .nav-links.active a:nth-child(2) {
            transition-delay: 0.2s;
          }
          
          .nav-links.active a:nth-child(3) {
            transition-delay: 0.3s;
          }
          
          .nav-links.active a:nth-child(4) {
            transition-delay: 0.4s;
          }
        }
      `}</style>
    </header>
  )
}