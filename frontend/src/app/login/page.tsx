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
import { PublicHeader } from '@/components/layout/PublicHeader'
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
      <PublicHeader />

      <div className="container mx-auto px-4 py-16">
        <Tabs defaultValue="login" className="max-w-md mx-auto">
          <TabsList className="grid w-full grid-cols-1 mb-8">
            <TabsTrigger value="login">Sign In</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  )
}