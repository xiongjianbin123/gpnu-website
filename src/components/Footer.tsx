import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: '#1a1a2e', color: '#ccc', marginTop: 'auto' }}>
      {/* Main footer content */}
      <div className="container-main" style={{ padding: '40px 16px 30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
          {/* School info */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '14px', fontSize: '15px', fontWeight: '600', paddingBottom: '8px', borderBottom: '2px solid var(--color-accent)' }}>
              广东技术师范大学
            </h4>
            <div style={{ fontSize: '13px', lineHeight: '2', color: '#aaa' }}>
              <p>地址：广州市天河区中山大道西293号</p>
              <p>邮编：510665</p>
              <p>电话：020-36549114</p>
              <p>传真：020-36549116</p>
              <p>邮箱：webmaster@gpnu.edu.cn</p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '14px', fontSize: '15px', fontWeight: '600', paddingBottom: '8px', borderBottom: '2px solid var(--color-accent)' }}>
              快速链接
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              {['教务系统', '图书馆', '邮件系统', '学工系统', '科研系统', '财务系统', '人事系统', '网络中心'].map(link => (
                <a
                  key={link}
                  href="#"
                  style={{ color: '#aaa', fontSize: '13px', padding: '3px 0', transition: 'color 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.color = 'white')}
                  onMouseOut={e => (e.currentTarget.style.color = '#aaa')}
                >
                  · {link}
                </a>
              ))}
            </div>
          </div>

          {/* Campus links */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '14px', fontSize: '15px', fontWeight: '600', paddingBottom: '8px', borderBottom: '2px solid var(--color-accent)' }}>
              校区导览
            </h4>
            <div style={{ fontSize: '13px', color: '#aaa', lineHeight: '2' }}>
              <p>天河校区：天河区中山大道西293号</p>
              <p>白云校区：白云区松洲街棠景街道</p>
              <p>番禺校区：番禺区石楼镇</p>
            </div>
            <div style={{ marginTop: '12px' }}>
              <Link
                to="/forum"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--color-accent)',
                  color: 'white',
                  padding: '7px 14px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseOut={e => (e.currentTarget.style.opacity = '1')}
              >
                💬 大学生论坛
              </Link>
            </div>
          </div>

          {/* Friendly links */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '14px', fontSize: '15px', fontWeight: '600', paddingBottom: '8px', borderBottom: '2px solid var(--color-accent)' }}>
              友情链接
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                '教育部', '广东省教育厅', '广东省人社厅',
                '中国知网', '万方数据', '超星学习通'
              ].map(link => (
                <a
                  key={link}
                  href="#"
                  style={{ color: '#aaa', fontSize: '13px', transition: 'color 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.color = 'white')}
                  onMouseOut={e => (e.currentTarget.style.color = '#aaa')}
                >
                  · {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div style={{ background: '#111120', padding: '14px 16px', textAlign: 'center', fontSize: '12px', color: '#777', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <span>版权所有 © 2024 广东技术师范大学</span>
        <span style={{ margin: '0 12px' }}>|</span>
        <a href="#" style={{ color: '#777' }}>粤ICP备05007799号</a>
        <span style={{ margin: '0 12px' }}>|</span>
        <span>技术支持：信息化建设与管理处</span>
        <span style={{ margin: '0 12px' }}>|</span>
        <a href="#" style={{ color: '#777' }}>隐私政策</a>
      </div>
    </footer>
  )
}
