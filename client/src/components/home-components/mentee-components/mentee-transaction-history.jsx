import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { 
  Filter, 
  Calendar, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Eye,
  DollarSign,
  TrendingUp,
  Users
} from "lucide-react";
import BookingService from "@/services/booking.service";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

export const MenteeTransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    paymentStatus: "all",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      // Convert "all" to empty string for API call
      const apiFilters = {
        ...filters,
        status: filters.status === "all" ? "" : filters.status,
        paymentStatus: filters.paymentStatus === "all" ? "" : filters.paymentStatus
      };
      
      console.log("Fetching transactions with filters:", apiFilters);
      console.log("API base URL:", import.meta.env.DEV ? "http://localhost:3000" : "https://mentor-web-back-end.vercel.app");
      console.log("Auth token:", localStorage.getItem("token"));
      
      const response = await BookingService.getTransactionHistory(apiFilters);
      
      if (response.success) {
        setTransactions(response.data.transactions);
        setSummary(response.data.summary);
        setPagination(response.pagination);
      } else {
        toast.error(response.message || "Không thể tải lịch sử giao dịch");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);
      toast.error("Lỗi khi tải lịch sử giao dịch");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset về trang đầu khi filter
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      CONFIRMED: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      COMPLETED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      CANCELLED: { color: "bg-red-100 text-red-800", icon: XCircle },
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const paymentConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      PAID: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      FAILED: { color: "bg-red-100 text-red-800", icon: XCircle },
      CANCELLED: { color: "bg-gray-100 text-gray-800", icon: AlertCircle },
    };
    
    const config = paymentConfig[paymentStatus] || paymentConfig.PENDING;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {paymentStatus}
      </Badge>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner className="w-8 h-8" style={{ color: "#F9C5D5" }} />
        <p className="mt-4 text-gray-500">Đang tải lịch sử giao dịch...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử giao dịch</h1>
        <p className="text-gray-600">Theo dõi tất cả các giao dịch và thanh toán của bạn</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Tổng đã thanh toán</p>
                <p className="text-2xl font-bold text-green-800">
                  {formatCurrency(summary.totalAmount || 0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Giao dịch thành công</p>
                <p className="text-2xl font-bold text-blue-800">
                  {summary.paidTransactions || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Đang chờ thanh toán</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {summary.pendingTransactions || 0}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Tổng giao dịch</p>
                <p className="text-2xl font-bold text-purple-800">
                  {summary.totalTransactions || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Trạng thái booking</label>
              <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange('status', value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
                  <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                  <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Trạng thái thanh toán</label>
              <Select value={filters.paymentStatus || "all"} onValueChange={(value) => handleFilterChange('paymentStatus', value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả thanh toán" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thanh toán</SelectItem>
                  <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                  <SelectItem value="PAID">Đã thanh toán</SelectItem>
                  <SelectItem value="FAILED">Thanh toán thất bại</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Từ ngày</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Đến ngày</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={() => setFilters({ status: "all", paymentStatus: "all", startDate: "", endDate: "", page: 1, limit: 10 })}
                variant="outline"
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có giao dịch nào</h3>
              <p className="text-gray-500">Bạn chưa có giao dịch nào phù hợp với bộ lọc hiện tại.</p>
            </CardContent>
          </Card>
        ) : (
          transactions.map((transaction) => (
            <Card key={transaction.transactionId} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Transaction Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={transaction.mentor.avatarUrl} />
                        <AvatarFallback className="bg-pink-100 text-pink-600">
                          {transaction.mentor.fullName?.charAt(0) || "M"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {transaction.mentor.fullName}
                          </h3>
                          {getStatusBadge(transaction.status)}
                          {getPaymentStatusBadge(transaction.paymentStatus)}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-1">
                          {transaction.mentor.jobTitle} tại {transaction.mentor.company}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(transaction.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {transaction.sessions} buổi học
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {transaction.duration}h
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amount and Actions */}
                  <div className="flex flex-col lg:items-end gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Mã đơn: {transaction.orderCode || "N/A"}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Chi tiết
                      </Button>
                      {transaction.paymentStatus === "PAID" && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Hóa đơn
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page === 1}
              onClick={() => handlePageChange(filters.page - 1)}
            >
              Trước
            </Button>
            
            <span className="px-4 py-2 text-sm text-gray-600">
              Trang {filters.page} / {pagination.totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page === pagination.totalPages}
              onClick={() => handlePageChange(filters.page + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
