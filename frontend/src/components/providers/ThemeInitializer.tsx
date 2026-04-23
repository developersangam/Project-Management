'use client'

import * as React from 'react'
import { useAppSelector } from '@/hooks/redux'

export const ThemeInitializer: React.FC = () => {
  const theme = useAppSelector((state) => state.ui.theme)

  // Apply theme to DOM whenever it changes
  React.useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return null
}
