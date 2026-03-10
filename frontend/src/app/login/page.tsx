'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { login } from '@/store/auth/authThunk'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '../../components/ui/badge'
import Link from 'next/link'
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

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isAuthenticated, loading } = useAppSelector(state => state.auth)

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await dispatch(login({ email, password }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">JiraClone</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="#contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <Button variant="outline" asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <Tabs defaultValue="login" className="max-w-md mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="shadow-lg border-0">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground">
                The modern way to manage projects
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Streamline your workflow, boost productivity, and deliver projects on time with our powerful project management platform.
              </p>
              <div className="flex justify-center space-x-4">
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
            <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <Card key={feature.title} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Pricing */}
            <div id="pricing" className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold">Choose your plan</h2>
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
                <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
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
              <h2 className="text-3xl font-bold">Get in touch</h2>
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
                    <h3 className="font-semibold mb-2">Office</h3>
                    <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}