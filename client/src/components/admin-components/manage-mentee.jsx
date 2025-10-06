import { useState } from "react"
import { Search, Eye, Mail, Phone, Calendar, BookOpen } from "lucide-react"

export const MenteesManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const mentees = [
    {
      id: 1,
      name: "Nguyễn Thị Mai",
      email: "nguyenthimai@email.com",
      phone: "+84 967 890 123",
      joinedDate: "2024-01-10",
      status: "active",
      totalSessions: 12,
      completedSessions: 10,
      activeMentors: 2,
      interests: ["Web Development", "UI/UX Design"],
      currentGoal: "Trở thành Full-stack Developer",
      progress: 75,
      lastActivity: "2024-03-15",
    },
    {
      id: 2,
      name: "Trần Văn Bình",
      email: "tranvanbinh@email.com",
      phone: "+84 978 901 234",
      joinedDate: "2024-02-05",
      status: "active",
      totalSessions: 8,
      completedSessions: 6,
      activeMentors: 1,
      interests: ["Data Science", "Machine Learning"],
      currentGoal: "Chuyển sang nghề Data Analyst",
      progress: 60,
      lastActivity: "2024-03-14",
    },
    {
      id: 3,
      name: "Lê Thị Cẩm",
      email: "lethicam@email.com",
      phone: "+84 989 012 345",
      joinedDate: "2023-11-20",
      status: "active",
      totalSessions: 25,
      completedSessions: 22,
      activeMentors: 3,
      interests: ["Product Management", "Business Strategy"],
      currentGoal: "Thăng tiến lên Senior Product Manager",
      progress: 85,
      lastActivity: "2024-03-16",
    },
    {
      id: 4,
      name: "Phạm Minh Đức",
      email: "phamminhduc@email.com",
      phone: "+84 990 123 456",
      joinedDate: "2024-02-28",
      status: "active",
      totalSessions: 5,
      completedSessions: 4,
      activeMentors: 1,
      interests: ["Mobile Development", "React Native"],
      currentGoal: "Xây dựng ứng dụng mobile đầu tiên",
      progress: 40,
      lastActivity: "2024-03-13",
    },
    {
      id: 5,
      name: "Hoàng Thị Hương",
      email: "hoangthihuong@email.com",
      phone: "+84 901 234 567",
      joinedDate: "2023-12-15",
      status: "inactive",
      totalSessions: 15,
      completedSessions: 12,
      activeMentors: 0,
      interests: ["DevOps", "Cloud Computing"],
      currentGoal: "Trở thành DevOps Engineer",
      progress: 55,
      lastActivity: "2024-02-20",
    },
    {
      id: 6,
      name: "Vũ Văn Kiên",
      email: "vuvankien@email.com",
      phone: "+84 912 345 678",
      joinedDate: "2024-01-25",
      status: "active",
      totalSessions: 10,
      completedSessions: 8,
      activeMentors: 2,
      interests: ["Backend Development", "System Design"],
      currentGoal: "Nâng cao kỹ năng thiết kế hệ thống",
      progress: 70,
      lastActivity: "2024-03-15",
    },
  ]

  const filteredMentees = mentees.filter((mentee) => {
    const matchesSearch =
      mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentee.interests.some((interest) =>
        interest.toLowerCase().includes(searchQuery.toLowerCase())
      )
    const matchesStatus = statusFilter === "all" || mentee.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mentees.length,
    active: mentees.filter((m) => m.status === "active").length,
    inactive: mentees.filter((m) => m.status === "inactive").length,
    totalSessions: mentees.reduce((sum, m) => sum + m.totalSessions, 0),
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-[#2C3E50]">Quản lý Mentee</h1>
          <p className="text-[#333333]/70">Theo dõi và quản lý thông tin học viên</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-lg border border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6">
            <div className="mb-2 text-sm text-[#333333]/70">Tổng số Mentee</div>
            <div className="text-3xl font-bold text-[#2C3E50]">{stats.total}</div>
          </div>
          <div className="rounded-lg border border-green-500/20 bg-green-100 p-6">
            <div className="mb-2 text-sm text-green-600">Đang hoạt động</div>
            <div className="text-3xl font-bold text-green-700">{stats.active}</div>
          </div>
          <div className="rounded-lg border border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6">
            <div className="mb-2 text-sm text-[#333333]/70">Không hoạt động</div>
            <div className="text-3xl font-bold text-[#2C3E50]">{stats.inactive}</div>
          </div>
          <div className="rounded-lg border border-[#2C3E50]/30 bg-[#2C3E50]/10 p-6">
            <div className="mb-2 text-sm text-[#2C3E50]">Tổng phiên học</div>
            <div className="text-3xl font-bold text-[#2C3E50]">{stats.totalSessions}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2C3E50]/70" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, sở thích..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#F9C5D5]/40 bg-[#FFFFFF] py-2 pl-10 pr-4 text-sm text-[#333333] placeholder-[#333333]/40 focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5] focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: "all", label: "Tất cả" },
              { key: "active", label: "Đang hoạt động" },
              { key: "inactive", label: "Không hoạt động" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setStatusFilter(item.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === item.key
                    ? "bg-[#F9C5D5] text-[#2C3E50]"
                    : "border border-[#F9C5D5]/50 bg-[#FFFFFF] text-[#333333] hover:bg-[#F9C5D5]/20"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mentees List */}
        <div className="space-y-4">
          {filteredMentees.map((mentee) => (
            <div
              key={mentee.id}
              className="rounded-lg border border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6"
            >
              <div className="flex flex-col gap-6 lg:flex-row">
                {/* Left */}
                <div className="flex gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#F9C5D5] to-[#2C3E50] text-2xl font-bold text-[#FFFFFF]">
                    {mentee.name.charAt(0)}
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-[#2C3E50]">{mentee.name}</h3>
                      {mentee.status === "active" && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          Đang hoạt động
                        </span>
                      )}
                      {mentee.status === "inactive" && (
                        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                          Không hoạt động
                        </span>
                      )}
                    </div>
                    <p className="mb-2 text-sm text-[#333333]/80">{mentee.currentGoal}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-[#333333]/60">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {mentee.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {mentee.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Tham gia: {mentee.joinedDate}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="mb-1 text-xs text-[#333333]/60">Mentor đang học</p>
                      <p className="text-lg font-semibold text-[#2C3E50]">
                        {mentee.activeMentors}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-[#333333]/60">Phiên đã hoàn thành</p>
                      <p className="text-lg font-semibold text-[#2C3E50]">
                        {mentee.completedSessions}/{mentee.totalSessions}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-[#333333]/60">Hoạt động gần nhất</p>
                      <p className="text-sm font-medium text-[#333333]">
                        {mentee.lastActivity}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs text-[#333333]/60">Tiến độ học tập</p>
                      <p className="text-sm font-medium text-[#2C3E50]">
                        {mentee.progress}%
                      </p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#FFFFFF]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#2C3E50] to-[#F9C5D5]"
                        style={{ width: `${mentee.progress}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs text-[#333333]/60">Sở thích</p>
                    <div className="flex flex-wrap gap-2">
                      {mentee.interests.map((interest) => (
                        <span
                          key={interest}
                          className="rounded-full bg-[#F9C5D5]/40 px-3 py-1 text-xs font-medium text-[#2C3E50]"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button className="flex items-center gap-2 rounded-lg border border-[#F9C5D5]/40 bg-[#FFFFFF] px-4 py-2 text-sm font-medium text-[#2C3E50] transition-colors hover:bg-[#F9C5D5]/30">
                      <Eye className="h-4 w-4" />
                      Xem chi tiết
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-[#F9C5D5]/40 bg-[#FFFFFF] px-4 py-2 text-sm font-medium text-[#2C3E50] transition-colors hover:bg-[#F9C5D5]/30">
                      <BookOpen className="h-4 w-4" />
                      Lịch sử học tập
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMentees.length === 0 && (
          <div className="rounded-lg border border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-12 text-center">
            <p className="text-[#333333]/70">Không tìm thấy mentee nào</p>
          </div>
        )}
      </div>
    </div>
  )
}
