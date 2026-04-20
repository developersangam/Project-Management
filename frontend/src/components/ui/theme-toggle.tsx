"use client"

import * as React from 'react'
import { Button } from './button'
import { Moon, Sun } from 'lucide-react'

export const ThemeToggle: React.FC = () => {
  const [mounted, setMounted] = React.useState(false)
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const theme = localStorage.getItem('theme') || 'light'
      return theme === 'dark'
    } catch (e) {
      return false
    }
  })

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="p-2 rounded-full bg-background/20 hover:bg-background/30"
        disabled
      >
        <Sun className="w-4 h-4" />
      </Button>
    )
  }

  const toggle = () => {
    const root = document.documentElement
    const nextIsDark = !isDark
    if (nextIsDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    setIsDark(nextIsDark)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="p-2 rounded-full bg-background/20 hover:bg-background/30"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  )
}
