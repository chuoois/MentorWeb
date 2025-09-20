import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "react-hot-toast"
import { Link } from "react-router-dom"

export const MenteeRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    toast.success("Register submitted!")
    setIsLoading(false)
  }

  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold text-[#2C3E50] mb-8 text-center">
        Sign up as a mentee
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-[#2C3E50]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            className="h-12 border border-gray-300 rounded-md focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5]"
          />
        </div>

        {/* Full name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-[#2C3E50]">
            Full Name
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            required
            className="h-12 border border-gray-300 rounded-md focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5]"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-[#2C3E50]">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              minLength={8}
              className="h-12 border border-gray-300 rounded-md focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5] pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <ul className="text-xs text-gray-500 mt-1 list-disc ml-5">
            <li>Must be at least 8 characters</li>
            <li>Must include one lowercase character</li>
            <li>Must include one uppercase character</li>
            <li>Can't be too common</li>
          </ul>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full h-12 bg-[#F9C5D5] hover:bg-[#f5b8cc] text-[#2C3E50] font-medium rounded-md transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Sign Up"}
        </Button>
      </form>

      {/* Separator */}
      <div className="relative">
        <Separator className="my-6" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white px-4 text-sm text-gray-500">Or</span>
        </div>
      </div>

      {/* Google button */}
      <Button
        variant="outline"
        className="w-full h-12 border border-gray-300 hover:bg-gray-50 transition-colors bg-transparent flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign up with Google
      </Button>

      {/* Footer */}
      <div className="text-center space-y-3 text-sm mt-6 text-gray-600">
        <p>
          By clicking <span className="font-medium">"Sign Up"</span> or{" "}
          <span className="font-medium">"Sign up with Google"</span>, you accept the{" "}
          <Link to="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>.
        </p>

        <p>
          Already have an account?{" "}
          <Link to="/auth/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>

        <p>
          Looking to join us as a mentor?{" "}
          <Link to="/mentor-apply" className="text-blue-600 hover:underline">
            Apply now
          </Link>
        </p>
      </div>
    </div>
  )
}
