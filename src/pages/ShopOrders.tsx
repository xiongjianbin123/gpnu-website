import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Order } from '../types'
import { getOrders } from '../utils/shopApi'

const STATUS_MAP = {
  pending: { label: '待处理', color: '#f59e0b', bg: '#fff8e6' },
  paid: { label: '已付款', color: '#3b82f6', bg: '#eff6ff' },
  shipped: { label: '配送中', color: '#8b5cf6', bg: '#f5f3ff' },
  done: { label: '已完成', color: '#16a34a', bg: '#f0fdf4' },
}

export default function ShopOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders().then(data => { setOrders(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  function formatTime(dt: string) {
    return new Date(dt).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '60vh', padding: '0 0 48px' }}>
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
        <div className="container-main" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/shop" style={{ color: '#888', fontSize: '14px', textDecoration: 'none' }}>← 返回商城</Link>
          <h1 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1a1a1a' }}>我的订单</h1>
        </div>
      </div>

      <div className="container-main" style={{ paddingTop: '24px', maxWidth: '800px' }}>
        {loading ? (
          <div className="loading-spinner">加载订单中...</div>
        ) : orders.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '4px', border: '1px solid var(--color-border)', textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>📦</div>
            <p style={{ color: '#888', fontSize: '15px', marginBottom: '24px' }}>还没有订单记录</p>
            <Link to="/shop" style={{ padding: '11px 28px', background: 'var(--color-primary)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: '700' }}>
              去购物
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map(order => {
              const status = STATUS_MAP[order.status]
              return (
                <div key={order.id} style={{ background: 'white', borderRadius: '4px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                  {/* Order header */}
                  <div style={{ padding: '12px 20px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '13px', color: '#888' }}>
                      订单号：<strong style={{ color: '#333' }}>{order.id}</strong>
                      <span style={{ marginLeft: '16px' }}>{formatTime(order.created_at)}</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '12px', background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                  </div>

                  {/* Items */}
                  <div style={{ padding: '12px 20px' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: idx < order.items.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                        <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #f0f4fa, #e8edf8)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                          {item.image}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>¥{item.price} × {item.quantity}</div>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#333' }}>¥{(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  {/* Order footer */}
                  <div style={{ padding: '12px 20px', borderTop: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '13px', color: '#888' }}>
                      收货人：{order.buyer_name} · {order.phone} · {order.address}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-accent)' }}>
                      合计 ¥{order.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
