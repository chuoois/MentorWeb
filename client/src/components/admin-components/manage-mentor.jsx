import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { User, Search, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminService from "@/services/admin.service";
import toast from "react-hot-toast";

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

// Component: Form cập nhật trạng thái riêng cho từng mentor
const MentorStatusForm = ({ mentorId, currentStatus, onStatusChanged }) => {
  const [status, setStatus] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!status) return;

    setLoading(true);
    try {
      await AdminService.changeMentorStatus(mentorId, {
        status,
        review_note: reviewNote,
      });
      toast.success("Cập nhật trạng thái thành công!");
      setStatus("");
      setReviewNote("");
      onStatusChanged();
    } catch (error) {
      console.error("Error changing mentor status:", error);
      toast.error("Cập nhật trạng thái thất bại.");
    } finally {
      setLoading(false);
    }
  };

  // Tự động chọn trạng thái hiện tại (tùy chọn)
  useEffect(() => {
    if (currentStatus) {
      setStatus(currentStatus);
    }
  }, [currentStatus]);

  return (
    <div className="flex flex-col gap-2">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="h-9 text-xs">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PENDING">Chờ duyệt</SelectItem>
          <SelectItem value="ACTIVE">Hoạt động</SelectItem>
          <SelectItem value="REJECTED">Bị từ chối</SelectItem>
          <SelectItem value="BANNED">Bị cấm</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Ghi chú (tùy chọn)"
        value={reviewNote}
        onChange={(e) => setReviewNote(e.target.value)}
        className="h-9 text-xs"
      />

      <Button
        size="sm"
        className="h-8"
        style={{ backgroundColor: "#F9C5D5", color: "#2C3E50" }}
        onClick={handleSubmit}
        disabled={!status || loading}
      >
        {loading ? "Đang lưu..." : "Cập nhật"}
      </Button>
    </div>
  );
};

export const MentorsManagementPage = () => {
  const navigate = useNavigate();

  const [mentors, setMentors] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // Debounce search
  const debouncedSearch = useDebounce(search, 500);

  // Fetch mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const queryParams = { page, limit, search: debouncedSearch };
        if (status !== "ALL") {
          queryParams.status = status;
        }
        const response = await AdminService.getMentors(queryParams);
        setMentors(response.data.mentors);
        setTotal(response.data.total);
      } catch (error) {
        console.error("Error fetching mentors:", error);
        toast.error("Không thể tải danh sách mentor.");
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, [page, limit, debouncedSearch, status]);

  // Hàm refresh danh sách (dùng chung cho MentorStatusForm)
  const refreshMentors = async () => {
    const queryParams = { page, limit, search: debouncedSearch };
    if (status !== "ALL") queryParams.status = status;
    const response = await AdminService.getMentors(queryParams);
    setMentors(response.data.mentors);
    setTotal(response.data.total);
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

                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* Status Badge */}
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium self-start sm:self-center ${
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

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {/* Thanh toán tuần */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() =>
                          navigate(`/admin/mentors/${mentor._id}/payment`)
                        }
                      >
                        <DollarSign className="w-4 h-4" />
                        Thanh toán
                      </Button>

                      {/* Form cập nhật trạng thái riêng */}
                      <MentorStatusForm
                        mentorId={mentor._id}
                        currentStatus={mentor.status}
                        onStatusChanged={refreshMentors}
                      />
                    </div>
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
    </div>
  );
};

export default MentorsManagementPage;