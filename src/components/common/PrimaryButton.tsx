interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export const PrimaryButton = ({ 
  children,
  onClick,
  className = ''
}: ButtonProps) => {
  return (
    <button
      className={`px-4 py-2 bg-blue-600 text-white rounded-md 
        hover:bg-blue-700 transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
