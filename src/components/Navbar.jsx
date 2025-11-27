"use client";
import Loader from "./Loader";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/http/api";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import clsx from "clsx";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiBriefcase,
  FiClipboard,
  FiFileText,
  FiMic,
  FiEdit,
} from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, setUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      setUser(null);
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
      setMenuOpen(false);
    }
  };

  if (loading) return <Loader />;

  const candidateLinks = [
    { href: "/candidate/jobs", label: "Jobs", icon: <FiBriefcase /> },
    { href: "/candidate/mock-test", label: "Mock Test", icon: <FiClipboard /> },
    { href: "/candidate/interviews", label: "Interviews", icon: <FiMic /> },
    {
      href: "/candidate/applications",
      label: "Applications",
      icon: <FiFileText />,
    },
    { href: "/candidate/vapi", label: "Vapi Test", icon: <FiEdit /> },
  ];

  const employerLinks = [
    { href: "/employer/jobs", label: "Jobs", icon: <FiBriefcase /> },
    { href: "/employer/create-job", label: "Create Job", icon: <FiEdit /> },
    { href: "/", label: "Profile", icon: <FiUser /> },
  ];

  const navLinks =
    user?.role === "candidate"
      ? candidateLinks
      : user?.role === "employer"
      ? employerLinks
      : [];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0F2A2A]/80 backdrop-blur-md border-b border-gray-200/50 dark:border-[#1E3A8A]/40 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-cyan-400 dark:to-teal-300 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              EchoHire
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {user &&
              navLinks.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative group",
                    pathname === href
                      ? "text-teal-700 dark:text-cyan-400 bg-teal-50 dark:bg-cyan-950/50 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-teal-700 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-white/5"
                  )}
                >
                  <span
                    className={clsx(
                      "transition-transform duration-200",
                      pathname === href ? "scale-110" : "group-hover:scale-110"
                    )}
                  >
                    {icon}
                  </span>
                  {label}
                  {pathname === href && (
                    <div className="absolute inset-x-2 -bottom-2 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" />
                  )}
                </Link>
              ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {user ? (
              <>
                <div className="hidden md:flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user.username || user.role}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user.role}
                    </p>
                  </div>

                  <Link
                    href={`/`}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 border-2 border-white dark:border-[#0F2A2A]"
                  >
                    {user?.username?.charAt(0)?.toUpperCase()}
                  </Link>

                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    disabled={isLoggingOut}
                    className="hidden sm:flex items-center gap-2 border-teal-200 dark:border-cyan-800 text-teal-700 dark:text-cyan-400 hover:bg-teal-50 dark:hover:bg-cyan-950/50 hover:border-teal-300 dark:hover:border-cyan-700 transition-all"
                  >
                    <FiLogOut className="w-4 h-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
                </div>

                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-[#1B2B2B] text-teal-600 dark:text-cyan-400 hover:bg-gray-200 dark:hover:bg-[#223344] transition-all duration-200"
                >
                  {menuOpen ? (
                    <FiX className="w-5 h-5" />
                  ) : (
                    <FiMenu className="w-5 h-5" />
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="sm:hidden">
                  <ThemeToggle />
                </div>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-cyan-400 dark:text-cyan-300 dark:hover:bg-[#0F2A2A]/40 transition-all"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-sm hover:shadow-md transition-all">
                    Signup
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {user && (
        <div
          className={clsx(
            "md:hidden border-t border-gray-200 dark:border-[#1E3A8A]/40 bg-white dark:bg-[#0F2A2A] transition-all duration-300 overflow-hidden",
            menuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
            <div className="grid gap-2">
              {navLinks.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    pathname === href
                      ? "text-teal-700 dark:text-cyan-400 bg-teal-50 dark:bg-cyan-950/50"
                      : "text-gray-600 dark:text-gray-300 hover:text-teal-700 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-white/5"
                  )}
                >
                  <span
                    className={clsx(
                      "transition-transform duration-200",
                      pathname === href && "scale-110"
                    )}
                  >
                    {icon}
                  </span>
                  {label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-[#1E3A8A]/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-semibold shadow-sm"
                  >
                    {user?.username?.charAt(0)?.toUpperCase()}
                  </Link>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user.username || user.role}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    disabled={isLoggingOut}
                    size="sm"
                    className="border-teal-200 dark:border-cyan-800 text-teal-700 dark:text-cyan-400 hover:bg-teal-50 dark:hover:bg-cyan-950/50"
                  >
                    <FiLogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
