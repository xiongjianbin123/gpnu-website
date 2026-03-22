const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 3003
const DB_PATH = path.join(__dirname, 'forum-data.json')

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

function readDB() { return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) }
function writeDB(data) { fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8') }

app.get('/api/categories', (req, res) => {
  try {
    const db = readDB()
    const result = db.categories.sort((a, b) => a.sort_order - b.sort_order).map(cat => {
      const catPosts = db.posts.filter(p => p.category_id === cat.id)
      const latest = catPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] || null
      return { ...cat, post_count: catPosts.length, latest_post: latest ? { title: latest.title, author: latest.author, created_at: latest.created_at } : null }
    })
    res.json(result)
  } catch (err) { res.status(500).json({ error: '获取分区失败' }) }
})

app.get('/api/posts', (req, res) => {
  try {
    const db = readDB()
    const category_id = req.query.category_id ? Number(req.query.category_id) : null
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 15))
    let filtered = category_id ? db.posts.filter(p => p.category_id === category_id) : db.posts
    filtered = filtered.sort((a, b) => {
      if (b.is_pinned !== a.is_pinned) return b.is_pinned - a.is_pinned
      return new Date(b.created_at) - new Date(a.created_at)
    })
    const total = filtered.length
    const paged = filtered.slice((page - 1) * limit, page * limit)
    const catMap = Object.fromEntries(db.categories.map(c => [c.id, c.name]))
    const posts = paged.map(p => ({ ...p, category_name: catMap[p.category_id] || '', comment_count: db.comments.filter(c => c.post_id === p.id).length }))
    res.json({ posts, total, page, limit, total_pages: Math.ceil(total / limit) })
  } catch (err) { res.status(500).json({ error: '获取帖子失败' }) }
})

app.get('/api/posts/hot', (req, res) => {
  try {
    const db = readDB()
    const limit = Math.min(20, Number(req.query.limit) || 10)
    const catMap = Object.fromEntries(db.categories.map(c => [c.id, c.name]))
    const posts = db.posts
      .map(p => ({ ...p, category_name: catMap[p.category_id] || '', comment_count: db.comments.filter(c => c.post_id === p.id).length }))
      .sort((a, b) => b.comment_count - a.comment_count || b.views - a.views).slice(0, limit)
    res.json(posts)
  } catch (err) { res.status(500).json({ error: '获取热门帖子失败' }) }
})

app.get('/api/posts/recent-replies', (req, res) => {
  try {
    const db = readDB()
    const limit = Math.min(20, Number(req.query.limit) || 8)
    const catMap = Object.fromEntries(db.categories.map(c => [c.id, c.name]))
    const posts = db.posts
      .map(p => {
        const pc = db.comments.filter(c => c.post_id === p.id)
        if (!pc.length) return null
        const last = pc.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
        return { ...p, category_name: catMap[p.category_id] || '', comment_count: pc.length, last_reply_at: last.created_at }
      }).filter(Boolean).sort((a, b) => new Date(b.last_reply_at) - new Date(a.last_reply_at)).slice(0, limit)
    res.json(posts)
  } catch (err) { res.status(500).json({ error: '获取最新回复失败' }) }
})

app.get('/api/posts/:id', (req, res) => {
  try {
    const db = readDB()
    const id = Number(req.params.id)
    if (!id) return res.status(400).json({ error: '无效的帖子ID' })
    const idx = db.posts.findIndex(p => p.id === id)
    if (idx === -1) return res.status(404).json({ error: '帖子不存在' })
    db.posts[idx].views += 1
    writeDB(db)
    const catMap = Object.fromEntries(db.categories.map(c => [c.id, c.name]))
    res.json({ ...db.posts[idx], category_name: catMap[db.posts[idx].category_id] || '' })
  } catch (err) { res.status(500).json({ error: '获取帖子详情失败' }) }
})

