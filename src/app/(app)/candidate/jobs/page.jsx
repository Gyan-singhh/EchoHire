"use client";

import { useEffect, useState } from "react";
import { fetchAllJobs } from "@/lib/http/api";
import JobsList from "@/components/JobsList";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchAllJobs();
   
        setJobs(data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0F2A2A] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-[#1B2B2B] rounded w-1/3 mb-6"></div>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#1B2B2B] rounded-lg shadow-sm p-6 mb-4"
              >
                <div className="h-6 bg-gray-200 dark:bg-[#223344] rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-[#223344] rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-[#223344] rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F2A2A] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Available Positions
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover your next career opportunity
          </p>
        </div>

        <JobsList jobs={jobs} userRole="candidate" />
      </div>
    </div>
  );
}
