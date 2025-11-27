"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetchMyJobs } from "@/lib/http/api";
import JobsList from "@/components/JobsList";

export default function EmployerJobsPage() {
  const { user } = useAuth();2
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await fetchMyJobs();
        setJobs(data.jobs || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleCreateJob = () => {
    router.push("/employer/create-job");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-300">Loading jobs...</p>
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-[#0F2A2A] dark:via-[#0B2424] dark:to-[#0C2F2F] transition-all duration-500">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.username || "Employer"}
          </h1>
          <button
            onClick={handleCreateJob}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-4 py-2 rounded-md"
          >
            Create Job
          </button>
        </div>

        <JobsList jobs={jobs} userRole="employer" />
      </div>
    </div>
  );
}
