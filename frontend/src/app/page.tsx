"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../hooks/redux";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "../components/ui/badge";
import { PublicHeader } from "@/components/layout/PublicHeader";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Target,
  BarChart3,
  Shield,
  Zap,
  Star,
  Play,
  ChevronRight,
} from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "TechCorp",
    content:
      "JiraClone transformed how our team manages projects. The intuitive interface and powerful features helped us deliver projects 40% faster.",
    avatar: "SJ",
  },
  {
    name: "Mike Chen",
    role: "Engineering Lead",
    company: "StartupXYZ",
    content:
      "The analytics and reporting features give us incredible insights into our team's performance. Highly recommended!",
    avatar: "MC",
  },
  {
    name: "Emily Davis",
    role: "Operations Manager",
    company: "GlobalTech",
    content:
      "Finally, a project management tool that's both powerful and easy to use. Our productivity has skyrocketed since switching.",
    avatar: "ED",
  },
];

const stats = [
  { number: "10K+", label: "Active Users" },
  { number: "50K+", label: "Projects Completed" },
  { number: "99.9%", label: "Uptime" },
  { number: "24/7", label: "Support" },
];

export default function LandingPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("[data-animate]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_40%)] dark:bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.24),_transparent_40%)]" />
      <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-400/20 blur-3xl dark:bg-violet-500/20" />
      <div className="pointer-events-none absolute left-0 bottom-0 h-64 w-64 -translate-y-1/2 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/20" />
      <PublicHeader />
      <section className="relative overflow-hidden pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <div data-animate className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-sm text-muted-foreground shadow-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span>Everything your team needs to ship projects faster.</span>
              </div>
              <div data-animate className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  Build better projects with a single team workspace.
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground">
                  JiraClone combines planning, collaboration, and reporting so your team can stay aligned and move faster from ideas to delivery.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-start" data-animate>
                <Button
                  size="lg"
                  className="text-base px-6 py-4 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95"
                  asChild
                >
                  <Link href="/register">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base px-6 py-4 border-[color:var(--border)] text-foreground hover:border-primary/80 hover:bg-primary/5">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-[color:var(--muted-foreground)]" data-animate>
                <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--secondary)] px-4 py-2 text-[color:var(--secondary-foreground)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  Trusted by 10,000+ teams worldwide
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--secondary)] px-4 py-2 text-[color:var(--secondary-foreground)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Built for fast team collaboration
                </div>
              </div>
            </div>

            <div className="relative max-w-6xl mx-auto" data-animate>
              <div className="relative overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] ring-1 ring-[color:var(--border)]/90 backdrop-blur-xl">
                <div className="absolute -right-16 top-12 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />
                <div className="absolute -left-16 bottom-12 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl" />
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--secondary)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[color:var(--secondary-foreground)] shadow-sm">
                  <span>Live dashboard preview</span>
                </div>
                <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
                  <div className="space-y-4 rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-sm">
                    <div className="mb-4 rounded-3xl bg-[color:var(--secondary)] p-4 text-sm text-[color:var(--secondary-foreground)]">
                      <p className="font-semibold text-[color:var(--foreground)]">Boards</p>
                      <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">Quick access to your active workflows</p>
                    </div>
                    {['Sprint board', 'Design review', 'Client sync', 'Release plan'].map((item) => (
                      <div key={item} className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-3 text-sm text-[color:var(--muted-foreground)] transition hover:border-primary/40 hover:bg-[color:var(--secondary)]">
                        <p className="font-medium text-[color:var(--foreground)]">{item}</p>
                        <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">Quick access</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--card)] p-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">Live dashboard</p>
                        <h3 className="text-2xl font-semibold text-[color:var(--foreground)]">Project board overview</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10" />
                        <div className="h-10 w-10 rounded-full bg-purple-500/10" />
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--card)] p-4">
                        <div className="mb-4 flex items-center justify-between text-sm text-[color:var(--muted-foreground)]">
                          <span className="font-semibold text-[color:var(--foreground)]">Sprint Tasks</span>
                          <span>8 left</span>
                        </div>
                        {['Backlog', 'In Progress', 'Review'].map((task) => (
                          <div key={task} className="mb-3 rounded-3xl bg-[color:var(--card)] p-3">
                            <p className="text-sm font-medium text-[color:var(--foreground)]">{task}</p>
                            <div className="mt-2 h-2 rounded-full bg-primary/20" />
                          </div>
                        ))}
                      </div>
                      <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-lg">
                        <div className="mb-4 flex items-center justify-between text-sm font-semibold text-[color:var(--foreground)]">
                          <span>Weekly Progress</span>
                          <span>72%</span>
                        </div>
                        <div className="h-40 rounded-[1.5rem] bg-primary/10 shadow-inner">
                          <div className="h-full rounded-[1.5rem] bg-gradient-to-br from-primary to-sky-500" />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--card)] p-4">
                      <div className="mb-4 flex items-center justify-between text-sm text-[color:var(--muted-foreground)]">
                        <p className="font-semibold text-[color:var(--foreground)]">Team updates</p>
                        <span>3 new</span>
                      </div>
                      <div className="space-y-2">
                        {['Design review', 'Client sync', 'Deploy checklist'].map((item) => (
                          <div key={item} className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-3 shadow-sm">
                            <p className="text-sm font-medium text-[color:var(--foreground)]">{item}</p>
                            <p className="text-xs text-[color:var(--muted-foreground)]">Due today</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-16 bg-[color:var(--background)]" data-animate>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] px-6 py-8 text-center shadow-sm">
                <p className="text-3xl font-semibold text-[color:var(--foreground)]">{stat.number}</p>
                <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4" data-animate>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help teams collaborate, track
              progress, and deliver exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border border-[color:var(--border)] shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <Target className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4">
                  Project Management
                </h3>
                <p className="text-muted-foreground mb-6">
                  Organize and track your projects with powerful Kanban boards,
                  timelines, and Gantt charts.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Visual project boards</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Custom workflows</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Time tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-[color:var(--border)] shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <Users className="w-12 h-12 text-green-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4">
                  Team Collaboration
                </h3>
                <p className="text-muted-foreground mb-6">
                  Work together seamlessly with real-time updates, comments, and
                  file sharing.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Real-time collaboration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">@mentions and notifications</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">File attachments</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-[color:var(--border)] shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <BarChart3 className="w-12 h-12 text-purple-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4">
                  Analytics & Insights
                </h3>
                <p className="text-muted-foreground mb-6">
                  Get detailed insights into your team's performance with
                  comprehensive analytics.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Performance dashboards</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Time tracking reports</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Custom reports</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-background/50" data-animate>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Loved by teams worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our customers have to say about JiraClone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border border-[color:var(--border)] shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-purple-600 text-white" data-animate>
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of teams already using JiraClone to deliver projects
            faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
              asChild
            >
              <Link href="/register">
                Start Free Trial
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm mt-4 opacity-75">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-foreground dark:bg-slate-950 dark:text-card-foreground border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">JiraClone</span>
              </div>
              <p className="text-muted-foreground">
                The modern project management platform for teams that want to
                deliver exceptional results.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2026 JiraClone. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
