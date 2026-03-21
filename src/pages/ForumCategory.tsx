import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Post, Category, PaginatedPosts } from '../types'
import Pagination from '../components/Pagination'
import { getCategories, getPosts } from '../utils/api'

function avatarColor(name: string) {
  const colors = ['#003087', '#C8102E', '#7c3aed', '#065f46', '#b45309', '#0369a1', '#be123c', '#0e7490']
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return colors[Math.abs(hash) % colors.length]
}

function formatTime(dt: string) {
  const d = new Date(dt)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`
  return d.toLocaleDateString('zh-CN')
}

const LIMIT = 15

export default function ForumCategory() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [category, setCategory] = useState<Category | null>(null)
  const [data, setData] = useState<PaginatedPosts | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories().then((cats: Category[]) => {
      const cat = cats.find(c => c.id === Number(id))
      setCategory(cat || null)
    })
  }, [id])

  useEffect(() => {
    setLoading(true)
    getPosts({ category_id: Number(id), page, limit: LIMIT })
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id, page])

  const handlePageChange = (p: number) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Category Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #002060 0%, #003087 100%)',
        padding: '20px 0',
        borderBottom: '3px solid var(--color-accent)'
      }}>
        <div className="container-main">
          <div className="breadcrumb" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.7)' }}>首页</Link>
            <span>›</span>
            <Link to="/forum" style={{ color: 'rgba(255,255,255,0.7)' }}>大学生论坛</Link>
            <span>›</span>
            <span style={{ color: 'white' }}>{category?.name || '分区'}</span>
          </div>
          {category && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.75rem' }}>{category.icon}</span>
              <div>
                <h1 style={{ color: 'white', fontSize: '1.3rem', fontWeight: '700' }}>{category.name}</h1>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginTop: '3px' }}>{category.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ background: 'var(--color-bg)', padding: '24px 0 40px' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '24px' }}>
            {/* Posts list */}
            <div>
              {/* Toolbar */}
              <div style={{
                background: 'white',
                padding: '14px 20px',
                borderRadius: '4px 4px 0 0',
                border: '1px solid var(--color-border)',
                borderBottom: '2px solid var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#555', fontWeight: '600' }}>
                    全部帖子
                  </span>
                  {data && (
                    <span style={{ fontSize: '12px', color: '#aaa', background: '#f0f0f0', padding: '2px 8px', borderRadius: '10px' }}>
                      共 {data.total} 条
                    </span>
                  )}
                </div>
                <Link
                  to="/forum/post/new"
                  style={{
                    background: 'var(--color-accent)',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseOut={e => (e.currentTarget.style.opacity = '1')}
                >
                  ✏️ 发布新帖
                </Link>
              </div>

              {/* List */}
              <div style={{ background: 'white', border: '1px solid var(--color-border)', borderTop: 'none', borderRadius: '0 0 4px 4px', padding: '0 20px' }}>
                {loading ? (
                  <div className="loading-spinner">加载中...</div>
                ) : data?.posts.length === 0 ? (
                  <div style={{ padding: '60px 0', textAlign: 'center', color: '#aaa' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📭</div>
                    <p>该分区暂无帖子，快来发第一帖吧！</p>
                  </div>
                ) : (
                  data?.posts.map(post => (
                    <div key={post.id} className="post-item">
                      {/* Avatar */}
                      <div className="avatar-circle" style={{ background: avatarColor(post.author) }}>
                        {post.author[0]}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          {post.is_pinned === 1 && <span className="tag-pinned">置顶</span>}
                          <Link
                            to={`/forum/post/${post.id}`}
                            style={{
                              fontSize: '14px',
                              fontWeight: post.is_pinned ? '700' : '600',
                              color: post.is_pinned ? 'var(--color-primary)' : '#222',
                              textDecoration: 'none',
                              transition: 'color 0.2s'
                            }}
                            onMouseOver={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                            onMouseOut={e => (e.currentTarget.style.color = post.is_pinned ? 'var(--color-primary)' : '#222')}
                          >
                            {post.title}
                          </Link>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '5px', fontSize: '12px', color: '#999' }}>
                          <span>👤 {post.author}</span>
                          <span>🕐 {formatTime(post.created_at)}</span>
                          <span>👁 {post.views} 浏览</span>
                          <span>💬 {post.comment_count ?? 0} 回复</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {data && data.total_pages > 1 && (
                <Pagination
                  current={page}
                  total={data.total_pages}
                  onChange={handlePageChange}
                />
              )}
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Back to forum */}
              <Link
                to="/forum"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseOut={e => (e.currentTarget.style.opacity = '1')}
              >
                ← 返回论坛首页
              </Link>

              {/* New post */}
              <button
                onClick={() => navigate('/forum/post/new')}
                className="btn-accent"
                style={{ width: '100%', padding: '12px', fontSize: '14px' }}
              >
                ✏️ 在此分区发帖
              </button>

              {/* Category info */}
              {category && (
                <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '16px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#333', marginBottom: '12px' }}>分区信息</h3>
                  <div style={{ textAlign: 'center', padding: '12px 0' }}>
                    <div style={{ fontSize: '2.5rem' }}>{category.icon}</div>
                    <div style={{ fontWeight: '700', color: 'var(--color-primary)', marginTop: '6px' }}>{category.name}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{category.description}</div>
                    <div style={{ marginTop: '10px', fontSize: '13px', color: '#aaa' }}>
                      <span style={{ fontWeight: '700', color: '#333', fontSize: '1.2rem' }}>{category.post_count || 0}</span>
                      <span> 个帖子</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
