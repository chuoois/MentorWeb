import { useState } from "react"
import {
  Search,
  Filter,
  MoreVertical,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const applications = [
  {
    id: "1",
    studentName: "Emily Zhang",
    program: "Phát triển Web Nâng cao",
    submittedDate: "2024-01-15",
    status: "pending",
    priority: "high",
    gpa: 3.8,
    experience: "2 năm phát triển frontend",
    motivation: "Đam mê tạo ra các ứng dụng web thân thiện và học các framework hiện đại.",
  },
  {
    id: "2",
    studentName: "Michael Brown",
    program: "Hướng dẫn Khoa học Dữ liệu",
    submittedDate: "2024-01-14",
    status: "under-review",
    priority: "medium",
    gpa: 3.6,
    experience: "1 năm phân tích dữ liệu",
    motivation: "Mong muốn chuyển sang lĩnh vực machine learning và phát triển AI.",
  },
  {
    id: "3",
    studentName: "Sarah Johnson",
    program: "Phát triển Ứng dụng Di động",
    submittedDate: "2024-01-13",
    status: "approved",
    priority: "high",
    gpa: 3.9,
    experience: "3 năm phát triển iOS",
    motivation: "Muốn mở rộng kỹ năng sang phát triển đa nền tảng.",
  },
  {
    id: "4",
    studentName: "David Lee",
    program: "Kỹ sư Backend",
    submittedDate: "2024-01-12",
    status: "rejected",
    priority: "low",
    gpa: 3.2,
    experience: "Mới tốt nghiệp",
    motivation: "Quan tâm đến kiến trúc hệ thống có khả năng mở rộng.",
  },
]

const getStatusIcon = (status) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="w-4 h-4 text-green-500" />
    case "rejected":
      return <XCircle className="w-4 h-4 text-red-500" />
    case "under-review":
      return <AlertCircle className="w-4 h-4 text-yellow-500" />
    default:
      return <Clock className="w-4 h-4 text-blue-500" />
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "rejected":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    case "under-review":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    default:
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    case "medium":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    default:
      return "bg-green-500/10 text-green-500 border-green-500/20"
  }
}

export const Applications = () => {
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showApplicationsList, setShowApplicationsList] = useState(true)

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.program.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleStatusChange = (applicationId, newStatus) => {
    console.log(`Đổi trạng thái đơn ${applicationId} thành ${newStatus}`)
  }

  const handleApplicationSelect = (application) => {
    setSelectedApplication(application)
    setShowApplicationsList(false)
  }

  return (
    <div className="flex h-full">
      {/* Danh sách Đơn đăng ký */}
      <div className={cn("w-full lg:w-96 border-r border-border bg-card", !showApplicationsList && "hidden lg:block")}>
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-card-foreground">Đơn đăng ký</h2>
            <Button variant="ghost" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm đơn đăng ký..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Đang chờ</SelectItem>
                <SelectItem value="under-review">Đang xét duyệt</SelectItem>
                <SelectItem value="approved">Đã chấp nhận</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-y-auto">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className={cn(
                "p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors",
                selectedApplication?.id === application.id && "bg-accent",
              )}
              onClick={() => handleApplicationSelect(application)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={application.studentAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-card-foreground">{application.studentName}</h3>
                      <p className="text-sm text-muted-foreground">{application.program}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getPriorityColor(application.priority)}>
                    {application.priority === "high"
                      ? "Cao"
                      : application.priority === "medium"
                      ? "Trung bình"
                      : "Thấp"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(application.status)}
                    <Badge variant="outline" className={getStatusColor(application.status)}>
                      {application.status === "pending"
                        ? "Đang chờ"
                        : application.status === "under-review"
                        ? "Đang xét duyệt"
                        : application.status === "approved"
                        ? "Đã chấp nhận"
                        : "Từ chối"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(application.submittedDate).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chi tiết đơn */}
      <div className={cn("flex-1 flex flex-col", showApplicationsList && "hidden lg:flex")}>
        {selectedApplication ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Nút quay lại cho mobile */}
                  <Button variant="ghost" size="sm" onClick={() => setShowApplicationsList(true)} className="lg:hidden">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>

                  <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedApplication.studentAvatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-card-foreground">{selectedApplication.studentName}</h2>
                    <p className="text-muted-foreground">{selectedApplication.program}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nội dung */}
            <div className="flex-1 overflow-y-auto p-6">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                  <TabsTrigger value="details">Chi tiết</TabsTrigger>
                  <TabsTrigger value="actions">Hành động</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">GPA</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedApplication.gpa}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Trạng thái</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedApplication.status)}
                          <span>
                            {selectedApplication.status === "pending"
                              ? "Đang chờ"
                              : selectedApplication.status === "under-review"
                              ? "Đang xét duyệt"
                              : selectedApplication.status === "approved"
                              ? "Đã chấp nhận"
                              : "Từ chối"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Độ ưu tiên</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="outline" className={getPriorityColor(selectedApplication.priority)}>
                          {selectedApplication.priority === "high"
                            ? "Cao"
                            : selectedApplication.priority === "medium"
                            ? "Trung bình"
                            : "Thấp"}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Kinh nghiệm</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{selectedApplication.experience}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Động lực</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{selectedApplication.motivation}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Chi tiết đơn</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Ngày nộp</label>
                          <p className="text-muted-foreground">
                            {new Date(selectedApplication.submittedDate).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Chương trình</label>
                          <p className="text-muted-foreground">{selectedApplication.program}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="actions" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hành động với đơn</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleStatusChange(selectedApplication.id, "approved")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Chấp nhận
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleStatusChange(selectedApplication.id, "rejected")}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Từ chối
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleStatusChange(selectedApplication.id, "under-review")}
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Đánh dấu xét duyệt
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">Chọn một đơn đăng ký</h3>
              <p className="text-muted-foreground">Hãy chọn một đơn từ danh sách để xem chi tiết</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
