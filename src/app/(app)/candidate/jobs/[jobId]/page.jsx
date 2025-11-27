"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchJobById, applyForJob } from "@/lib/http/api";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  FiAward,
  FiCheckCircle,
  FiBriefcase,
  FiTrendingUp,
  FiMapPin,
  FiCheck,
  FiSend,
  FiArrowRight,
} from "react-icons/fi";
import {
  FiDollarSign,
  FiClock,
  FiUsers,
  FiArrowLeft,
  FiUpload,
  FiX,
} from "react-icons/fi";
import Loader from "@/components/Loader";
export default function JobDetailsPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!jobId) return;
    const loadJob = async () => {
      try {
        const data = await fetchJobById(jobId);
        setJob(data);
      } catch (error) {
        console.error("Error loading job:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  const hasApplied = job?.applicants?.some(
    (applicant) => applicant === currentUser._id
  );

  const handleApply = async () => {
    if (!resume) {
      alert("Please upload your resume before submitting.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobId", jobId);

      const res = await applyForJob(formData);

      if (res.success) {
        alert("Application submitted successfully!");
        setShowModal(false);
        setResume(null);

        const updatedJob = await fetchJobById(jobId);
        setJob(updatedJob);
      } else {
        alert(res.message || "Failed to apply for job.");
      }
    } catch (error) {
      console.error("Apply error:", error);
      alert("Failed to apply for the job.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0F2A2A] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-[#1B2B2B] rounded w-1/4 mb-6"></div>
            <div className="bg-white dark:bg-[#1B2B2B] rounded-xl shadow-sm p-6">
              <div className="h-6 bg-gray-200 dark:bg-[#223344] rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-[#223344] rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-[#223344] rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F2A2A] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/candidate/jobs">
          <Button
            variant="outline"
            className="mb-6 border-gray-300 dark:border-cyan-800 text-gray-600 dark:text-gray-300"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>

        <div className="bg-white dark:bg-[#1B2B2B] rounded-xl border border-gray-200 dark:border-cyan-800">
          <div className="p-6 border-b border-gray-200 dark:border-cyan-800">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {job.companyName?.charAt(0) || "C"}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {job.title}
                    </h1>
                    <p className="text-lg text-teal-600 dark:text-cyan-400 font-medium">
                      {job.companyName}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <FiMapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <FiBriefcase className="w-4 h-4" />
                    {job.jobType}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <FiDollarSign className="w-4 h-4" />$
                    {job.salaryRange?.minSalary?.toLocaleString()} - $
                    {job.salaryRange?.maxSalary?.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <FiUsers className="w-4 h-4" />
                    {job.openings} opening{job.openings > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 dark:bg-cyan-900/50 text-teal-800 dark:text-cyan-300">
                    {job.experienceLevel}
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-col gap-3">
                {!hasApplied ? (
                  <Button
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 hover:cursor-pointer"
                  >
                    Apply Now
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8"
                  >
                    <FiCheck className="w-4 h-4 mr-2" />
                    Applied
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <Section title="Job Description" content={job.jobDescription} />

            <Section title="Responsibilities" list={job.responsibilities} />

            <Section title="Requirements" list={job.requirements} />

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                  <FiAward className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Skills Required
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {job.skillsRequired?.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-[#223344] dark:to-[#1E2A3A] text-teal-700 dark:text-cyan-300 border border-teal-200 dark:border-cyan-800"
                  >
                    <FiCheckCircle className="w-4 h-4 mr-2 text-teal-500 dark:text-cyan-400" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#223344] dark:to-[#1E2A3A] rounded-xl p-5 border border-gray-200 dark:border-cyan-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <FiBriefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Job Type
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                  {job.jobType}
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#223344] dark:to-[#1E2A3A] rounded-xl p-5 border border-gray-200 dark:border-cyan-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <FiTrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Experience Level
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                  {job.experienceLevel}
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#223344] dark:to-[#1E2A3A] rounded-xl p-5 border border-gray-200 dark:border-cyan-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <FiMapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Location
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                  {job.location}
                </p>
              </div>
            </div>

            {hasApplied && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <FiCheck className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-800 dark:text-green-400 text-lg mb-1">
                      Application Submitted Successfully!
                    </h3>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Your application has been received. The employer will
                      review your profile and contact you if shortlisted.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center pt-6">
              {!hasApplied ? (
                <Button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-12 py-6 rounded-2xl text-lg font-semibold hover:cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FiSend className="w-5 h-5" />
                    <span>Apply Now</span>
                  </div>
                </Button>
              ) : (
                <Button
                  disabled
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-12 py-6 rounded-2xl text-lg font-semibold"
                >
                  <div className="flex items-center gap-3">
                    <FiCheckCircle className="w-5 h-5" />
                    <span>Application Submitted</span>
                  </div>
                </Button>
              )}
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/20 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-[#1B2B2B] rounded-xl w-full max-w-md p-6 border border-gray-200 dark:border-cyan-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Apply for {job.title}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setResume(null);
                    const fileInput = document.getElementById("resume-upload");
                    if (fileInput) fileInput.value = "";
                  }}
                  className="text-gray-400"
                >
                  <FiX className="w-5 h-5 hover:cursor-pointer" />
                </button>
              </div>

              <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiCheck className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm text-teal-800 dark:text-teal-300 font-medium mb-1">
                      Your profile information will be used
                    </p>
                    <p className="text-xs text-teal-700 dark:text-teal-400">
                      All details from your candidate profile will be shared
                      with the employer.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Upload Resume (PDF)
                </label>

                {!resume ? (
                  <div className="border-2 border-dashed border-gray-300 dark:border-cyan-800 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      onChange={(e) => setResume(e.target.files[0])}
                      accept=".pdf"
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload your resume
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        PDF files only
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="border-2 border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                          <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {resume.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(resume.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setResume(null);
                          const fileInput =
                            document.getElementById("resume-upload");
                          if (fileInput) fileInput.value = "";
                        }}
                        className="text-red-500 dark:text-red-400 p-1 hover:cursor-pointer "
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex  justify-center">
                <Button
                  onClick={handleApply}
                  disabled={uploading || !resume}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, content, list }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      {list ? (
        <ul className="space-y-2">
          {list.map((item, i) => (
            <li
              key={i}
              className="flex items-start text-gray-600 dark:text-gray-300"
            >
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {content}
        </p>
      )}
    </div>
  );
}
