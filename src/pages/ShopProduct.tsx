import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import type { Product } from '../types'
import { getProduct, getProducts } from '../utils/shopApi'
import { addToCart, getCartCount, onCartChange } from '../utils/cartStore'

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: '16px' }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span style={{ color: '#888', marginLeft: '6px', fontSize: '14px' }}>{rating.toFixed(1)} 分</span>
    </span>
  )
}

export default function ShopProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [cartCount, setCartCount] = useState(getCartCount())
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const off = onCartChange(() => setCartCount(getCartCount()))
    return off
  }, [])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setAdded(false)
    setQty(1)
    getProduct(Number(id)).then(async p => {
      setProduct(p)
      if (p) {
        const res = await getProducts({ category_id: p.category_id, limit: 4 })
        setRelated(res.products.filter(r => r.id !== p.id).slice(0, 3))
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  function handleAddToCart() {
    if (!product) return
    addToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    if (!product) return
    addToCart(product, qty)
    navigate('/shop/cart')
  }

  if (loading) return <div className="loading-spinner" style={{ padding: '80px 0' }}>加载中...</div>
  if (!product) return (
    <div style={{ textAlign: 'center', padding: '80px 0' }}>
      <div style={{ fontSize: '3rem' }}>🔍</div>
      <p style={{ color: '#999', margin: '16px 0' }}>商品不存在</p>
      <Link to="/shop" style={{ color: 'var(--color-primary)' }}>返回商城</Link>
    </div>
  )

  const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '60vh', padding: '0 0 48px' }}>
      {/* Breadcrumb */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '12px 0' }}>
        <div className="container-main" style={{ fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>首页</Link>
          <span>›</span>
          <Link to="/shop" style={{ color: '#888', textDecoration: 'none' }}>校园商城</Link>
          <span>›</span>
          <Link to={`/shop?category=${product.category_id}`} style={{ color: '#888', textDecoration: 'none' }}>{product.category_name}</Link>
          <span>›</span>
          <span style={{ color: '#333' }}>{product.name}</span>
        </div>
      </div>

      <div className="container-main" style={{ paddingTop: '24px' }}>
        {/* Product detail card */}
        <div style={{ background: 'white', borderRadius: '4px', border: '1px solid var(--color-border)', padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '40px' }}>
            {/* Left: image */}
            <div>
              <div style={{
                background: 'linear-gradient(135deg, #f0f4fa, #e8edf8)',
                borderRadius: '8px', height: '340px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '8rem', position: 'relative',
              }}>
                {product.image}
                {discount > 0 && (
                  <span style={{
                    position: 'absolute', top: '16px', left: '16px',
                    background: 'var(--color-accent)', color: 'white',
                    fontSize: '13px', fontWeight: '800', padding: '4px 12px', borderRadius: '2px',
                  }}>-{discount}%</span>
                )}
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '16px' }}>
                {product.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '12px', padding: '3px 10px', background: '#f0f4fa', color: 'var(--color-primary)', borderRadius: '2px', border: '1px solid #d4dfff' }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Right: info */}
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-primary)', marginBottom: '8px' }}>{product.category_name}</div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1a1a1a', lineHeight: 1.4, marginBottom: '12px' }}>{product.name}</h1>
              <StarRating rating={product.rating} />
              <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>已售 {product.sales_count} 件</div>

              {/* Price */}
              <div style={{ margin: '20px 0', padding: '16px', background: '#fff8f0', borderRadius: '4px', border: '1px solid #ffe4c4' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--color-accent)' }}>¥{product.price}</span>
                  {product.original_price && (
                    <span style={{ fontSize: '16px', color: '#bbb', textDecoration: 'line-through' }}>¥{product.original_price}</span>
                  )}
                  {discount > 0 && (
                    <span style={{ fontSize: '13px', background: '#ffecec', color: 'var(--color-accent)', padding: '2px 8px', borderRadius: '2px', fontWeight: '700' }}>省¥{(product.original_price! - product.price).toFixed(1)}</span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>校内包邮 · 支持退换货</div>
              </div>

              {/* Stock */}
              <div style={{ fontSize: '13px', color: product.stock > 0 ? '#16a34a' : '#ef4444', marginBottom: '16px' }}>
                {product.stock > 20 ? '库存充足' : product.stock > 0 ? `仅剩 ${product.stock} 件` : '暂无库存'}
              </div>

              {/* Qty selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '14px', color: '#555' }}>数量</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '4px', overflow: 'hidden' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{ width: '36px', height: '36px', border: 'none', background: '#f9fafb', cursor: 'pointer', fontSize: '18px', fontWeight: '700' }}>−</button>
                  <span style={{ width: '48px', textAlign: 'center', fontSize: '15px', fontWeight: '600' }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    style={{ width: '36px', height: '36px', border: 'none', background: '#f9fafb', cursor: 'pointer', fontSize: '18px', fontWeight: '700' }}>+</button>
                </div>
                <span style={{ fontSize: '13px', color: '#aaa' }}>小计 <strong style={{ color: '#333' }}>¥{(product.price * qty).toFixed(2)}</strong></span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  style={{
                    flex: 1, padding: '13px 0', fontSize: '15px', fontWeight: '700',
                    border: '2px solid var(--color-primary)', borderRadius: '4px', cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                    background: added ? '#16a34a' : 'white',
                    color: added ? 'white' : 'var(--color-primary)',
                    transition: 'all 0.2s',
                  }}
                >
                  {added ? '✓ 已加入购物车' : '加入购物车'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  style={{
                    flex: 1, padding: '13px 0', fontSize: '15px', fontWeight: '700',
                    border: 'none', borderRadius: '4px', cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                    background: product.stock === 0 ? '#d1d5db' : 'var(--color-accent)',
                    color: 'white', transition: 'opacity 0.2s',
                  }}
                  onMouseOver={e => { if (product.stock > 0) e.currentTarget.style.opacity = '0.85' }}
                  onMouseOut={e => (e.currentTarget.style.opacity = '1')}
                >
                  立即购买
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ background: 'white', borderRadius: '4px', border: '1px solid var(--color-border)', marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '15px', fontWeight: '700', color: '#333' }}>
            商品详情
          </div>
          <div style={{ padding: '24px', fontSize: '14px', color: '#444', lineHeight: 1.8 }}>
            {product.description}
          </div>
          <div style={{ padding: '0 24px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { icon: '🚚', title: '校内包邮', desc: '校内免运费配送' },
              { icon: '🔒', title: '正品保障', desc: '全程正品保障' },
              { icon: '🔄', title: '7天退换', desc: '质量问题免费退换' },
            ].map(item => (
              <div key={item.title} style={{ padding: '14px', background: '#f8f9ff', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{item.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#333' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div style={{ background: 'white', borderRadius: '4px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e7eb', fontSize: '15px', fontWeight: '700', color: '#333' }}>
              同类推荐
            </div>
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {related.map(r => (
                <Link key={r.id} to={`/shop/product/${r.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card-hover" style={{ border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100px', background: 'linear-gradient(135deg, #f0f4fa, #e8edf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>{r.image}</div>
                    <div style={{ padding: '10px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#222', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{r.name}</div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-accent)', marginTop: '4px' }}>¥{r.price}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white', borderTop: '1px solid #e5e7eb',
        padding: '12px 0', zIndex: 50, boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
      }}>
        <div className="container-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/shop" style={{ color: '#555', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ← 继续购物
            </Link>
            <Link to="/shop/cart" style={{ color: 'var(--color-primary)', fontSize: '14px', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🛒 购物车 {cartCount > 0 && <span style={{ background: 'var(--color-accent)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-accent)' }}>¥{(product.price * qty).toFixed(2)}</span>
            <button onClick={handleBuyNow} disabled={product.stock === 0}
              style={{ padding: '10px 32px', background: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
              立即购买
            </button>
          </div>
        </div>
      </div>
      <div style={{ height: '64px' }} />
    </div>
  )
}