app.post('/api/posts', (req, res) => {
  try {
    const db = readDB()
    const { category_id, title, content, author } = req.body
    if (!category_id || !title || !content || !author) return res.status(400).json({ error: '请填写所有必填字段' })
    if (title.trim().length < 4 || title.trim().length > 100) return res.status(400).json({ error: '标题需要4-100个字符' })
    if (content.trim().length < 10) return res.status(400).json({ error: '内容至少需要10个字符' })
    if (author.trim().length < 1 || author.trim().length > 20) return res.status(400).json({ error: '昵称需要1-20个字符' })
    if (!db.categories.find(c => c.id === Number(category_id))) return res.status(400).json({ error: '无效的分区' })
    const newPost = { id: db._meta.next_post_id++, category_id: Number(category_id), title: title.trim(), content: content.trim(), author: author.trim(), is_pinned: 0, views: 0, created_at: new Date().toISOString() }
    db.posts.push(newPost)
    writeDB(db)
    const catMap = Object.fromEntries(db.categories.map(c => [c.id, c.name]))
    res.status(201).json({ ...newPost, category_name: catMap[newPost.category_id] || '' })
  } catch (err) { res.status(500).json({ error: '发帖失败，请稍后再试' }) }
})

app.get('/api/comments/:post_id', (req, res) => {
  try {
    const db = readDB()
    const post_id = Number(req.params.post_id)
    if (!post_id) return res.status(400).json({ error: '无效的帖子ID' })
    const comments = db.comments.filter(c => c.post_id === post_id).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    res.json(comments)
  } catch (err) { res.status(500).json({ error: '获取评论失败' }) }
})

app.post('/api/comments', (req, res) => {
  try {
    const db = readDB()
    const { post_id, author, content } = req.body
    if (!post_id || !author || !content) return res.status(400).json({ error: '请填写所有必填字段' })
    if (author.trim().length < 1 || author.trim().length > 20) return res.status(400).json({ error: '昵称需要1-20个字符' })
    if (content.trim().length < 1 || content.trim().length > 2000) return res.status(400).json({ error: '内容需要1-2000个字符' })
    if (!db.posts.find(p => p.id === Number(post_id))) return res.status(404).json({ error: '帖子不存在' })
    const newComment = { id: db._meta.next_comment_id++, post_id: Number(post_id), author: author.trim(), content: content.trim(), likes: 0, created_at: new Date().toISOString() }
    db.comments.push(newComment)
    writeDB(db)
    res.status(201).json(newComment)
  } catch (err) { res.status(500).json({ error: '发表评论失败' }) }
})

app.post('/api/comments/:id/like', (req, res) => {
  try {
    const db = readDB()
    const idx = db.comments.findIndex(c => c.id === Number(req.params.id))
    if (idx === -1) return res.status(404).json({ error: '评论不存在' })
    db.comments[idx].likes += 1
    writeDB(db)
    res.json({ likes: db.comments[idx].likes })
  } catch (err) { res.status(500).json({ error: '点赞失败' }) }
})

// ===================== 电子商城 API =====================

const SHOP_DB_PATH = path.join(__dirname, 'shop-data.json')

function readShopDB() {
  if (!fs.existsSync(SHOP_DB_PATH)) {
    const init = { categories: [], products: [], orders: [], _meta: { next_order_id: 1001 } }
    fs.writeFileSync(SHOP_DB_PATH, JSON.stringify(init, null, 2))
    return init
  }
  return JSON.parse(fs.readFileSync(SHOP_DB_PATH, 'utf-8'))
}
function writeShopDB(data) { fs.writeFileSync(SHOP_DB_PATH, JSON.stringify(data, null, 2), 'utf-8') }

