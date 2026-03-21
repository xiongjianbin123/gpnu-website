import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Forum from './pages/Forum'
import ForumCategory from './pages/ForumCategory'
import ForumPost from './pages/ForumPost'
import NewPost from './pages/NewPost'

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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
