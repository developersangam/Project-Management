'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PublicHeader } from '@/components/layout/PublicHeader'
import {
  CheckCircle,
  Users,
  Target,
  BarChart3,
  Shield,
  Zap,
  Star,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ArrowRight
} from 'lucide-react'

const features = [
  {
    icon: Target,
    title: 'Project Management',
    description: 'Organize and track your projects with powerful Kanban boards'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together seamlessly with your team members'
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Get detailed insights into your team\'s performance'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security to protect your sensitive data'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed and performance at scale'
  },
  {
    icon: CheckCircle,
    title: 'Task Tracking',
    description: 'Never miss a deadline with smart task management'
  }
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Up to 3 projects',
      '5 team members',
      'Basic task management',
      'Email support'
    ],
    popular: false
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per user/month',
    description: 'Best for growing teams',
    features: [
      'Unlimited projects',
      'Unlimited team members',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
      'Advanced security'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'SSO & advanced security',
      'Dedicated support',
      'Custom contracts',
      'On-premise deployment',
      '24/7 phone support'
    ],
    popular: false
  }
]

const faqs = [
  {
    question: 'How does the free trial work?',
    answer: 'You can try JiraClone Pro free for 14 days. No credit card required. At the end of the trial, you can choose to continue with a paid plan or downgrade to our free plan.'
  },
  {
    question: 'Can I change my plan anytime?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any charges.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use bank-level encryption, regular security audits, and comply with SOC 2 Type II standards. Your data is always safe with us.'
  },
  {
    question: 'Do you offer training and onboarding?',
    answer: 'Yes! We provide comprehensive documentation, video tutorials, and dedicated onboarding sessions for Enterprise customers.'
  },
  {
    question: 'What integrations do you support?',
    answer: 'We integrate with Slack, Microsoft Teams, Google Workspace, Jira, Trello, Asana, and many more. Check our integrations page for the full list.'
  },
  {
    question: 'Can I export my data?',
    answer: 'Yes, you can export your data in JSON or CSV format at any time. We also provide API access for custom integrations.'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicHeader />
      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            The modern way to manage projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your workflow, boost productivity, and deliver projects on time with our powerful project management platform.
          </p>
          <div className="flex justify-center space-x-4 pt-4">
            <Button size="lg" asChild>
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Powerful Features</h2>
            <p className="text-muted-foreground mt-2">Everything you need to manage projects effectively</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Icon className="w-12 h-12 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Choose your plan</h2>
            <p className="text-muted-foreground mt-2">Start free and scale as you grow</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mt-2">Everything you need to know about JiraClone</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div id="contact" className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Get in touch</h2>
          <p className="text-muted-foreground">Have questions? We'd love to hear from you.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-muted-foreground">hello@jiraclone.com</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-sm text-muted-foreground">123 Tech Street, SF, CA</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-6 py-12">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to get started?</h2>
          <Button size="lg" asChild>
            <Link href="/register">
              Start your free trial today
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Twitter</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">LinkedIn</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">GitHub</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 JiraClone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
