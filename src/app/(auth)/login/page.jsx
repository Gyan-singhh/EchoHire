"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/lib/http/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FiLogIn, FiMail, FiLock, FiShield } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(form);
      setUser(res.user);
      toast.success("Welcome back!");
      router.push("/");
    } catch (err) {
      toast.error(err.message || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-[#0F2A2A] dark:via-[#0B2424] dark:to-[#0C2F2F] transition-all duration-500">
      <Card className="w-full max-w-md mx-4 shadow-2xl border-0 bg-white/80 dark:bg-[#0B1F1F]/90 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-xl">
        <CardHeader className="text-center bg-gradient-to-br from-teal-600 via-cyan-600 to-emerald-600 text-white py-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-shine" />
          <div className="relative z-10">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome Back
            </CardTitle>
            <p className="text-sm opacity-95 mt-2 font-light">
              Sign in to continue your journey
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-cyan-100">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiMail className="text-lg text-teal-600 dark:text-cyan-400 group-focus-within:text-cyan-500 transition-colors" />
              </div>
              <Input
                placeholder="Enter your email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-cyan-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-800 bg-white dark:bg-[#0D2F2B]/50 transition-all duration-200 group-hover:border-cyan-300 dark:group-hover:border-cyan-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-cyan-100">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiLock className="text-lg text-teal-600 dark:text-cyan-400 group-focus-within:text-cyan-500 transition-colors" />
              </div>
              <Input
                placeholder="Enter your password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-cyan-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-800 bg-white dark:bg-[#0D2F2B]/50 transition-all duration-200 group-hover:border-cyan-300 dark:group-hover:border-cyan-700"
              />
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing you in...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FiLogIn className="text-lg" />
                Sign In to Your Account
              </div>
            )}
          </Button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600 dark:text-cyan-200">
              Don't have an account?{" "}
              <span
                onClick={() => router.push("/signup")}
                className="text-teal-600 dark:text-cyan-400 hover:text-teal-700 dark:hover:text-cyan-300 font-semibold cursor-pointer transition-colors duration-200 hover:underline underline-offset-2"
              >
                Create one now
              </span>
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span
              onClick={() => router.push("/forgot-password")}
              className="text-xs text-teal-600 dark:text-cyan-400 hover:text-teal-700 dark:hover:text-cyan-300 cursor-pointer transition-colors duration-200"
            >
              Forgot password?
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-cyan-300">
              <FiShield className="text-cyan-500" />
              Secure login
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="fixed top-10 left-10 w-20 h-20 bg-teal-200 dark:bg-cyan-800 rounded-full blur-xl opacity-30 animate-float"></div>
      <div className="fixed bottom-10 right-10 w-16 h-16 bg-cyan-200 dark:bg-teal-800 rounded-full blur-xl opacity-40 animate-float-delayed"></div>
    </div>
  );
}
