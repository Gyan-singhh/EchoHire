"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function Layout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error("You must be logged in to access this page!");
        router.push("/login");
      } else if (user?.role !== "employer") {
        toast.error("You are not allowed to access this page!");
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return <>{children}</>;
}
