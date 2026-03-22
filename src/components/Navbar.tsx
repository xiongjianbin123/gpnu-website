import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface NavItem {
  label: string
  path?: string
  children?: { label: string; path: string }[]
}

const navItems: NavItem[] = [
  {
    label: '学校概况',
    children: [
      { label: '学校简介', path: '#' },
      { label: '历史沿革', path: '#' },
      { label: '现任领导', path: '#' },
      { label: '组织机构', path: '#' },
      { label: '学校章程', path: '#' },
      { label: '校园风光', path: '#' },
    ]
  },
  {
    label: '机构设置',
    children: [
      { label: '职能部门', path: '#' },
      { label: '学院概览', path: '#' },
      { label: '直属单位', path: '#' },
      { label: '附属单位', path: '#' },
    ]
  },
  {
    label: '人才培养',
    children: [
      { label: '本科教育', path: '#' },
      { label: '研究生教育', path: '#' },
      { label: '继续教育', path: '#' },
      { label: '教学成果', path: '#' },
      { label: '一流专业', path: '#' },
    ]
  },
  {
    label: '科学研究',
    children: [
      { label: '科研动态', path: '#' },
      { label: '科研平台', path: '#' },
      { label: '学术期刊', path: '#' },
      { label: '科研成果', path: '#' },
    ]
  },
  {
    label: '招生就业',
    children: [
      { label: '本科招生', path: '#' },
      { label: '研究生招生', path: '#' },
      { label: '就业指导', path: '#' },
      { label: '招聘信息', path: '#' },
    ]
  },
  {
    label: '合作交流',
    children: [
      { label: '国际合作', path: '#' },
      { label: '校企合作', path: '#' },
      { label: '友好院校', path: '#' },
    ]
  },
  {
    label: '校园文化',
    children: [
      { label: '文化活动', path: '#' },
      { label: '学生社团', path: '#' },
      { label: '校园媒体', path: '#' },
      { label: '体育竞技', path: '#' },
    ]
  },
  {
    label: '大学生论坛',
    path: '/forum',
  },
  {
    label: '校园商城',
    path: '/shop',
  },
]

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const location = useLocation()

  const isForumActive = location.pathname.startsWith('/forum')
  const isShopActive = location.pathname.startsWith('/shop')

  return (
    <nav
      style={{
        background: 'var(--color-primary)',
        position: 'relative',
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="container-main" style={{ display: 'flex' }}>
        {navItems.map(item => {
          const isActive = item.path ? location.pathname === item.path || (item.path === '/forum' && isForumActive) || (item.path === '/shop' && isShopActive) : false
          const isOpen = activeMenu === item.label

          return (
            <div
              key={item.label}
              style={{ position: 'relative' }}
              onMouseEnter={() => setActiveMenu(item.label)}
            >
              {item.path ? (
                <Link
                  to={item.path}
                  style={{
                    display: 'block',
                    padding: '16px 18px',
                    color: isActive ? '#FFD700' : 'white',
                    fontSize: '14px',
                    fontWeight: isActive ? '700' : '500',
                    letterSpacing: '0.5px',
                    borderBottom: isActive ? '3px solid #FFD700' : '3px solid transparent',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    background: item.label === '大学生论坛' ? 'rgba(200,16,46,0.85)' : item.label === '校园商城' ? 'rgba(22,100,172,0.7)' : 'transparent'
                  }}
                  onMouseOver={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#FFD700'
                      e.currentTarget.style.borderBottom = '3px solid rgba(255,215,0,0.5)'
                    }
                  }}
                  onMouseOut={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = item.label === '大学生论坛' ? 'white' : 'white'
                      e.currentTarget.style.borderBottom = '3px solid transparent'
                    }
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <div
                  style={{
                    display: 'block',
                    padding: '16px 18px',
                    color: isOpen ? '#FFD700' : 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                    borderBottom: isOpen ? '3px solid #FFD700' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    userSelect: 'none'
                  }}
                >
                  {item.label}
                  <span style={{ marginLeft: '4px', fontSize: '10px', opacity: 0.7 }}>▼</span>
                </div>
              )}

              {/* Dropdown */}
              {item.children && isOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'white',
                  minWidth: '150px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  border: '1px solid #e5e7eb',
                  borderTop: '2px solid var(--color-primary)',
                  zIndex: 999
                }}>
                  {item.children.map(child => (
                    <Link
                      key={child.label}
                      to={child.path}
                      style={{
                        display: 'block',
                        padding: '10px 18px',
                        color: '#333',
                        fontSize: '13px',
                        borderBottom: '1px solid #f5f5f5',
                        transition: 'all 0.15s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.background = '#f0f4fa'
                        e.currentTarget.style.color = 'var(--color-primary)'
                        e.currentTarget.style.paddingLeft = '22px'
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = 'white'
                        e.currentTarget.style.color = '#333'
                        e.currentTarget.style.paddingLeft = '18px'
                      }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
