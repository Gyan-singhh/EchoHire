"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FiPlus, FiCode, FiBriefcase, FiFileText } from "react-icons/fi";
import { X } from "lucide-react";

const suggestedSkills = [
  "React",
  "Next.js",
  "JavaScript",
  "TypeScript",
  "CSS",
  "HTML",
  "Node.js",
  "Express.js",
  "MongoDB",
  "PostgreSQL",
  "Python",
  "Java",
  "Spring Boot",
  "AWS",
  "Docker",
  "Git",
];

export default function CreateMockTestPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    jobDescription: "",
    skillsRequired: [],
  });
  const [currentSkill, setCurrentSkill] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = (skill) => {
    if (skill && !form.skillsRequired.includes(skill)) {
      setForm({ ...form, skillsRequired: [...form.skillsRequired, skill] });
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setForm({
      ...form,
      skillsRequired: form.skillsRequired.filter(
        (skill) => skill !== skillToRemove
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.skillsRequired.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/candidate/mock-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Mock test created successfully!");
        router.push("/candidate/mock-test");
      } else {
        toast.error(data.message || "Failed to create mock test");
      }
    } catch (err) {
      toast.error("Error creating mock test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#0F2A2A] dark:to-[#0C1E2A] py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-[#1B2B2B]/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Create Mock Test
            </CardTitle>
            <CardDescription className="text-lg">
              Practice your interview skills with AI-generated questions
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FiBriefcase className="w-4 h-4" />
                  Title
                </label>
                <Input
                  name="title"
                  placeholder="e.g., Frontend Developer, Full Stack Engineer"
                  value={form.title}
                  onChange={handleChange}
                  className="bg-white dark:bg-[#1B2B2B] border-gray-300 dark:border-gray-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FiFileText className="w-4 h-4" />
                  Description
                </label>
                <Textarea
                  name="jobDescription"
                  placeholder="Describe the role, responsibilities, and what you want to practice..."
                  value={form.jobDescription}
                  onChange={handleChange}
                  className="min-h-[120px] bg-white dark:bg-[#1B2B2B] border-gray-300 dark:border-gray-600"
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <FiCode className="w-4 h-4" />
                    Skills
                  </label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {form.skillsRequired.length} selected
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {form.skillsRequired.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 bg-teal-100 dark:bg-cyan-900 text-teal-800 dark:text-cyan-300"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-teal-600 dark:hover:text-cyan-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addSkill(currentSkill))
                    }
                    className="flex-1 bg-white dark:bg-[#1B2B2B] border-gray-300 dark:border-gray-600"
                  />
                  <Button
                    type="button"
                    onClick={() => addSkill(currentSkill)}
                    variant="outline"
                    className="border-teal-300 dark:border-cyan-700 text-teal-600 dark:text-cyan-400"
                  >
                    <FiPlus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer border-teal-300 dark:border-cyan-700 text-teal-600 dark:text-cyan-400 hover:bg-teal-50 dark:hover:bg-cyan-900/20"
                      onClick={() => addSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-3 text-lg font-semibold"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Questions...
                  </div>
                ) : (
                  "Create Mock Test"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
