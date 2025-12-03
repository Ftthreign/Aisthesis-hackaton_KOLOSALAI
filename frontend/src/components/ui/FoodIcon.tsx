interface FoodIconProps {
  className?: string
  type?: "default" | "rice" | "spices" | "dish"
}

export default function FoodIcon({
  className = "",
  type = "default",
}: FoodIconProps) {
  const iconClasses = `w-12 h-12 ${className}`

  // Simple food icon using SVG
  if (type === "rice") {
    return (
      <svg
        className={iconClasses}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" fill="#F59E0B" opacity="0.2" />
        <circle cx="8" cy="10" r="1.5" fill="#F59E0B" />
        <circle cx="12" cy="9" r="1.5" fill="#F59E0B" />
        <circle cx="16" cy="10" r="1.5" fill="#F59E0B" />
        <circle cx="10" cy="13" r="1.5" fill="#F59E0B" />
        <circle cx="14" cy="13" r="1.5" fill="#F59E0B" />
        <circle cx="12" cy="15" r="1.5" fill="#F59E0B" />
      </svg>
    )
  }

  if (type === "spices") {
    return (
      <svg
        className={iconClasses}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" fill="#EF4444" opacity="0.2" />
        <path
          d="M12 8L13 11L16 12L13 13L12 16L11 13L8 12L11 11L12 8Z"
          fill="#EF4444"
        />
        <circle cx="12" cy="12" r="2" fill="#FBBF24" />
      </svg>
    )
  }

  if (type === "dish") {
    return (
      <svg
        className={iconClasses}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="12"
          cy="16"
          rx="8"
          ry="2"
          fill="#DC2626"
          opacity="0.2"
        />
        <ellipse cx="12" cy="14" rx="7" ry="1.5" fill="#DC2626" opacity="0.3" />
        <path
          d="M8 10C8 8.895 8.895 8 10 8H14C15.105 8 16 8.895 16 10V14C16 15.105 15.105 16 14 16H10C8.895 16 8 15.105 8 14V10Z"
          fill="#F97316"
        />
        <circle cx="12" cy="12" r="3" fill="#FBBF24" opacity="0.6" />
      </svg>
    )
  }

  // Default food icon
  return (
    <svg
      className={iconClasses}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="#F97316" opacity="0.1" />
      <path
        d="M12 6C9.79 6 8 7.79 8 10C8 11.5 8.8 12.8 10 13.5V18H14V13.5C15.2 12.8 16 11.5 16 10C16 7.79 14.21 6 12 6Z"
        fill="#F97316"
        opacity="0.6"
      />
      <circle cx="12" cy="10" r="3" fill="#FBBF24" />
    </svg>
  )
}

