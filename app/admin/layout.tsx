"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "◈" },
  { href: "/admin/posts", label: "Posts", icon: "✦" },
  { href: "/admin/posts/new", label: "New Post", icon: "+" },
  { href: "/admin/books", label: "Books", icon: "▣" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    Cookies.remove("admin_token");
    router.push("/admin/login");
  };

  // Don't show layout on login page
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-cream-dark">
      {/* Sidebar */}
      <aside className="w-60 bg-charcoal text-cream flex flex-col fixed top-0 left-0 h-full z-50">
        <div className="p-6 border-b border-cream/10">
          <h1 className="font-serif text-xl text-cream">The Unsent Daak</h1>
          <p className="font-accent italic text-terracotta text-sm mt-0.5">Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-sans transition-all ${
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "bg-terracotta text-cream"
                  : "text-cream/60 hover:bg-cream/5 hover:text-cream"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-cream/10">
          <Link
            href="/"
            target="_blank"
            className="block text-center text-xs text-cream/40 hover:text-cream mb-3 font-sans uppercase tracking-widest"
          >
            View Site →
          </Link>
          <button
            onClick={logout}
            className="w-full text-center text-xs text-cream/40 hover:text-red-400 font-sans uppercase tracking-widest transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-60">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