// Seed shop data on first access
function ensureShopData() {
  const db = readShopDB()
  if (db.categories.length > 0) return db
  db.categories = [
    { id: 1, name: '校园周边', icon: '🎓', description: '广师大官方文创，带走一份师大情怀' },
    { id: 2, name: '数码产品', icon: '💻', description: '笔记本、耳机、数码配件，学习更高效' },
    { id: 3, name: '生活用品', icon: '🛍️', description: '宿舍必备生活好物，品质有保障' },
    { id: 4, name: '图书教材', icon: '📚', description: '专业教材、课外读物、考研用书' },
    { id: 5, name: '运动装备', icon: '⚽', description: '运动健身装备，活力校园生活' },
    { id: 6, name: '美食特产', icon: '🍜', description: '广东特色美食、零食饮品，校园好味道' },
  ]
  db.products = [
    { id: 1, category_id: 1, name: '广师大定制马克杯', description: '精选陶瓷材质，印有广师大校徽及校训，容量350ml，微波炉可用。', price: 39.9, original_price: 59.9, stock: 120, image: '☕', tags: ['热销', '官方定制'], sales_count: 856, rating: 4.8, created_at: '2025-09-01T00:00:00Z' },
    { id: 2, category_id: 1, name: '广师大文化T恤', description: '100%纯棉，印有广师大标志性建筑剪影，男女同款，提供S/M/L/XL。', price: 89, original_price: 129, stock: 200, image: '👕', tags: ['官方定制', '纯棉'], sales_count: 412, rating: 4.7, created_at: '2025-09-05T00:00:00Z' },
    { id: 3, category_id: 1, name: '广师大定制帆布包', description: '加厚帆布，大容量设计，单肩手提两用，印有广师大校徽logo。', price: 49.9, original_price: 69, stock: 80, image: '👜', tags: ['实用', '大容量'], sales_count: 623, rating: 4.6, created_at: '2025-09-10T00:00:00Z' },
    { id: 4, category_id: 1, name: '广师大笔记本套装', description: '精装A5笔记本2册+钢笔1支礼盒，广师大定制封面，适合纪念收藏。', price: 68, original_price: 98, stock: 150, image: '📓', tags: ['礼盒', '套装'], sales_count: 289, rating: 4.9, created_at: '2025-09-15T00:00:00Z' },
    { id: 5, category_id: 2, name: '无线蓝牙耳机 学生款', description: '主动降噪，续航30小时，IPX4防水，轻盈折叠，适合图书馆学习。', price: 199, original_price: 299, stock: 45, image: '🎧', tags: ['降噪', '长续航'], sales_count: 341, rating: 4.5, created_at: '2025-09-20T00:00:00Z' },
    { id: 6, category_id: 2, name: 'Type-C 多功能扩展坞', description: '7合1扩展坞，支持HDMI 4K、USB3.0×3、SD/TF、PD快充。', price: 129, original_price: 189, stock: 60, image: '🔌', tags: ['扩展', 'Type-C'], sales_count: 198, rating: 4.6, created_at: '2025-09-25T00:00:00Z' },
    { id: 7, category_id: 2, name: '便携无线充电板', description: '15W快充，兼容iPhone/安卓/TWS，超薄5mm，多设备同时充电。', price: 79, original_price: 119, stock: 90, image: '⚡', tags: ['快充', '无线'], sales_count: 267, rating: 4.4, created_at: '2025-10-01T00:00:00Z' },
    { id: 8, category_id: 2, name: '学生护眼台灯', description: 'AA级护眼，无频闪无蓝光，5档亮度3色温，USB-C供电，宿舍必备。', price: 149, original_price: 219, stock: 35, image: '💡', tags: ['护眼', '宿舍必备'], sales_count: 524, rating: 4.8, created_at: '2025-10-05T00:00:00Z' },
    { id: 9, category_id: 3, name: '宿舍收纳神器套装', description: '床头挂袋+桌面收纳盒组合，防水布料，分格设计，整洁美观。', price: 45.9, original_price: 69, stock: 180, image: '🗂️', tags: ['收纳', '宿舍'], sales_count: 892, rating: 4.7, created_at: '2025-10-10T00:00:00Z' },
    { id: 10, category_id: 3, name: '304不锈钢保温杯', description: '500ml大容量，316食品级内胆，12小时保温，宽口设计易清洗，配茶隔。', price: 69, original_price: 99, stock: 150, image: '🥤', tags: ['保温', '大容量'], sales_count: 613, rating: 4.8, created_at: '2025-10-15T00:00:00Z' },
    { id: 11, category_id: 3, name: '懒人沙发豆袋', description: '高弹EPS颗粒填充，柔软舒适，可折叠收纳，宿舍休闲必备。', price: 159, original_price: 239, stock: 40, image: '🛋️', tags: ['舒适', '懒人'], sales_count: 178, rating: 4.5, created_at: '2025-10-20T00:00:00Z' },
    { id: 12, category_id: 3, name: '可折叠晾衣架', description: '铝合金材质，一键伸缩折叠，承重15kg，附赠防风夹10个。', price: 35.9, original_price: 55, stock: 220, image: '🪝', tags: ['宿舍', '折叠'], sales_count: 734, rating: 4.6, created_at: '2025-10-25T00:00:00Z' },
    { id: 13, category_id: 4, name: '考研英语真题精析（近10年）', description: '近10年考研英语一真题精析，按题型分类，含解析及答题技巧，必备。', price: 59.9, original_price: 79, stock: 300, image: '📖', tags: ['考研', '英语'], sales_count: 1024, rating: 4.9, created_at: '2025-11-01T00:00:00Z' },
    { id: 14, category_id: 4, name: '数据结构与算法（第2版）', description: '计算机核心课教材，图文并茂，例题丰富，附在线代码，适合期末备考。', price: 49, original_price: 65, stock: 200, image: '💾', tags: ['计算机', '教材'], sales_count: 567, rating: 4.7, created_at: '2025-11-05T00:00:00Z' },
    { id: 15, category_id: 4, name: '高等数学同步辅导练习', description: '配合高数课程，每章含知识点梳理、典型例题、强化练习及历年真题。', price: 38, original_price: 52, stock: 400, image: '📐', tags: ['数学', '辅导书'], sales_count: 789, rating: 4.6, created_at: '2025-11-10T00:00:00Z' },
    { id: 16, category_id: 4, name: '人生哲理与当代青年', description: '知名学者撰写，聚焦大学生成长困惑，语言亲切，适合课余阅读。', price: 36, original_price: 48, stock: 160, image: '📕', tags: ['课外', '成长'], sales_count: 312, rating: 4.8, created_at: '2025-11-15T00:00:00Z' },
    { id: 17, category_id: 5, name: '专业瑜伽垫 加厚版', description: 'TPE材质，10mm加厚防滑，183×61cm，附赠背包带，健身必备。', price: 89, original_price: 139, stock: 70, image: '🧘', tags: ['健身', '防滑'], sales_count: 423, rating: 4.7, created_at: '2025-11-20T00:00:00Z' },
    { id: 18, category_id: 5, name: '跳绳 专业速跳款', description: '铝合金手柄，轴承旋转，绳长可调3.2m，附计数器，减脂训练利器。', price: 29.9, original_price: 49, stock: 200, image: '🪃', tags: ['减脂', '跳绳'], sales_count: 918, rating: 4.6, created_at: '2025-11-25T00:00:00Z' },
    { id: 19, category_id: 5, name: '篮球 室内外通用款', description: '7号标准篮球，超纤皮材质，手感好，适合校内球场日常训练。', price: 129, original_price: 179, stock: 50, image: '🏀', tags: ['篮球', '室外'], sales_count: 234, rating: 4.5, created_at: '2025-12-01T00:00:00Z' },
    { id: 20, category_id: 6, name: '广东特产礼盒套装', description: '精选陈皮、腊肠、鱼干、沙琪玛组合装，精美礼盒包装，孝敬父母。', price: 128, original_price: 168, stock: 100, image: '🎁', tags: ['特产', '礼盒'], sales_count: 536, rating: 4.9, created_at: '2025-12-05T00:00:00Z' },
    { id: 21, category_id: 6, name: '网红奶茶粉（10包装）', description: '芋泥、焦糖、抹茶、黑糖4种口味，宿舍冲泡方便美味，校园热销。', price: 39.9, original_price: 55, stock: 300, image: '🧋', tags: ['网红', '零食'], sales_count: 1203, rating: 4.7, created_at: '2025-12-10T00:00:00Z' },
    { id: 22, category_id: 6, name: '手工曲奇饼干礼盒', description: '师生自制手工曲奇，黄油浓郁，8种造型，每盒500g，无添加新鲜烘焙。', price: 68, original_price: 88, stock: 60, image: '🍪', tags: ['手工', '新鲜'], sales_count: 389, rating: 4.8, created_at: '2025-12-15T00:00:00Z' },
  ]
  writeShopDB(db)
  return db
}

