"use client";
import { useEffect, useState } from "react";
import { adminBooksApi, uploadApi } from "@/lib/api";
import { Book } from "@/lib/types";

const emptyBook = {
  title: "",
  author: "",
  description: "",
  coverImage: "",
  price: "",
  buyLink: "",
  bookType: "own" as "own" | "affiliate",
  isFeatured: false,
};

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form, setForm] = useState(emptyBook);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      const res = await adminBooksApi.getAll();
      setBooks(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditingBook(null);
    setForm(emptyBook);
    setShowForm(true);
  };

  const openEdit = (book: Book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      author: book.author || "",
      description: book.description || "",
      coverImage: book.coverImage || "",
      price: book.price ? String(book.price) : "",
      buyLink: book.buyLink,
      bookType: book.bookType as "own" | "affiliate",
      isFeatured: book.isFeatured,
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadApi.image(file);
      setForm((f) => ({ ...f, coverImage: res.data.url }));
    } catch {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.buyLink) {
      alert("Title and Buy Link are required.");
      return;
    }
    setSaving(true);
    const data = { ...form, price: form.price ? parseFloat(form.price) : null };
    try {
      if (editingBook) {
        await adminBooksApi.update(editingBook.id, data);
      } else {
        await adminBooksApi.create(data);
      }
      setShowForm(false);
      load();
    } catch {
      alert("Failed to save book.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await adminBooksApi.delete(id);
      setBooks((b) => b.filter((bk) => bk.id !== id));
    } catch {
      alert("Failed to delete.");
    }
  };

  if (loading) return <p className="font-accent italic text-charcoal/40 text-xl">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-charcoal mb-1">Books</h1>
          <p className="text-charcoal/50 text-sm">{books.length} total</p>
        </div>
        <button onClick={openNew} className="btn-dark">+ Add Book</button>
      </div>

      {/* Book form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-charcoal/60 z-50 flex items-center justify-center p-4">
          <div className="bg-cream w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-beige flex items-center justify-between">
              <h2 className="font-serif text-2xl text-charcoal">
                {editingBook ? "Edit Book" : "Add Book"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-charcoal/40 hover:text-charcoal text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-charcoal/50 mb-1">Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full border border-parchment bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-charcoal/50 mb-1">Author</label>
                  <input
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full border border-parchment bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans uppercase tracking-widest text-charcoal/50 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full border border-parchment bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-charcoal/50 mb-1">Type</label>
                  <select
                    value={form.bookType}
                    onChange={(e) => setForm({ ...form, bookType: e.target.value as "own" | "affiliate" })}
                    className="w-full border border-parchment bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta transition-colors"
                  >
                    <option value="own">My Book</option>
                    <option value="affiliate">Affiliate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-charcoal/50 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-parchment bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta transition-colors"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans uppercase tracking-widest text-charcoal/50 mb-1">Buy Link *</label>
                <input
                  value={form.buyLink}
                  onChange={(e) => setForm({ ...form, buyLink: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-parchment bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-sans uppercase tracking-widest text-charcoal/50 mb-1">Cover Image</label>
                {form.coverImage && (
                  <img src={form.coverImage} alt="" className="h-24 object-cover mb-2" />
                )}
                <input
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="Image URL"
                  className="w-full border border-parchment bg-white px-4 py-2.5 text-sm outline-none focus:border-terracotta transition-colors mb-2"
                />
                <label className="cursor-pointer btn-primary !text-xs !px-4 !py-2 inline-block">
                  {uploading ? "Uploading..." : "Upload Cover"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="accent-terracotta"
                />
                <span className="text-sm font-sans">Featured on homepage</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="btn-dark">
                  {saving ? "Saving..." : "Save Book"}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-primary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Books grid */}
      {books.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-accent italic text-charcoal/40 text-xl">No books yet. Add your first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white border border-beige p-5">
              {book.coverImage && (
                <img src={book.coverImage} alt={book.title} className="w-full h-40 object-cover mb-4" />
              )}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-serif text-lg text-charcoal flex-1">{book.title}</h3>
                <span className={`text-xs font-sans px-2 py-0.5 ${
                  book.bookType === "own" ? "bg-terracotta text-cream" : "bg-charcoal text-cream"
                }`}>
                  {book.bookType}
                </span>
              </div>
              {book.author && <p className="font-accent italic text-charcoal/50 text-sm mb-1">{book.author}</p>}
              {book.price && <p className="text-terracotta font-serif mb-3">₹{book.price}</p>}
              {book.isFeatured && (
                <p className="text-xs text-sage font-sans mb-3">★ Featured</p>
              )}
              <div className="flex gap-2">
                <button onClick={() => openEdit(book)} className="btn-primary !text-xs !px-4 !py-2 flex-1 text-center">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book.id, book.title)}
                  className="text-xs border border-red-200 text-red-400 px-4 py-2 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
