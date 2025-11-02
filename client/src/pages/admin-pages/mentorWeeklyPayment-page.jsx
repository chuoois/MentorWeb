import { useEffect, useState } from "react";
import { Calendar, DollarSign, CheckCircle, User, AlertCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import AdminService from "@/services/admin.service";
import toast from "react-hot-toast";

// Format tiền VND
const fmtVND = (amount) => {
  if (amount == null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Format ngày VN
const fmtVN = (d) => {
  try {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

export const MentorWeeklyPaymentPage = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const res = await AdminService.getMentorWeeklyRevenue(mentorId);
      setData(res);
    } catch (err) {
      toast.error(err?.message || "Không thể tải dữ liệu doanh thu.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async () => {
    if (paying || !data?.bookings?.length) return;

    const loadingToast = toast.loading("Đang xử lý thanh toán...");

    try {
      setPaying(true);
      const res = await AdminService.markMentorWeeklyPaid(mentorId);

      toast.dismiss(loadingToast);
      toast.success(
        `Thành công! Đã thanh toán ${fmtVND(res.totalAmountPaid)} cho ${res.totalBookingsPaid} booking.`,
        { duration: 5000 }
      );

      // Cập nhật lại dữ liệu
      await fetchRevenue();
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err?.message || "Không thể đánh dấu đã thanh toán.");
    } finally {
      setPaying(false);
    }
  };

  useEffect(() => {
    if (mentorId) fetchRevenue();
  }, [mentorId]);

  const hasPendingBookings = data?.bookings && data.bookings.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Thanh toán tuần cho Mentor
            </h1>
            <p className="mt-1 text-gray-600">Doanh thu 7 ngày gần nhất</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Quay lại
          </Button>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Data */}
        {!loading && data && (
          <>
            {/* Mentor Info & Summary */}
            <Card className="mb-6 border-none bg-gradient-to-br from-indigo-50 to-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {data.mentorName || "Mentor"}
                    </h2>
                    <p className="text-sm text-gray-500">ID: {mentorId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Tổng doanh thu 7 ngày</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {fmtVND(data.totalRevenue7Days)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <Card className="bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Số booking</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {data.totalBookings || 0}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-white">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Đủ điều kiện</p>
                      <p className="text-2xl font-bold text-green-700">
                        {data.bookings?.length || 0}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Trạng thái</p>
                      <Badge
                        variant={hasPendingBookings ? "default" : "secondary"}
                        className={cn(
                          hasPendingBookings
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {hasPendingBookings ? "Chờ thanh toán" : "Đã thanh toán"}
                      </Badge>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Button */}
            {hasPendingBookings && (
              <div className="mb-6 flex justify-end">
                <Button
                  onClick={handleMarkPaid}
                  disabled={paying}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  {paying ? (
                    <>Đang xử lý...</>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Đánh dấu đã thanh toán
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Bookings List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Danh sách booking đủ điều kiện (7 ngày)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasPendingBookings ? (
                  <div className="space-y-4">
                    {data.bookings.map((booking) => (
                      <div
                        key={booking.booking_id}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {booking.mentee_name || "Mentee"}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {fmtVN(booking.payment_at)}
                            </span>
                            <span>#{booking.booking_id.slice(-6)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-indigo-600">
                            {fmtVND(booking.price)}
                          </p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-3">Không có booking nào cần thanh toán trong tuần này.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default MentorWeeklyPaymentPage;