export const AuthLeftLogo = () => {
  return (
    <div className="hidden lg:flex w-full h-full bg-[#2C3E50] items-center justify-center">
      <div className="text-white">
        {/* Logo */}
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto"
        >
          {/* Mentor figure */}
          <circle cx="45" cy="35" r="12" fill="#F9C5D5" />
          <path d="M30 50 Q45 45 60 50 L60 75 Q45 70 30 75 Z" fill="#F9C5D5" />

          {/* Mentee figure */}
          <circle cx="95" cy="45" r="10" fill="white" />
          <path d="M82 58 Q95 54 108 58 L108 78 Q95 74 82 78 Z" fill="white" />

          {/* Connection */}
          <path d="M60 62 Q75 55 82 65" stroke="#F9C5D5" strokeWidth="3" fill="none" />
          <path d="M78 62 L82 65 L78 68" stroke="#F9C5D5" strokeWidth="3" fill="none" />

          {/* Symbols */}
          <path d="M45 85 L45 95 M40 90 L50 90" stroke="white" strokeWidth="2" />
          <path d="M95 88 L95 98 M90 93 L100 93" stroke="#F9C5D5" strokeWidth="2" />
          <circle cx="70" cy="25" r="8" fill="none" stroke="white" strokeWidth="2" />
          <path d="M66 25 L70 21 L74 25 L70 29 Z" fill="white" />

          {/* Base */}
          <ellipse cx="70" cy="110" rx="50" ry="4" fill="white" fillOpacity="0.3" />
        </svg>

        {/* Brand name */}
        <div className="text-center mt-6">
          <h2 className="text-2xl font-bold text-white">MentorConnect</h2>
          <p className="text-sm text-gray-300 mt-2">Find your perfect mentor</p>
        </div>
      </div>
    </div>
  )
}
