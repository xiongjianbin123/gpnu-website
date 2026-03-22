export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  sort_order: number;
  post_count: number;
  latest_post?: {
    title: string;
    author: string;
    created_at: string;
  } | null;
}

export interface Post {
  id: number;
  category_id: number;
  category_name?: string;
  title: string;
  content: string;
  author: string;
  is_pinned: number;
  views: number;
  comment_count?: number;
  created_at: string;
}

export interface Comment {
  id: number;
  post_id: number;
  author: string;
  content: string;
  likes: number;
  created_at: string;
}

export interface PaginatedPosts {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  category?: string;
  url?: string;
}

export interface NoticeItem {
  id: number;
  title: string;
  date: string;
  type?: string;
}

// ---- 电子商城 ----

export interface ShopCategory {
  id: number;
  name: string;
  icon: string;
  description: string;
  product_count?: number;
}

export interface Product {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  stock: number;
  image: string; // emoji or placeholder
  tags: string[];
  sales_count: number;
  rating: number;
  created_at: string;
}

export interface CartItem {
  product_id: number;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: { product_id: number; name: string; price: number; quantity: number; image: string }[];
  total: number;
  buyer_name: string;
  phone: string;
  address: string;
  note: string;
  status: 'pending' | 'paid' | 'shipped' | 'done';
  created_at: string;
}
