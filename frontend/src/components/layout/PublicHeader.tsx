'use client'

import Link from 'next/link'
import { Target } from 'lucide-react'
import { ThemeToggle } from '../ui/theme-toggle'

export const PublicHeader: React.FC = () => {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">Task Management</span>
        </Link>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <Link href="/login" className="text-sm px-4 py-2 text-foreground hover:opacity-80 transition-opacity">
            Sign In
          </Link>
          <Link href="/register" className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
