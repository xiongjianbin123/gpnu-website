import { Link } from 'react-router-dom'
import Banner from '../components/Banner'

const majorNews = [
  { id: 1, title: '我校召开2024年度工作总结暨表彰大会', date: '2024-12-28' },
  { id: 2, title: '广东技术师范大学入选广东省高水平大学建设高校', date: '2024-12-20' },
  { id: 3, title: '我校举办第十届"挑战杯"广东省大学生课外学术科技作品竞赛', date: '2024-12-15' },
  { id: 4, title: '学校与广东省电力有限公司签署战略合作协议', date: '2024-12-10' },
  { id: 5, title: '我校教师荣获全国职业院校技能大赛优秀指导教师称号', date: '2024-12-05' },
  { id: 6, title: '广东技术师范大学2025年硕士研究生招生简章发布', date: '2024-11-28' },
]

const generalNews = [
  { id: 7, title: '信息工程学院举办人工智能技术应用研讨会', date: '2024-12-26' },
  { id: 8, title: '我校学生在全国大学生数学建模竞赛中获佳绩', date: '2024-12-22' },
  { id: 9, title: '机械与电气工程学院开展企业参观实习活动', date: '2024-12-18' },
  { id: 10, title: '计算机科学学院2024届毕业生就业率达98.5%', date: '2024-12-14' },
]

const notices = [
  { id: 1, title: '关于2025年春季学期开学安排的通知', date: '2024-12-27', type: '教务' },
  { id: 2, title: '关于申报2025年度校级科研项目的通知', date: '2024-12-24', type: '科研' },
  { id: 3, title: '关于开展2024年度年终财务结账工作的通知', date: '2024-12-22', type: '财务' },
  { id: 4, title: '2024年冬季运动会暨体育节活动安排', date: '2024-12-20', type: '学工' },
  { id: 5, title: '关于图书馆寒假开放时间调整的通知', date: '2024-12-18', type: '图书馆' },
  { id: 6, title: '2025年研究生复试时间及要求公告', date: '2024-12-15', type: '研招' },
  { id: 7, title: '关于开展2024年教职工年度考核工作的通知', date: '2024-12-12', type: '人事' },
  { id: 8, title: '计算机中心：校园网计划维护升级公告', date: '2024-12-10', type: '网络' },
]

const academicEvents = [
  {
    id: 1,
    title: '人工智能与职业教育融合发展高峰论坛',
    date: '2025-01-08',
    location: '天河校区学术报告厅',
    type: '论坛'
  },
  {
    id: 2,
    title: '第十二届广东省研究生学术论坛（工学）',
    date: '2025-01-05',
    location: '白云校区图书馆报告厅',
    type: '学术'
  },
  {
    id: 3,
    title: '量子计算与信息安全专题讲座',
    date: '2024-12-30',
    location: '信息工程学院 208 报告室',
    type: '讲座'
  },
  {
    id: 4,
    title: '2024年度"挑战杯"创新创业大赛校内选拔赛',
    date: '2024-12-28',
    location: '大学生活动中心',
    type: '竞赛'
  },
]

const stats = [
  { num: '26000+', label: '在校学生' },
  { num: '1800+', label: '教职工', unit: '人' },
  { num: '18', label: '二级学院', unit: '个' },
  { num: '3.2亿', label: '年科研经费', unit: '元' },
  { num: '68+', label: '本科专业', unit: '个' },
  { num: '95%+', label: '就业率' },
]

const typeColors: Record<string, string> = {
  '教务': '#003087', '科研': '#5b21b6', '财务': '#b45309', '学工': '#065f46',
  '图书馆': '#1e40af', '研招': '#c2410c', '人事': '#be123c', '网络': '#0e7490',
  '论坛': '#7c3aed', '学术': '#0369a1', '讲座': '#065f46', '竞赛': '#c2410c'
}

