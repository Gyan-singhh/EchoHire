"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchJobApplications } from "@/lib/http/api";
import {
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiFileText,
  FiCalendar,
  FiPlay,
  FiExternalLink,
  FiUser,
} from "react-icons/fi";

import {
  FaFileAlt,
  FaBullseye,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboard,
} from "react-icons/fa";

import Link from "next/link";

export default function CandidateApplicationsPage() {
  const { user } = useAuth();
  const userId = user?._id;
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await fetchJobApplications();
  
        setApplications(data.applications || []);
      } catch (error) {
        console.error("Error fetching candidate apps:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0F2A2A] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-[#1B2B2B] rounded w-1/4 mb-6"></div>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#1B2B2B] rounded-xl shadow-sm p-6 mb-4"
              >
                <div className="h-6 bg-gray-200 dark:bg-[#223344] rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-[#223344] rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-[#223344] rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "interviewed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "hired":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "applied":
        return <FaFileAlt />;
      case "interviewed":
        return <FaBullseye />;
      case "hired":
        return <FaCheckCircle />;
      case "rejected":
        return <FaTimesCircle />;
      default:
        return <FaClipboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F2A2A] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your job applications and interview status
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white dark:bg-[#1B2B2B] rounded-xl shadow-sm border border-gray-200 dark:border-[#1E3A8A]/40 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-[#223344] rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBriefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No applications yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You haven't applied to any jobs yet. Start exploring
              opportunities!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white dark:bg-[#1B2B2B] rounded-xl shadow-sm border border-gray-200 dark:border-[#1E3A8A]/40 hover:shadow-md transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-sm">
                          <span className="text-white font-bold text-sm">
                            {app.jobId?.companyName?.charAt(0) || "C"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {app.jobId?.title}
                            </h2>
                          </div>

                          <p className="text-lg text-teal-600 dark:text-cyan-400 font-medium mb-3">
                            {app.jobId?.companyName}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                            <div className="flex items-center gap-2">
                              <FiMapPin className="w-4 h-4" />
                              {app.jobId?.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <FiBriefcase className="w-4 h-4" />
                              {app.jobId?.jobType}
                            </div>
                            <div className="flex items-center gap-2">
                              <FiClock className="w-4 h-4" />
                              Applied{" "}
                              {new Date(app.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          {app.jobId?.salaryRange && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                              <span className="font-medium">Salary:</span>$
                              {app.jobId.salaryRange.minSalary?.toLocaleString()}{" "}
                              - $
                              {app.jobId.salaryRange.maxSalary?.toLocaleString()}
                            </div>
                          )}
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              app.status
                            )}`}
                          >
                            {" "}
                            Application Status:
                            <span className="mr-1 ml-2">
                              {getStatusIcon(app.status)}
                            </span>
                            {app.status.charAt(0).toUpperCase() +
                              app.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-3">
                      {app.resume?.resumeUrl && (
                        <a
                          href={app.resume.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-[#1E3A8A] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#223344] rounded-lg transition-all duration-200 text-sm font-medium"
                        >
                          <FiFileText className="w-4 h-4" />
                          View Resume
                          <FiExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <button className="inline-flex items-center gap-2 px-4 py-2 border border-teal-200 dark:border-cyan-800 text-teal-700 dark:text-cyan-400 hover:bg-teal-50 dark:hover:bg-cyan-950/50 rounded-lg transition-all duration-200 text-sm font-medium">
                        <FiUser className="w-4 h-4" />
                        <Link href={`/candidate/jobs/${app.jobId?._id}`}>
                          View Details
                        </Link>
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
  {app.assignedInterview?.isAssigned && (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
            <FiCalendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-400 text-sm">
              Interview Scheduled
            </h4>
            <p className="text-blue-700 dark:text-blue-300 text-xs">
              {new Date(app.assignedInterview.scheduledAt).toLocaleString()}
            </p>
          </div>
        </div>

        <Link
          href={`/candidate/interviews/${app?.jobId?._id}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <FiPlay className="w-4 h-4" />
          Start Interview
        </Link>
      </div>
    </div>
  )}
</div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
