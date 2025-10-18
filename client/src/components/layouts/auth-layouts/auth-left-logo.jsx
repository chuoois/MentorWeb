import { Link } from "react-router-dom";

export const AuthLeftLogo = () => {
  return (
    <div className="hidden lg:flex w-full h-full bg-gradient-to-br from-[#2C3E50] to-[#4A6276] items-center justify-center">
      <div className="text-white text-center">
        {/* Logo SVG với hiệu ứng hover */}
        <svg
          width="160"
          height="160"
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto transition-transform duration-300 ease-in-out hover:scale-105 hover:rotate-3"
        >
          {/* Mentor figure */}
          <circle cx="45" cy="35" r="12" fill="#F9C5D5" />
          <path d="M30 50 Q45 45 60 50 L60 75 Q45 70 30 75 Z" fill="#F9C5D5" />

          {/* Mentee figure */}
          <circle cx="95" cy="45" r="10" fill="#FFFFFF" />
          <path d="M82 58 Q95 54 108 58 L108 78 Q95 74 82 78 Z" fill="#FFFFFF" />

          {/* Connection */}
          <path d="M60 62 Q75 55 82 65" stroke="#F9C5D5" strokeWidth="3" fill="none" />
          <path d="M78 62 L82 65 L78 68" stroke="#F9C5D5" strokeWidth="3" fill="none" />

          {/* Symbols */}
          <path d="M45 85 L45 95 M40 90 L50 90" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M95 88 L95 98 M90 93 L100 93" stroke="#F9C5D5" strokeWidth="2" />
          <circle cx="70" cy="25" r="8" fill="none" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M66 25 L70 21 L74 25 L70 29 Z" fill="#FFFFFF" />

          {/* Base */}
          <ellipse cx="70" cy="110" rx="50" ry="4" fill="#FFFFFF" fillOpacity="0.3" />
        </svg>

        {/* Brand name */}
        <div className="mt-8">
          <Link to="/">
            <h2 className="text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
              MentorHub
            </h2>
          </Link>
          <p className="text-base text-gray-200 mt-3 font-medium">
            Kết nối với người cố vấn hoàn hảo của bạn
          </p>
        </div>
      </div>
    </div>
  );
};