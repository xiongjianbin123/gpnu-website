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
