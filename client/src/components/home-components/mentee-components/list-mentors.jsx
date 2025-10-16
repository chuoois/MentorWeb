import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, DollarSign, ChevronDown, Filter, X, MapPin, Briefcase, Star, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import MentorService from "@/services/mentor.service";
import { toast } from "react-hot-toast";
import { useDebounce } from "@/hooks/useDebounce";

const categories = [
  "Kỹ thuật & Dữ liệu",
  "UX & Thiết kế",
  "Kinh doanh & Quản lý",
  "Sản phẩm & Tiếp thị",
];

const sortFields = [
  { value: "full_name", label: "Tên đầy đủ" },
  { value: "price", label: "Giá" },
  { value: "company", label: "Công ty" },
  { value: "createdAt", label: "Ngày tạo" },
];

const sortOrders = [
  { value: "asc", label: "Tăng dần" },
  { value: "desc", label: "Giảm dần" },
];

export const ListMentor = () => {
  const [mentors, setMentors] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [initialLimit] = useState(100);
  const [loading, setLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("30000");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("full_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [uniqueSkills, setUniqueSkills] = useState([]);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [priceRange, setPriceRange] = useState([30000, 1000000]);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchMentors = async (reset = false, isInitial = false) => {
    try {
      setLoading(true);
      const currentLimit = isInitial ? initialLimit : limit;
      const currentPage = isInitial ? 1 : reset ? 1 : page;

      const params = {
        search: debouncedSearchQuery,
        skill: selectedSkills.join(","),
        category: selectedCategory,
        company,
        location,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: currentLimit,
      };

      Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === "") delete params[key];
      });

      const res = await MentorService.listActiveMentors(params);
      const fetched = res.mentors || [];
      setTotal(res.pagination?.totalItems || 0);

      if (isInitial || reset) {
        setMentors(fetched);
      } else {
        setMentors((prev) => [...prev, ...fetched]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách mentor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const allSkills = new Set();
    mentors.forEach((mentor) => {
      if (mentor.skill) {
        mentor.skill.split(",").forEach((s) => {
          const trimmed = s.trim();
          if (trimmed && trimmed.length > 0) {
            allSkills.add(trimmed);
          }
        });
      }
    });

    const sortedSkills = Array.from(allSkills).sort((a, b) => a.localeCompare(b));
    setUniqueSkills(sortedSkills);
  }, [mentors]);

  useEffect(() => {
    fetchMentors(true, true);
  }, []);

  useEffect(() => {
    setPage(1);
    fetchMentors(true, false);

    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set("search", debouncedSearchQuery);
    if (selectedSkills.length) params.set("skills", selectedSkills.join(","));
    if (selectedCategory) params.set("category", selectedCategory);
    if (company) params.set("company", company);
    if (location) params.set("location", location);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    setSearchParams(params);
  }, [
    debouncedSearchQuery,
    selectedSkills,
    selectedCategory,
    company,
    location,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  ]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchMentors(true, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleArrayItem = (array, item, setArray) => {
    setArray((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setMinPrice(value[0].toString());
    setMaxPrice(value[1].toString());
  };

  useEffect(() => {
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      toast.error("Giá min không thể lớn hơn giá max!");
      setMinPrice(maxPrice || "30000");
    }
  }, [minPrice, maxPrice]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSkills([]);
    setSelectedCategory("");
    setCompany("");
    setLocation("");
    setMinPrice("30000");
    setMaxPrice("");
    setSortBy("full_name");
    setSortOrder("asc");
    setPriceRange([30000, 1000000]);
    setSearchParams({});
  };

  const displayedSkills = showAllSkills ? uniqueSkills : uniqueSkills.slice(0, 20);
  const totalPages = Math.ceil(total / limit);

  const getPaginationRange = () => {
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxPagesToShow - 1);

    if (end - start + 1 < maxPagesToShow) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Tìm kiếm mentor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-gray-50 border-0 focus-visible:ring-2 focus-visible:ring-[#F9C5D5] rounded-xl text-[#333333]"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-[#2C3E50] mb-4">Danh mục</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={selectedCategory === category}
                onCheckedChange={() =>
                  setSelectedCategory(selectedCategory === category ? "" : category)
                }
                className="border-2 border-gray-300 data-[state=checked]:bg-[#F9C5D5] data-[state=checked]:border-[#F9C5D5]"
              />
              <span className="text-sm text-[#333333] group-hover:text-[#F9C5D5] transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-[#2C3E50] mb-4">
          Kỹ năng ({uniqueSkills.length})
        </h3>
        <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
          {displayedSkills.map((skill) => (
            <label
              key={skill}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={selectedSkills.includes(skill)}
                onCheckedChange={() =>
                  toggleArrayItem(selectedSkills, skill, setSelectedSkills)
                }
                className="border-2 border-gray-300 data-[state=checked]:bg-[#F9C5D5] data-[state=checked]:border-[#F9C5D5]"
              />
              <span className="text-sm text-[#333333] group-hover:text-[#F9C5D5] transition-colors">
                {skill}
              </span>
            </label>
          ))}
        </div>
        {uniqueSkills.length > 20 && (
          <Button
            variant="ghost"
            onClick={() => setShowAllSkills(!showAllSkills)}
            className="w-full mt-4 text-[#F9C5D5] hover:text-[#F9C5D5] hover:bg-pink-50"
          >
            {showAllSkills ? "Thu gọn" : `Xem thêm ${uniqueSkills.length - 20} kỹ năng`}
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAllSkills ? "rotate-180" : ""}`} />
          </Button>
        )}
      </div>

      {/* Location & Company */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="text-sm font-semibold text-[#2C3E50] mb-2 block">
            Công ty
          </label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Nhập tên công ty"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="pl-11 h-11 bg-gray-50 border-0 focus-visible:ring-2 focus-visible:ring-[#F9C5D5] rounded-xl"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-[#2C3E50] mb-2 block">
            Vị trí
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Nhập địa điểm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-11 h-11 bg-gray-50 border-0 focus-visible:ring-2 focus-visible:ring-[#F9C5D5] rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-[#2C3E50] mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Khoảng giá
        </h3>
        <Slider
          min={0}
          max={2000000}
          step={10000}
          value={priceRange}
          onValueChange={handlePriceChange}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-[#333333] mb-4">
          <span className="font-semibold">{priceRange[0].toLocaleString("vi-VN")} đ</span>
          <span className="font-semibold">{priceRange[1].toLocaleString("vi-VN")} đ</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPriceRange([Number(e.target.value) || 30000, priceRange[1]]);
            }}
            className="h-10 bg-gray-50 border-0 focus-visible:ring-2 focus-visible:ring-[#F9C5D5] rounded-xl"
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPriceRange([priceRange[0], Number(e.target.value) || 1000000]);
            }}
            className="h-10 bg-gray-50 border-0 focus-visible:ring-2 focus-visible:ring-[#F9C5D5] rounded-xl"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-[#2C3E50] mb-4">Sắp xếp</h3>
        <div className="grid grid-cols-2 gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-11 bg-gray-50 border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortFields.map((field) => (
                <SelectItem key={field.value} value={field.value}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="h-11 bg-gray-50 border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOrders.map((order) => (
                <SelectItem key={order.value} value={order.value}>
                  {order.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reset */}
      <Button
        onClick={resetFilters}
        variant="outline"
        className="w-full h-11 border-2 border-[#F9C5D5] text-[#F9C5D5] hover:bg-[#F9C5D5] hover:text-white rounded-xl font-semibold transition-all"
      >
        Xóa bộ lọc
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#F9C5D5] to-[#2C3E50] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tìm kiếm Mentor</h1>
          <p className="text-lg md:text-xl opacity-90">
            Kết nối với {total} chuyên gia hàng đầu trong lĩnh vực của bạn
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Mobile Filter Button */}
        <Button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden mb-6 w-full h-12 bg-[#F9C5D5] hover:bg-[#f5b3c9] text-white rounded-xl flex items-center justify-center gap-2"
        >
          <Filter className="h-5 w-5" />
          Bộ lọc tìm kiếm
        </Button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSection />
            </div>
          </aside>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowMobileFilters(false)}>
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-50 overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#2C3E50]">Bộ lọc</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <FilterSection />
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#2C3E50]">
                    {total} Mentor
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)} kết quả
                  </p>
                </div>
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                      <Badge
                        key={skill}
                        className="bg-[#F9C5D5] text-white hover:bg-[#f5b3c9] cursor-pointer"
                        onClick={() => toggleArrayItem(selectedSkills, skill, setSelectedSkills)}
                      >
                        {skill}
                        <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mentor Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center">
                  <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#F9C5D5] border-r-transparent mb-4"></div>
                  <p className="text-lg text-[#333333]">Đang tải mentor...</p>
                </div>
              </div>
            ) : mentors.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                <div className="max-w-md mx-auto">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#2C3E50] mb-2">
                    Không tìm thấy mentor
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
                  </p>
                  <Button
                    onClick={resetFilters}
                    className="bg-[#F9C5D5] hover:bg-[#f5b3c9] text-white"
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mentors.map((mentor) => (
                  <Card
                    key={mentor.id}
                    className="group bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden"
                  >
                    <CardContent className="p-0">
                      {/* Header with Avatar */}
                      <div className="bg-gradient-to-br from-[#F9C5D5] to-[#f5b3c9] p-6 relative">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-20 w-20 border-4 border-white shadow-lg ring-2 ring-pink-100">
                            <AvatarImage
                              src={mentor.avatar_url || "/placeholder.svg"}
                              alt={mentor.full_name}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-white text-[#F9C5D5] text-xl font-bold">
                              {mentor.full_name?.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-white">
                            <h3 className="font-bold text-lg mb-1 line-clamp-1">
                              {mentor.full_name}
                            </h3>
                            <p className="text-sm opacity-90 line-clamp-1">
                              {mentor.job_title}
                            </p>
                            {mentor.company && (
                              <div className="flex items-center gap-1 mt-2 text-xs opacity-80">
                                <Briefcase className="h-3 w-3" />
                                <span className="line-clamp-1">{mentor.company}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        {/* Category */}
                        {mentor.category && (
                          <Badge className="bg-[#2C3E50] text-white hover:bg-[#1e2d3d]">
                            {mentor.category}
                          </Badge>
                        )}

                        {/* Skills */}
                        {mentor.skill && (
                          <div className="flex flex-wrap gap-2">
                            {mentor.skill.split(",").slice(0, 3).map((s, index) => (
                              <Badge
                                key={`${s}-${index}`}
                                variant="outline"
                                className="border-[#F9C5D5] text-[#F9C5D5] text-xs"
                              >
                                {s.trim()}
                              </Badge>
                            ))}
                            {mentor.skill.split(",").length > 3 && (
                              <Badge variant="outline" className="border-gray-300 text-gray-500 text-xs">
                                +{mentor.skill.split(",").length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Bio Preview */}
                        {mentor.bio && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {mentor.bio}
                          </p>
                        )}

                        {/* Footer */}
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            {mentor.price && (
                              <div className="text-xl font-bold text-[#2C3E50]">
                                {mentor.price.toLocaleString("vi-VN")} đ
                                <span className="text-xs text-gray-500 font-normal">/giờ</span>
                              </div>
                            )}
                          </div>
                          <Link to={`/mentor/${mentor.id}`}>
                            <Button
                              size="sm"
                              className="bg-[#F9C5D5] hover:bg-[#f5b3c9] text-white rounded-lg px-6"
                            >
                              Xem chi tiết
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {total > limit && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent className="bg-white shadow-sm rounded-xl p-2 gap-1">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(page - 1)}
                        className={`rounded-lg ${
                          page === 1
                            ? "pointer-events-none opacity-50"
                            : "hover:bg-pink-50 hover:text-[#F9C5D5] cursor-pointer"
                        }`}
                      />
                    </PaginationItem>
                    {getPaginationRange().map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={page === pageNum}
                          className={`rounded-lg cursor-pointer ${
                            page === pageNum
                              ? "bg-[#F9C5D5] text-white hover:bg-[#f5b3c9]"
                              : "hover:bg-pink-50 hover:text-[#F9C5D5]"
                          }`}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(page + 1)}
                        className={`rounded-lg ${
                          page === totalPages
                            ? "pointer-events-none opacity-50"
                            : "hover:bg-pink-50 hover:text-[#F9C5D5] cursor-pointer"
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </main>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #F9C5D5;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f5b3c9;
        }
      `}</style>
    </div>
  );
};