import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { User, Search, XCircle } from "lucide-react";
import AdminService from "@/services/admin.service";

// Custom useDebounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const MentorsManagementPage = () => {
  const [mentors, setMentors] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL"); // Default to "ALL" to show all mentors initially
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: "", review_note: "" });

  // Debounce search input
  const debouncedSearch = useDebounce(search, 500);

  // Fetch mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        // Prepare query parameters, exclude status if "ALL" is selected
        const queryParams = { page, limit, search: debouncedSearch };
        if (status !== "ALL") {
          queryParams.status = status;
        }
        const response = await AdminService.getMentors(queryParams);
        setMentors(response.data.mentors);
        setTotal(response.data.total);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, [page, limit, debouncedSearch, status]);

  // Handle status change
  const handleStatusChange = async (id) => {
    try {
      await AdminService.changeMentorStatus(id, statusForm);
      setSelectedMentor(null);
      setStatusForm({ status: "", review_note: "" });
      // Refresh mentor list
      const queryParams = { page, limit, search: debouncedSearch };
      if (status !== "ALL") {
        queryParams.status = status;
      }
      const response = await AdminService.getMentors(queryParams);
      setMentors(response.data.mentors);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error changing mentor status:", error);
    }
  };

  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Loading UI
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Spinner className="w-12 h-12" style={{ color: "#F9C5D5" }} />
        <p className="text-gray-500">Đang tải danh sách mentor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: "#F9C5D5" }}>
              <User className="w-6 h-6" style={{ color: "#2C3E50" }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#333333" }}>
                Quản lý Mentor
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Xem và quản lý thông tin mentor
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Tìm kiếm mentor (tên, email, công ty, chức vụ)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="PENDING">Chờ duyệt</SelectItem>
              <SelectItem value="ACTIVE">Hoạt động</SelectItem>
              <SelectItem value="REJECTED">Bị từ chối</SelectItem>
              <SelectItem value="BANNED">Bị cấm</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mentor List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: "#333333" }}>
          Danh sách Mentor
        </h3>
        {mentors.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium" style={{ color: "#333333" }}>
              Không tìm thấy mentor
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Vui lòng thay đổi bộ lọc hoặc tìm kiếm
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mentors.map((mentor) => (
              <div
                key={mentor._id}
                className="border-b border-gray-200 py-4 last:border-b-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={mentor.avatar_url || "https://via.placeholder.com/40"}
                      alt={mentor.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium" style={{ color: "#333333" }}>
                        {mentor.full_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {mentor.job_title} tại {mentor.company}
                      </p>
                      <p className="text-sm text-gray-500">{mentor.email}</p>
                      <p className="text-sm text-gray-500">
                        Danh mục: {mentor.category} | Kỹ năng: {mentor.skill}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        mentor.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : mentor.status === "PENDING"
                          ? "bg-blue-100 text-blue-700"
                          : mentor.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {mentor.status === "ACTIVE"
                        ? "Hoạt động"
                        : mentor.status === "PENDING"
                        ? "Chờ duyệt"
                        : mentor.status === "REJECTED"
                        ? "Bị từ chối"
                        : "Bị cấm"}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedMentor(mentor)} // Use mentor directly
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Hiển thị {mentors.length} / {total} mentor
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              disabled={page * limit >= total}
              onClick={() => setPage(page + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      </div>

      {/* Mentor Detail Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold" style={{ color: "#333333" }}>
                Chi tiết Mentor
              </h3>
              <Button variant="ghost" onClick={() => setSelectedMentor(null)}>
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMentor.avatar_url || "https://via.placeholder.com/40"}
                  alt={selectedMentor.full_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium" style={{ color: "#2C3E50" }}>
                    {selectedMentor.full_name}
                  </p>
                  <p className="text-sm text-gray-500">{selectedMentor.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Chức vụ</p>
                <p className="font-medium" style={{ color: "#2C3E50" }}>
                  {selectedMentor.job_title} tại {selectedMentor.company}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Danh mục</p>
                <p className="font-medium" style={{ color: "#2C3E50" }}>
                  {selectedMentor.category}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kỹ năng</p>
                <p className="font-medium" style={{ color: "#2C3E50" }}>
                  {selectedMentor.skill}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vị trí</p>
                <p className="font-medium" style={{ color: "#2C3E50" }}>
                  {selectedMentor.location || "Không có thông tin"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Giá mỗi buổi</p>
                <p className="font-medium" style={{ color: "#2C3E50" }}>
                  {formatPrice(selectedMentor.price || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Giới thiệu</p>
                <p className="font-medium" style={{ color: "#2C3E50" }}>
                  {selectedMentor.bio || "Không có thông tin"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <p className="font-medium" style={{ color: "#2C3E50" }}>
                  {selectedMentor.status === "ACTIVE"
                    ? "Hoạt động"
                    : selectedMentor.status === "PENDING"
                    ? "Chờ duyệt"
                    : selectedMentor.status === "REJECTED"
                    ? "Bị từ chối"
                    : "Bị cấm"}
                </p>
              </div>
              {selectedMentor.review_note && (
                <div>
                  <p className="text-sm text-gray-500">Ghi chú duyệt</p>
                  <p className="font-medium" style={{ color: "#2C3E50" }}>
                    {selectedMentor.review_note}
                  </p>
                </div>
              )}
              {selectedMentor.reviewed_by && (
                <div>
                  <p className="text-sm text-gray-500">Duyệt bởi</p>
                  <p className="font-medium" style={{ color: "#2C3E50" }}>
                    {selectedMentor.reviewed_by.full_name} ({selectedMentor.reviewed_by.email})
                  </p>
                </div>
              )}
            </div>

            {/* Change Status Form */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-500">Thay đổi trạng thái</h4>
              <Select
                value={statusForm.status}
                onValueChange={(value) => setStatusForm({ ...statusForm, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                  <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                  <SelectItem value="REJECTED">Bị từ chối</SelectItem>
                  <SelectItem value="BANNED">Bị cấm</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Ghi chú duyệt (tùy chọn)"
                value={statusForm.review_note}
                onChange={(e) => setStatusForm({ ...statusForm, review_note: e.target.value })}
                className="mt-2"
              />
              <Button
                className="mt-4 w-full"
                style={{ backgroundColor: "#F9C5D5", color: "#2C3E50" }}
                onClick={() => handleStatusChange(selectedMentor._id)}
                disabled={!statusForm.status}
              >
                Cập nhật trạng thái
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};