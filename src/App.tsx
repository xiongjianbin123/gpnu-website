import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Forum from './pages/Forum'
import ForumCategory from './pages/ForumCategory'
import ForumPost from './pages/ForumPost'
import NewPost from './pages/NewPost'
import Shop from './pages/Shop'
import ShopProduct from './pages/ShopProduct'
import ShopCart from './pages/ShopCart'
import ShopCheckout from './pages/ShopCheckout'
import ShopOrders from './pages/ShopOrders'

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/category/:id" element={<ForumCategory />} />
            <Route path="/forum/post/new" element={<NewPost />} />
            <Route path="/forum/post/:id" element={<ForumPost />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/product/:id" element={<ShopProduct />} />
            <Route path="/shop/cart" element={<ShopCart />} />
            <Route path="/shop/checkout" element={<ShopCheckout />} />
            <Route path="/shop/orders" element={<ShopOrders />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