app.get('/api/shop/categories', (req, res) => {
  try {
    const db = ensureShopData()
    const result = db.categories.map(cat => ({
      ...cat,
      product_count: db.products.filter(p => p.category_id === cat.id).length,
    }))
    res.json(result)
  } catch (err) { res.status(500).json({ error: '获取商城分类失败' }) }
})

app.get('/api/shop/products', (req, res) => {
  try {
    const db = ensureShopData()
    const category_id = req.query.category_id ? Number(req.query.category_id) : null
    const keyword = req.query.keyword ? String(req.query.keyword).toLowerCase() : null
    const sort = req.query.sort || 'default'
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12))
    const catMap = Object.fromEntries(db.categories.map(c => [c.id, c.name]))

    let filtered = [...db.products]
    if (category_id) filtered = filtered.filter(p => p.category_id === category_id)
    if (keyword) filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      p.description.toLowerCase().includes(keyword) ||
      p.tags.some(t => t.toLowerCase().includes(keyword))
    )
    if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price)
    else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price)
    else if (sort === 'sales') filtered.sort((a, b) => b.sales_count - a.sales_count)

    const total = filtered.length
    const paged = filtered.slice((page - 1) * limit, page * limit)
    res.json({
      products: paged.map(p => ({ ...p, category_name: catMap[p.category_id] || '' })),
      total, page, limit,
      total_pages: Math.max(1, Math.ceil(total / limit)),
    })
  } catch (err) { res.status(500).json({ error: '获取商品列表失败' }) }
})

