interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'blue' | 'white' | 'gray'
}

export default function Spinner({ size = 'md', color = 'blue' }: SpinnerProps) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const colorStyles = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600',
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeStyles[size]} border-4 ${colorStyles[color]} border-t-transparent rounded-full animate-spin`}
      />
    </div>
  )
}
