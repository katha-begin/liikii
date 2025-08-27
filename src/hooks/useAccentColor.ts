import { useState, useEffect } from 'react'

export type AccentColor = 'lilac' | 'blue' | 'pink' | 'mint' | 'butter'

const ACCENT_COLORS: Record<AccentColor, string> = {
  lilac: '#CBB7E8',
  blue: '#B7D3F2', 
  pink: '#F4C6D7',
  mint: '#CDE8D6',
  butter: '#F9E7A1',
}

export const useAccentColor = (defaultColor: AccentColor = 'lilac') => {
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    // Try to get accent color from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('liikii-accent-color') as AccentColor
      if (stored && ACCENT_COLORS[stored]) {
        return stored
      }
    }
    return defaultColor
  })

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color)
    localStorage.setItem('liikii-accent-color', color)
    
    // Update CSS custom property for dynamic theming
    document.documentElement.style.setProperty('--accent-primary', ACCENT_COLORS[color])
  }

  useEffect(() => {
    // Set initial accent color
    document.documentElement.style.setProperty('--accent-primary', ACCENT_COLORS[accentColor])
  }, [accentColor])

  return {
    accentColor,
    setAccentColor,
    accentColors: ACCENT_COLORS,
    getAccentValue: (color: AccentColor) => ACCENT_COLORS[color],
  }
}