app.get('/api/shop/products/:id', (req, res) => {
  try {
    const db = ensureShopData()
    const id = Number(req.params.id)
    const product = db.products.find(p => p.id === id)
    if (!product) return res.status(404).json({ error: '商品不存在' })
    const catMap = Object.fromEntries(db.categories.map(c => [c.id, c.name]))
    res.json({ ...product, category_name: catMap[product.category_id] || '' })
  } catch (err) { res.status(500).json({ error: '获取商品详情失败' }) }
})

app.post('/api/shop/orders', (req, res) => {
  try {
    const db = ensureShopData()
    const { items, total, buyer_name, phone, address, note } = req.body
    if (!items || !items.length || !buyer_name || !phone || !address) return res.status(400).json({ error: '请填写所有必填字段' })
    if (!/^1[3-9]\d{9}$/.test(phone.trim())) return res.status(400).json({ error: '请输入正确的手机号' })
    const order = {
      id: `ORD${Date.now()}`,
      items, total, buyer_name: buyer_name.trim(), phone: phone.trim(),
      address: address.trim(), note: (note || '').trim(),
      status: 'pending', created_at: new Date().toISOString(),
    }
    db.orders.push(order)
    db._meta.next_order_id++
    writeShopDB(db)
    res.status(201).json(order)
  } catch (err) { res.status(500).json({ error: '创建订单失败' }) }
})

app.get('/api/shop/orders', (req, res) => {
  try {
    const db = ensureShopData()
    const orders = [...db.orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    res.json(orders)
  } catch (err) { res.status(500).json({ error: '获取订单失败' }) }
})

// ===================== 通用 =====================
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))
app.use('/api/*', (req, res) => res.status(404).json({ error: '接口不存在' }))

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 广师大论坛后端服务已启动`)
  console.log(`📡 端口：${PORT}`)
  console.log(`🔗 http://localhost:${PORT}/api/health`)
})
