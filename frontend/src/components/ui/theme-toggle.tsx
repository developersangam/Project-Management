"use client"

import * as React from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { toggleTheme } from '@/store/ui/uiSlice'
import { Button } from './button'
import { Moon, Sun } from 'lucide-react'

export const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.ui.theme)
  const [mounted, setMounted] = React.useState(false)

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

  const handleToggle = () => {
    dispatch(toggleTheme())
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="p-2 rounded-full bg-background/20 hover:bg-background/30"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  )
}
