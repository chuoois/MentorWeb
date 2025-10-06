import { useState } from "react"
import { Search, Check, X, Eye, Mail, Phone, Calendar, Award, Star } from "lucide-react"

export const MentorsManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const mentors = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "nguyenvanan@email.com",
      phone: "+84 912 345 678",
      expertise: "Full-stack Development",
      experience: "8 năm",
      company: "Google Vietnam",
      position: "Senior Software Engineer",
      rating: 4.9,
      totalSessions: 45,
      status: "approved",
      appliedDate: "2024-01-15",
      bio: "Chuyên gia phát triển phần mềm với 8 năm kinh nghiệm tại các công ty công nghệ hàng đầu.",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      education: "Đại học Bách Khoa Hà Nội",
      certifications: ["AWS Certified", "Google Cloud Professional"],
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "tranthibinh@email.com",
      phone: "+84 923 456 789",
      expertise: "UI/UX Design",
      experience: "6 năm",
      company: "Grab",
      position: "Lead Product Designer",
      rating: 4.8,
      totalSessions: 32,
      status: "approved",
      appliedDate: "2024-01-20",
      bio: "Nhà thiết kế sản phẩm với niềm đam mê tạo ra trải nghiệm người dùng tuyệt vời.",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
      education: "Đại học Kiến trúc Hà Nội",
      certifications: ["Google UX Design Certificate"],
    },
    {
      id: 3,
      name: "Lê Minh Cường",
      email: "leminhcuong@email.com",
      phone: "+84 934 567 890",
      expertise: "Data Science & AI",
      experience: "5 năm",
      company: "VinAI Research",
      position: "AI Research Engineer",
      rating: null,
      totalSessions: 0,
      status: "pending",
      appliedDate: "2024-03-10",
      bio: "Kỹ sư nghiên cứu AI với chuyên môn về Machine Learning và Deep Learning.",
      skills: ["Python", "TensorFlow", "PyTorch", "NLP"],
      education: "Đại học Công nghệ - ĐHQGHN",
      certifications: ["Deep Learning Specialization"],
    },
    {
      id: 4,
      name: "Phạm Thu Hà",
      email: "phamthuha@email.com",
      phone: "+84 945 678 901",
      expertise: "Product Management",
      experience: "7 năm",
      company: "Shopee Vietnam",
      position: "Senior Product Manager",
      rating: null,
      totalSessions: 0,
      status: "pending",
      appliedDate: "2024-03-12",
      bio: "Product Manager giàu kinh nghiệm trong việc xây dựng và phát triển sản phẩm công nghệ.",
      skills: ["Product Strategy", "Agile", "Data Analysis", "User Stories"],
      education: "Đại học Ngoại thương",
      certifications: ["Certified Scrum Product Owner"],
    },
    {
      id: 5,
      name: "Hoàng Văn Đức",
      email: "hoangvanduc@email.com",
      phone: "+84 956 789 012",
      expertise: "DevOps Engineering",
      experience: "4 năm",
      company: "FPT Software",
      position: "DevOps Engineer",
      rating: null,
      totalSessions: 0,
      status: "rejected",
      appliedDate: "2024-02-28",
      bio: "DevOps Engineer với kinh nghiệm triển khai và quản lý hạ tầng cloud.",
      skills: ["Docker", "Kubernetes", "CI/CD", "Terraform"],
      education: "Đại học Bách Khoa TP.HCM",
      certifications: ["AWS Solutions Architect"],
    },
  ]

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || mentor.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mentors.length,
    pending: mentors.filter((m) => m.status === "pending").length,
    approved: mentors.filter((m) => m.status === "approved").length,
    rejected: mentors.filter((m) => m.status === "rejected").length,
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-[#2C3E50]">Quản lý Mentor</h1>
          <p className="text-[#333333]/70">Xem và xác nhận đăng ký mentor, quản lý thông tin mentor</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-lg border border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6">
            <p className="mb-2 text-sm text-[#333333]/70">Tổng số Mentor</p>
            <p className="text-3xl font-bold text-[#2C3E50]">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-yellow-400/30 bg-yellow-100/50 p-6">
            <p className="mb-2 text-sm text-yellow-600">Chờ duyệt</p>
            <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
          </div>
          <div className="rounded-lg border border-green-400/30 bg-green-100/50 p-6">
            <p className="mb-2 text-sm text-green-600">Đã duyệt</p>
            <p className="text-3xl font-bold text-green-700">{stats.approved}</p>
          </div>
          <div className="rounded-lg border border-red-400/30 bg-red-100/50 p-6">
            <p className="mb-2 text-sm text-red-600">Từ chối</p>
            <p className="text-3xl font-bold text-red-700">{stats.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2C3E50]/70" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, chuyên môn, công ty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#F9C5D5]/40 bg-[#FFFFFF] py-2 pl-10 pr-4 text-sm text-[#333333] placeholder-[#333333]/40 focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5] focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-[#F9C5D5] text-[#2C3E50]"
                    : "border border-[#F9C5D5]/50 bg-[#FFFFFF] text-[#333333] hover:bg-[#F9C5D5]/20"
                }`}
              >
                {status === "all"
                  ? "Tất cả"
                  : status === "pending"
                  ? "Chờ duyệt"
                  : status === "approved"
                  ? "Đã duyệt"
                  : "Từ chối"}
              </button>
            ))}
          </div>
        </div>

        {/* Mentor Cards */}
        <div className="space-y-4">
          {filteredMentors.map((mentor) => (
            <div key={mentor.id} className="rounded-lg border border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6">
              <div className="flex flex-col gap-6 lg:flex-row">
                <div className="flex gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#F9C5D5] to-[#2C3E50] text-2xl font-bold text-white">
                    {mentor.name.charAt(0)}
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-[#2C3E50]">{mentor.name}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          mentor.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : mentor.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {mentor.status === "approved"
                          ? "Đã duyệt"
                          : mentor.status === "pending"
                          ? "Chờ duyệt"
                          : "Từ chối"}
                      </span>
                    </div>
                    <p className="text-sm text-[#333333]/70">{mentor.position} tại {mentor.company}</p>
                    <p className="text-sm text-[#333333]/60">{mentor.expertise}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-[#333333]/60 mt-2">
                      <div className="flex items-center gap-1"><Mail className="h-3 w-3" />{mentor.email}</div>
                      <div className="flex items-center gap-1"><Phone className="h-3 w-3" />{mentor.phone}</div>
                      <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />Đăng ký: {mentor.appliedDate}</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <p className="text-sm text-[#333333]/80">{mentor.bio}</p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-[#333333]/60">Kinh nghiệm</p>
                      <p className="font-medium text-[#2C3E50]">{mentor.experience}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#333333]/60">Học vấn</p>
                      <p className="font-medium text-[#2C3E50]">{mentor.education}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[#333333]/60 mb-2">Kỹ năng</p>
                    <div className="flex flex-wrap gap-2">
                      {mentor.skills.map((skill) => (
                        <span key={skill} className="rounded-full bg-[#F9C5D5]/40 px-3 py-1 text-xs font-medium text-[#2C3E50]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[#333333]/60 mb-2">Chứng chỉ</p>
                    <div className="flex flex-wrap gap-2">
                      {mentor.certifications.map((cert) => (
                        <span key={cert} className="flex items-center gap-1 rounded-full bg-[#2C3E50]/10 px-3 py-1 text-xs font-medium text-[#2C3E50]">
                          <Award className="h-3 w-3" /> {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {mentor.status === "pending" && (
                      <>
                        <button className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-200">
                          <Check className="h-4 w-4" /> Phê duyệt
                        </button>
                        <button className="flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200">
                          <X className="h-4 w-4" /> Từ chối
                        </button>
                      </>
                    )}
                    <button className="flex items-center gap-2 rounded-lg border border-[#F9C5D5]/40 bg-[#FFFFFF] px-4 py-2 text-sm font-medium text-[#2C3E50] hover:bg-[#F9C5D5]/30">
                      <Eye className="h-4 w-4" /> Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="rounded-lg border border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-12 text-center">
            <p className="text-[#333333]/70">Không tìm thấy mentor nào</p>
          </div>
        )}
      </div>
    </div>
  )
}
