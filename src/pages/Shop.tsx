import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { ShopCategory, Product } from '../types'
import { getShopCategories, getProducts } from '../utils/shopApi'
import { addToCart, getCartCount, onCartChange } from '../utils/cartStore'

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: '12px' }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span style={{ color: '#999', marginLeft: '4px' }}>{rating.toFixed(1)}</span>
    </span>
  )
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState<ShopCategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(getCartCount())
  const [addedId, setAddedId] = useState<number | null>(null)

  const categoryId = searchParams.get('category') ? Number(searchParams.get('category')) : undefined
  const keyword = searchParams.get('q') || ''
  const sort = (searchParams.get('sort') as 'default' | 'price_asc' | 'price_desc' | 'sales') || 'default'
  const page = Number(searchParams.get('page') || '1')
  const [inputKeyword, setInputKeyword] = useState(keyword)

  useEffect(() => {
    const off = onCartChange(() => setCartCount(getCartCount()))
    return off
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getShopCategories(),
      getProducts({ category_id: categoryId, keyword, sort, page, limit: 12 }),
    ]).then(([cats, result]) => {
      setCategories(cats)
      setProducts(result.products)
      setTotal(result.total)
      setTotalPages(result.total_pages)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [categoryId, keyword, sort, page])

  function setParam(key: string, value: string | undefined) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setSearchParams(next)
  }

  function handleAddToCart(e: React.MouseEvent, product: Product) {
    e.preventDefault()
    addToCart(product, 1)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  const activeCat = categories.find(c => c.id === categoryId)

  return (
    <div>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '32px 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(200,16,46,0.12) 0%, transparent 60%)' }} />
        <div className="container-main" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '2rem' }}>🛒</span>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white', letterSpacing: '2px' }}>校园电子商城</h1>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>
                广师大官方文创 · 校园好物 · 正品保障 · 校内包邮
              </p>
              <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                {[{ icon: '🎓', text: '官方文创' }, { icon: '📦', text: '校内包邮' }, { icon: '🔒', text: '正品保障' }].map(item => (
                  <span key={item.text} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{item.icon}</span>{item.text}
                  </span>
                ))}
              </div>
            </div>
            <Link
              to="/shop/cart"
              style={{
                background: 'var(--color-accent)', color: 'white',
                padding: '12px 28px', borderRadius: '4px', fontWeight: '700',
                fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px',
                textDecoration: 'none', position: 'relative', flexShrink: 0,
              }}
              onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseOut={e => (e.currentTarget.style.opacity = '1')}
            >
              🛒 购物车
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-8px', right: '-8px',
                  background: '#FFD700', color: '#003087',
                  borderRadius: '50%', width: '20px', height: '20px',
                  fontSize: '11px', fontWeight: '900',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '14px 0' }}>
        <div className="container-main">
          <form onSubmit={e => { e.preventDefault(); setParam('q', inputKeyword || undefined) }} style={{ display: 'flex', gap: '10px', maxWidth: '600px' }}>
            <input
              type="text"
              value={inputKeyword}
              onChange={e => setInputKeyword(e.target.value)}
              placeholder="搜索商品名称、标签..."
              style={{
                flex: 1, padding: '9px 14px', border: '1px solid #d1d5db',
                borderRadius: '4px', fontSize: '14px', outline: 'none',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
              onBlur={e => (e.currentTarget.style.borderColor = '#d1d5db')}
            />
            <button type="submit" style={{
              padding: '9px 20px', background: 'var(--color-primary)', color: 'white',
              border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
            }}>搜索</button>
            {keyword && (
              <button type="button" onClick={() => { setInputKeyword(''); setParam('q', undefined) }}
                style={{ padding: '9px 14px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
                清除
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Main content */}
      <div style={{ background: 'var(--color-bg)', padding: '28px 0 48px' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }}>

            {/* Sidebar: categories */}
            <div>
              <div style={{ background: 'white', borderRadius: '4px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', background: 'var(--color-primary)', color: 'white', fontSize: '14px', fontWeight: '700' }}>
                  商品分类
                </div>
                <div>
                  <button
                    onClick={() => setParam('category', undefined)}
                    style={{
                      display: 'block', width: '100%', padding: '11px 16px', textAlign: 'left',
                      fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                      background: !categoryId ? '#f0f4fa' : 'white',
                      color: !categoryId ? 'var(--color-primary)' : '#333',
                      fontWeight: !categoryId ? '700' : '400',
                      borderLeft: !categoryId ? '3px solid var(--color-primary)' : '3px solid transparent',
                    }}
                  >
                    全部商品 <span style={{ color: '#999', fontSize: '12px' }}>({total})</span>
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setParam('category', String(cat.id))}
                      style={{
                        display: 'block', width: '100%', padding: '11px 16px', textAlign: 'left',
                        fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                        borderBottom: '1px solid #f5f5f5',
                        background: categoryId === cat.id ? '#f0f4fa' : 'white',
                        color: categoryId === cat.id ? 'var(--color-primary)' : '#333',
                        fontWeight: categoryId === cat.id ? '700' : '400',
                        borderLeft: categoryId === cat.id ? '3px solid var(--color-primary)' : '3px solid transparent',
                      }}
                    >
                      {cat.icon} {cat.name}
                      <span style={{ color: '#bbb', fontSize: '12px', marginLeft: '4px' }}>({cat.product_count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: product list */}
            <div>
              {/* Filter bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {activeCat ? <><span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{activeCat.icon} {activeCat.name}</span> &nbsp;·&nbsp;</> : ''}
                  共 <strong>{total}</strong> 件商品
                  {keyword && <> · 关键词：<strong style={{ color: 'var(--color-accent)' }}>"{keyword}"</strong></>}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {([
                    { val: 'default', label: '综合' },
                    { val: 'sales', label: '销量' },
                    { val: 'price_asc', label: '价格↑' },
                    { val: 'price_desc', label: '价格↓' },
                  ] as { val: typeof sort; label: string }[]).map(s => (
                    <button key={s.val} onClick={() => setParam('sort', s.val)}
                      style={{
                        padding: '5px 12px', fontSize: '13px', border: '1px solid',
                        borderRadius: '4px', cursor: 'pointer',
                        borderColor: sort === s.val ? 'var(--color-primary)' : '#d1d5db',
                        background: sort === s.val ? 'var(--color-primary)' : 'white',
                        color: sort === s.val ? 'white' : '#555',
                        fontWeight: sort === s.val ? '700' : '400',
                      }}>{s.label}</button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="loading-spinner">加载商品中...</div>
              ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
                  <p>没有找到相关商品</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {products.map(product => (
                      <Link
                        key={product.id}
                        to={`/shop/product/${product.id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <div
                          className="card-hover"
                          style={{ background: 'white', borderRadius: '4px', border: '1px solid var(--color-border)', overflow: 'hidden', cursor: 'pointer' }}
                        >
                          {/* Product image */}
                          <div style={{
                            height: '160px',
                            background: 'linear-gradient(135deg, #f0f4fa, #e8edf8)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '4rem', position: 'relative',
                          }}>
                            {product.image}
                            {product.original_price && (
                              <span style={{
                                position: 'absolute', top: '10px', left: '10px',
                                background: 'var(--color-accent)', color: 'white',
                                fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '2px',
                              }}>
                                -{Math.round((1 - product.price / product.original_price) * 100)}%
                              </span>
                            )}
                            {product.stock <= 5 && product.stock > 0 && (
                              <span style={{
                                position: 'absolute', top: '10px', right: '10px',
                                background: '#f59e0b', color: 'white',
                                fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '2px',
                              }}>仅剩{product.stock}件</span>
                            )}
                          </div>

                          {/* Product info */}
                          <div style={{ padding: '12px' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#222', lineHeight: 1.4, marginBottom: '6px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                              {product.name}
                            </div>
                            <StarRating rating={product.rating} />
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', margin: '6px 0' }}>
                              {product.tags.slice(0, 2).map(tag => (
                                <span key={tag} style={{ fontSize: '11px', padding: '1px 6px', background: '#f0f4fa', color: 'var(--color-primary)', borderRadius: '2px' }}>{tag}</span>
                              ))}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                              <div>
                                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-accent)' }}>¥{product.price}</span>
                                {product.original_price && (
                                  <span style={{ fontSize: '12px', color: '#bbb', textDecoration: 'line-through', marginLeft: '6px' }}>¥{product.original_price}</span>
                                )}
                              </div>
                              <span style={{ fontSize: '11px', color: '#bbb' }}>已售{product.sales_count}</span>
                            </div>
                            <button
                              onClick={e => handleAddToCart(e, product)}
                              style={{
                                marginTop: '10px', width: '100%', padding: '7px 0',
                                background: addedId === product.id ? '#16a34a' : 'var(--color-primary)',
                                color: 'white', border: 'none', borderRadius: '4px',
                                cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                                transition: 'background 0.2s',
                              }}
                            >
                              {addedId === product.id ? '✓ 已加入购物车' : '加入购物车'}
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => { const next = new URLSearchParams(searchParams); next.set('page', String(p)); setSearchParams(next) }}
                          style={{
                            width: '36px', height: '36px', border: '1px solid',
                            borderRadius: '4px', cursor: 'pointer', fontSize: '14px',
                            borderColor: page === p ? 'var(--color-primary)' : '#d1d5db',
                            background: page === p ? 'var(--color-primary)' : 'white',
                            color: page === p ? 'white' : '#555',
                            fontWeight: page === p ? '700' : '400',
                          }}>{p}</button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
