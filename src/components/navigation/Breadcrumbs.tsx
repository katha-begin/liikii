import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { useNavigation } from '@/contexts/NavigationContext'

interface BreadcrumbsProps {
  className?: string
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className }) => {
  const { breadcrumbs } = useNavigation()

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className={`breadcrumbs ${className || ''}`} aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {index === 0 && (
              <Home size={12} className="breadcrumb-home-icon" />
            )}
            
            {item.href && index < breadcrumbs.length - 1 ? (
              <Link to={item.href} className="breadcrumb-link">
                {item.label}
              </Link>
            ) : (
              <span className="breadcrumb-current">{item.label}</span>
            )}
            
            {index < breadcrumbs.length - 1 && (
              <ChevronRight size={12} className="breadcrumb-separator" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
