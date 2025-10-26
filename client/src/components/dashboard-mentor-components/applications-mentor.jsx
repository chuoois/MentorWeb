import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import BookingService from "@/services/booking.service";
import { toast } from "react-hot-toast";

const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return <CheckCircle className="w-3 h-3 text-green-500" />;
    case "cancelled":
      return <XCircle className="w-3 h-3 text-red-500" />;
    case "pending":
      return <Clock className="w-3 h-3 text-blue-500" />;
    default:
      return <Clock className="w-3 h-3 text-blue-500" />;
  }
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "cancelled":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "pending":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    default:
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  }
};

const getStatusLabel = (status) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "Đã chấp nhận";
    case "cancelled":
      return "Đã từ chối";
    case "pending":
      return "Đang chờ";
    default:
      return "Đang chờ";
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

export const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showApplicationsList, setShowApplicationsList] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await BookingService.getMentorApplications();
        setApplications(response.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách đơn đăng ký:", err);
        setError("Không thể tải danh sách đơn đăng ký. Vui lòng thử lại sau.");
        toast.error("Lỗi khi tải đơn đăng ký!");
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleApplicationSelect = async (application) => {
    try {
      setLoading(true);
      const response = await BookingService.getApplicationDetails(application.id);
      setSelectedApplication(response.data);
      setShowApplicationsList(false);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết đơn đăng ký:", err);
      toast.error("Lỗi khi tải chi tiết đơn đăng ký!");
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = Array.isArray(applications)
    ? applications.filter((app) => {
        const matchesStatus =
          statusFilter === "all" || app.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesSearch =
          (app.mentee?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
          (app.program?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
        return matchesStatus && matchesSearch;
      })
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#2C3E50] text-sm">Đang tải đơn đăng ký...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className={cn("w-full lg:w-80 border-r border-[#F3F3F3] bg-white shadow-sm", !showApplicationsList && "hidden lg:block")}>
        <div className="p-4 border-b border-[#F3F3F3]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[#2C3E50]">Đơn đăng ký</h2>
            <Button variant="ghost" size="sm" className="hover:bg-[#A3BFFA]/30">
              <Filter className="w-4 h-4 text-[#2C3E50]" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm đơn đăng ký..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-[#F3F3F3] text-sm rounded-xl focus:ring-[#A3BFFA] focus:border-[#A3BFFA]"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white border-[#F3F3F3] text-sm rounded-xl">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-sm">Tất cả</SelectItem>
                <SelectItem value="pending" className="text-sm">Đang chờ</SelectItem>
                <SelectItem value="confirmed" className="text-sm">Đã chấp nhận</SelectItem>
                <SelectItem value="cancelled" className="text-sm">Đã từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-y-auto">
          {filteredApplications.length === 0 ? (
            <p className="p-4 text-gray-500 text-sm">Không có đơn đăng ký nào phù hợp.</p>
          ) : (
            filteredApplications.map((application) => (
              <div
                key={application.id}
                className={cn(
                  "p-4 border-b border-[#F3F3F3] cursor-pointer hover:bg-[#A3BFFA]/30 transition-all duration-200",
                  selectedApplication?.id === application.id && "bg-[#A3BFFA]/80 shadow-[0_0_10px_rgba(163,191,250,0.5)]"
                )}
                onClick={() => handleApplicationSelect(application)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 border">
                        <AvatarImage src={application.mentee?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-sm font-medium text-[#2C3E50]">{application.mentee?.fullName || "N/A"}</h3>
                        <p className="text-xs text-gray-500">{application.program}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(application.status)}
                      <Badge variant="outline" className={cn(getStatusColor(application.status), "text-xs")}>
                        {getStatusLabel(application.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(application.submittedDate).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={cn("flex-1 flex flex-col", showApplicationsList && "hidden lg:flex")}>
        {selectedApplication ? (
          <>
            <div className="p-4 border-b border-[#F3F3F3] bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowApplicationsList(true)}
                    className="lg:hidden hover:bg-[#A3BFFA]/30"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#2C3E50]" />
                  </Button>
                  <Avatar className="w-10 h-10 border">
                    <AvatarImage src={selectedApplication.mentee?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold text-[#2C3E50]">{selectedApplication.mentee?.fullName}</h2>
                    <p className="text-sm text-gray-500">{selectedApplication.program}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 bg-white border-[#F3F3F3] rounded-xl">
                  <TabsTrigger value="overview" className="text-sm text-[#2C3E50] data-[state=active]:bg-[#A3BFFA]/80">Tổng quan</TabsTrigger>
                  <TabsTrigger value="details" className="text-sm text-[#2C3E50] data-[state=active]:bg-[#A3BFFA]/80">Chi tiết</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-white border-[#F3F3F3] shadow-[0_0_10px_rgba(163,191,250,0.2)]">
                      <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-medium text-[#2C3E50]">GPA</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-lg font-bold text-[#2C3E50]">{selectedApplication.mentee?.gpa || "Chưa có"}</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-[#F3F3F3] shadow-[0_0_10px_rgba(163,191,250,0.2)]">
                      <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-medium text-[#2C3E50]">Trạng thái</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedApplication.status)}
                          <span className="text-sm text-[#2C3E50]">{getStatusLabel(selectedApplication.status)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-[#F3F3F3] shadow-[0_0_10px_rgba(163,191,250,0.2)]">
                      <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-medium text-[#2C3E50]">Email</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">{selectedApplication.mentee?.email}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-white border-[#F3F3F3] shadow-[0_0_10px_rgba(163,191,250,0.2)]">
                    <CardHeader>
                      <CardTitle className="text-sm text-[#2C3E50]">Công việc hiện tại</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">{selectedApplication.mentee.job_title || "Chưa có"}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-[#F3F3F3] shadow-[0_0_10px_rgba(163,191,250,0.2)]">
                    <CardHeader>
                      <CardTitle className="text-sm text-[#2C3E50]">Kinh nghiệm</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">{selectedApplication.mentee?.experience || "Chưa có"}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-[#F3F3F3] shadow-[0_0_10px_rgba(163,191,250,0.2)]">
                    <CardHeader>
                      <CardTitle className="text-sm text-[#2C3E50]">Động lực</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">{selectedApplication.mentee?.motivation || "Chưa có"}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <Card className="bg-white border-[#F3F3F3] shadow-[0_0_10px_rgba(163,191,250,0.2)]">
                    <CardHeader>
                      <CardTitle className="text-sm text-[#2C3E50]">Chi tiết đơn</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-[#2C3E50]">Ngày nộp</label>
                          <p className="text-sm text-gray-500">{new Date(selectedApplication.createdAt).toLocaleDateString("vi-VN")}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#2C3E50]">Thời lượng mỗi buổi</label>
                          <p className="text-sm text-gray-500">{selectedApplication.duration || "N/A"} giờ</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#2C3E50]">Tổng số buổi</label>
                          <p className="text-sm text-gray-500">{selectedApplication.sessions || "1"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#2C3E50]">Giá</label>
                          <p className="text-sm text-gray-500">{formatCurrency(selectedApplication.price)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-[#F3F3F3] shadow-[0_0_10px_rgba(163,191,250,0.2)]">
                    <CardHeader>
                      <CardTitle className="text-sm text-[#2C3E50]">Thời gian buổi học</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedApplication.sessionTimes && selectedApplication.sessionTimes.length > 0 ? (
                        selectedApplication.sessionTimes.map((session, index) => (
                          <div key={index} className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-[#2C3E50]">Thời gian bắt đầu</label>
                              <p className="text-sm text-gray-500">{formatDateTime(session.startTime)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-[#2C3E50]">Thời gian kết thúc</label>
                              <p className="text-sm text-gray-500">{formatDateTime(session.endTime)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-[#2C3E50]">Trạng thái</label>
                              <p className="text-sm text-gray-500">
                                {session.status === "UPCOMING" ? "Sắp diễn ra" : session.status}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-[#2C3E50]">Ghi chú</label>
                              <p className="text-sm text-gray-500">{session.note || "Không có"}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">Không có thông tin thời gian buổi học.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-[#2C3E50] mb-2">Chọn một đơn đăng ký</h3>
              <p className="text-sm text-gray-500">Hãy chọn một đơn từ danh sách để xem chi tiết</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};