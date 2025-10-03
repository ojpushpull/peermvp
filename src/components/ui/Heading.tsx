import { ReactNode } from 'react'

interface HeadingProps {
  children: ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
  align?: 'left' | 'center' | 'right'
}

export default function Heading({
  children,
  level = 2,
  className = '',
  align = 'left',
}: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  const sizeStyles = {
    1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
    2: 'text-3xl md:text-4xl font-bold',
    3: 'text-2xl md:text-3xl font-bold',
    4: 'text-xl md:text-2xl font-semibold',
    5: 'text-lg md:text-xl font-semibold',
    6: 'text-base md:text-lg font-semibold',
  }

  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <Tag className={`text-gray-900 ${sizeStyles[level]} ${alignStyles[align]} ${className}`}>
      {children}
    </Tag>
  )
}
