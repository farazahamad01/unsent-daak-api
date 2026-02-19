export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string;
  coverImage?: string;
  isPublished: boolean;
  readTime?: number;
  metaTitle?: string;
  metaDesc?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: number;
  title: string;
  author?: string;
  description?: string;
  coverImage?: string;
  price?: number;
  buyLink: string;
  bookType: "own" | "affiliate";
  isFeatured: boolean;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalBooks: number;
}
