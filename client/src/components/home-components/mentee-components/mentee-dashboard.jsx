"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Home,
  MessageSquare,
  Search,
  Settings,
  Star,
  User,
  Users,
} from "lucide-react"

const applicationData = [
  {
    id: 1,
    mentor: "Nguyễn Văn An",
    avatar: "/professional-asian-man-suit.png",
    company: "Google",
    role: "Senior Software Engineer",
    status: "accepted",
    appliedDate: "2024-01-15",
    nextSession: "2024-01-20",
    progress: 75,
    totalSessions: 8,
    completedSessions: 6,
  },
  {
    id: 2,
    mentor: "Trần Thị Bình",
    avatar: "/professional-asian-woman-smiling.png",
    company: "Meta",
    role: "Product Manager",
    status: "in_progress",
    appliedDate: "2024-01-10",
    nextSession: "2024-01-18",
    progress: 45,
    totalSessions: 10,
    completedSessions: 4,
  },
  {
    id: 3,
    mentor: "Lê Minh Cường",
    avatar: "/professional-asian-designer.png",
    company: "Shopee",
    role: "UX Designer",
    status: "pending",
    appliedDate: "2024-01-12",
    nextSession: null,
    progress: 0,
    totalSessions: 0,
    completedSessions: 0,
  },
  {
    id: 4,
    mentor: "Phạm Thu Hà",
    avatar: "/professional-asian-data-scientist.jpg",
    company: "Grab",
    role: "Data Scientist",
    status: "completed",
    appliedDate: "2023-11-01",
    nextSession: null,
    progress: 100,
    totalSessions: 12,
    completedSessions: 12,
  },
]

const getStatusBadge = (status) => {
  switch (status) {
    case "accepted":
      return <Badge className="bg-green-200 text-green-700 border-green-300">Đã chấp nhận</Badge>
    case "in_progress":
      return <Badge className="bg-blue-200 text-blue-700 border-blue-300">Đang học</Badge>
    case "pending":
      return <Badge className="bg-yellow-200 text-yellow-700 border-yellow-300">Chờ duyệt</Badge>
    case "completed":
      return <Badge className="bg-purple-200 text-purple-700 border-purple-300">Hoàn thành</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export const MenteeDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const filteredApplications = applicationData.filter(
    (app) =>
      app.mentor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF", color: "#333333" }}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64" style={{ backgroundColor: "#2C3E50", color: "#FFFFFF" }}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#F9C5D5" }}>
                <GraduationCap className="w-5 h-5 text-[#2C3E50]" />
              </div>
              <span className="font-semibold">MenteeHub</span>
            </div>

            <nav className="space-y-2">
              {[
                { key: "overview", label: "Tổng quan", icon: <Home className="w-4 h-4" /> },
                { key: "applications", label: "Đơn ứng tuyển", icon: <Users className="w-4 h-4" /> },
                { key: "progress", label: "Tiến độ học tập", icon: <BookOpen className="w-4 h-4" /> },
                { key: "schedule", label: "Lịch học", icon: <Calendar className="w-4 h-4" /> },
                { key: "messages", label: "Tin nhắn", icon: <MessageSquare className="w-4 h-4" /> },
                { key: "profile", label: "Hồ sơ", icon: <User className="w-4 h-4" /> },
                { key: "settings", label: "Cài đặt", icon: <Settings className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === tab.key
                      ? "bg-[#F9C5D5] text-[#2C3E50]"
                      : "hover:bg-[#F9C5D5] hover:text-[#2C3E50]"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Tổng quan</h1>
                <p className="opacity-80">Theo dõi tiến độ học tập và các mentor của bạn</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card style={{ backgroundColor: "#F9C5D5", color: "#2C3E50" }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Mentor đã apply</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4</div>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: "#F9C5D5", color: "#2C3E50" }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Phiên đang diễn ra</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-3 h-3" /> Đang hoạt động
                    </div>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: "#F9C5D5", color: "#2C3E50" }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Phiên hoàn thành</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">22</div>
                    <div className="flex items-center gap-1 text-sm">
                      <BookOpen className="w-3 h-3" /> 88 giờ học
                    </div>
                  </CardContent>
                </Card>

                <Card style={{ backgroundColor: "#F9C5D5", color: "#2C3E50" }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Đánh giá trung bình</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.8</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3 h-3 fill-current" /> Từ 3 mentor
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Applications */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold mb-2">Đơn ứng tuyển</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm mentor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
              </div>

              <Card style={{ backgroundColor: "#FFFFFF", color: "#333333" }}>
                <CardContent className="p-0">
                  <table className="w-full">
                    <tbody>
                      {filteredApplications.map((app) => (
                        <tr key={app.id} className="border-b hover:bg-[#F9C5D5]/40">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={app.avatar || "/placeholder.svg"} alt={app.mentor} />
                                <AvatarFallback>
                                  {app.mentor.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{app.mentor}</div>
                                <div className="text-sm opacity-80">
                                  {app.role} tại {app.company}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">{getStatusBadge(app.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Progress / Schedule / Messages / Profile / Settings */}
          {(activeTab === "progress" ||
            activeTab === "schedule" ||
            activeTab === "messages" ||
            activeTab === "profile" ||
            activeTab === "settings") && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold mb-2">
                {activeTab === "progress" && "Tiến độ học tập"}
                {activeTab === "schedule" && "Lịch học"}
                {activeTab === "messages" && "Tin nhắn"}
                {activeTab === "profile" && "Hồ sơ"}
                {activeTab === "settings" && "Cài đặt"}
              </h1>
              <Card style={{ backgroundColor: "#F9C5D5", color: "#2C3E50" }}>
                <CardContent className="p-8 text-center">
                  <div>Tính năng này sẽ sớm được cập nhật</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
