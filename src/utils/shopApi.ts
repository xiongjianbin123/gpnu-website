import type { ShopCategory, Product, Order } from '../types'
import { mockShopCategories, mockProducts } from '../mock/shopData'

const IS_PROD = import.meta.env.PROD

function delay(ms = 100): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// In-memory mutable copy for prod mock
let _products = [...mockProducts]
let _orders: Order[] = []
let _nextOrderId = 1001

// ---- Orders stored in localStorage (prod fallback) ----
const ORDERS_KEY = 'gpnu_shop_orders'
function loadOrders(): Order[] {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]') } catch { return [] }
}
function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export async function getShopCategories(): Promise<ShopCategory[]> {
  if (!IS_PROD) {
    const res = await fetch('/api/shop/categories')
    return res.json()
  }
  await delay()
  return mockShopCategories.map(cat => ({
    ...cat,
    product_count: _products.filter(p => p.category_id === cat.id).length,
  }))
}

export async function getProducts(params: {
  category_id?: number
  keyword?: string
  sort?: 'default' | 'price_asc' | 'price_desc' | 'sales'
  page?: number
  limit?: number
}): Promise<{ products: Product[]; total: number; page: number; total_pages: number }> {
  const { category_id, keyword, sort = 'default', page = 1, limit = 12 } = params
  if (!IS_PROD) {
    const qs = new URLSearchParams()
    if (category_id) qs.set('category_id', String(category_id))
    if (keyword) qs.set('keyword', keyword)
    qs.set('sort', sort)
    qs.set('page', String(page))
    qs.set('limit', String(limit))
    const res = await fetch(`/api/shop/products?${qs.toString()}`)
    return res.json()
  }
  await delay()
  let filtered = [..._products]
  if (category_id) filtered = filtered.filter(p => p.category_id === category_id)
  if (keyword) {
    const kw = keyword.toLowerCase()
    filtered = filtered.filter(p => p.name.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw) || p.tags.some(t => t.toLowerCase().includes(kw)))
  }
  if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price)
  else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price)
  else if (sort === 'sales') filtered.sort((a, b) => b.sales_count - a.sales_count)
  const total = filtered.length
  const sliced = filtered.slice((page - 1) * limit, page * limit)
  const catMap = Object.fromEntries(mockShopCategories.map(c => [c.id, c.name]))
  return {
    products: sliced.map(p => ({ ...p, category_name: catMap[p.category_id] || '' })),
    total,
    page,
    total_pages: Math.max(1, Math.ceil(total / limit)),
  }
}

export async function getProduct(id: number): Promise<Product | null> {
  if (!IS_PROD) {
    const res = await fetch(`/api/shop/products/${id}`)
    if (!res.ok) return null
    return res.json()
  }
  await delay()
  const product = _products.find(p => p.id === id)
  if (!product) return null
  const catMap = Object.fromEntries(mockShopCategories.map(c => [c.id, c.name]))
  return { ...product, category_name: catMap[product.category_id] || '' }
}

export async function createOrder(data: {
  items: { product_id: number; name: string; price: number; quantity: number; image: string }[]
  total: number
  buyer_name: string
  phone: string
  address: string
  note: string
}): Promise<Order> {
  if (!IS_PROD) {
    const res = await fetch('/api/shop/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  }
  await delay(300)
  const orders = loadOrders()
  const order: Order = {
    id: `ORD${Date.now()}`,
    ...data,
    status: 'pending',
    created_at: new Date().toISOString(),
  }
  orders.push(order)
  saveOrders(orders)
  _nextOrderId++
  return order
}

export async function getOrders(): Promise<Order[]> {
  if (!IS_PROD) {
    const res = await fetch('/api/shop/orders')
    return res.json()
  }
  await delay()
  return loadOrders().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}
