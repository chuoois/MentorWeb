import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import AdminService from "@/services/admin.service"

// ===== Cookie helpers (chỉ dùng nhớ email) =====
function setCookie(name, value, days = 30) {
  const d = new Date()
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/`
}
function getCookie(name) {
  const key = `${name}=`
  const arr = decodeURIComponent(document.cookie || "").split(";")
  for (let c of arr) {
    const t = c.trim()
    if (t.indexOf(key) === 0) return t.substring(key.length)
  }
  return ""
}
function eraseCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

// ✅ FORM-ONLY: khớp AuthLayout (bên phải <Outlet />)
export const AdminLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({ email: "", password: "" })
  const navigate = useNavigate()

  // Prefill email từ cookie; dọn token cũ (nếu lỡ lưu bền vững)
  useEffect(() => {
    const savedEmail = getCookie("admin_remember_email")
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
    // Đảm bảo không auto-login từ localStorage/cookie cũ
    try { localStorage.removeItem("token") } catch {}
    // Nếu trước đây có set cookie token tuỳ biến thì xoá:
    // eraseCookie("admin_session_token")
  }, [])

  const validate = () => {
    const e = { email: "", password: "" }
    if (!email) e.email = "Email là bắt buộc"
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Email không hợp lệ"
    if (!password) e.password = "Mật khẩu là bắt buộc"
    else if (password.length < 6) e.password = "Mật khẩu phải có ít nhất 6 ký tự"
    setErrors(e)
    return !e.email && !e.password
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      const res = await AdminService.login({ email, password })

      // Lấy token theo 2 kiểu trả về phổ biến
      const token = res?.data?.data?.token || res?.data?.token
      if (token) {
        // 🔐 Lưu token CHỈ TRONG PHIÊN (đóng tab là mất, không auto-login lại)
        localStorage.setItem("token", token)
      }

      // Remember me = chỉ lưu EMAIL bằng cookie
      if (rememberMe) setCookie("admin_remember_email", email, 30)
      else eraseCookie("admin_remember_email")

      navigate("/admin/dashboard")
    } catch (err) {
      const msg = err?.error || err?.message || "Đăng nhập thất bại. Kiểm tra lại thông tin."
      setErrors((p) => ({ ...p, password: msg }))
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Đăng nhập Admin</h2>
        <p className="text-slate-600">Nhập thông tin đăng nhập để truy cập dashboard</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`h-12 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300 focus-visible:ring-blue-500"}`}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-slate-700">Mật khẩu</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`h-12 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : "border-slate-300 focus-visible:ring-blue-500"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        {/* Remember me */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
          />
          <label htmlFor="remember" className="text-sm font-medium text-slate-700 cursor-pointer">
            Ghi nhớ đăng nhập
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
          disabled={isLoading}
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>

      <div className="text-center text-sm text-slate-600">
        <p>Chỉ dành cho quản trị viên hệ thống</p>
      </div>
    </div>
  )
}
