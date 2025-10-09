import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  ArrowLeft,
  Save,
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
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "cancelled":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "pending":
      return <Clock className="w-4 h-4 text-blue-500" />;
    default:
      return <Clock className="w-4 h-4 text-blue-500" />;
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

export const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showApplicationsList, setShowApplicationsList] = useState(true);

  // Fetch applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await BookingService.getMentorApplications();
        setApplications(response.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Không thể tải danh sách đơn đăng ký. Vui lòng thử lại sau.");
        toast.error("Lỗi khi tải đơn đăng ký!");
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Fetch application details when selected
  const handleApplicationSelect = async (application) => {
    try {
      setLoading(true);
      const response = await BookingService.getApplicationDetails(application.id);
      setSelectedApplication(response.data);
      setShowApplicationsList(false);
    } catch (err) {
      console.error("Error fetching application details:", err);
      toast.error("Lỗi khi tải chi tiết đơn đăng ký!");
    } finally {
      setLoading(false);
    }
  };

  // Filter applications
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

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      let data = { status: newStatus.toUpperCase() };

      if (newStatus.toLowerCase() === "cancelled") {
        const cancelReason = prompt("Vui lòng nhập lý do từ chối:");
        if (!cancelReason) {
          toast.error("Vui lòng cung cấp lý do từ chối!");
          return;
        }
        data.cancel_reason = cancelReason;
      }

      await BookingService.updateApplicationStatus(applicationId, data);

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus.toUpperCase() } : app
        )
      );

      if (selectedApplication?.id === applicationId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus.toUpperCase() });
      }

      toast.success(`Đã cập nhật trạng thái thành ${getStatusLabel(newStatus)}`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Lỗi khi cập nhật trạng thái!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Đang tải đơn đăng ký...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
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
                <SelectItem value="confirmed">Đã chấp nhận</SelectItem>
                <SelectItem value="cancelled">Đã từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-y-auto">
          {filteredApplications.length === 0 ? (
            <p className="p-4 text-muted-foreground">Không có đơn đăng ký nào phù hợp.</p>
          ) : (
            filteredApplications.map((application) => (
              <div
                key={application.id}
                className={cn(
                  "p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors",
                  selectedApplication?.id === application.id && "bg-accent"
                )}
                onClick={() => handleApplicationSelect(application)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={application.mentee?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-card-foreground">{application.mentee?.fullName || "N/A"}</h3>
                        <p className="text-sm text-muted-foreground">{application.program}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(application.status)}
                      <Badge variant="outline" className={getStatusColor(application.status)}>
                        {getStatusLabel(application.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(application.submittedDate).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
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
                  <Button variant="ghost" size="sm" onClick={() => setShowApplicationsList(true)} className="lg:hidden">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedApplication.mentee?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-card-foreground">{selectedApplication.mentee?.fullName}</h2>
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
                        <div className="text-2xl font-bold">{selectedApplication.mentee?.gpa || "Chưa có"}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Trạng thái</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedApplication.status)}
                          <span>{getStatusLabel(selectedApplication.status)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Email</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{selectedApplication.mentee?.email}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Kinh nghiệm</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{selectedApplication.mentee?.experience || "Chưa có"}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Động lực</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{selectedApplication.mentee?.motivation || "Chưa có"}</p>
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
                            {new Date(selectedApplication.createdAt).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Chương trình</label>
                          <p className="text-muted-foreground">{selectedApplication.program || "Không có ghi chú"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Thời lượng mỗi buổi</label>
                          <p className="text-muted-foreground">{selectedApplication.duration || "N/A"} giờ</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Tổng số buổi</label>
                          <p className="text-muted-foreground">{selectedApplication.sessions || "1"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Giá</label>
                          <p className="text-muted-foreground">{formatCurrency(selectedApplication.price)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Trạng thái thanh toán</label>
                          <p className="text-muted-foreground">
                            {selectedApplication.paymentStatus === "PENDING"
                              ? "Đang chờ"
                              : selectedApplication.paymentStatus === "PAID"
                                ? "Đã thanh toán"
                                : "Thất bại"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Mentor</label>
                          <p className="text-muted-foreground">{selectedApplication.mentor?.fullName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Công ty</label>
                          <p className="text-muted-foreground">{selectedApplication.mentor?.company || "N/A"}</p>
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
                          onClick={() => handleStatusChange(selectedApplication.id, "CONFIRMED")}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={selectedApplication.status === "CONFIRMED"}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Chấp nhận
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleStatusChange(selectedApplication.id, "CANCELLED")}
                          disabled={selectedApplication.status === "CANCELLED"}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Từ chối
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
  );
};