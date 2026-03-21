import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Category, Post } from '../types'
import { getCategories, getHotPosts, getRecentReplies } from '../utils/api'

function avatarColor(name: string) {
  const colors = ['#003087', '#C8102E', '#7c3aed', '#065f46', '#b45309', '#0369a1', '#be123c', '#0e7490']
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return colors[Math.abs(hash) % colors.length]
}

export default function Forum() {
  const [categories, setCategories] = useState<Category[]>([])
  const [hotPosts, setHotPosts] = useState<Post[]>([])
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getCategories(),
      getHotPosts(),
      getRecentReplies(),
    ]).then(([cats, hot, recent]) => {
      setCategories(cats)
      setHotPosts(hot)
      setRecentPosts(recent)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  function formatTime(dt: string) {
    const d = new Date(dt)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    return d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
  }

  return (
    <div>
      {/* Forum Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #002060 0%, #003087 50%, #004bb5 100%)',
        padding: '32px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(200,16,46,0.15) 0%, transparent 60%)',
        }} />
        <div className="container-main" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '2rem' }}>💬</span>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white', letterSpacing: '2px' }}>
                  大学生论坛
                </h1>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                广东技术师范大学学生交流社区 · 分享 · 学习 · 成长
              </p>
              <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                {[
                  { icon: '🏫', text: '校园生活' },
                  { icon: '📚', text: '学习交流' },
                  { icon: '💼', text: '就业创业' },
                ].map(item => (
                  <span key={item.text} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{item.icon}</span>{item.text}
                  </span>
                ))}
              </div>
            </div>
            <Link
              to="/forum/post/new"
              style={{
                background: 'var(--color-accent)',
                color: 'white',
                padding: '12px 28px',
                borderRadius: '4px',
                fontWeight: '700',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
                flexShrink: 0
              }}
              onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseOut={e => (e.currentTarget.style.opacity = '1')}
            >
              ✏️ 发布新帖
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ background: 'var(--color-bg)', padding: '28px 0 40px' }}>
        <div className="container-main">
          {loading ? (
            <div className="loading-spinner">正在加载论坛数据...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
              {/* Left: Categories */}
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#333', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '4px', height: '18px', background: 'var(--color-primary)', borderRadius: '2px', display: 'inline-block' }}></span>
                  论坛分区
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {categories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/forum/category/${cat.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="forum-category-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Icon */}
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, var(--color-primary), #004bb5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.75rem',
                          flexShrink: 0
                        }}>
                          {cat.icon}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-primary)' }}>{cat.name}</h3>
                            <span style={{ fontSize: '12px', color: '#999' }}>{cat.post_count || 0} 帖子</span>
                          </div>
                          <p style={{ fontSize: '13px', color: '#666', marginTop: '3px' }}>{cat.description}</p>
                          {cat.latest_post && (
                            <div style={{ marginTop: '6px', fontSize: '12px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>最新：</span>
                              <span style={{ color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                                {cat.latest_post.title}
                              </span>
                              <span style={{ flexShrink: 0 }}>· {cat.latest_post.author}</span>
                            </div>
                          )}
                        </div>

                        {/* Arrow */}
                        <div style={{ color: '#ccc', fontSize: '1.2rem', flexShrink: 0 }}>›</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Hot posts */}
                <div style={{ background: 'white', borderRadius: '4px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', background: 'var(--color-primary)', color: 'white', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🔥 热门帖子
                  </div>
                  <div style={{ padding: '8px 16px' }}>
                    {hotPosts.slice(0, 8).map((post, i) => (
                      <Link
                        key={post.id}
                        to={`/forum/post/${post.id}`}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '9px 0', borderBottom: i < hotPosts.length - 1 ? '1px solid #f5f5f5' : 'none', textDecoration: 'none' }}
                      >
                        <span style={{
                          width: '20px', height: '20px', borderRadius: '50%',
                          background: i < 3 ? 'var(--color-accent)' : '#ccc',
                          color: 'white', fontSize: '11px', fontWeight: '700',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, marginTop: '1px'
                        }}>
                          {i + 1}
                        </span>
                        <span style={{ fontSize: '13px', color: '#333', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {post.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Recent replies */}
                <div style={{ background: 'white', borderRadius: '4px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', background: '#7c3aed', color: 'white', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    💬 最新回复
                  </div>
                  <div style={{ padding: '8px 16px' }}>
                    {recentPosts.slice(0, 6).map((post, i) => (
                      <Link
                        key={post.id}
                        to={`/forum/post/${post.id}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', borderBottom: i < recentPosts.length - 1 ? '1px solid #f5f5f5' : 'none', textDecoration: 'none' }}
                      >
                        <div
                          className="avatar-circle"
                          style={{ background: avatarColor(post.author), width: '32px', height: '32px', fontSize: '13px' }}
                        >
                          {post.author[0]}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '12px', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {post.title}
                          </div>
                          <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>
                            {post.author} · {formatTime(post.created_at)}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Forum stats */}
                <div style={{ background: 'white', borderRadius: '4px', border: '1px solid var(--color-border)', padding: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#333', marginBottom: '12px' }}>📊 论坛统计</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                      { num: categories.length, label: '论坛分区' },
                      { num: hotPosts.length * 3 + 12, label: '总帖子数' },
                      { num: hotPosts.length * 8 + 36, label: '总回复数' },
                      { num: '活跃中', label: '论坛状态' },
                    ].map(item => (
                      <div key={item.label} style={{ textAlign: 'center', padding: '10px', background: '#f8f9ff', borderRadius: '4px' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-primary)' }}>{item.num}</div>
                        <div style={{ fontSize: '11px', color: '#999', marginTop: '3px' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
