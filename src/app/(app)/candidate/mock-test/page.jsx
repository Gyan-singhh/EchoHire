"use client";

import { useEffect, useState } from "react";
import { fetchMyJobs } from "@/lib/http/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FiPlus,
  FiCalendar,
  FiUsers,
  FiCode,
  FiPlay,
  FiAward,
  FiArrowRight,
  FiEye,
} from "react-icons/fi";
import Loader from "@/components/Loader";

export default function MockTestPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyJobs = async () => {
      try {
        const data = await fetchMyJobs();
        const mockTests =
          data.jobs?.filter((job) => job.isMockTest !== false) || [];
        setTests(mockTests);
      } catch (error) {
        console.error("Error fetching mock tests:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMyJobs();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#0F2A2A] dark:to-[#0C1E2A] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              My Mock Tests
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Practice and improve your interview skills
            </p>
          </div>
          <Link href="/candidate/mock-test/create">
            <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-6 py-3">
              <FiPlus className="w-4 h-4 mr-2" />
              Create New Test
            </Button>
          </Link>
        </div>

        {tests.length === 0 ? (
          <Card className="text-center py-16 max-w-2xl mx-auto border-0 shadow-lg bg-white/80 dark:bg-[#1B2B2B]/80 backdrop-blur-sm">
            <CardContent>
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                <FiAward className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No Mock Tests Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 max-w-md mx-auto">
                Create your first mock test to practice interview questions
                tailored to your skills and goals.
              </p>
              <Link href="/candidate/mock-test/create">
                <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-4 text-lg">
                  <FiPlus className="w-5 h-5 mr-2" />
                  Create Your First Test
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tests.map((test) => (
              <Card
                key={test._id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-[#1B2B2B]/80 backdrop-blur-sm hover:scale-[1.02]"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                      {test.title}
                    </CardTitle>
                    <Badge
                      className={
                        test.interviewType === "Technical"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : test.interviewType === "Behavioral"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                      }
                    >
                      {test.interviewType}
                    </Badge>
                  </div>
                  <CardDescription className="text-teal-600 dark:text-cyan-400 font-medium text-base">
                    {test.role || "Practice Interview"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                    {test.jobDescription}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {test.skillsRequired.slice(0, 4).map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-teal-50 dark:bg-cyan-900/30 text-teal-700 dark:text-cyan-300"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {test.skillsRequired.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{test.skillsRequired.length - 4} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <FiUsers className="w-4 h-4" />
                      <span>AI Questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      <span>
                        {new Date(test.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-2">
                      <Link
                        href={`/candidate/mock-test/${test?._id}`}
                        className="flex items-center justify-center w-full"
                      >
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
