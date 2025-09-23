import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Upload, User, FileText, Briefcase } from "lucide-react"

const steps = [
  { id: 1, name: "Thông tin cá nhân", icon: User },
  { id: 2, name: "Hồ sơ", icon: FileText },
  { id: 3, name: "Kinh nghiệm", icon: Briefcase },
]

export const MentorApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    // Thông tin cá nhân
    photo: null,
    fullName: "",
    email: "",
    password: "",
    jobTitle: "",
    company: "",
    location: "",
    // Hồ sơ
    category: "",
    skills: "",
    bio: "",
    linkedin: "",
    twitter: "",
    website: "",
    // Kinh nghiệm
    intro_video: "",
    featured_article: "",
    question: {
      whyMentor: "",
      greatestAchievement: ""
    },
    cv_img: null
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNestedChange = (parent, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [key]: value }
    }))
  }

  const handleFileChange = (field, event) => {
    const file = event.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const handleBackStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-12 bg-white">
      <div className="w-full max-w-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Đăng ký làm Mentor</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = step.id < currentStep

              return (
                <div key={step.id} className="flex flex-col items-center relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors
                    ${isCompleted ? "bg-[#2C3E50] text-white" : isActive ? "bg-[#F9C5D5] text-[#333] border-2 border-[#2C3E50]" : "bg-gray-200 text-gray-400"}
                  `}>
                    {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? "text-[#2C3E50]" : "text-gray-400"}`}>{step.name}</span>
                  {index < steps.length - 1 && (
                    <div className={`absolute w-16 h-0.5 mt-6 ml-20 ${isCompleted ? "bg-[#2C3E50]" : "bg-gray-300"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bước 1: Thông tin cá nhân */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Info Box */}
            <div className="bg-[#F9C5D5] border border-[#F5AFC4] rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-[#2C3E50] mt-2 flex-shrink-0" />
                <div className="text-sm text-[#333]">
                  <p className="font-medium mb-2">Rất vui được gặp bạn!</p>
                  <p className="mb-2">
                    Điền thông tin trong form chỉ mất vài phút. Chúng tôi muốn tìm hiểu về nền tảng của bạn
                    và lý do bạn muốn trở thành Mentor. Hãy viết thật cá nhân, trực tiếp tới chúng tôi và mentee.
                    Không cần dùng thuật ngữ chuyên môn hay thư xin việc dài dòng.
                  </p>
                  <p>
                    Bằng việc gửi form, bạn đồng ý với quy tắc ứng xử và thỏa thuận Mentor, hãy đọc kỹ trước khi gửi.
                  </p>
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="photo" className="text-sm font-medium text-[#333]">Ảnh đại diện</Label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  {formData.photo ? (
                    <img
                      src={URL.createObjectURL(formData.photo)}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={(e) => handleFileChange("photo", e)}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("photo")?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" /> Tải ảnh lên
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500">Ảnh sẽ giúp mentee dễ dàng nhận diện bạn hơn.</p>
            </div>

            {/* Tên */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-[#333]">Họ</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
                <p className="text-xs text-gray-500">Ví dụ: Nguyễn</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-[#333]">Tên</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
                <p className="text-xs text-gray-500">Ví dụ: Khôi</p>
              </div>
            </div>

            {/* Email và Password */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#333]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                <p className="text-xs text-gray-500">Chúng tôi sẽ không chia sẻ email của bạn.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-[#333]">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                />
                <p className="text-xs text-gray-500">Tối thiểu 8 ký tự, bao gồm chữ và số.</p>
              </div>
            </div>

            {/* Chức danh và Công ty */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-sm font-medium text-[#333]">Chức danh</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                />
                <p className="text-xs text-gray-500">Ví dụ: Senior Developer, Product Manager...</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium text-[#333]">
                  Công ty <span className="text-gray-400">(tùy chọn)</span>
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                />
                <p className="text-xs text-gray-500">Ví dụ: FPT Software, Google...</p>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-[#333]">Vị trí</Label>
              <Input
                id="location"
                placeholder="Nhập vị trí của bạn"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
              <p className="text-xs text-gray-500">Ví dụ: Hà Nội, Việt Nam</p>
            </div>
          </div>
        )}

        {/* Bước 2: Hồ sơ */}
        {currentStep === 2 && (
          <div className="space-y-6">

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-[#333]">Ngành</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngành" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Kỹ thuật & Dữ liệu</SelectItem>
                  <SelectItem value="ux">UX & Thiết kế</SelectItem>
                  <SelectItem value="business">Kinh doanh & Quản lý</SelectItem>
                  <SelectItem value="product">Sản phẩm & Tiếp thị</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-sm font-medium text-[#333]">Kỹ năng</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => handleInputChange("skills", e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Hãy mô tả chuyên môn của bạn để kết nối với những người được hướng dẫn có cùng sở thích.
                Danh sách các kỹ năng của bạn được phân cách bằng dấu phẩy (không quá 10).
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium text-[#333]">Giới thiệu bản thân</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Hãy cho chúng tôi và mentee biết về bạn. Viết ở ngôi thứ nhất, như đang trò chuyện trực tiếp.
              </p>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-2 gap-4">
              {/* LinkedIn */}
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-sm font-medium text-[#333]">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange("linkedin", e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Nhập URL LinkedIn, ví dụ: https://www.linkedin.com/in/username
                </p>
              </div>

              {/* Twitter */}
              <div className="space-y-2">
                <Label htmlFor="twitter" className="text-sm font-medium text-[#333]">Twitter <span className="text-gray-400">(tùy chọn)</span></Label>
                <Input
                  id="twitter"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange("twitter", e.target.value)}
                />
                <p className="text-xs text-gray-500">Bỏ "@", ví dụ: "dqmonn"</p>
              </div>

              {/* Website */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="website" className="text-sm font-medium text-[#333]">Website cá nhân <span className="text-gray-400">(tùy chọn)</span></Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
                <p className="text-xs text-gray-500">Thêm blog, GitHub hoặc trang cá nhân khác</p>
              </div>
            </div>
          </div>
        )}

        {/* Bước 3: Kinh nghiệm */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Info Box */}
            <div className="bg-[#F9C5D5] border border-[#F5AFC4] rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-[#2C3E50] mt-2 flex-shrink-0" />
                <div className="text-sm text-[#333]">
                  <p className="font-medium mb-2">Gần đến nơi rồi!</p>
                  <p className="mb-2">
                    Bạn chỉ còn một bước cuối cùng để trở thành người cố vấn và kết nối với các mentee trên toàn thế giới!
                  </p>
                  <p className="mb-2">
                    Trong bước này, hãy thể hiện những thành tựu của bạn và cách bạn có thể giúp đỡ người khác.
                    Nhiều lĩnh vực trong số này là tùy chọn, nhưng sẽ giúp chúng tôi có cái nhìn tốt hơn về công việc của bạn –
                    và do đó làm tăng cơ hội của bạn theo cấp số nhân.
                  </p>
                  <p>
                    Chúng cũng giúp bạn khởi đầu thuận lợi khi bạn trở thành một người cố vấn.
                  </p>
                </div>
              </div>
            </div>

            {/* Intro Video & Featured Article */}
            <div className="grid grid-cols-2 gap-4">
              {/* Intro Video */}
              <div className="space-y-2">
                <Label htmlFor="intro_video" className="text-sm font-medium text-gray-800">
                  Video giới thiệu <span className="text-gray-400">(tùy chọn)</span>
                </Label>
                <Input
                  id="intro_video"
                  value={formData.intro_video}
                  onChange={(e) => handleInputChange("intro_video", e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Thêm một video trên YouTube hoặc ghi âm một video cho những mentee tương lai của bạn
                </p>
              </div>

              {/* Featured Article */}
              <div className="space-y-2">
                <Label htmlFor="featured_article" className="text-sm font-medium text-gray-800">
                  Bài viết nổi bật <span className="text-gray-400">(tùy chọn)</span>
                </Label>
                <Input
                  id="featured_article"
                  value={formData.featured_article}
                  onChange={(e) => handleInputChange("featured_article", e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Liên kết một buổi phỏng vấn / podcast / tác phẩm viết mà bạn tự hào hoặc đã được giới thiệu.
                </p>
              </div>
            </div>


            {/* Questions */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800">Tại sao bạn muốn trở thành Mentor? (Không công khai)</Label>
              <Textarea
                value={formData.question.whyMentor}
                onChange={(e) => handleNestedChange("question", "whyMentor", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800">Thành tựu lớn nhất của bạn đến nay là gì? (Không công khai)</Label>
              <Textarea
                value={formData.question.greatestAchievement}
                onChange={(e) => handleNestedChange("question", "greatestAchievement", e.target.value)}
              />
            </div>

            {/* CV Upload */}
            <div className="space-y-2">
              <Label htmlFor="cv_img" className="text-sm font-medium text-gray-800">CV (tùy chọn)</Label>
              <input
                type="file"
                id="cv_img"
                accept="image/*"
                onChange={(e) => handleFileChange("cv_img", e)}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("cv_img")?.click()}
              >
                <Upload className="w-4 h-4 mr-2" /> Tải CV
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {/* Back */}
          {currentStep > 1 ? (
            <Button onClick={handleBackStep} variant="outline" className="px-6 py-2 border-gray-400 text-gray-700 hover:bg-gray-100">
              Quay lại
            </Button>
          ) : <div />} {/* khoảng trống bước 1 */}

          {/* Next / Submit */}
          <Button
            onClick={handleNextStep}
            className="px-6 py-2 text-white"
            style={{ backgroundColor: "#2C3E50" }}
            disabled={currentStep === 3}
          >
            {currentStep === 3 ? "Gửi" : "Bước tiếp theo"}
          </Button>
        </div>

      </div>
    </div>
  )
}