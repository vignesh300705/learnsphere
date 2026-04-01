import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  BarChart3,
  Brain,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BarChart3,
    title: "Learning Analytics",
    desc: "Gain deep insights into student engagement, course progress, and academic performance through powerful visual dashboards.",
  },
  {
    icon: Brain,
    title: "AI-Powered Predictions",
    desc: "Identify at-risk students early using intelligent predictive models and provide personalized recommendations.",
  },
  {
    icon: Users,
    title: "Instructor Management",
    desc: "Create courses, manage quizzes, and monitor classroom performance using powerful instructor tools.",
  },
];

const stats = [
  { value: "40%", label: "Improvement in Course Completion" },
  { value: "25%", label: "Increase in Student Engagement" },
  { value: "3x", label: "Faster Academic Performance Insights" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      {/* NAVBAR */}
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <GraduationCap className="h-7 w-7 text-primary" />
            LearnSphere AI
          </div>

          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>

            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="py-28 px-6 md:px-10 text-center bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-4xl mx-auto">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm mb-6">
            <Brain className="h-4 w-4" />
            AI-Driven Learning Intelligence Platform
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Transform Education with
            <br />
            <span className="text-primary">
              Intelligent Learning Analytics
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            LearnSphere AI empowers educators and students with real-time
            analytics, predictive insights, and personalized learning
            experiences designed to improve academic outcomes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="gap-2 px-8">
                Start Your Learning Journey
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link to="/login">
              <Button size="lg" variant="outline">
                Explore the Platform
              </Button>
            </Link>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            Demo Accounts: alex@student.com • sarah@instructor.com •
            admin@platform.com (any password)
          </p>

        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold">
              Powerful Tools for Modern Education
            </h2>

            <p className="text-muted-foreground mt-3">
              Everything educators and institutions need to track performance,
              improve outcomes, and deliver smarter learning experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {features.map((feature) => (
              <div
                key={feature.title}
                className="border rounded-xl p-8 text-center hover:shadow-lg transition"
              >
                <div className="mx-auto w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>

                <h3 className="text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="text-sm text-muted-foreground mt-3">
                  {feature.desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* IMPACT SECTION */}
      <section className="py-24 px-6 md:px-10 bg-muted/30">
        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-4">
            Driving Better Learning Outcomes
          </h2>

          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            LearnSphere AI helps institutions enhance student success through
            data-driven insights, predictive intelligence, and smarter
            academic decision-making.
          </p>

          <div className="grid md:grid-cols-3 gap-8">

            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border rounded-xl p-8 bg-background"
              >
                <h3 className="text-3xl font-bold text-primary">
                  {stat.value}
                </h3>

                <p className="text-sm text-muted-foreground mt-2">
                  {stat.label}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground bg-muted">
        LearnSphere AI — Intelligent Learning Analytics Platform  
        <br />
        © {new Date().getFullYear()} LearnSphere AI. All rights reserved.
      </footer>

    </div>
  );
}