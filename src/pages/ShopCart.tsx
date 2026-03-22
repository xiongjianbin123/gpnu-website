import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { CartItem } from '../types'
import { getCart, updateCartQty, removeFromCart, getCartTotal, onCartChange } from '../utils/cartStore'

export default function ShopCart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState<CartItem[]>(getCart())
  const [removed, setRemoved] = useState<number | null>(null)

  useEffect(() => {
    const off = onCartChange(() => setCart(getCart()))
    return off
  }, [])

  function handleRemove(product_id: number) {
    setRemoved(product_id)
    setTimeout(() => {
      removeFromCart(product_id)
      setRemoved(null)
    }, 300)
  }

  const total = getCartTotal()
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '60vh', padding: '0 0 48px' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
        <div className="container-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/shop" style={{ color: '#888', fontSize: '14px', textDecoration: 'none' }}>← 继续购物</Link>
            <h1 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1a1a1a' }}>
              购物车 {cart.length > 0 && <span style={{ fontSize: '14px', color: '#888', fontWeight: '400' }}>（{itemCount} 件商品）</span>}
            </h1>
          </div>
          <div style={{ fontSize: '13px', color: '#888' }}>
            <Link to="/shop/orders" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>查看我的订单 →</Link>
          </div>
        </div>
      </div>

      <div className="container-main" style={{ paddingTop: '24px' }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', background: 'white', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
            <p style={{ fontSize: '16px', color: '#888', marginBottom: '24px' }}>购物车是空的，去挑选喜欢的商品吧~</p>
            <Link to="/shop" style={{ padding: '12px 32px', background: 'var(--color-primary)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>
              去逛逛
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
            {/* Cart items */}
            <div>
              <div style={{ background: 'white', borderRadius: '4px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 80px', padding: '12px 20px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '13px', color: '#888', fontWeight: '600' }}>
                  <span>商品</span><span style={{ textAlign: 'center' }}>数量</span><span style={{ textAlign: 'center' }}>单价</span><span style={{ textAlign: 'right' }}>小计</span>
                </div>

                {cart.map((item, idx) => (
                  <div
                    key={item.product_id}
                    style={{
                      display: 'grid', gridTemplateColumns: '1fr 120px 100px 80px',
                      padding: '16px 20px', borderBottom: idx < cart.length - 1 ? '1px solid #f5f5f5' : 'none',
                      alignItems: 'center', opacity: removed === item.product_id ? 0.3 : 1,
                      transition: 'opacity 0.3s',
                    }}
                  >
                    {/* Product info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <Link to={`/shop/product/${item.product_id}`}>
                        <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #f0f4fa, #e8edf8)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
                          {item.product.image}
                        </div>
                      </Link>
                      <div>
                        <Link to={`/shop/product/${item.product_id}`} style={{ textDecoration: 'none' }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#222', lineHeight: 1.4, marginBottom: '4px' }}>{item.product.name}</div>
                        </Link>
                        <div style={{ fontSize: '12px', color: '#aaa' }}>{item.product.category_name}</div>
                        <button
                          onClick={() => handleRemove(item.product_id)}
                          style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '4px' }}
                        >删除</button>
                      </div>
                    </div>

                    {/* Qty */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '4px', overflow: 'hidden' }}>
                        <button onClick={() => updateCartQty(item.product_id, item.quantity - 1)}
                          style={{ width: '28px', height: '28px', border: 'none', background: '#f9fafb', cursor: 'pointer', fontSize: '16px' }}>−</button>
                        <span style={{ width: '36px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.product_id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          style={{ width: '28px', height: '28px', border: 'none', background: '#f9fafb', cursor: item.quantity >= item.product.stock ? 'not-allowed' : 'pointer', fontSize: '16px' }}>+</button>
                      </div>
                    </div>

                    {/* Unit price */}
                    <div style={{ textAlign: 'center', fontSize: '14px', color: '#555' }}>¥{item.product.price}</div>

                    {/* Subtotal */}
                    <div style={{ textAlign: 'right', fontSize: '15px', fontWeight: '700', color: 'var(--color-accent)' }}>
                      ¥{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div>
              <div style={{ background: 'white', borderRadius: '4px', border: '1px solid var(--color-border)', overflow: 'hidden', position: 'sticky', top: '20px' }}>
                <div style={{ padding: '14px 16px', background: 'var(--color-primary)', color: 'white', fontSize: '14px', fontWeight: '700' }}>订单汇总</div>
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                    <span>商品数量</span><span>{itemCount} 件</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                    <span>商品总价</span><span>¥{total.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#16a34a', marginBottom: '10px' }}>
                    <span>运费</span><span>校内包邮</span>
                  </div>
                  <div style={{ height: '1px', background: '#e5e7eb', margin: '12px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '800', color: '#1a1a1a', marginBottom: '16px' }}>
                    <span>合计</span>
                    <span style={{ color: 'var(--color-accent)' }}>¥{total.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => navigate('/shop/checkout')}
                    style={{ width: '100%', padding: '13px 0', background: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '800', fontSize: '16px' }}
                    onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
                    onMouseOut={e => (e.currentTarget.style.opacity = '1')}
                  >
                    结算 ({itemCount} 件)
                  </button>
                  <div style={{ marginTop: '12px', fontSize: '12px', color: '#aaa', textAlign: 'center' }}>
                    正品保障 · 7天退换 · 校内包邮
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
