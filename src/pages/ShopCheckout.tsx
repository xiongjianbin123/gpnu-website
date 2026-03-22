import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { CartItem, Order } from '../types'
import { getCart, getCartTotal, clearCart } from '../utils/cartStore'
import { createOrder } from '../utils/shopApi'

type FormField = 'buyer_name' | 'phone' | 'address' | 'note'

export default function ShopCheckout() {
  const navigate = useNavigate()
  const [cart, setCart] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [form, setForm] = useState({ buyer_name: '', phone: '', address: '', note: '' })
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({})

  useEffect(() => {
    const c = getCart()
    if (c.length === 0) { navigate('/shop/cart'); return }
    setCart(c)
    setTotal(getCartTotal())
  }, [navigate])

  function validate(): boolean {
    const errs: Partial<Record<FormField, string>> = {}
    if (!form.buyer_name.trim()) errs.buyer_name = '请填写收货人姓名'
    else if (form.buyer_name.trim().length > 20) errs.buyer_name = '姓名不超过20个字符'
    if (!form.phone.trim()) errs.phone = '请填写手机号'
    else if (!/^1[3-9]\d{9}$/.test(form.phone.trim())) errs.phone = '请输入正确的手机号格式'
    if (!form.address.trim()) errs.address = '请填写收货地址'
    else if (form.address.trim().length < 5) errs.address = '地址至少5个字符'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const result = await createOrder({
        items: cart.map(item => ({ product_id: item.product_id, name: item.product.name, price: item.product.price, quantity: item.quantity, image: item.product.image })),
        total,
        buyer_name: form.buyer_name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        note: form.note.trim(),
      })
      clearCart()
      setOrder(result)
    } catch {
      alert('提交订单失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  function InputField({ field, label, placeholder, type = 'text', required = true }: { field: FormField; label: string; placeholder: string; type?: string; required?: boolean }) {
    return (
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '6px' }}>
          {label}{required && <span style={{ color: 'var(--color-accent)' }}> *</span>}
        </label>
        {field === 'note' ? (
          <textarea
            value={form[field]}
            onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(err => ({ ...err, [field]: undefined })) }}
            placeholder={placeholder}
            rows={3}
            style={{ width: '100%', padding: '9px 12px', border: `1px solid ${errors[field] ? '#ef4444' : '#d1d5db'}`, borderRadius: '4px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
          />
        ) : (
          <input
            type={type}
            value={form[field]}
            onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(err => ({ ...err, [field]: undefined })) }}
            placeholder={placeholder}
            style={{ width: '100%', padding: '9px 12px', border: `1px solid ${errors[field] ? '#ef4444' : '#d1d5db'}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
            onFocus={e => (e.currentTarget.style.borderColor = errors[field] ? '#ef4444' : 'var(--color-primary)')}
            onBlur={e => (e.currentTarget.style.borderColor = errors[field] ? '#ef4444' : '#d1d5db')}
          />
        )}
        {errors[field] && <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>{errors[field]}</p>}
      </div>
    )
  }

  // ---- Success page ----
  if (order) {
    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '60vh', padding: '48px 0' }}>
        <div className="container-main" style={{ maxWidth: '560px' }}>
          <div style={{ background: 'white', borderRadius: '8px', border: '1px solid var(--color-border)', padding: '48px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#16a34a', marginBottom: '8px' }}>订单提交成功！</h1>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>订单号：<strong style={{ color: 'var(--color-primary)' }}>{order.id}</strong></p>

            <div style={{ background: '#f8f9ff', borderRadius: '4px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ fontSize: '13px', color: '#555', lineHeight: 2 }}>
                <div><strong>收货人：</strong>{order.buyer_name}</div>
                <div><strong>手机号：</strong>{order.phone}</div>
                <div><strong>收货地址：</strong>{order.address}</div>
                <div><strong>订单金额：</strong><span style={{ color: 'var(--color-accent)', fontWeight: '800' }}>¥{order.total.toFixed(2)}</span></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/shop" style={{ padding: '10px 24px', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', borderRadius: '4px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
                继续购物
              </Link>
              <Link to="/shop/orders" style={{ padding: '10px 24px', background: 'var(--color-primary)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
                查看订单
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '60vh', padding: '0 0 48px' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
        <div className="container-main">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/shop/cart" style={{ color: '#888', fontSize: '14px', textDecoration: 'none' }}>← 返回购物车</Link>
            <h1 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1a1a1a' }}>填写订单信息</h1>
          </div>
        </div>
      </div>

      <div className="container-main" style={{ paddingTop: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px' }}>

          {/* Left: form */}
          <form onSubmit={handleSubmit}>
            <div style={{ background: 'white', borderRadius: '4px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '15px', fontWeight: '700', color: '#333' }}>
                收货信息
              </div>
              <div style={{ padding: '24px' }}>
                <InputField field="buyer_name" label="收货人姓名" placeholder="请填写真实姓名" />
                <InputField field="phone" label="手机号码" placeholder="请填写手机号" type="tel" />
                <InputField field="address" label="收货地址" placeholder="请填写详细地址，例如：北校区3栋501" />
                <InputField field="note" label="备注" placeholder="有什么要提醒卖家的？（可选）" required={false} />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: '16px', width: '100%', padding: '14px 0',
                background: submitting ? '#9ca3af' : 'var(--color-accent)',
                color: 'white', border: 'none', borderRadius: '4px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: '800', fontSize: '16px',
              }}
            >
              {submitting ? '提交中...' : `提交订单 · ¥${total.toFixed(2)}`}
            </button>
          </form>

          {/* Right: order summary */}
          <div>
            <div style={{ background: 'white', borderRadius: '4px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', background: 'var(--color-primary)', color: 'white', fontSize: '14px', fontWeight: '700' }}>
                订单商品 ({cart.reduce((s, i) => s + i.quantity, 0)} 件)
              </div>
              <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                {cart.map((item, idx) => (
                  <div key={item.product_id} style={{ display: 'flex', gap: '12px', padding: '12px 16px', borderBottom: idx < cart.length - 1 ? '1px solid #f5f5f5' : 'none', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #f0f4fa, #e8edf8)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                      {item.product.image}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</div>
                      <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>x{item.quantity}</div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-accent)', flexShrink: 0 }}>
                      ¥{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                  <span>商品总价</span><span>¥{total.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#16a34a', marginBottom: '12px' }}>
                  <span>运费</span><span>校内包邮</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '800', color: '#1a1a1a' }}>
                  <span>合计</span>
                  <span style={{ color: 'var(--color-accent)' }}>¥{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '12px', padding: '12px', background: '#f8f9ff', borderRadius: '4px', border: '1px solid #d4dfff', fontSize: '12px', color: '#555', lineHeight: 1.8 }}>
              <strong style={{ color: 'var(--color-primary)' }}>温馨提示</strong><br />
              · 仅限校内配送，请填写宿舍/楼栋信息<br />
              · 商品质量问题可申请7天退换<br />
              · 如有疑问可在备注中说明
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
