"use client";
import { useEffect, useState } from "react";
import { assignedInterview } from "@/lib/http/api";
import { useRouter } from "next/navigation";
import { InterviewLoader } from "@/components/Loader";
import Link from "next/link";
import {
  FiCalendar,
  FiArrowRight,
  FiMapPin,
  FiClock,
  FiFileText,
  FiPlay,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
export default function MyAssignedInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const { data } = await assignedInterview();
        setInterviews(data || []);
      } catch (error) {
        console.error("Error fetching assigned interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) {
    return <InterviewLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F2A2A] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold dark:text-white mb-4">
            My Assigned Interviews
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Track and manage your scheduled interviews
          </p>

          {interviews.length > 0 && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white dark:bg-[#1B2B2B] rounded-xl p-4 border border-gray-200 dark:border-cyan-800">
                <div className="text-2xl font-bold text-teal-600 dark:text-cyan-400">
                  {interviews.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Interviews
                </div>
              </div>
              <div className="bg-white dark:bg-[#1B2B2B] rounded-xl p-4 border border-gray-200 dark:border-cyan-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {
                    interviews.filter(
                      (iv) => iv.status === "interview_scheduled"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Upcoming
                </div>
              </div>
              <div className="bg-white dark:bg-[#1B2B2B] rounded-xl p-4 border border-gray-200 dark:border-cyan-800">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {
                    interviews.filter((iv) => iv.status === "interviewed")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Completed
                </div>
              </div>
            </div>
          )}
        </div>

        {interviews.length === 0 ? (
          <div className="text-center">
            <div className="bg-white dark:bg-[#1B2B2B] rounded-2xl p-12 max-w-2xl mx-auto border border-gray-200 dark:border-cyan-800">
              <div className="w-20 h-20 mx-auto mb-6 bg-teal-100 dark:bg-cyan-900 rounded-full flex items-center justify-center">
                <FiCalendar className="w-8 h-8 text-teal-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No interviews scheduled
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                You don't have any interviews scheduled yet.
              </p>
              <Button
                onClick={() => router.push("/candidate/jobs")}
                className="bg-teal-600 text-white px-6 py-3 hover:bg-teal-700"
              >
                Browse Available Jobs
                <FiArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {interviews?.map((iv) => (
              <div
                key={iv._id}
                className="bg-white dark:bg-[#1B2B2B] rounded-2xl border border-gray-200 dark:border-cyan-800 p-6"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {iv.jobId?.title || "Untitled Role"}
                  </h2>
                  <p className="text-lg font-semibold text-teal-600 dark:text-cyan-400 mt-1">
                    {iv.jobId?.companyName || "Unknown Company"}
                  </p>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2">
                    <FiMapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {iv.jobId?.location || "Location not specified"}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/candidate/jobs/${iv.jobId?._id}`}
                  className="text-teal-600 dark:text-cyan-400 text-sm mb-4 inline-block"
                >
                  View Job
                </Link>

                <div className="mb-4 p-4 bg-gray-50 dark:bg-[#223344] rounded-xl border border-gray-200 dark:border-cyan-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 dark:bg-cyan-900 rounded-lg">
                      <FiClock className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Scheduled For
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {iv.assignedInterview?.scheduledAt
                          ? new Date(
                              iv.assignedInterview.scheduledAt
                            ).toLocaleString()
                          : "Not Scheduled"}
                      </div>
                    </div>
                  </div>
                </div>

                {iv.resume?.resumeUrl && (
                  <a
                    href={iv.resume.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-cyan-400 mb-4"
                  >
                    <FiFileText className="w-4 h-4" />
                    View Submitted Resume
                  </a>
                )}

                {iv.assignedInterview?.isAssigned && (
                  <Button
                    onClick={() =>
                      router.push(`/candidate/interviews/${iv?.jobId?._id}`)
                    }
                    className="w-full bg-teal-600 text-white py-3 mb-4"
                  >
                    <FiPlay className="w-4 h-4 mr-2" />
                    Start Interview
                  </Button>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Status
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      iv.status === "interview_scheduled"
                        ? "bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-300"
                        : iv.status === "interviewed"
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                        : "bg-gray-100 dark:bg-[#223344] text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {iv.status
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
