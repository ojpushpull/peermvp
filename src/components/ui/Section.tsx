import { ReactNode } from 'react'
import Container from './Container'

interface SectionProps {
  children: ReactNode
  className?: string
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  background?: 'white' | 'gray' | 'blue' | 'none'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export default function Section({
  children,
  className = '',
  containerSize = 'lg',
  background = 'white',
  padding = 'lg',
}: SectionProps) {
  const backgroundStyles = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    blue: 'bg-blue-50',
    none: '',
  }

  const paddingStyles = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
  }

  return (
    <section className={`${backgroundStyles[background]} ${paddingStyles[padding]} ${className}`}>
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  )
}
