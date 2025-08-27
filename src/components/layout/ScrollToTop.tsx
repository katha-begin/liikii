import React, { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui'

interface ScrollToTopProps {
  threshold?: number
  smooth?: boolean
  className?: string
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({
  threshold = 300,
  smooth = true,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Check if we're in a page wrapper or main content
      const scrollElement = document.querySelector('.page-wrapper--scrollable') || 
                           document.querySelector('.main-content') ||
                           window

      let scrollTop = 0
      if (scrollElement === window) {
        scrollTop = window.pageYOffset || document.documentElement.scrollTop
      } else {
        scrollTop = (scrollElement as Element).scrollTop
      }

      setIsVisible(scrollTop > threshold)
    }

    const scrollElement = document.querySelector('.page-wrapper--scrollable') || 
                         document.querySelector('.main-content') ||
                         window

    scrollElement.addEventListener('scroll', toggleVisibility)
    
    return () => {
      scrollElement.removeEventListener('scroll', toggleVisibility)
    }
  }, [threshold])

  const scrollToTop = () => {
    const scrollElement = document.querySelector('.page-wrapper--scrollable') || 
                         document.querySelector('.main-content')

    if (scrollElement) {
      scrollElement.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto'
      })
    } else {
      window.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto'
      })
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <Button
      variant="primary"
      size="sm"
      className={`scroll-to-top ${className || ''}`}
      onClick={scrollToTop}
      leftIcon={<ChevronUp size={16} />}
      title="Scroll to top"
    >
      Top
    </Button>
  )
}

export default ScrollToTop
