import { mockCategories, mockPosts, mockComments } from '../mock/forumData'
import type { Category, Post, Comment, PaginatedPosts } from '../types'

const IS_PROD = import.meta.env.PROD

// In-memory mutable copies (only used in prod)
let _posts = [...mockPosts]
let _comments = [...mockComments]
let _nextPostId = Math.max(...mockPosts.map(p => p.id)) + 1
let _nextCommentId = Math.max(...mockComments.map(c => c.id)) + 1

function delay(ms = 120): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function getCategories(): Promise<Category[]> {
  if (!IS_PROD) {
    const res = await fetch('/api/categories')
    return res.json()
  }
  await delay()
  return mockCategories.map(cat => {
    const catPosts = _posts.filter(p => p.category_id === cat.id)
    const latestPost = [...catPosts].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]
    return {
      ...cat,
      post_count: catPosts.length,
      latest_post: latestPost
        ? { title: latestPost.title, author: latestPost.author, created_at: latestPost.created_at }
        : null,
    }
  })
}

export async function getPosts(params: {
  category_id?: number
  page?: number
  limit?: number
}): Promise<PaginatedPosts> {
  if (!IS_PROD) {
    const { category_id, page = 1, limit = 15 } = params
    const qs = new URLSearchParams()
    if (category_id !== undefined) qs.set('category_id', String(category_id))
    qs.set('page', String(page))
    qs.set('limit', String(limit))
    const res = await fetch(`/api/posts?${qs.toString()}`)
    return res.json()
  }
  await delay()
  const { category_id, page = 1, limit = 15 } = params
  let filtered = [..._posts]
  if (category_id !== undefined) {
    filtered = filtered.filter(p => p.category_id === category_id)
  }
  // Sort: pinned first, then by created_at desc
  filtered.sort((a, b) => {
    if (b.is_pinned !== a.is_pinned) return b.is_pinned - a.is_pinned
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
  const total = filtered.length
  const total_pages = Math.max(1, Math.ceil(total / limit))
  const offset = (page - 1) * limit
  const posts = filtered.slice(offset, offset + limit)
  return { posts, total, page, limit, total_pages }
}

export async function getHotPosts(limit = 8): Promise<Post[]> {
  if (!IS_PROD) {
    const res = await fetch(`/api/posts/hot?limit=${limit}`)
    return res.json()
  }
  await delay()
  return [..._posts]
    .sort((a, b) => (b.comment_count ?? 0) - (a.comment_count ?? 0))
    .slice(0, limit)
}

export async function getRecentReplies(limit = 6): Promise<Post[]> {
  if (!IS_PROD) {
    const res = await fetch(`/api/posts/recent-replies?limit=${limit}`)
    return res.json()
  }
  await delay()
  // For each post, find the latest comment time (or fall back to created_at)
  const postLatestComment: Record<number, number> = {}
  for (const c of _comments) {
    const t = new Date(c.created_at).getTime()
    if (!postLatestComment[c.post_id] || t > postLatestComment[c.post_id]) {
      postLatestComment[c.post_id] = t
    }
  }
  return [..._posts]
    .sort((a, b) => {
      const ta = postLatestComment[a.id] ?? new Date(a.created_at).getTime()
      const tb = postLatestComment[b.id] ?? new Date(b.created_at).getTime()
      return tb - ta
    })
    .slice(0, limit)
}

export async function getPost(id: number): Promise<Post | null> {
  if (!IS_PROD) {
    const res = await fetch(`/api/posts/${id}`)
    if (!res.ok) return null
    return res.json()
  }
  await delay()
  const idx = _posts.findIndex(p => p.id === id)
  if (idx === -1) return null
  _posts[idx] = { ..._posts[idx], views: _posts[idx].views + 1 }
  return _posts[idx]
}

export async function createPost(data: {
  category_id: number
  title: string
  content: string
  author: string
}): Promise<Post> {
  if (!IS_PROD) {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  }
  await delay()
  const cat = mockCategories.find(c => c.id === data.category_id)
  const newPost: Post = {
    id: _nextPostId++,
    category_id: data.category_id,
    category_name: cat?.name ?? '',
    title: data.title,
    content: data.content,
    author: data.author,
    is_pinned: 0,
    views: 0,
    comment_count: 0,
    created_at: new Date().toISOString(),
  }
  _posts.push(newPost)
  return newPost
}

export async function getComments(post_id: number): Promise<Comment[]> {
  if (!IS_PROD) {
    const res = await fetch(`/api/comments/${post_id}`)
    return res.json()
  }
  await delay()
  return _comments
    .filter(c => c.post_id === post_id)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
}

export async function createComment(data: {
  post_id: number
  author: string
  content: string
}): Promise<Comment> {
  if (!IS_PROD) {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  }
  await delay()
  const newComment: Comment = {
    id: _nextCommentId++,
    post_id: data.post_id,
    author: data.author,
    content: data.content,
    likes: 0,
    created_at: new Date().toISOString(),
  }
  _comments.push(newComment)
  // Update comment_count on post
  const postIdx = _posts.findIndex(p => p.id === data.post_id)
  if (postIdx !== -1) {
    _posts[postIdx] = { ..._posts[postIdx], comment_count: (_posts[postIdx].comment_count ?? 0) + 1 }
  }
  return newComment
}

export async function likeComment(id: number): Promise<{ likes: number }> {
  if (!IS_PROD) {
    const res = await fetch(`/api/comments/${id}/like`, { method: 'POST' })
    return res.json()
  }
  await delay()
  const idx = _comments.findIndex(c => c.id === id)
  if (idx === -1) return { likes: 0 }
  _comments[idx] = { ..._comments[idx], likes: _comments[idx].likes + 1 }
  return { likes: _comments[idx].likes }
}
