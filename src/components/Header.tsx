import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      alert(`搜索：${searchValue}`)
    }
  }

  return (
    <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb' }}>
      {/* Top utility bar */}
      <div style={{ background: '#f0f4fa', borderBottom: '1px solid #dde3ef' }}>
        <div className="container-main" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '6px 16px', gap: '16px', fontSize: '12px', color: '#666' }}>
          <a href="#" style={{ color: '#555' }}>English</a>
          <span style={{ color: '#ddd' }}>|</span>
          <a href="#" style={{ color: '#555' }}>旧版回顾</a>
          <span style={{ color: '#ddd' }}>|</span>
          <a href="#" style={{ color: '#555' }}>网站地图</a>
          <span style={{ color: '#ddd' }}>|</span>
          <a href="#" style={{ color: '#555' }}>邮箱登录</a>
        </div>
      </div>

      {/* Main header */}
      <div className="container-main" style={{ display: 'flex', alignItems: 'center', padding: '16px', gap: '24px', flexWrap: 'wrap' }}>
        {/* Logo + School Name */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
          {/* Logo SVG */}
          <div style={{
            width: '64px',
            height: '64px',
            background: 'var(--color-primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <svg viewBox="0 0 64 64" width="64" height="64" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="#003087"/>
              {/* Gear outer */}
              <circle cx="32" cy="32" r="22" fill="none" stroke="#FFD700" strokeWidth="2"/>
              {/* Torch */}
              <rect x="30" y="16" width="4" height="18" rx="2" fill="#FFD700"/>
              <polygon points="32,10 28,18 36,18" fill="#C8102E"/>
              {/* Leaves */}
              <path d="M18,38 Q24,30 32,32 Q24,36 22,44 Z" fill="#FFD700" opacity="0.8"/>
              <path d="M46,38 Q40,30 32,32 Q40,36 42,44 Z" fill="#FFD700" opacity="0.8"/>
              {/* Bottom text bar */}
              <rect x="14" y="46" width="36" height="6" rx="1" fill="#C8102E"/>
              <text x="32" y="51" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">广师大</text>
            </svg>
          </div>

          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-primary)', lineHeight: 1.2, letterSpacing: '2px' }}>
              广东技术师范大学
            </div>
            <div style={{ fontSize: '0.7rem', color: '#666', letterSpacing: '1px', marginTop: '3px' }}>
              GUANGDONG POLYTECHNIC NORMAL UNIVERSITY
            </div>
          </div>
        </Link>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Right side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
          {/* Quick links */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { label: '在校学生', color: '#003087' },
              { label: '教职员工', color: '#005a9e' },
              { label: '校友', color: '#C8102E' },
              { label: '访客', color: '#555' },
            ].map(item => (
              <a
                key={item.label}
                href="#"
                style={{
                  padding: '5px 14px',
                  background: item.color,
                  color: 'white',
                  borderRadius: '3px',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseOut={e => (e.currentTarget.style.opacity = '1')}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0' }}>
            <input
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="搜索站内内容..."
              style={{
                padding: '7px 14px',
                border: '1px solid #ccc',
                borderRight: 'none',
                borderRadius: '4px 0 0 4px',
                fontSize: '13px',
                outline: 'none',
                width: '220px',
                fontFamily: 'inherit'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '7px 16px',
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '0 4px 4px 0',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'inherit'
              }}
            >
              搜索
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
