"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { fetchInterviewQuestions, submitInterview } from "@/lib/http/api";
import Vapi from "@vapi-ai/web";
import Loader from "@/components/Loader";
import { FiUser, FiPlay, FiPhoneOff } from "react-icons/fi";
import { PiRobotBold } from "react-icons/pi";
import { useVapiErrorSuppression } from "@/utils/useVapiWithErrorSuppression";

export default function InterviewPage() {
  useVapiErrorSuppression();
  const { interviewId } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [state, setState] = useState({
    jobTitle: "",
    jobId: "",
    questionId: "",
    isMockTest: false,
    loading: true,
    isCallActive: false,
    isSpeaking: false,
    interviewComplete: false,
    isSubmitting: false,
    hasSubmitted: false,
    status: "Ready to start",
    currentAISpeech: "",
  });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [fullTranscript, setFullTranscript] = useState("");

  const qIndex = useRef(0);
  const processed = useRef(new Set());
  const vapiRef = useRef(null);
  const submitLock = useRef(false);

  const cleanText = (text) => text.trim().replace(/\s+/g, " ");
  const isSystemResponse = (t) =>
    /^(uh|um|ah|yes|no|ok|okay|thanks?)$/i.test(t.trim());

  const calculateSimilarity = (str1, str2) => {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    const intersection = new Set([...words1].filter((x) => words2.includes(x)));
    return intersection.size / new Set([...words1, ...words2]).size;
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchInterviewQuestions(interviewId);
        setQuestions(data?.questions?.text || []);
        setState((s) => ({
          ...s,
          jobTitle: data.jobTitle || "Frontend Developer",
          jobId: interviewId,
          questionId: data.questions?._id || "",
          isMockTest: data.isMockTest || false,
          loading: false,
        }));
      } catch {
        console.error("Failed to load questions");
        setState((s) => ({ ...s, loading: false }));
      }
    })();
  }, [interviewId]);

  useEffect(() => {
    const VAPI = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
    vapiRef.current = VAPI;

    const stopCall = () =>
      setState((s) => ({
        ...s,
        isCallActive: false,
        isSpeaking: false,
        interviewComplete: true,
        status: "Interview Ended",
      }));

    VAPI.on("call-start", () => {
      setState((s) => ({
        ...s,
        isCallActive: true,
        status: "Interview in Progress...",
        currentAISpeech: "",
      }));
      qIndex.current = 0;
      processed.current = new Set();
      submitLock.current = false;
    });

    VAPI.on("call-end", stopCall);
    VAPI.on("ejected", stopCall);
    VAPI.on("speech-start", () =>
      setState((s) => ({ ...s, isSpeaking: true }))
    );
    VAPI.on("speech-end", () => setState((s) => ({ ...s, isSpeaking: false })));

    VAPI.on("message", (m) => {
      if (m.type !== "transcript" || m.transcriptType !== "final") return;
      const { transcript, role } = m;
      if (!transcript) return;

      setFullTranscript((p) =>
        p ? `${p}\n${role}: ${transcript}` : `${role}: ${transcript}`
      );

      if (role === "assistant") {
        setState((s) => ({ ...s, currentAISpeech: transcript }));
        questions.forEach((question, index) => {
          const questionKeywords = question
            .toLowerCase()
            .split(" ")
            .slice(0, 3)
            .join(" ");
          if (
            transcript.toLowerCase().includes(questionKeywords) &&
            index >= qIndex.current
          ) {
            qIndex.current = index;
          }
        });
      }

      if (role === "user") {
        const userResponse = cleanText(transcript);
        if (userResponse.length <= 2 || isSystemResponse(userResponse)) return;

        const transcriptKey = `${qIndex.current}-${userResponse.toLowerCase()}`;
        if (processed.current.has(transcriptKey)) return;
        processed.current.add(transcriptKey);

        setAnswers((prev) => {
          const existingAnswerIndex = prev.findIndex(
            (a) => a.questionNumber === qIndex.current
          );

          if (existingAnswerIndex !== -1) {
            const similarity = calculateSimilarity(
              prev[existingAnswerIndex].answer,
              userResponse
            );
            if (similarity > 0.7) return prev;

            const updated = [...prev];
            updated[existingAnswerIndex] = {
              ...updated[existingAnswerIndex],
              answer: cleanText(
                `${updated[existingAnswerIndex].answer} ${userResponse}`
              ),
              timestamp: new Date().toISOString(),
            };
            return updated;
          } else {
            return [
              ...prev,
              {
                questionNumber: qIndex.current,
                question: questions[qIndex.current],
                answer: userResponse,
                timestamp: new Date().toISOString(),
              },
            ];
          }
        });
      }
    });

    VAPI.on("error", (err) => {
      console.error("Interview error:", err);
      setState((s) => ({
        ...s,
        isCallActive: false,
        status: "Error occurred",
      }));
    });

    return () => VAPI.stop();
  }, [questions]);

  const startInterview = async () => {
    if (!vapiRef.current || !questions.length) return;
    const { jobTitle } = state;

    setState((s) => ({
      ...s,
      status: "Connecting...",
      currentAISpeech: "",
      interviewComplete: false,
    }));
    setAnswers([]);
    setFullTranscript("");
    submitLock.current = false;

    const assistant = {
      name: "AI Recruiter",
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are interviewing for ${jobTitle}. Ask EXACTLY these ${
              questions.length
            } questions in order:\n${questions
              .map((q, i) => `${i + 1}. ${q}`)
              .join("\n")}
            Ask ONE question at a time, wait for full answer, give brief acknowledgment, then proceed to next question.`,
          },
        ],
        temperature: 0.3,
      },
      voice: { provider: "11labs", voiceId: "paula" },
      firstMessage: `Hello ${
        user?.name || "Candidate"
      }, welcome to the ${jobTitle} interview. I'll ask you ${
        questions.length
      } questions. Let's begin: ${questions[0]}`,
    };

    try {
      await vapiRef.current.start(assistant);
    } catch (err) {
      console.error("Error starting call:", err);
      setState((s) => ({ ...s, status: "Error occurred" }));
    }
  };

  const endInterview = () => vapiRef.current?.stop();

  const handleSubmitInterview = useCallback(async () => {
    if (submitLock.current || state.hasSubmitted) {
    
      return;
    }
    const { jobId, questionId, isMockTest, jobTitle } = state;
    if (!jobId || !questionId || !answers.length) return;

    setState((s) => ({ ...s, isSubmitting: true, status: "Submitting..." }));
    try {
      const res = await submitInterview({
        jobId,
        jobTitle,
        questionId,
        questions,
        answers,
        fullTranscript,
        isMockTest,
      });
      setState((s) => ({
        ...s,
        status: res.success
          ? "Interview submitted successfully!"
          : "Submission failed",
      }));
      if (res.success) setTimeout(() => router.push("/interviews"), 2000);
    } catch (e) {
      console.error("Submit error:", e);
      setState((s) => ({ ...s, status: "Error submitting interview" }));
    } finally {
      setState((s) => ({ ...s, isSubmitting: false }));
    }
  }, [state, answers, questions, fullTranscript, router]);

  useEffect(() => {
    if (
      state.interviewComplete &&
      answers.length > 0 &&
      !state.isSubmitting &&
      !state.hasSubmitted &&
      !submitLock.current
    ) {

      handleSubmitInterview();
    }
  }, [
    state.interviewComplete,
    state.isSubmitting,
    state.hasSubmitted,
    answers.length,
    handleSubmitInterview,
  ]);

  if (state.loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#0F2A2A] dark:to-[#0C1E2A] flex flex-col items-center justify-center py-6 md:-mt-8">
      <div className="max-w-4xl w-full px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          AI Interview Session - {state.jobTitle}
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center mb-8">
          {[
            {
              icon: <PiRobotBold className="w-10 h-10 text-white" />,
              title: "AI Recruiter",
              active: state.isSpeaking,
              subtitle: state.isSpeaking ? "Speaking..." : "Ready to interview",
              gradient: "from-teal-500 to-cyan-600",
            },
            {
              icon: <FiUser className="w-10 h-10 text-white" />,
              title: user?.name || "Candidate",
              subtitle: state.isCallActive
                ? "In interview"
                : "Waiting to start",
              gradient: "from-teal-600 to-cyan-700",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`bg-white dark:bg-[#1B2B2B] rounded-2xl border-2 p-8 w-80 text-center shadow-lg transition-all duration-300 ${
                card.active
                  ? "border-teal-400 dark:border-cyan-400"
                  : "border-gray-200 dark:border-cyan-800"
              }`}
            >
              <div
                className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-br ${
                  card.gradient
                } rounded-full flex items-center justify-center ${
                  card.active ? "animate-pulse" : ""
                }`}
              >
                {card.icon}
              </div>
              <p className="font-semibold text-lg text-gray-900 dark:text-white">
                {card.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>

        {state.currentAISpeech && (
          <div className="flex justify-center mt-4 mb-6">
            <div className="p-2 bg-teal-50 dark:bg-cyan-900/30 border border-teal-200 dark:border-cyan-700 rounded-lg inline-block text-center">
              <div className="flex items-start justify-center gap-3">
                <div className="w-2 bg-teal-400 dark:bg-cyan-400 rounded-full mt-1 flex-shrink-0"></div>
                <p className="text-md text-teal-800 dark:text-cyan-200 italic leading-relaxed whitespace-pre-wrap break-words m-[-1]">
                  "{state.currentAISpeech}"
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center items-center gap-6 mb-6 mt-4">
          {!state.isCallActive && !state.interviewComplete ? (
            <button
              onClick={startInterview}
              disabled={!questions.length || state.isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {state.isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FiPlay className="w-5 h-5" />
                  Join Interview
                </>
              )}
            </button>
          ) : (
            state.isCallActive && (
              <button
                onClick={endInterview}
                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg hover:bg-red-700 transition-all"
                disabled={state.isSubmitting}
              >
                <FiPhoneOff className="w-6 h-6" />
              </button>
            )
          )}
        </div>

        {!state.isSubmitting && !state.interviewComplete && (
          <p className="text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 text-lg font-semibold mb-8">
            {state.status}
          </p>
        )}
      </div>
    </div>
  );
}
