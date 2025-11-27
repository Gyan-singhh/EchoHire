"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  FiArrowLeft,
  FiPlay,
  FiCalendar,
  FiUsers,
  FiCode,
  FiBook,
  FiClock,
  FiAward,
  FiCheckCircle,
  FiStar,
  FiMessageSquare,
} from "react-icons/fi";
import { fetchMockTestById } from "@/lib/http/api";

export default function MockTestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMockTest = async () => {
      try {
        const data = await fetchMockTestById(params?.mockId);
        if (data.success) {
          setTest(data.mockTest);
        }
      } catch (error) {
        console.error("Error fetching mock test:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMockTest();
  }, [params.id]);

  const hasAttempt = test?.attempt !== null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#0F2A2A] dark:to-[#0C1E2A] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Loading mock test details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#0F2A2A] dark:to-[#0C1E2A] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Mock Test Not Found
          </h1>
          <Link href="/candidate/mock-test">
            <Button className="bg-teal-600 text-white">
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Mock Tests
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#0F2A2A] dark:to-[#0C1E2A] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/candidate/mock-test">
            <Button
              variant="outline"
              className="border-gray-300 dark:border-cyan-800 text-gray-600 dark:text-gray-300"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Tests
            </Button>
          </Link>

          {!hasAttempt && (
            <Button
              onClick={() => router.push(`/candidate/interviews/${test.id}`)}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8"
            >
              <FiPlay className="w-4 h-4 mr-2" />
              Start Mock Test
            </Button>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-[#1B2B2B]/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {test.title}
                    </CardTitle>
                    <CardDescription className="text-xl text-teal-600 dark:text-cyan-400 font-medium">
                      {test.role || "Practice Interview"}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      className={
                        test.interviewType === "Technical"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-lg px-4 py-2"
                          : test.interviewType === "Behavioral"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-lg px-4 py-2"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 text-lg px-4 py-2"
                      }
                    >
                      {test.interviewType}
                    </Badge>
                    {hasAttempt && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-sm px-3 py-1">
                        <FiCheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    <span>
                      Created: {new Date(test.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUsers className="w-4 h-4" />
                    <span>AI Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4" />
                    <span>
                      ~{Math.ceil(test.skillsRequired.length * 3)} minutes
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {hasAttempt && test.attempt && (
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-[#1B2B2B]/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FiAward className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                    Your Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {test.attempt.rating && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <FiStar className="w-5 h-5 text-yellow-500" />
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          Rating: {test.attempt.rating}/5
                        </span>
                      </div>
                    </div>
                  )}

                  {test.attempt.feedback && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <FiMessageSquare className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                        Feedback
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#223344] p-4 rounded-lg">
                        {test.attempt.feedback}
                      </p>
                    </div>
                  )}

                  {test.attempt.answers && test.attempt.answers.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Your Answers ({test.attempt.answers.length})
                      </h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {test.attempt.answers
                          .slice(0, 3)
                          .map((answer, index) => (
                            <div
                              key={index}
                              className="p-3 border border-gray-200 dark:border-cyan-800 rounded-lg bg-gray-50 dark:bg-[#223344]"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-teal-100 dark:bg-cyan-900 text-teal-600 dark:text-cyan-400 rounded-full text-sm flex items-center justify-center font-bold flex-shrink-0 mt-1">
                                  {index + 1}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                  {answer.substring(0, 150)}...
                                </p>
                              </div>
                            </div>
                          ))}
                        {test.attempt.answers.length > 3 && (
                          <div className="text-center text-gray-500 dark:text-gray-400 py-2">
                            + {test.attempt.answers.length - 3} more answers
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-[#1B2B2B]/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FiBook className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {test.description}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-[#1B2B2B]/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FiCode className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                  Skills Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {test.skillsRequired.map((skill, index) => (
                    <Badge
                      key={index}
                      className="px-4 py-2 text-base bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-cyan-900 dark:to-teal-900 text-teal-800 dark:text-cyan-300 border-0"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-[#1B2B2B]/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                  Test Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-100 dark:bg-cyan-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-teal-600 dark:text-cyan-400 text-sm font-bold">
                      1
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    You'll have 2-3 minutes per question to think and respond
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-100 dark:bg-cyan-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-teal-600 dark:text-cyan-400 text-sm font-bold">
                      2
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Speak clearly and structure your answers
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-100 dark:bg-cyan-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-teal-600 dark:text-cyan-400 text-sm font-bold">
                      3
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Focus on demonstrating your thought process
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-[#1B2B2B]/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                  Test Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Skills Tested
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {test.skillsRequired.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Estimated Time
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ~{Math.ceil(test.skillsRequired.length * 3)} min
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Difficulty
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {test.interviewType}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Status
                  </span>
                  <span
                    className={`font-semibold ${
                      hasAttempt
                        ? "text-green-600 dark:text-green-400"
                        : "text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    {hasAttempt ? "Completed" : "Not Started"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
