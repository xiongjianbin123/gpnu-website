import { useState, useEffect } from 'react'

const slides = [
  {
    id: 1,
    gradient: 'linear-gradient(135deg, #003087 0%, #0055b3 40%, #004bb5 60%, #001a5e 100%)',
    title: '立德树人  强工兴师',
    subtitle: '培养高素质应用型人才，服务广东经济社会发展',
    tag: '校训',
    overlay: 'rgba(0,0,0,0.25)'
  },
  {
    id: 2,
    gradient: 'linear-gradient(135deg, #1a3a6b 0%, #003087 30%, #C8102E 80%, #8b0000 100%)',
    title: '双一流建设  高质量发展',
    subtitle: '聚焦职教师资培养，打造一流应用型大学',
    tag: '战略',
    overlay: 'rgba(0,0,0,0.3)'
  },
  {
    id: 3,
    gradient: 'linear-gradient(135deg, #002060 0%, #003087 50%, #004d99 75%, #0066cc 100%)',
    title: '2024年招生简章正式发布',
    subtitle: '广东技术师范大学欢迎莘莘学子，共创美好未来',
    tag: '招生',
    overlay: 'rgba(0,0,0,0.2)'
  }
]

export default function Banner() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (indexOrFn: number | ((prev: number) => number)) => {
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(typeof indexOrFn === 'function' ? indexOrFn(current) : indexOrFn)
      setTransitioning(false)
    }, 300)
  }

  const slide = slides[current]

  return (
    <div style={{ position: 'relative', height: '460px', overflow: 'hidden', background: '#001a4d' }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: slide.gradient,
        opacity: transitioning ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '50%', left: '60%', width: '200px', height: '200px', background: 'rgba(255,215,0,0.06)', borderRadius: '50%', transform: 'translateY(-50%)' }} />
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 80px',
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? 'translateY(10px)' : 'translateY(0)',
        transition: 'all 0.6s ease'
      }}>
        <div>
          <div style={{
            display: 'inline-block',
            background: 'var(--color-accent)',
            color: 'white',
            padding: '4px 14px',
            borderRadius: '3px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '20px',
            letterSpacing: '2px'
          }}>
            {slide.tag}
          </div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: '800',
            color: 'white',
            marginBottom: '16px',
            letterSpacing: '4px',
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            lineHeight: 1.2
          }}>
            {slide.title}
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.85)',
            marginBottom: '28px',
            maxWidth: '520px',
            lineHeight: 1.7
          }}>
            {slide.subtitle}
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="#" style={{
              padding: '11px 28px',
              background: 'var(--color-accent)',
              color: 'white',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'opacity 0.2s',
              display: 'inline-block'
            }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={e => (e.currentTarget.style.opacity = '1')}
            >
              了解更多
            </a>
            <a href="#" style={{
              padding: '10px 28px',
              border: '2px solid rgba(255,255,255,0.7)',
              color: 'white',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.borderColor = 'white'
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'
            }}
            >
              招生信息
            </a>
          </div>
        </div>

        {/* Right decorative element */}
        <div style={{ position: 'absolute', right: '80px', top: '50%', transform: 'translateY(-50%)', textAlign: 'center', opacity: 0.15 }}>
          <div style={{ fontSize: '12rem', fontWeight: '900', color: 'white', lineHeight: 1, letterSpacing: '-8px' }}>
            广师
          </div>
        </div>
      </div>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 3 }}>
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? '28px' : '10px',
              height: '10px',
              borderRadius: '5px',
              background: i === current ? 'white' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        style={{
          position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
          color: 'white', width: '40px', height: '40px', borderRadius: '50%',
          cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 3, transition: 'background 0.2s'
        }}
        onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
        onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
      >
        ‹
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        style={{
          position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
          color: 'white', width: '40px', height: '40px', borderRadius: '50%',
          cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 3, transition: 'background 0.2s'
        }}
        onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
        onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
      >
        ›
      </button>
    </div>
  )
}
