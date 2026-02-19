"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { adminPostsApi, uploadApi } from "@/lib/api";
import { Post } from "@/lib/types";

interface Props {
  post?: Post;
}

const categories = ["poem", "letter", "story", "reflection"];

export default function PostEditor({ post }: Props) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [category, setCategory] = useState(post?.category || "");
  const [tags, setTags] = useState(post?.tags || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [isPublished, setIsPublished] = useState(post?.isPublished || false);
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle || "");
  const [metaDesc, setMetaDesc] = useState(post?.metaDesc || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Begin writing your piece..." }),
    ],
    content: post?.content || "",
    editorProps: {
      attributes: {
        class: "min-h-[400px] outline-none p-4",
      },
    },
  });

  const generateSlug = (t: string) => {
    return t
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (t: string) => {
    setTitle(t);
    if (!isEdit) setSlug(generateSlug(t));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadApi.image(file);
      setCoverImage(res.data.url);
    } catch {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (publish: boolean) => {
    if (!title.trim() || !editor?.getHTML()) {
      alert("Title and content are required.");
      return;
    }
    setSaving(true);
    setMessage("");

    const data = {
      title,
      slug,
      content: editor?.getHTML(),
      excerpt,
      category,
      tags,
      coverImage,
      isPublished: publish,
      metaTitle,
      metaDesc,
    };

    try {
      if (isEdit && post) {
        await adminPostsApi.update(post.id, data);
        setMessage("Post updated successfully!");
      } else {
        await adminPostsApi.create(data);
        setMessage("Post created successfully!");
        router.push("/admin/posts");
      }
    } catch (err: any) {
      setMessage("Error: " + (err.response?.data?.error || "Something went wrong."));
    } finally {
      setSaving(false);
    }
  };

  const editorToolbar = [
    { label: "B", action: () => editor?.chain().focus().toggleBold().run(), title: "Bold" },
    { label: "I", action: () => editor?.chain().focus().toggleItalic().run(), title: "Italic" },
    { label: "H1", action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), title: "H1" },
    { label: "H2", action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), title: "H2" },
    { label: "❝", action: () => editor?.chain().focus().toggleBlockquote().run(), title: "Blockquote" },
    { label: "—", action: () => editor?.chain().focus().setHorizontalRule().run(), title: "Divider" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-charcoal">
          {isEdit ? "Edit Post" : "New Post"}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="btn-primary !py-2"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="btn-dark !py-2"
          >
            {saving ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>

      {message && (
        <div className={`px-4 py-3 mb-6 text-sm ${
          message.startsWith("Error")
            ? "bg-red-50 border border-red-200 text-red-600"
            : "bg-sage/10 border border-sage/30 text-sage"
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post Title"
            className="w-full font-serif text-3xl text-charcoal bg-white border border-beige 
                       px-5 py-4 outline-none focus:border-terracotta transition-colors placeholder-parchment"
          />

          {/* Slug */}
          <div className="flex items-center gap-2 bg-white border border-beige px-4 py-2.5">
            <span className="text-xs text-charcoal/40 font-sans">/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1 text-sm text-charcoal outline-none bg-transparent font-sans"
              placeholder="your-post-slug"
            />
          </div>

          {/* Excerpt */}
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short excerpt (shown in cards and SEO)..."
            rows={2}
            className="w-full bg-white border border-beige px-5 py-4 outline-none 
                       focus:border-terracotta transition-colors text-sm font-body resize-none"
          />

          {/* Rich text editor */}
          <div className="bg-white border border-beige overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 px-4 py-3 border-b border-beige bg-cream-dark">
              {editorToolbar.map((btn) => (
                <button
                  key={btn.title}
                  onClick={btn.action}
                  title={btn.title}
                  type="button"
                  className="px-3 py-1.5 text-xs font-sans border border-parchment hover:border-terracotta 
                             hover:text-terracotta transition-colors text-charcoal"
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-4">
          {/* Publish status */}
          <div className="bg-white border border-beige p-5">
            <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal/50 mb-3">Status</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 accent-terracotta"
              />
              <span className="text-sm font-sans">Published</span>
            </label>
          </div>

          {/* Category */}
          <div className="bg-white border border-beige p-5">
            <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal/50 mb-3">Category</h3>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-parchment bg-transparent px-3 py-2.5 text-sm 
                         outline-none focus:border-terracotta transition-colors font-body"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white border border-beige p-5">
            <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal/50 mb-3">Tags</h3>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="love, nostalgia, hope (comma-separated)"
              className="w-full border border-parchment bg-transparent px-3 py-2.5 text-sm 
                         outline-none focus:border-terracotta transition-colors font-body"
            />
          </div>

          {/* Cover image */}
          <div className="bg-white border border-beige p-5">
            <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal/50 mb-3">Cover Image</h3>
            {coverImage && (
              <img src={coverImage} alt="Cover" className="w-full h-32 object-cover mb-3" />
            )}
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Image URL"
              className="w-full border border-parchment bg-transparent px-3 py-2.5 text-sm 
                         outline-none focus:border-terracotta transition-colors font-body mb-2"
            />
            <label className="block">
              <span className="btn-primary !text-xs !px-4 !py-2 cursor-pointer">
                {uploading ? "Uploading..." : "Upload Image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* SEO */}
          <div className="bg-white border border-beige p-5">
            <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal/50 mb-3">SEO</h3>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Meta title (optional)"
              className="w-full border border-parchment bg-transparent px-3 py-2.5 text-sm 
                         outline-none focus:border-terracotta transition-colors font-body mb-2"
            />
            <textarea
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              placeholder="Meta description (optional)"
              rows={3}
              className="w-full border border-parchment bg-transparent px-3 py-2.5 text-sm 
                         outline-none focus:border-terracotta transition-colors font-body resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
