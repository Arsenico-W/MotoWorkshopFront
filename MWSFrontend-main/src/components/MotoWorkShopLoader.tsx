'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface MotoWorkShopLoaderProps {
  className?: string
}

export function MotoWorkShopLoader({ className }: MotoWorkShopLoaderProps) {
  const [slashPosition, setSlashPosition] = useState(-1)
  const text = 'MotoWorkShop'

  useEffect(() => {
    const interval = setInterval(() => {
      setSlashPosition((prev) => (prev + 1) % (text.length + 5))
    }, 50) // Adjust timing for smoother or faster animation

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={cn(
        'flex items-center justify-center min-h-screen bg-white',
        className
      )}
    >
      <div
        className="text-5xl font-bold relative"
        style={{ fontFamily: "'Arial', sans-serif" }}
        aria-live="polite"
        aria-busy="true"
      >
        {text.split('').map((letter, index) => (
          <span
            key={index}
            className={cn(
              'inline-block transition-colors duration-100',
              'text-gray-400',
              {
                'text-gray-800':
                  index === slashPosition || index === slashPosition - 1,
              }
            )}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  )
}
