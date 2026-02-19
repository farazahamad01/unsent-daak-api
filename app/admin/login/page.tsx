"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authApi } from "@/lib/api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authApi.login(email, password);
      Cookies.set("admin_token", res.data.token, { expires: 1, sameSite: "strict" });
      router.push("/admin/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-charcoal mb-2">The Unsent Daak</h1>
          <p className="font-accent italic text-terracotta">Admin Access</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-white border border-beige p-10 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block font-sans text-xs uppercase tracking-widest text-charcoal/50 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-b border-parchment bg-transparent py-3 outline-none 
                         focus:border-terracotta transition-colors font-body text-charcoal"
              placeholder="your@email.com"
            />
          </div>

          <div className="mb-8">
            <label className="block font-sans text-xs uppercase tracking-widest text-charcoal/50 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-b border-parchment bg-transparent py-3 outline-none 
                         focus:border-terracotta transition-colors font-body text-charcoal"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-charcoal text-cream py-4 font-sans text-sm uppercase 
                       tracking-widest hover:bg-terracotta transition-colors duration-300 
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Entering..." : "Enter"}
          </button>
        </form>

        <p className="text-center text-charcoal/30 text-xs mt-6 font-sans">
          Private access only. No public registration.
        </p>
      </div>
    </div>
  );
}
