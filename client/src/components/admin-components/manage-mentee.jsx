import { useEffect, useMemo, useState } from "react";
import { Search, Eye, Mail, Phone, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminService from "@/services/admin.service";

// debounce để giảm số lần gọi API khi gõ tìm kiếm
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// format ngày kiểu VN
const fmtVN = (d) => {
  try {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("vi-VN");
  } catch {
    return "—";
  }
};

// chuẩn hóa status
const normalizeStatus = (s) => (s ? String(s).toLowerCase() : "inactive");

// ánh xạ dữ liệu backend
const mapMentee = (m) => ({
  id: m._id,
  name: m.full_name || "Mentee",
  email: m.email || "—",
  phone: m.phone || "—",
  status: normalizeStatus(m.status),
  joinedDate: fmtVN(m.createdAt),
  lastActivity: fmtVN(m.updatedAt),
  avatar_url: m.avatar_url || "", // thêm avatar
});

export const MenteesManagementPage = () => {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  const navigate = useNavigate();

  const statusParam = useMemo(() => {
    if (!statusFilter || statusFilter === "all") return "";
    return statusFilter.toUpperCase();
  }, [statusFilter]);

  const fetchMentees = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {
        page,
        limit,
        search: debouncedSearch?.trim() || "",
        status: statusParam,
      };

      const res = await AdminService.getMentees(params);
      const data = res?.data || {};
      const raw = data.mentees ?? [];
      const total = data.total ?? raw.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));

      const items = raw.map(mapMentee);

      setStats({
        total,
        active: items.filter((x) => x.status === "active").length,
        inactive: items.filter((x) => x.status === "inactive").length,
      });

      setMentees(items);
      setTotalPages(totalPages);
    } catch (err) {
      console.error(err);
      setError("Không tải được danh sách mentee.");
      setMentees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchMentees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, statusFilter]);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-[#2C3E50]">Quản lý Mentee</h1>
          <p className="text-[#333333]/70">Theo dõi và quản lý danh sách học viên</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6">
            <p className="text-sm text-[#333333]/70">Tổng số Mentee</p>
            <p className="text-3xl font-bold text-[#2C3E50]">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-green-500/20 bg-green-100 p-6">
            <p className="text-sm text-green-600">Đang hoạt động</p>
            <p className="text-3xl font-bold text-green-700">{stats.active}</p>
          </div>
          <div className="rounded-lg border border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6">
            <p className="text-sm text-[#333333]/70">Không hoạt động</p>
            <p className="text-3xl font-bold text-[#2C3E50]">{stats.inactive}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2C3E50]/70" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#F9C5D5]/40 bg-white py-2 pl-10 pr-4 text-sm text-[#333333] placeholder-[#333333]/40 focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5] focus:outline-none"
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
                    : "border border-[#F9C5D5]/50 bg-white text-[#333333] hover:bg-[#F9C5D5]/20"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading / Error */}
        {error && <p className="mb-4 text-center text-red-600">{error}</p>}
        {loading && <p className="text-center text-[#333333]/70">Đang tải dữ liệu...</p>}

        {/* List mentees */}
        <div className="space-y-4">
          {!loading &&
            mentees.map((mentee) => (
              <div
                key={mentee.id}
                className="rounded-lg border border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  {mentee.avatar_url ? (
                    <img
                      src={mentee.avatar_url}
                      alt={mentee.name}
                      className="h-16 w-16 rounded-full object-cover border border-[#F9C5D5]/50"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#F9C5D5] to-[#2C3E50] text-lg font-bold text-white">
                      {mentee.name.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2C3E50]">
                      {mentee.name}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-[#333333]/70">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {mentee.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {mentee.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Tham gia: {mentee.joinedDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        mentee.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {mentee.status === "active"
                        ? "Đang hoạt động"
                        : "Không hoạt động"}
                    </span>
                    <button
                      onClick={() => navigate(`/admin/mentees/${mentee.id}`)}
                      className="flex items-center gap-2 rounded-lg border border-[#F9C5D5]/40 bg-white px-4 py-2 text-sm font-medium text-[#2C3E50] transition-colors hover:bg-[#F9C5D5]/30"
                    >
                      <Eye className="h-4 w-4" />
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination */}
        {!loading && mentees.length > 0 && (
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

        {!loading && mentees.length === 0 && (
          <div className="mt-6 rounded-lg border border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-12 text-center">
            <p className="text-[#333333]/70">Không tìm thấy mentee nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenteesManagementPage;
