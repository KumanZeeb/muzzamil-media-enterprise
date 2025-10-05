'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        router.push('/admin/dashboard')
      }
    }
    checkUser()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      router.push('/admin/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <span>🔒</span>
          </div>
          <h1>Admin Login</h1>
          <p>Masuk ke dashboard administrator</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="login-input"
            />
            <label className="input-label">Email</label>
            <div className="input-icon">📧</div>
          </div>
          
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="login-input"
            />
            <label className="input-label">Password</label>
            <div className="input-icon">🔒</div>
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          
          <button type="submit" disabled={loading} className="login-button">
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <span>Login</span>
                <div className="login-icon">→</div>
              </>
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>© 2023 Epol Stock • Premium Gaming Services</p>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a1f17 0%, #0c291e 50%, #0d2e21 100%);
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .login-container {
          background: rgba(18, 38, 30, 0.9);
          border-radius: 16px;
          padding: 2.5rem;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 10px 30px rgba(0, 40, 20, 0.5),
                      0 0 0 1px rgba(46, 204, 113, 0.1),
                      0 0 20px rgba(46, 204, 113, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(46, 204, 113, 0.2);
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .logo {
          width: 70px;
          height: 70px;
          margin: 0 auto 1rem;
          background: linear-gradient(135deg, rgba(46, 204, 113, 0.2) 0%, rgba(39, 174, 96, 0.1) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          border: 1px solid rgba(46, 204, 113, 0.3);
          box-shadow: 0 0 15px rgba(46, 204, 113, 0.3);
        }
        
        h1 {
          color: #e8f5e8;
          margin: 0 0 0.5rem;
          font-size: 1.8rem;
          font-weight: 700;
          text-shadow: 0 0 10px rgba(46, 204, 113, 0.5);
        }
        
        .login-header p {
          color: #a7c6a7;
          margin: 0;
          font-size: 0.9rem;
        }
        
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .input-group {
          position: relative;
        }
        
        .login-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 1px solid rgba(46, 204, 113, 0.3);
          border-radius: 10px;
          background: rgba(15, 30, 24, 0.8);
          color: #e8f5e8;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3),
                      0 0 0 1px transparent;
        }
        
        .login-input:focus {
          outline: none;
          border-color: #2ecc71;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3),
                      0 0 0 1px #2ecc71,
                      0 0 15px rgba(46, 204, 113, 0.4);
        }
        
        .login-input:focus + .input-label,
        .login-input:not(:placeholder-shown) + .input-label {
          top: -10px;
          left: 15px;
          font-size: 0.8rem;
          background: linear-gradient(135deg, #0a1f17, #0c291e);
          padding: 0 8px;
          color: #2ecc71;
          text-shadow: 0 0 5px rgba(46, 204, 113, 0.5);
        }
        
        .input-label {
          position: absolute;
          top: 1rem;
          left: 3rem;
          color: #a7c6a7;
          pointer-events: none;
          transition: all 0.3s ease;
          font-size: 1rem;
        }
        
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #2ecc71;
          font-size: 1.1rem;
        }
        
        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #a7c6a7;
          cursor: pointer;
          font-size: 1.1rem;
          padding: 0;
          transition: color 0.3s ease;
        }
        
        .password-toggle:hover {
          color: #2ecc71;
        }
        
        .login-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 1rem;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(46, 204, 113, 0.4),
                      0 0 15px rgba(46, 204, 113, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .login-button:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: 0.5s;
        }
        
        .login-button:hover:before {
          left: 100%;
        }
        
        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(46, 204, 113, 0.5),
                      0 0 20px rgba(46, 204, 113, 0.4);
        }
        
        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .login-icon {
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }
        
        .login-button:hover .login-icon {
          transform: translateX(4px);
        }
        
        .login-footer {
          margin-top: 2rem;
          text-align: center;
        }
        
        .login-footer p {
          color: #5a7d5a;
          font-size: 0.8rem;
          margin: 0;
        }
        
        @media (max-width: 480px) {
          .login-container {
            padding: 1.5rem;
          }
          
          h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}