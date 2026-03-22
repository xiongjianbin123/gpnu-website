import type { ShopCategory, Product } from '../types'

export const mockShopCategories: ShopCategory[] = [
  { id: 1, name: '校园周边', icon: '🎓', description: '广师大官方文创，带走一份师大情怀' },
  { id: 2, name: '数码产品', icon: '💻', description: '笔记本、耳机、数码配件，学习更高效' },
  { id: 3, name: '生活用品', icon: '🛍️', description: '宿舍必备生活好物，品质有保障' },
  { id: 4, name: '图书教材', icon: '📚', description: '专业教材、课外读物、考研用书' },
  { id: 5, name: '运动装备', icon: '⚽', description: '运动健身装备，活力校园生活' },
  { id: 6, name: '美食特产', icon: '🍜', description: '广东特色美食、零食饮品，校园好味道' },
]

export const mockProducts: Product[] = [
  // 校园周边 (category_id: 1)
  {
    id: 1, category_id: 1, name: '广师大定制马克杯',
    description: '精选陶瓷材质，印有广师大校徽及校训，容量350ml，微波炉可用，是学习和送礼的首选。',
    price: 39.9, original_price: 59.9, stock: 120, image: '☕',
    tags: ['热销', '官方定制'], sales_count: 856, rating: 4.8, created_at: '2025-09-01T00:00:00Z',
  },
  {
    id: 2, category_id: 1, name: '广师大文化T恤',
    description: '100%纯棉材质，印有广师大标志性建筑剪影，宽松版型，男女同款，提供S/M/L/XL码。',
    price: 89, original_price: 129, stock: 200, image: '👕',
    tags: ['官方定制', '纯棉'], sales_count: 412, rating: 4.7, created_at: '2025-09-05T00:00:00Z',
  },
  {
    id: 3, category_id: 1, name: '广师大定制帆布包',
    description: '加厚帆布，大容量设计，单肩手提两用，印有广师大校徽logo，适合日常上课携带。',
    price: 49.9, original_price: 69, stock: 80, image: '👜',
    tags: ['实用', '大容量'], sales_count: 623, rating: 4.6, created_at: '2025-09-10T00:00:00Z',
  },
  {
    id: 4, category_id: 1, name: '广师大笔记本套装',
    description: '精装笔记本+钢笔礼盒套装，内含A5笔记本2册+钢笔1支，广师大定制封面，适合纪念和收藏。',
    price: 68, original_price: 98, stock: 150, image: '📓',
    tags: ['礼盒', '套装'], sales_count: 289, rating: 4.9, created_at: '2025-09-15T00:00:00Z',
  },

  // 数码产品 (category_id: 2)
  {
    id: 5, category_id: 2, name: '无线蓝牙耳机 学生款',
    description: '主动降噪，续航30小时，IPX4防水，轻盈折叠设计，适合图书馆学习和通勤使用。',
    price: 199, original_price: 299, stock: 45, image: '🎧',
    tags: ['降噪', '长续航'], sales_count: 341, rating: 4.5, created_at: '2025-09-20T00:00:00Z',
  },
  {
    id: 6, category_id: 2, name: 'Type-C 多功能扩展坞',
    description: '7合1扩展坞，支持HDMI 4K投屏、USB3.0×3、SD/TF读卡器、PD快充，笔记本学习必备。',
    price: 129, original_price: 189, stock: 60, image: '🔌',
    tags: ['扩展', 'Type-C'], sales_count: 198, rating: 4.6, created_at: '2025-09-25T00:00:00Z',
  },
  {
    id: 7, category_id: 2, name: '便携无线充电板',
    description: '15W快充，兼容iPhone/安卓/TWS耳机，超薄设计5mm，支持多设备同时充电。',
    price: 79, original_price: 119, stock: 90, image: '⚡',
    tags: ['快充', '无线'], sales_count: 267, rating: 4.4, created_at: '2025-10-01T00:00:00Z',
  },
  {
    id: 8, category_id: 2, name: '学生护眼台灯',
    description: 'AA级护眼标准，无频闪无蓝光，5档亮度3色温可调，USB-C供电，宿舍书桌首选。',
    price: 149, original_price: 219, stock: 35, image: '💡',
    tags: ['护眼', '宿舍必备'], sales_count: 524, rating: 4.8, created_at: '2025-10-05T00:00:00Z',
  },

  // 生活用品 (category_id: 3)
  {
    id: 9, category_id: 3, name: '宿舍收纳神器套装',
    description: '宿舍床头收纳挂袋+桌面收纳盒组合，防水布料，分格设计，摆放整洁又美观。',
    price: 45.9, original_price: 69, stock: 180, image: '🗂️',
    tags: ['收纳', '宿舍'], sales_count: 892, rating: 4.7, created_at: '2025-10-10T00:00:00Z',
  },
  {
    id: 10, category_id: 3, name: '304不锈钢保温杯',
    description: '500ml大容量，316食品级内胆，12小时保温，宽口设计易清洗，配茶隔，适合校园携带。',
    price: 69, original_price: 99, stock: 150, image: '🥤',
    tags: ['保温', '大容量'], sales_count: 613, rating: 4.8, created_at: '2025-10-15T00:00:00Z',
  },
  {
    id: 11, category_id: 3, name: '懒人沙发豆袋',
    description: '慵懒风格豆袋，内填高弹EPS颗粒，柔软舒适，可折叠收纳，宿舍休闲必备神器。',
    price: 159, original_price: 239, stock: 40, image: '🛋️',
    tags: ['舒适', '懒人'], sales_count: 178, rating: 4.5, created_at: '2025-10-20T00:00:00Z',
  },
  {
    id: 12, category_id: 3, name: '可折叠晾衣架',
    description: '铝合金材质，一键伸缩折叠，宿舍阳台两用，承重15kg，附赠防风夹10个。',
    price: 35.9, original_price: 55, stock: 220, image: '🪝',
    tags: ['宿舍', '折叠'], sales_count: 734, rating: 4.6, created_at: '2025-10-25T00:00:00Z',
  },

  // 图书教材 (category_id: 4)
  {
    id: 13, category_id: 4, name: '考研英语真题精析（近10年）',
    description: '近10年考研英语一真题全套精析，按题型分类，含详细解析及答题技巧，考研备考必备。',
    price: 59.9, original_price: 79, stock: 300, image: '📖',
    tags: ['考研', '英语'], sales_count: 1024, rating: 4.9, created_at: '2025-11-01T00:00:00Z',
  },
  {
    id: 14, category_id: 4, name: '数据结构与算法（第2版）',
    description: '计算机专业核心课教材，图文并茂，例题丰富，附在线代码，适合期末备考和面试准备。',
    price: 49, original_price: 65, stock: 200, image: '💾',
    tags: ['计算机', '教材'], sales_count: 567, rating: 4.7, created_at: '2025-11-05T00:00:00Z',
  },
  {
    id: 15, category_id: 4, name: '高等数学同步辅导练习',
    description: '配合高数课程同步使用，每章含知识点梳理、典型例题、强化练习及历年真题，学霸推荐。',
    price: 38, original_price: 52, stock: 400, image: '📐',
    tags: ['数学', '辅导书'], sales_count: 789, rating: 4.6, created_at: '2025-11-10T00:00:00Z',
  },
  {
    id: 16, category_id: 4, name: '人生哲理与当代青年（随笔集）',
    description: '当代知名学者撰写，聚焦大学生成长困惑与人生抉择，语言亲切，适合课余阅读放松身心。',
    price: 36, original_price: 48, stock: 160, image: '📕',
    tags: ['课外', '成长'], sales_count: 312, rating: 4.8, created_at: '2025-11-15T00:00:00Z',
  },

  // 运动装备 (category_id: 5)
  {
    id: 17, category_id: 5, name: '专业瑜伽垫 加厚版',
    description: 'TPE材质，10mm加厚防滑，183×61cm标准尺寸，附赠背包带，适合校园健身房和宿舍使用。',
    price: 89, original_price: 139, stock: 70, image: '🧘',
    tags: ['健身', '防滑'], sales_count: 423, rating: 4.7, created_at: '2025-11-20T00:00:00Z',
  },
  {
    id: 18, category_id: 5, name: '跳绳 专业速跳款',
    description: '铝合金手柄，轴承旋转设计，绳长可调3.2m，附计数器，适合减脂训练和体能提升。',
    price: 29.9, original_price: 49, stock: 200, image: '🪃',
    tags: ['减脂', '跳绳'], sales_count: 918, rating: 4.6, created_at: '2025-11-25T00:00:00Z',
  },
  {
    id: 19, category_id: 5, name: '篮球 室内外通用款',
    description: '7号标准篮球，超纤皮材质，手感好吸汗耐磨，适合校内球场日常训练和比赛使用。',
    price: 129, original_price: 179, stock: 50, image: '🏀',
    tags: ['篮球', '室外'], sales_count: 234, rating: 4.5, created_at: '2025-12-01T00:00:00Z',
  },

  // 美食特产 (category_id: 6)
  {
    id: 20, category_id: 6, name: '广东特产礼盒套装',
    description: '精选广东特产：陈皮、腊肠、鱼干、沙琪玛组合装，精美礼盒包装，带回家孝敬父母。',
    price: 128, original_price: 168, stock: 100, image: '🎁',
    tags: ['特产', '礼盒'], sales_count: 536, rating: 4.9, created_at: '2025-12-05T00:00:00Z',
  },
  {
    id: 21, category_id: 6, name: '网红奶茶粉（10包装）',
    description: '校园热销奶茶粉，芋泥、焦糖、抹茶、黑糖4种口味各2包+2包原味，宿舍冲泡方便美味。',
    price: 39.9, original_price: 55, stock: 300, image: '🧋',
    tags: ['网红', '零食'], sales_count: 1203, rating: 4.7, created_at: '2025-12-10T00:00:00Z',
  },
  {
    id: 22, category_id: 6, name: '手工曲奇饼干礼盒',
    description: '师生自制手工曲奇，黄油浓郁，口感酥脆，8种造型，每盒500g，无添加剂新鲜烘焙。',
    price: 68, original_price: 88, stock: 60, image: '🍪',
    tags: ['手工', '新鲜'], sales_count: 389, rating: 4.8, created_at: '2025-12-15T00:00:00Z',
  },
]
