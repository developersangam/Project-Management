'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PublicHeader } from '@/components/layout/PublicHeader'
import {
  CheckCircle,
  ArrowRight
} from 'lucide-react'

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

export default function PricingPage() {
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicHeader />

      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your team's needs. Always flexible to scale up or down.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`border border-[color:var(--border)] relative hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular ? 'ring-2 ring-primary md:scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-white">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="space-y-4">
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-foreground">{plan.price}</div>
                  <div className="text-sm text-muted-foreground">per {plan.period}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button className="w-full" variant={plan.popular ? 'default' : 'outline'} asChild>
                  <Link href="/register">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Frequently asked questions</h2>
            <p className="text-muted-foreground mt-2">Have questions about our pricing? We're here to help.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="border border-[color:var(--border)] cursor-pointer hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                {expandedFaq === index && (
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 md:p-12 text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="text-blue-100 max-w-xl mx-auto">
            Join thousands of teams using JiraClone to manage their projects more effectively.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">
              Start your free trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
