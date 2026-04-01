'use client'

import * as React from 'react'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

type ThemeProviderProps = {
  attribute?: 'class' | `data-${string}`
  children: React.ReactNode
  defaultTheme?: Theme
  enableSystem?: boolean
}

type ThemeContextValue = {
  resolvedTheme: ResolvedTheme
  setTheme: (value: Theme) => void
  theme: Theme
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme, enableSystem: boolean): ResolvedTheme {
  if (theme === 'system') return enableSystem ? getSystemTheme() : 'light'
  return theme
}

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function ThemeProvider({
  attribute = 'class',
  children,
  defaultTheme = 'system',
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>(
    resolveTheme(defaultTheme, enableSystem),
  )

  React.useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme')
    if (isTheme(storedTheme)) {
      setThemeState(storedTheme)
      return
    }

    setThemeState(defaultTheme)
  }, [defaultTheme])

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (nextTheme: Theme) => {
      const nextResolvedTheme = resolveTheme(nextTheme, enableSystem)
      setResolvedTheme(nextResolvedTheme)

      const root = document.documentElement
      if (attribute === 'class') {
        root.classList.remove('light', 'dark')
        root.classList.add(nextResolvedTheme)
        return
      }

      root.setAttribute(attribute, nextResolvedTheme)
    }

    applyTheme(theme)

    const handleSystemThemeChange = () => {
      if (theme === 'system') applyTheme('system')
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [attribute, enableSystem, theme])

  const setTheme = React.useCallback((value: Theme) => {
    window.localStorage.setItem('theme', value)
    setThemeState(value)
  }, [])

  const contextValue = React.useMemo(
    () => ({ resolvedTheme, setTheme, theme }),
    [resolvedTheme, setTheme, theme],
  )

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
