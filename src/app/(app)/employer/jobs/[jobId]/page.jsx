"use client";
import React, { useEffect, useState } from "react";
import { fetchJobAndApplications } from "@/lib/http/api";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { updateApplicationStatus } from "@/lib/http/api";
import { FiUsers, FiCalendar, FiMapPin, FiBriefcase, FiFileText, FiMail, FiUser, FiX, FiCheck, FiDownload } from "react-icons/fi";

export default function JobApplicationsPage() {
  const { jobId } = useParams();
  const userId = useAuth().user?._id;
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [interviewDate, setInterviewDate] = useState("");

  const loadJob = async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const data = await fetchJobAndApplications(jobId);
      setJob(data.job);
      setApplications(data.applications);
    } catch (error) {
      console.error("Error fetching job and applications:", error);
      toast.error("Failed to fetch job and applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadJob(); }, [jobId]);

  const handleAssignInterview = (appId) => {
    setSelectedAppId(appId);
    setShowModal(true);
  };

  const submitInterview = async () => {
    if (!interviewDate) {
      toast.error("Please select interview date and time");
      return;
    }
    try {
      await updateApplicationStatus(selectedAppId, "assignInterview", { scheduledAt: interviewDate });
      toast.success("Interview scheduled successfully");
      setShowModal(false);
      setInterviewDate("");
      setSelectedAppId(null);
      loadJob();
    } catch (error) {
      toast.error(error.message || "Failed to schedule interview");
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, "updateStatus", { status: newStatus });
      toast.success(`Application ${newStatus.replace("_", " ")}`);
      loadJob();
    } catch (error) {
      toast.error(error.message || "Failed to update application status");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      interview_scheduled: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      interviewed: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      hired: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };

  const formatStatus = (status) => status.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  const filteredApplications = applications.filter((app) => activeTab === "all" || app.status?.toLowerCase() === activeTab.toLowerCase());

  const stats = {
    total: applications.length,
    applied: applications.filter((app) => app.status?.toLowerCase() === "applied").length,
    interview_scheduled: applications.filter((app) => app.status?.toLowerCase() === "interview_scheduled").length,
    interviewed: applications.filter((app) => app.status?.toLowerCase() === "interviewed").length,
    hired: applications.filter((app) => app.status?.toLowerCase() === "hired").length,
    rejected: applications.filter((app) => app.status?.toLowerCase() === "rejected").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#0F2A2A] dark:to-[#0C1E2A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#0F2A2A] dark:to-[#0C1E2A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Job Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300">The job you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#0F2A2A] dark:to-[#0C1E2A] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#1B2B2B] rounded-2xl shadow-sm border border-gray-200 dark:border-cyan-800/30 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h1>
              <p className="text-xl text-teal-600 dark:text-cyan-400 font-semibold mb-3">{job.companyName}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-2xl">{job.jobDescription}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2"><FiMapPin className="w-4 h-4" />{job.location}</div>
                <div className="flex items-center gap-2"><FiBriefcase className="w-4 h-4" />{job.role}</div>
                <div className="flex items-center gap-2"><FiUsers className="w-4 h-4" />{job.openings || 1} opening{job.openings > 1 ? "s" : ""}</div>
              </div>
            </div>
            <div className="bg-teal-50 dark:bg-cyan-900/20 rounded-xl p-4 min-w-[200px]">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600 dark:text-cyan-400 mb-1">{stats.total}</div>
                <div className="text-sm text-teal-700 dark:text-cyan-300 font-medium">Total Applicants</div>
              </div>
            </div>
          </div>
        </div>

        <div >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex overflow-x-auto scrollbar-hide space-x-1 border-b border-gray-200 dark:border-gray-700">
              {[
                { id: "all", label: "All Applications", count: stats.total },
                { id: "applied", label: "Applied", count: stats.applied },
                { id: "interview_scheduled", label: "Interview Scheduled", count: stats.interview_scheduled },
                { id: "interviewed", label: "Interviewed", count: stats.interviewed },
                { id: "hired", label: "Hired", count: stats.hired },
                { id: "rejected", label: "Rejected", count: stats.rejected },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id ? "border-teal-500 text-teal-600 dark:text-cyan-400 dark:border-cyan-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}>
                  {tab.label}
                  <span className={`px-2 py-1 rounded-full text-xs ${activeTab === tab.id ? "bg-teal-100 text-teal-800 dark:bg-cyan-900/50 dark:text-cyan-300" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>{tab.count}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <FiUsers className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No applications found</h3>
                <p className="text-gray-500 dark:text-gray-400">{activeTab === "all" ? "No one has applied for this position yet." : `No ${formatStatus(activeTab).toLowerCase()} applications at the moment.`}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <div key={app._id} className="bg-gray-50 dark:bg-[#0B1F1F] border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              <FiUser className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                              {app.candidate?.username || "Unknown Candidate"}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2 mt-1">
                              <FiMail className="w-4 h-4" />
                              {app.candidate?.email}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(app.status)}`}>{formatStatus(app.status)}</span>
                        </div>
                        {app.resume?.resumeUrl && (
                          <div className="flex items-center gap-2">
                            <FiFileText className="w-4 h-4 text-gray-400" />
                            <a href={app.resume.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
                              View Resume
                            </a>
                          </div>
                        )}
                        {app.status === "interview_scheduled" && app.assignedInterview?.isAssigned && (
                          <div className="flex items-center gap-2 text-sm mt-3 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg mb-3">
                            <FiCalendar className="w-4 h-4" />
                            Interview scheduled for {new Date(app.assignedInterview.scheduledAt).toLocaleString()}
                          </div>
                        )}
                        
                      </div>
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        {app.status === "applied" && (
                          <button onClick={() => handleAssignInterview(app._id)} className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm">
                            <FiCalendar className="w-4 h-4" />Schedule Interview
                          </button>
                        )}
                        {app.status !== "hired" && app.status !== "rejected" && (
                          <div className="flex gap-2">
                            <button onClick={() => handleStatusUpdate(app._id, "hired")} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm">
                              <FiCheck className="w-4 h-4" />Hire
                            </button>
                            <button onClick={() => handleStatusUpdate(app._id, "rejected")} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm">
                              <FiX className="w-4 h-4" />Reject
                            </button>
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
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white/95 dark:bg-[#1B2B2B]/95 rounded-2xl w-full max-w-md shadow-xl border border-gray-200/50 dark:border-[#1E3A8A]/40 backdrop-blur-md">
            <div className="p-6 border-b border-gray-200/50 dark:border-[#1E3A8A]/40 flex items-center gap-2">
              <FiCalendar className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Schedule Interview</h2>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Interview Date & Time</label>
              <input type="datetime-local" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white/90 dark:bg-[#1B2B2B]/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent backdrop-blur-sm" min={new Date().toISOString().slice(0, 16)} />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200/50 dark:border-[#1E3A8A]/40">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Cancel</button>
              <button onClick={submitInterview} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 hover:cursor-pointer">
                <FiCheck className="w-4 h-4" />Schedule Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}