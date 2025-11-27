"use client";
import React, { useState } from "react";
import { generateInterviewQuestionsByGemini } from "@/lib/http/api";
import { createJob } from "@/lib/http/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, X } from "lucide-react";

export default function TwoStepJobForm() {
  const router = useRouter();
  const suggestedTags = [
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "CSS",
    "HTML",
    "Redux",
    "Tailwind CSS",
    "Bootstrap",
    "Vue.js",
    "Angular",
    "React Native",
    "Expo",
    "Flutter",
    "Dart",
    "Swift",
    "Kotlin",
    "Android",
    "iOS",
    "Node.js",
    "Express.js",
    "NestJS",
    "GraphQL",
    "REST API",
    "PostgreSQL",
    "MongoDB",
    "MySQL",
    "SQLite",
    "Prisma",
    "Sequelize",
  ];

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [jobType, setJobType] = useState("");
  const [openings, setOpenings] = useState("1");
  const [companyName, setCompanyName] = useState("");
  const [responsibilities, setResponsibilities] = useState([""]);
  const [requirements, setRequirements] = useState([""]);
  const [questions, setQuestions] = useState([]);

  const addTag = (tag) => {
    if (
      skillsRequired.length >= suggestedTags.length ||
      skillsRequired.includes(tag)
    )
      return;
    setSkillsRequired([...skillsRequired, tag]);
  };

  const removeTag = (tagToRemove) => {
    setSkillsRequired(skillsRequired.filter((tag) => tag !== tagToRemove));
  };

  const handleAddResponsibility = () => {
    setResponsibilities([...responsibilities, ""]);
  };

  const handleRemoveResponsibility = (index) => {
    if (responsibilities.length > 1) {
      const updated = responsibilities.filter((_, i) => i !== index);
      setResponsibilities(updated);
    }
  };

  const handleChangeResponsibility = (index, value) => {
    const updated = [...responsibilities];
    updated[index] = value;
    setResponsibilities(updated);
  };

  const handleAddRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const handleRemoveRequirement = (index) => {
    if (requirements.length > 1) {
      const updated = requirements.filter((_, i) => i !== index);
      setRequirements(updated);
    }
  };

  const handleChangeRequirement = (index, value) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    const jobData = { title, jobDescription, skillsRequired };

    try {
      setLoading(true);
      const { questions: generatedQuestions } =
        await generateInterviewQuestionsByGemini(jobData);
      setQuestions(generatedQuestions);
      setStep(2);
    } catch (error) {
      alert("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    const payload = {
      title,
      jobDescription,
      skillsRequired,
      experienceLevel,
      location,
      minSalary: parseInt(minSalary),
      maxSalary: parseInt(maxSalary),
      jobType,
      openings: parseInt(openings),
      companyName,
      questions,
      responsibilities: responsibilities.filter((r) => r.trim() !== ""),
      requirements: requirements.filter((r) => r.trim() !== ""),
    };

    try {
      await createJob(payload);
      alert("Job saved successfully!");
      router.push("/employer");
    } catch (error) {
      alert("Failed to save job. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#0F2A2A] dark:to-[#0C1E2A] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className=" shadow-lg bg-white/80 dark:bg-[#1B2B2B]/80 backdrop-blur-sm border border-gray-200/60 dark:border-cyan-800/30">
          {step === 1 && (
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                Create Job Position
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                Fill in the job details and generate interview questions
              </CardDescription>
            </CardHeader>
          )}

          <CardContent className="px-8 py-5">
            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Job Title
                    </label>
                    <Input
                      placeholder="Frontend Developer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-white dark:bg-[#1B2B2B] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company Name
                    </label>
                    <Input
                      placeholder="Your company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="bg-white dark:bg-[#1B2B2B] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Experience Level
                    </label>
                    <Select
                      value={experienceLevel}
                      onValueChange={setExperienceLevel}
                    >
                      <SelectTrigger className="bg-white dark:bg-[#1B2B2B] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                        <SelectValue placeholder="Select Experience Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                        <SelectItem value="Mid Level">Mid Level</SelectItem>
                        <SelectItem value="Senior Level">
                          Senior Level
                        </SelectItem>
                        <SelectItem value="Director">Director</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Job Type
                    </label>
                    <Select value={jobType} onValueChange={setJobType}>
                      <SelectTrigger className="bg-white dark:bg-[#1B2B2B] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                        <SelectValue placeholder="Select Job Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full Time">Full Time</SelectItem>
                        <SelectItem value="Part Time">Part Time</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Location
                    </label>
                    <Input
                      placeholder="City, State or Country"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-white dark:bg-[#1B2B2B] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Openings
                    </label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Number of openings"
                      value={openings}
                      onChange={(e) => setOpenings(e.target.value)}
                      className="bg-white dark:bg-[#1B2B2B] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Min Salary ($)
                    </label>
                    <Input
                      type="number"
                      placeholder="Minimum salary"
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                      className="bg-white dark:bg-[#1B2B2B] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Max Salary ($)
                    </label>
                    <Input
                      type="number"
                      placeholder="Maximum salary"
                      value={maxSalary}
                      onChange={(e) => setMaxSalary(e.target.value)}
                      className="bg-white dark:bg-[#1B2B2B] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Job Description
                  </label>
                  <Textarea
                    placeholder="Describe the role, team, and what makes this position exciting..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[120px] bg-white dark:bg-[#1B2B2B] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Skills Required
                    </label>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {skillsRequired.length}/{suggestedTags.length} selected
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skillsRequired.map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="px-3 py-1 bg-teal-100 dark:bg-cyan-900/30 text-teal-800 dark:text-cyan-300 border-teal-200 dark:border-cyan-700"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-teal-600 dark:hover:text-cyan-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  <ScrollArea className="h-32 border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-[#1B2B2B]">
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="cursor-pointer border-teal-300 dark:border-cyan-700 text-teal-600 dark:text-cyan-400 hover:bg-teal-50 dark:hover:bg-cyan-900/20 hover:text-teal-700 dark:hover:text-cyan-300 transition-colors"
                          onClick={() => addTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Responsibilities
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddResponsibility}
                        className="border-teal-300 dark:border-cyan-700 text-teal-600 dark:text-cyan-400 hover:bg-teal-50 dark:hover:bg-cyan-900/20"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {responsibilities.map((resp, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            value={resp}
                            onChange={(e) =>
                              handleChangeResponsibility(i, e.target.value)
                            }
                            placeholder={`Responsibility ${i + 1}`}
                            className="bg-white dark:bg-[#1B2B2B] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                          />
                          {responsibilities.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleRemoveResponsibility(i)}
                              className="shrink-0 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Requirements
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddRequirement}
                        className="border-teal-300 dark:border-cyan-700 text-teal-600 dark:text-cyan-400 hover:bg-teal-50 dark:hover:bg-cyan-900/20"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {requirements.map((req, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            value={req}
                            onChange={(e) =>
                              handleChangeRequirement(i, e.target.value)
                            }
                            placeholder={`Requirement ${i + 1}`}
                            className="bg-white dark:bg-[#1B2B2B] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                          />
                          {requirements.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleRemoveRequirement(i)}
                              className="shrink-0 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg transition-colors font-medium h-12 text-base flex items-center justify-center gap-2"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      Generating...
                    </>
                  ) : (
                    "Generate Questions"
                  )}
                </Button>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">
                    Generated Interview Questions
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Review the AI-generated questions for your job position
                  </CardDescription>
                </div>

                <Card className="bg-gray-50 dark:bg-[#0B1F1F] border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {questions.map((q, idx) => (
                        <div
                          key={idx}
                          className="flex items-start space-x-4 p-4 bg-white dark:bg-[#1B2B2B] rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-teal-100 dark:bg-cyan-900/30 text-teal-600 dark:text-cyan-400 rounded-full text-sm flex items-center justify-center font-medium">
                            {idx + 1}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {q}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setStep(1)}
                  >
                    Back to Edit
                  </Button>
                  <Button
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={handleFinalSubmit}
                  >
                    Submit Job Position
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
