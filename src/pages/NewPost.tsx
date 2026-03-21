import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Category } from '../types'
import { getCategories, createPost } from '../utils/api'

export default function NewPost() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId) { setError('请选择帖子分区'); return }
    if (!title.trim()) { setError('请输入帖子标题'); return }
    if (!author.trim()) { setError('请输入您的昵称'); return }
    if (!content.trim()) { setError('请输入帖子内容'); return }
    if (title.trim().length < 4) { setError('标题至少需要4个字符'); return }
    if (content.trim().length < 10) { setError('内容至少需要10个字符'); return }

    setSubmitting(true)
    setError('')
    try {
      const newPost = await createPost({
        category_id: Number(categoryId),
        title: title.trim(),
        author: author.trim(),
        content: content.trim()
      })
      navigate(`/forum/post/${newPost.id}`)
    } catch {
      setError('网络错误，请稍后再试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #002060, #003087)', padding: '16px 0', borderBottom: '3px solid var(--color-accent)' }}>
        <div className="container-main">
          <div className="breadcrumb" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.7)' }}>首页</Link>
            <span>›</span>
            <Link to="/forum" style={{ color: 'rgba(255,255,255,0.7)' }}>大学生论坛</Link>
            <span>›</span>
            <span style={{ color: 'white' }}>发布新帖</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '1.3rem', fontWeight: '700', marginTop: '8px' }}>✏️ 发布新帖</h1>
        </div>
      </div>

      <div style={{ background: 'var(--color-bg)', padding: '32px 0 60px' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
            {/* Form */}
            <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', background: 'var(--color-primary)', color: 'white' }}>
                <h2 style={{ fontSize: '15px', fontWeight: '700' }}>发布新帖子</h2>
                <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>请认真填写帖子信息，共同维护良好的论坛环境</p>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: '28px 24px' }}>
                {/* Category */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#333', marginBottom: '8px' }}>
                    发布分区 <span style={{ color: 'var(--color-accent)' }}>*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="form-select"
                    style={{ maxWidth: '400px' }}
                  >
                    <option value="">-- 请选择分区 --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name} — {cat.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#333', marginBottom: '8px' }}>
                    帖子标题 <span style={{ color: 'var(--color-accent)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="请输入帖子标题（4-100个字符）"
                    maxLength={100}
                    className="form-input"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#aaa' }}>标题要简明扼要，能准确表达帖子主题</span>
                    <span style={{ fontSize: '12px', color: title.length > 80 ? 'var(--color-accent)' : '#bbb' }}>
                      {title.length}/100
                    </span>
                  </div>
                </div>

                {/* Author */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#333', marginBottom: '8px' }}>
                    您的昵称 <span style={{ color: 'var(--color-accent)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    placeholder="请输入您的昵称（显示在帖子上）"
                    maxLength={20}
                    className="form-input"
                    style={{ maxWidth: '280px' }}
                  />
                </div>

                {/* Content */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#333', marginBottom: '8px' }}>
                    帖子内容 <span style={{ color: 'var(--color-accent)' }}>*</span>
                  </label>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="请输入帖子内容（至少10个字符）...&#10;&#10;支持换行，请文明发言，不得发布违法违规内容。"
                    maxLength={10000}
                    className="form-textarea"
                    style={{ minHeight: '280px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#aaa' }}>内容至少需要10个字符</span>
                    <span style={{ fontSize: '12px', color: content.length > 9000 ? 'var(--color-accent)' : '#bbb' }}>
                      {content.length}/10000
                    </span>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div style={{
                    padding: '10px 14px',
                    background: '#fff0f3',
                    border: '1px solid #fecdd3',
                    borderRadius: '4px',
                    color: 'var(--color-accent)',
                    fontSize: '13px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    ⚠️ {error}
                  </div>
                )}

                {/* Submit */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                    style={{ padding: '11px 32px', fontSize: '15px', opacity: submitting ? 0.7 : 1 }}
                  >
                    {submitting ? '发布中...' : '🚀 发布帖子'}
                  </button>
                  <Link
                    to="/forum"
                    style={{ color: '#666', fontSize: '14px' }}
                  >
                    取消，返回论坛
                  </Link>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Link
                to="/forum"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 16px', background: 'var(--color-primary)',
                  color: 'white', borderRadius: '4px', fontSize: '13px',
                  fontWeight: '600', textDecoration: 'none'
                }}
              >
                ← 返回论坛首页
              </Link>

              {/* Posting rules */}
              <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', background: '#f0f4fa', borderBottom: '1px solid var(--color-border)', fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>
                  📋 发帖须知
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <ul style={{ fontSize: '12px', color: '#555', lineHeight: '2', paddingLeft: '16px' }}>
                    <li>请选择合适的论坛分区</li>
                    <li>标题需简明扼要（4-100字符）</li>
                    <li>内容详细真实，不得造谣</li>
                    <li>禁止发布广告或违规内容</li>
                    <li>文明交流，相互尊重</li>
                    <li>禁止人身攻击或恶意诋毁</li>
                  </ul>
                </div>
              </div>

              {/* Category tips */}
              <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', background: '#f0f4fa', borderBottom: '1px solid var(--color-border)', fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>
                  🏷️ 分区说明
                </div>
                <div style={{ padding: '10px 16px' }}>
                  {categories.map(cat => (
                    <div key={cat.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '6px 0', borderBottom: '1px solid #f5f5f5', fontSize: '12px' }}>
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>{cat.icon}</span>
                      <div>
                        <div style={{ fontWeight: '600', color: '#333' }}>{cat.name}</div>
                        <div style={{ color: '#888', marginTop: '1px' }}>{cat.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
