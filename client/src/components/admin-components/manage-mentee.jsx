import { useEffect, useMemo, useState } from "react";
import { Search, Eye, Mail, Phone, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
  avatar_url: m.avatar_url || "",
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Quản lý Mentee
          </h1>
          <p className="mt-2 text-gray-600">Theo dõi và quản lý danh sách học viên</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="border-none bg-gradient-to-br from-blue-50 to-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <p className="text-sm text-gray-500">Tổng số Mentee</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="border-none bg-gradient-to-br from-green-50 to-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <p className="text-sm text-green-600">Đang hoạt động</p>
              <p className="text-3xl font-bold text-green-700">{stats.active}</p>
            </CardContent>
          </Card>
          <Card className="border-none bg-gradient-to-br from-red-50 to-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <p className="text-sm text-red-500">Không hoạt động</p>
              <p className="text-3xl font-bold text-red-600">{stats.inactive}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên, email, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="flex gap-2">
            {[
              { key: "all", label: "Tất cả" },
              { key: "active", label: "Đang hoạt động" },
              { key: "inactive", label: "Không hoạt động" },
            ].map((item) => (
              <Button
                key={item.key}
                onClick={() => setStatusFilter(item.key)}
                variant={statusFilter === item.key ? "default" : "outline"}
                className={cn(
                  "text-sm font-medium transition-all duration-200",
                  statusFilter === item.key
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                )}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading / Error */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4 text-center text-red-600">
              {error}
            </CardContent>
          </Card>
        )}
        {loading && (
          <Card className="mb-6 border-gray-200">
            <CardContent className="p-4 text-center text-gray-600">
              Đang tải dữ liệu...
            </CardContent>
          </Card>
        )}

        {/* List mentees */}
        <div className="space-y-4">
          {!loading &&
            mentees.map((mentee) => (
              <Card
                key={mentee.id}
                className="border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    {mentee.avatar_url ? (
                      <img
                        src={mentee.avatar_url}
                        alt={mentee.name}
                        className="h-12 w-12 rounded-full object-cover border border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white">
                        {mentee.name.charAt(0)}
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {mentee.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" /> {mentee.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" /> {mentee.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Tham gia: {mentee.joinedDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium",
                          mentee.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {mentee.status === "active"
                          ? "Đang hoạt động"
                          : "Không hoạt động"}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/admin/mentees/${mentee.id}`)}
                        className="flex items-center gap-2 text-sm font-medium border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Pagination */}
        {!loading && mentees.length > 0 && (
          <div className="mt-6 flex justify-center gap-4">
            <Button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              variant="outline"
              className="border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
            >
              ← Trước
            </Button>
            <span className="text-sm text-gray-600 flex items-center">
              Trang {page}/{totalPages}
            </span>
            <Button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              variant="outline"
              className="border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
            >
              Sau →
            </Button>
          </div>
        )}

        {!loading && mentees.length === 0 && (
          <Card className="mt-6 border-gray-100 bg-white shadow-sm">
            <CardContent className="p-12 text-center text-gray-600">
              Không tìm thấy mentee nào
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MenteesManagementPage;