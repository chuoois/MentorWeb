import { useEffect, useMemo, useState } from "react";
import { Search, Check, X, Eye, Mail, Phone, Calendar } from "lucide-react";
import AdminService from "@/services/admin.service"; // chỉnh path nếu khác

// debounce để giảm số lần gọi API khi gõ search
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// chuẩn hoá status hiển thị (BACKEND -> FRONTEND)
const normalizeStatus = (s) => {
  const up = (s || "").toUpperCase();
  if (up === "ACTIVE") return "approved";
  if (up === "PENDING") return "pending";
  if (up === "REJECTED" || up === "BANNED") return "rejected";
  return "pending";
};

// map dữ liệu từ backend sang format FE dùng
const mapMentor = (m) => ({
  id: m._id,
  name: m.full_name || "Mentor",
  email: m.email || "—",
  phone: m.phone || "—",
  company: m.company || "—",
  position: m.job_title || "—",
  status: normalizeStatus(m.status), // approved | pending | rejected
  appliedDate: m.createdAt ? new Date(m.createdAt).toLocaleDateString("vi-VN") : "—",
  avatar_url: m.avatar_url || "",
  // các field không có từ controller sẽ để trống/gọn
  expertise: m.expertise || "",
  bio: m.bio || "",
  experience: m.experience || "",
  education: m.education || "",
  skills: Array.isArray(m.skills) ? m.skills : [],
  certifications: Array.isArray(m.certifications) ? m.certifications : [],
});

export const MentorsManagementPage = () => {
  // dữ liệu hiển thị
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // filter & search & paging
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // thống kê thẻ trên cùng
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // FE -> tham số status cho BE
  const statusParam = useMemo(() => {
    if (statusFilter === "all") return "";
    if (statusFilter === "approved") return "ACTIVE";
    if (statusFilter === "pending") return "PENDING";
    if (statusFilter === "rejected") return "REJECTED";
    return "";
  }, [statusFilter]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {
        page,
        limit,
        search: debouncedSearch?.trim() || "",
        status: statusParam,
      };

      // BE: { success, data: { total, page, limit, mentors } }
      const res = await AdminService.getMentors(params);
      const data = res?.data || {};
      const raw = data.mentors ?? []; // <— quan trọng
      const total = data.total ?? raw.length;
      const tp = Math.max(1, Math.ceil(total / limit));

      const items = raw.map(mapMentor);

      setCounts({
        total,
        pending: items.filter((m) => m.status === "pending").length,
        approved: items.filter((m) => m.status === "approved").length,
        rejected: items.filter((m) => m.status === "rejected").length,
      });

      setMentors(items);
      setTotalPages(tp);
    } catch (e) {
      console.error(e);
      setError("Không tải được danh sách mentor.");
      setMentors([]);
      setCounts({ total: 0, pending: 0, approved: 0, rejected: 0 });
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // đổi filter/search thì về trang 1
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchMentors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, statusFilter]);

  const statusChip = (status) =>
    status === "approved"
      ? "bg-green-100 text-green-700"
      : status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  // hành động trạng thái (map sang BE)
  const onApprove = async (id) => {
    try {
      await AdminService.changeMentorStatus(id, { status: "ACTIVE" });
      fetchMentors();
    } catch (e) {
      console.error(e);
    }
  };
  const onReject = async (id) => {
    try {
      await AdminService.changeMentorStatus(id, { status: "REJECTED" });
      fetchMentors();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-[#2C3E50]">Quản lý Mentor</h1>
          <p className="text-[#333333]/70">
            Xem và xác nhận đăng ký mentor, quản lý thông tin mentor
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-lg border border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6">
            <p className="mb-2 text-sm text-[#333333]/70">Tổng số Mentor</p>
            <p className="text-3xl font-bold text-[#2C3E50]">{counts.total}</p>
          </div>
          <div className="rounded-lg border border-yellow-400/30 bg-yellow-100/50 p-6">
            <p className="mb-2 text-sm text-yellow-600">Chờ duyệt</p>
            <p className="text-3xl font-bold text-yellow-700">{counts.pending}</p>
          </div>
          <div className="rounded-lg border border-green-400/30 bg-green-100/50 p-6">
            <p className="mb-2 text-sm text-green-600">Đã duyệt</p>
            <p className="text-3xl font-bold text-green-700">{counts.approved}</p>
          </div>
          <div className="rounded-lg border border-red-400/30 bg-red-100/50 p-6">
            <p className="mb-2 text-sm text-red-600">Từ chối</p>
            <p className="text-3xl font-bold text-red-700">{counts.rejected}</p>
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
              className="w-full rounded-lg border border-[#F9C5D5]/40 bg-[#FFFFFF] py-2 pl-10 pr-4 text-sm text-[#333333] placeholder-[#333333]/40 focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5]"
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

        {/* Error/Loading */}
        {error && <p className="mb-4 text-center text-red-600">{error}</p>}
        {loading && <p className="text-center text-[#333333]/70">Đang tải dữ liệu...</p>}

        {/* Mentor Cards */}
        <div className="space-y-4">
          {!loading &&
            mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="rounded-lg border border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6"
              >
                <div className="flex flex-col gap-6 lg:flex-row">
                  <div className="flex gap-4">
                    {mentor.avatar_url ? (
                      <img
                        src={mentor.avatar_url}
                        alt={mentor.name}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#F9C5D5] to-[#2C3E50] text-2xl font-bold text-white">
                        {mentor.name?.charAt(0) ?? "M"}
                      </div>
                    )}

                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-[#2C3E50]">
                          {mentor.name}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusChip(
                            mentor.status
                          )}`}
                        >
                          {mentor.status === "approved"
                            ? "Đã duyệt"
                            : mentor.status === "pending"
                            ? "Chờ duyệt"
                            : "Từ chối"}
                        </span>
                      </div>

                      <p className="text-sm text-[#333333]/70">
                        {mentor.position}
                        {mentor.company && ` tại ${mentor.company}`}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-[#333333]/60">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {mentor.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {mentor.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Đăng ký: {mentor.appliedDate}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    {mentor.bio && (
                      <p className="text-sm text-[#333333]/80]">{mentor.bio}</p>
                    )}

                    {/* Hành động */}
                    <div className="flex gap-2 pt-2">
                      {mentor.status === "pending" && (
                        <>
                          <button
                            onClick={() => onApprove(mentor.id)}
                            className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-200"
                          >
                            <Check className="h-4 w-4" /> Phê duyệt
                          </button>
                          <button
                            onClick={() => onReject(mentor.id)}
                            className="flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                          >
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

        {/* Pagination */}
        {!loading && mentors.length > 0 && (
          <div className="mt-6 flex justify-center gap-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-[#F9C5D5]/40 px-4 py-2 text-sm text-[#2C3E50] disabled:opacity-50"
            >
              ← Trước
            </button>
            <span className="text-sm text-[#333333]/70">
              Trang {page}/{totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-[#F9C5D5]/40 px-4 py-2 text-sm text-[#2C3E50] disabled:opacity-50"
            >
              Sau →
            </button>
          </div>
        )}

        {!loading && mentors.length === 0 && (
          <div className="mt-6 rounded-lg border border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-12 text-center">
            <p className="text-[#333333]/70">Không tìm thấy mentor nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorsManagementPage;
