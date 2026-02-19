import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = Cookies.get("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      const isAdminRoute = window.location.pathname.startsWith("/admin");
      const isLoginPage = window.location.pathname === "/admin/login";
      if (isAdminRoute && !isLoginPage) {
        Cookies.remove("admin_token");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;

// ─── Typed API helpers ───────────────────────────────────────────

export const postsApi = {
  getAll: (page = 0, category?: string) =>
    api.get("/api/posts", { params: { page, category } }),
  getBySlug: (slug: string) => api.get(`/api/posts/${slug}`),
  search: (q: string, page = 0) => api.get("/api/posts/search", { params: { q, page } }),
  getRelated: (slug: string) => api.get(`/api/posts/${slug}/related`),
};

export const adminPostsApi = {
  getAll: () => api.get("/api/admin/posts"),
  getById: (id: number) => api.get(`/api/admin/posts/${id}`),
  create: (data: any) => api.post("/api/admin/posts", data),
  update: (id: number, data: any) => api.put(`/api/admin/posts/${id}`, data),
  delete: (id: number) => api.delete(`/api/admin/posts/${id}`),
};

export const booksApi = {
  getAll: (type?: string) => api.get("/api/books", { params: { type } }),
  getFeatured: () => api.get("/api/books/featured"),
  getById: (id: number) => api.get(`/api/books/${id}`),
};

export const adminBooksApi = {
  getAll: () => api.get("/api/admin/books"),
  create: (data: any) => api.post("/api/admin/books", data),
  update: (id: number, data: any) => api.put(`/api/admin/books/${id}`, data),
  delete: (id: number) => api.delete(`/api/admin/books/${id}`),
};

export const uploadApi = {
  image: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post("/api/admin/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/api/auth/login", { email, password }),
  verify: () => api.get("/api/auth/verify"),
};

export const dashboardApi = {
  getStats: () => api.get("/api/admin/dashboard/stats"),
};
