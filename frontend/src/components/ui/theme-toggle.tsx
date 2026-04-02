"use client"

import * as React from 'react'
import { Button } from './button'
import { Moon, Sun } from 'lucide-react'

export const ThemeToggle: React.FC = () => {
  const [mounted, setMounted] = React.useState(false)
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
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
    } else {
      root.classList.remove('dark')
    }
    setIsDark(nextIsDark)
    localStorage.setItem('theme', nextIsDark ? 'dark' : 'light')
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
