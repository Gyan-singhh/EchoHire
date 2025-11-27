"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

import Footer from "@/components/Footer";
import {
  Zap,
  Users,
  BarChart3,
  Video,
  Star,
  Award,
  Check,
  TrendingUp,
} from "lucide-react";
import Loader from "@/components/Loader";
export default function LandingPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  const subscriptionPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "5 AI interviews per month",
        "Basic feedback",
        "Community support",
        "Progress tracking",
      ],
      popular: false,
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "Most popular for serious learners",
      features: [
        "Unlimited AI interviews",
        "Detailed feedback & analytics",
        "Priority support",
        "Video recording",
        "Custom interview sets",
        "Advanced progress insights",
      ],
      popular: true,
      buttonText: "Start Free Trial",
    },
    {
      name: "Enterprise",
      price: "$49",
      period: "/month",
      description: "For teams and institutions",
      features: [
        "Everything in Pro",
        "Team management",
        "Bulk user accounts",
        "Custom branding",
        "API access",
        "Dedicated support",
      ],
      popular: false,
      buttonText: "Contact Sales",
    },
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI-Powered Feedback",
      description:
        "Get instant, actionable feedback to improve your answers and performance with advanced AI analysis.",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Realistic Interview Simulation",
      description:
        "Experience true interview environment with video recording and real-time coding challenges.",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Track Your Progress",
      description:
        "Monitor growth with detailed analytics, personalized insights, and performance metrics.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Industry Experts",
      description:
        "Learn from interviews designed by professionals from top tech companies.",
    },
  ];

  const stats = [
    {
      number: "10K+",
      label: "Interviews Conducted",
      icon: <TrendingUp className="w-6 h-6 text-teal-600 dark:text-cyan-400" />,
    },
    {
      number: "95%",
      label: "Success Rate",
      icon: <Star className="w-6 h-6 text-teal-600 dark:text-cyan-400" />,
    },
    {
      number: "50+",
      label: "Companies",
      icon: <Users className="w-6 h-6 text-teal-600 dark:text-cyan-400" />,
    },
    {
      number: "24/7",
      label: "AI Available",
      icon: <Zap className="w-6 h-6 text-teal-600 dark:text-cyan-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0F2A2A] dark:to-[#0F172A]">
      <section className="relative bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-[#0F2A2A] dark:to-[#1E40AF] min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-teal-200 dark:bg-cyan-800 rounded-full blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-cyan-200 dark:bg-blue-800 rounded-full blur-xl opacity-40 animate-float-delayed"></div>

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-cyan-900/50 text-teal-700 dark:text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Trusted by 10,000+ professionals
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white">
            Smarter{" "}
            <span className="text-teal-600 dark:text-cyan-400">AI-Driven</span>{" "}
            Interviews
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            Practice coding and behavioral interviews with AI-driven feedback.
            Get ready to land your dream job with real-time mock interviews and
            personalized coaching.
          </p>

          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href={user?.role ? `/${user.role}` : "/signup"}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Free Trial
            </Link>

            <Link
              href="/features"
              className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-cyan-400 dark:text-cyan-400 dark:hover:bg-cyan-900/50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              See How It Works
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Why Choose Our Platform?
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to prepare for your next technical interview
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border group hover:-translate-y-2"
            >
              <div className="text-teal-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Choose Your Plan
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Start free, upgrade as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${
                  plan.popular
                    ? "border-teal-500 dark:border-cyan-400 scale-105"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-600 dark:text-gray-400 ml-1">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-teal-500 dark:text-cyan-400 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={user?.role ? `/${user.role}` : "/signup"}
                  className={`block w-full py-3 px-6 rounded-lg font-semibold text-center transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl"
                      : "border-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-cyan-400 dark:text-cyan-400 dark:hover:bg-cyan-900/50"
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of successful candidates who landed their dream jobs
            with our platform.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href={user?.role ? `/${user.role}` : "/signup"}
              className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            <Link
              href="/demo"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
