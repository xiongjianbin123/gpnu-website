import type { CartItem, Product } from '../types'

const CART_KEY = 'gpnu_shop_cart'
const CART_CHANGE_EVENT = 'gpnu_cart_change'

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(CART_CHANGE_EVENT))
}

export function addToCart(product: Product, quantity = 1) {
  const cart = getCart()
  const idx = cart.findIndex(item => item.product_id === product.id)
  if (idx !== -1) {
    cart[idx].quantity = Math.min(cart[idx].quantity + quantity, product.stock)
  } else {
    cart.push({ product_id: product.id, product, quantity: Math.min(quantity, product.stock) })
  }
  saveCart(cart)
}

export function updateCartQty(product_id: number, quantity: number) {
  const cart = getCart()
  const idx = cart.findIndex(item => item.product_id === product_id)
  if (idx === -1) return
  if (quantity <= 0) {
    cart.splice(idx, 1)
  } else {
    cart[idx].quantity = Math.min(quantity, cart[idx].product.stock)
  }
  saveCart(cart)
}

export function removeFromCart(product_id: number) {
  saveCart(getCart().filter(item => item.product_id !== product_id))
}

export function clearCart() {
  saveCart([])
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0)
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
}

export function onCartChange(cb: () => void): () => void {
  window.addEventListener(CART_CHANGE_EVENT, cb)
  return () => window.removeEventListener(CART_CHANGE_EVENT, cb)
}
