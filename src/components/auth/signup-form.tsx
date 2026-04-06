"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", name: "", company: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Registration failed");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Account created but sign-in failed. Please try signing in.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-muted-foreground">Name</label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-nem-card" />
      </div>
      <div>
        <label className="mb-1 block text-sm text-muted-foreground">Company</label>
        <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="bg-nem-card" />
      </div>
      <div>
        <label className="mb-1 block text-sm text-muted-foreground">Email</label>
        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="bg-nem-card" />
      </div>
      <div>
        <label className="mb-1 block text-sm text-muted-foreground">Password</label>
        <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} className="bg-nem-card" />
      </div>
      {error && <p className="text-sm text-nem-high">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-nem-accent hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
