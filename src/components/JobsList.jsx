"use client";

import Link from "next/link";
import {
  FiMapPin,
  FiBriefcase,
  FiUsers,
  FiDollarSign,
  FiChevronRight,
} from "react-icons/fi";

export default function JobsList({ jobs, userRole }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white dark:bg-[#1B2B2B] rounded-xl shadow-sm p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {userRole === "employer"
              ? "No jobs created yet."
              : "No positions available"}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {userRole === "employer"
              ? "Start by creating a job."
              : "Check back later for new opportunities."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6">
        {jobs.map((job) => (
          <div
            key={job?._id}
            className="bg-white dark:bg-[#1B2B2B] rounded-xl shadow-sm border border-gray-200 dark:border-[#1E3A8A]/40 hover:shadow-md transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {job?.title}
                      </h2>
                      <p className="text-lg text-teal-600 dark:text-cyan-400 font-medium mb-3">
                        {job?.companyName}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {job?.jobDescription}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FiMapPin className="w-4 h-4" />
                      {job?.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FiBriefcase className="w-4 h-4" />
                      {job?.jobType}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FiDollarSign className="w-4 h-4" />$
                      {job?.salaryRange.minSalary.toLocaleString()} - $
                      {job.salaryRange.maxSalary.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FiUsers className="w-4 h-4" />
                      {job.openings} opening{job.openings > 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skillsRequired.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#223344] text-gray-700 dark:text-gray-300"
                      >
                        {skill}
                      </span>
                    ))}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 dark:bg-cyan-900/50 text-teal-800 dark:text-cyan-300">
                      {job.experienceLevel}
                    </span>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-3">
                  <Link
                    href={`/${userRole}/jobs/${job._id}`}
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    View Details
                    <FiChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