export default function Home() {
  return (
    <div>
      {/* Banner */}
      <Banner />

      {/* Stats bar */}
      <div style={{ background: 'var(--color-primary)', padding: '0' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.1)' }}>
            {stats.map(stat => (
              <div
                key={stat.label}
                style={{ background: 'var(--color-primary)', padding: '20px 16px', textAlign: 'center' }}
              >
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#FFD700', lineHeight: 1 }}>
                  {stat.num}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginTop: '6px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ background: 'var(--color-bg)', padding: '32px 0' }}>
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Major news */}
              <div style={{ background: 'white', padding: '20px 24px', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div className="section-title">
                  <span>学校要闻</span>
                  <a href="#" className="more-link">更多 &rsaquo;</a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                  {majorNews.map(item => (
                    <div key={item.id} className="news-item" style={{ cursor: 'pointer' }}>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.title}
                      </span>
                      <span className="date">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* General news + Academic events side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* General news */}
                <div style={{ background: 'white', padding: '20px 24px', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div className="section-title">
                    <span>综合新闻</span>
                    <a href="#" className="more-link">更多 &rsaquo;</a>
                  </div>
                  {generalNews.map(item => (
                    <div key={item.id} className="news-item">
                      <span style={{ flex: 1 }}>{item.title}</span>
                      <span className="date">{item.date}</span>
                    </div>
                  ))}
                </div>

                {/* Academic events */}
                <div style={{ background: 'white', padding: '20px 24px', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div className="section-title">
                    <span>学术活动</span>
                    <a href="#" className="more-link">更多 &rsaquo;</a>
                  </div>
                  {academicEvents.map(item => (
                    <div key={item.id} style={{ padding: '10px 0', borderBottom: '1px dashed #eee', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          background: typeColors[item.type] || '#666',
                          color: 'white',
                          fontSize: '11px',
                          padding: '1px 6px',
                          borderRadius: '2px',
                          flexShrink: 0
                        }}>
                          {item.type}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.title}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#999', paddingLeft: '2px' }}>
                        📅 {item.date} &nbsp; 📍 {item.location}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Forum promo */}
              <div style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, #004bb5 100%)',
                borderRadius: '4px',
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(0,48,135,0.2)'
              }}>
                <div>
                  <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>
                    💬 大学生论坛
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>
                    分享校园生活，交流学习心得，连接广师学子
                  </p>
                </div>
                <Link
                  to="/forum"
                  style={{
                    background: 'var(--color-accent)',
                    color: 'white',
                    padding: '10px 24px',
                    borderRadius: '4px',
                    fontWeight: '600',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'opacity 0.2s',
                    display: 'inline-block'
                  }}
                  onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseOut={e => (e.currentTarget.style.opacity = '1')}
                >
                  进入论坛 &rarr;
                </Link>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Notices */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div className="section-title">
                  <span>通知公告</span>
                  <a href="#" className="more-link">更多 &rsaquo;</a>
                </div>
                {notices.map(item => (
                  <div key={item.id} style={{ padding: '8px 0', borderBottom: '1px dashed #f0f0f0', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{
                      background: typeColors[item.type] || '#999',
                      color: 'white',
                      fontSize: '10px',
                      padding: '1px 5px',
                      borderRadius: '2px',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {item.type}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', color: '#333', lineHeight: 1.4, marginBottom: '2px' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#bbb' }}>{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick portals */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div className="section-title">
                  <span>服务门户</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { icon: '📚', label: '教务系统', color: '#003087' },
                    { icon: '📖', label: '图书馆', color: '#7c3aed' },
                    { icon: '💰', label: '财务服务', color: '#b45309' },
                    { icon: '🔬', label: '科研系统', color: '#065f46' },
                    { icon: '💼', label: '就业中心', color: '#c2410c' },
                    { icon: '🏥', label: '校医院', color: '#be123c' },
                    { icon: '🏠', label: '后勤服务', color: '#0369a1' },
                    { icon: '💬', label: '大学生论坛', color: '#C8102E', link: '/forum' },
                  ].map(portal => (
                    portal.link ? (
                      <Link
                        key={portal.label}
                        to={portal.link}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          background: '#f8f9ff',
                          border: `1px solid ${portal.color}22`,
                          borderRadius: '4px',
                          fontSize: '13px',
                          color: '#333',
                          transition: 'all 0.2s',
                          textDecoration: 'none'
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = portal.color
                          e.currentTarget.style.color = 'white'
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = '#f8f9ff'
                          e.currentTarget.style.color = '#333'
                        }}
                      >
                        <span>{portal.icon}</span>
                        <span>{portal.label}</span>
                      </Link>
                    ) : (
                      <a
                        key={portal.label}
                        href="#"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          background: '#f8f9ff',
                          border: `1px solid ${portal.color}22`,
                          borderRadius: '4px',
                          fontSize: '13px',
                          color: '#333',
                          transition: 'all 0.2s',
                          textDecoration: 'none'
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = portal.color
                          e.currentTarget.style.color = 'white'
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = '#f8f9ff'
                          e.currentTarget.style.color = '#333'
                        }}
                      >
                        <span>{portal.icon}</span>
                        <span>{portal.label}</span>
                      </a>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
