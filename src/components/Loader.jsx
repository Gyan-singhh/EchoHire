"use client";

export default function Loader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#0F2A2A] dark:to-[#0C1E2A] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading ...</p>
      </div>
    </div>
  );
}

export const InterviewLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30 dark:from-[#0F2A2A] dark:to-[#0A1F1F] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold  dark:text-white mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            My Assigned Interviews
          </h1>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-64 mx-auto animate-pulse"></div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white/80 dark:bg-[#1B2B2B]/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 dark:border-teal-900/40 p-6 animate-pulse"
            >
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mt-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
