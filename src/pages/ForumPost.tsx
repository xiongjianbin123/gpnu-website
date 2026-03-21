import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Post, Comment } from '../types'
import { getPost, getComments, createComment, likeComment } from '../utils/api'

function avatarColor(name: string) {
  const colors = ['#003087', '#C8102E', '#7c3aed', '#065f46', '#b45309', '#0369a1', '#be123c', '#0e7490']
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return colors[Math.abs(hash) % colors.length]
}

function formatDateTime(dt: string) {
  const d = new Date(dt)
  return d.toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

export default function ForumPost() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set())
  const [localLikes, setLocalLikes] = useState<Record<number, number>>({})

  // Reply form
  const [replyAuthor, setReplyAuthor] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')

  useEffect(() => {
    Promise.all([
      getPost(Number(id)),
      getComments(Number(id)),
    ]).then(([p, c]) => {
      setPost(p)
      setComments(c)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const handleLike = async (commentId: number) => {
    if (likedIds.has(commentId)) return
    try {
      const data = await likeComment(commentId)
      setLikedIds(prev => new Set([...prev, commentId]))
      setLocalLikes(prev => ({ ...prev, [commentId]: data.likes }))
    } catch {}
  }

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyAuthor.trim() || !replyContent.trim()) {
      setSubmitMsg('请填写昵称和回复内容')
      return
    }
    setSubmitting(true)
    setSubmitMsg('')
    try {
      const newComment = await createComment({
        post_id: Number(id),
        author: replyAuthor.trim(),
        content: replyContent.trim()
      })
      setComments(prev => [...prev, newComment])
      setReplyContent('')
      setSubmitMsg('回复成功！')
      setTimeout(() => setSubmitMsg(''), 3000)
      // Scroll to new comment
      setTimeout(() => {
        document.getElementById('reply-area')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch {
      setSubmitMsg('回复失败，请稍后再试')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="loading-spinner">加载中...</div>
  }

  if (!post) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: '#aaa' }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>😕</div>
        <p>帖子不存在或已被删除</p>
        <Link to="/forum" style={{ color: 'var(--color-primary)', marginTop: '12px', display: 'inline-block' }}>返回论坛</Link>
      </div>
    )
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
            {post.category_name && (
              <>
                <Link to={`/forum/category/${post.category_id}`} style={{ color: 'rgba(255,255,255,0.7)' }}>{post.category_name}</Link>
                <span>›</span>
              </>
            )}
            <span style={{ color: 'white', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</span>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--color-bg)', padding: '24px 0 40px' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '24px' }}>
            {/* Main content */}
            <div>
              {/* Post */}
              <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
                {/* Post header */}
                <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    {post.is_pinned === 1 && (
                      <span className="tag-pinned">置顶</span>
                    )}
                    {post.category_name && (
                      <Link
                        to={`/forum/category/${post.category_id}`}
                        style={{
                          background: '#f0f4fa',
                          color: 'var(--color-primary)',
                          padding: '1px 8px',
                          borderRadius: '2px',
                          fontSize: '12px',
                          border: '1px solid #d0dbf0'
                        }}
                      >
                        {post.category_name}
                      </Link>
                    )}
                  </div>
                  <h1 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1a1a1a', lineHeight: 1.4, marginBottom: '12px' }}>
                    {post.title}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#999' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="avatar-circle" style={{ background: avatarColor(post.author), width: '32px', height: '32px', fontSize: '13px' }}>
                        {post.author[0]}
                      </div>
                      <span style={{ color: '#555', fontWeight: '600' }}>{post.author}</span>
                    </div>
                    <span>🕐 {formatDateTime(post.created_at)}</span>
                    <span>👁 {post.views} 浏览</span>
                    <span>💬 {comments.length} 回复</span>
                  </div>
                </div>

                {/* Post body */}
                <div style={{ padding: '24px', lineHeight: '1.9', color: '#333', fontSize: '15px', minHeight: '200px' }}>
                  {post.content.split('\n').map((para, i) => (
                    para.trim() ? (
                      <p key={i} style={{ marginBottom: '16px' }}>{para}</p>
                    ) : (
                      <br key={i} />
                    )
                  ))}
                </div>

                {/* Post footer */}
                <div style={{ padding: '12px 24px', background: '#f9f9f9', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>
                    楼主 · #{post.id}
                  </div>
                  <Link
                    to={post.category_id ? `/forum/category/${post.category_id}` : '/forum'}
                    style={{ fontSize: '13px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    ← 返回列表
                  </Link>
                </div>
              </div>

              {/* Comments */}
              {comments.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#333', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '4px', height: '18px', background: 'var(--color-primary)', borderRadius: '2px', display: 'inline-block' }}></span>
                    全部回复 ({comments.length})
                  </h2>
                  {comments.map((comment, idx) => (
                    <div key={comment.id} className="comment-floor" id={idx === comments.length - 1 ? 'reply-area' : undefined}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        {/* Floor number + Avatar */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          <div className="avatar-circle" style={{ background: avatarColor(comment.author) }}>
                            {comment.author[0]}
                          </div>
                          <span style={{ fontSize: '11px', color: '#aaa', background: '#f0f0f0', padding: '1px 6px', borderRadius: '8px' }}>
                            B{idx + 1}
                          </span>
                        </div>

                        {/* Comment body */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontWeight: '700', fontSize: '14px', color: '#333' }}>{comment.author}</span>
                              <span style={{ fontSize: '12px', color: '#aaa' }}>{formatDateTime(comment.created_at)}</span>
                            </div>
                            <button
                              onClick={() => handleLike(comment.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 12px',
                                border: likedIds.has(comment.id) ? '1px solid #C8102E' : '1px solid #ddd',
                                background: likedIds.has(comment.id) ? '#fff0f3' : 'white',
                                color: likedIds.has(comment.id) ? 'var(--color-accent)' : '#888',
                                borderRadius: '20px',
                                cursor: likedIds.has(comment.id) ? 'default' : 'pointer',
                                fontSize: '12px',
                                transition: 'all 0.2s'
                              }}
                            >
                              👍 {localLikes[comment.id] ?? comment.likes}
                            </button>
                          </div>
                          <div style={{ color: '#444', lineHeight: '1.75', fontSize: '14px' }}>
                            {comment.content.split('\n').map((line, i) => (
                              <span key={i}>{line}{i < comment.content.split('\n').length - 1 && <br />}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply form */}
              <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', background: 'var(--color-primary)', color: 'white', fontSize: '14px', fontWeight: '700' }}>
                  ✍️ 发表回复
                </div>
                <form onSubmit={handleSubmitReply} style={{ padding: '20px' }}>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px', fontWeight: '600' }}>
                      昵称 <span style={{ color: 'var(--color-accent)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={replyAuthor}
                      onChange={e => setReplyAuthor(e.target.value)}
                      placeholder="请输入您的昵称"
                      maxLength={20}
                      className="form-input"
                      style={{ maxWidth: '280px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px', fontWeight: '600' }}>
                      回复内容 <span style={{ color: 'var(--color-accent)' }}>*</span>
                    </label>
                    <textarea
                      value={replyContent}
                      onChange={e => setReplyContent(e.target.value)}
                      placeholder="请输入您的回复内容..."
                      maxLength={2000}
                      className="form-textarea"
                      style={{ minHeight: '100px' }}
                    />
                    <div style={{ textAlign: 'right', fontSize: '12px', color: '#bbb', marginTop: '4px' }}>
                      {replyContent.length}/2000
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary"
                      style={{ opacity: submitting ? 0.7 : 1 }}
                    >
                      {submitting ? '提交中...' : '提交回复'}
                    </button>
                    {submitMsg && (
                      <span style={{
                        fontSize: '13px',
                        color: submitMsg.includes('成功') ? '#065f46' : 'var(--color-accent)',
                        background: submitMsg.includes('成功') ? '#d1fae5' : '#fff0f3',
                        padding: '4px 10px',
                        borderRadius: '4px'
                      }}>
                        {submitMsg}
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Link
                to="/forum"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 16px', background: 'var(--color-primary)',
                  color: 'white', borderRadius: '4px', fontSize: '13px',
                  fontWeight: '600', textDecoration: 'none', transition: 'opacity 0.2s'
                }}
                onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseOut={e => (e.currentTarget.style.opacity = '1')}
              >
                ← 返回论坛首页
              </Link>

              <Link
                to="/forum/post/new"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px 16px', background: 'var(--color-accent)',
                  color: 'white', borderRadius: '4px', fontSize: '13px',
                  fontWeight: '600', textDecoration: 'none', transition: 'opacity 0.2s'
                }}
                onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseOut={e => (e.currentTarget.style.opacity = '1')}
              >
                ✏️ 发布新帖
              </Link>

              {/* Post stats */}
              <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '16px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#333', marginBottom: '12px' }}>帖子统计</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { icon: '👁', label: '浏览次数', value: post.views },
                    { icon: '💬', label: '回复数量', value: comments.length },
                    { icon: '🕐', label: '发帖时间', value: new Date(post.created_at).toLocaleDateString('zh-CN') },
                    { icon: '👤', label: '楼主', value: post.author },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid #f5f5f5' }}>
                      <span style={{ color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {item.icon} {item.label}
                      </span>
                      <span style={{ fontWeight: '600', color: '#333' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div style={{ background: '#fff8e7', border: '1px solid #fde68a', borderRadius: '4px', padding: '14px 16px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#92400e', marginBottom: '8px' }}>📢 文明上网提示</h3>
                <p style={{ fontSize: '12px', color: '#78350f', lineHeight: '1.6' }}>
                  请遵守论坛规定，文明发言，不得发布违法违规内容，共同维护良好的交流环境。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
