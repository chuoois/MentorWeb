import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // Import useSearchParams
import { Search, DollarSign } from "lucide-react";
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

// Danh sách categories (vẫn hardcode tạm, có thể dynamic tương tự skills nếu cần)
const categories = [
  "Kỹ thuật & Dữ liệu",
  "UX & Thiết kế",
  "Kinh doanh & Quản lý",
  "Sản phẩm & Tiếp thị",
];

// Các trường sắp xếp hợp lệ từ backend
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
  const [limit] = useState(6);
  const [initialLimit] = useState(100);
  const [loading, setLoading] = useState(false);

  // Các state cho filter
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("30000");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("full_name");
  const [sortOrder, setSortOrder] = useState("asc");

  // State cho unique skills (dynamic)
  const [uniqueSkills, setUniqueSkills] = useState([]);
  const [showAllSkills, setShowAllSkills] = useState(false);

  // State cho slider giá
  const [priceRange, setPriceRange] = useState([30000, 1000000]);

  // Debounce searchQuery with a 500ms delay
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

    const sortedSkills = Array.from(allSkills).sort((a, b) =>
      a.localeCompare(b)
    );
    setUniqueSkills(sortedSkills);
  }, [mentors]);

  useEffect(() => {
    fetchMentors(true, true);
  }, []);

  useEffect(() => {
    setPage(1);
    fetchMentors(true, false);

    // Update URL with current filters
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set("search", debouncedSearchQuery);
    if (selectedSkills.length)
      params.set("skills", selectedSkills.join(","));
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
    setSearchParams,
  ]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchMentors(true, false);
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

  const displayedSkills = showAllSkills ? uniqueSkills : uniqueSkills.slice(0, 30);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-white text-[#333]">
      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar Filters */}
        <div className="w-80 flex-shrink-0 space-y-6">
          {/* Search Box */}
          <Card className="border border-[#F9C5D5] shadow-sm">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-[#2C3E50]">
                Tìm kiếm
              </h3>
              <div className="relative">
                <Search
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#2C3E50]"
                />
                <Input
                  placeholder="Tìm kiếm mentor (công ty, kỹ năng, bio)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 border border-[#F9C5D5] focus:ring-2 focus:ring-[#F9C5D5]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Category Filter */}
          <Card className="border border-[#F9C5D5] shadow-sm">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-[#2C3E50]">
                Danh mục
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedCategory === category}
                      onCheckedChange={() =>
                        setSelectedCategory(
                          selectedCategory === category ? "" : category
                        )
                      }
                    />
                    <span className="text-sm cursor-pointer hover:text-[#F9C5D5]">
                      {category}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills Filter */}
          <Card className="border border-[#F9C5D5] shadow-sm">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-[#2C3E50]">
                Kỹ năng ({uniqueSkills.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {displayedSkills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={() =>
                        toggleArrayItem(selectedSkills, skill, setSelectedSkills)
                      }
                    />
                    <span className="text-sm cursor-pointer hover:text-[#F9C5D5]">
                      {skill}
                    </span>
                  </div>
                ))}
                {uniqueSkills.length > 30 && (
                  <Button
                    size="sm"
                    variant="link"
                    className="mt-2 p-0 text-[#F9C5D5] hover:underline"
                    onClick={() => setShowAllSkills((prev) => !prev)}
                  >
                    {showAllSkills
                      ? "Thu gọn"
                      : `Xem thêm ${uniqueSkills.length - 30} kỹ năng`}
                  </Button>
                )}
                {uniqueSkills.length === 0 && (
                  <p className="text-sm text-gray-500">Đang tải kỹ năng...</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Company Filter */}
          <Card className="border border-[#F9C5D5] shadow-sm">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-[#2C3E50]">
                Công ty
              </h3>
              <Input
                placeholder="Tìm theo công ty"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="border border-[#F9C5D5] focus:ring-2 focus:ring-[#F9C5D5]"
              />
            </CardContent>
          </Card>

          {/* Location Filter */}
          <Card className="border border-[#F9C5D5] shadow-sm">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-[#2C3E50]">
                Vị trí
              </h3>
              <Input
                placeholder="Tìm theo vị trí"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border border-[#F9C5D5] focus:ring-2 focus:ring-[#F9C5D5]"
              />
            </CardContent>
          </Card>

          {/* Price Range Filter */}
          <Card className="border border-[#F9C5D5] shadow-sm">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-[#2C3E50] flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Khoảng giá (VND)
              </h3>
              <div className="space-y-3">
                <Slider
                  min={0}
                  max={2000000}
                  step={10000}
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-center">
                  {priceRange[0].toLocaleString()} -{" "}
                  {priceRange[1].toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <div className="flex-1 relative">
                  <DollarSign
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
                  />
                  <Input
                    type="number"
                    placeholder="Giá min"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setPriceRange([
                        Number(e.target.value) || 30000,
                        priceRange[1],
                      ]);
                    }}
                    className="pl-6 border border-[#F9C5D5] focus:ring-2 focus:ring-[#F9C5D5] text-sm"
                  />
                </div>
                <div className="flex-1 relative">
                  <DollarSign
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
                  />
                  <Input
                    type="number"
                    placeholder="Giá max"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setPriceRange([
                        priceRange[0],
                        Number(e.target.value) || 1000000,
                      ]);
                    }}
                    className="pl-6 border border-[#F9C5D5] focus:ring-2 focus:ring-[#F9C5D5] text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sort Filter */}
          <Card className="border border-[#F9C5D5] shadow-sm">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4 text-[#2C3E50]">
                Sắp xếp kết quả
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#2C3E50] mb-1 block">
                    Sắp xếp theo
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border border-[#F9C5D5] focus:ring-2 focus:ring-[#F9C5D5] bg-white">
                      <SelectValue placeholder="Chọn trường" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortFields.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#2C3E50] mb-1 block">
                    Thứ tự
                  </label>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="border border-[#F9C5D5] focus:ring-2 focus:ring-[#F9C5D5] bg-white">
                      <SelectValue placeholder="Chọn thứ tự" />
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
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full border-[#F9C5D5] text-[#2C3E50] hover:bg-[#F9C5D5]/10"
            onClick={resetFilters}
          >
            Xóa tất cả bộ lọc
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {loading ? (
            <p className="text-center text-[#2C3E50]">Đang tải...</p>
          ) : mentors.length === 0 ? (
            <p className="text-center text-[#2C3E50]">Không tìm thấy mentor.</p>
          ) : (
            mentors.map((mentor) => (
              <Card
                key={mentor.id}
                className="border border-[#F9C5D5] hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={mentor.avatar_url || "/placeholder.svg"}
                      alt={mentor.full_name}
                    />
                    <AvatarFallback>
                      {mentor.full_name?.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-semibold text-[#2C3E50]">
                      {mentor.full_name}
                    </h3>
                    <div className="text-[#2C3E50] font-medium">
                      {mentor.job_title}{" "}
                      {mentor.company ? `tại ${mentor.company}` : ""}
                    </div>
                    {mentor.category && (
                      <Badge className="bg-[#F9C5D5] text-[#2C3E50]">
                        {mentor.category}
                      </Badge>
                    )}
                    {mentor.skill && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {mentor.skill.split(",").map((s) => (
                          <Badge
                            key={s}
                            className="bg-[#2C3E50] text-white"
                          >
                            {s.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {mentor.bio && (
                      <p className="text-sm text-gray-600">{mentor.bio}</p>
                    )}
                    <Link to={`/mentor/${mentor.id}`}>
                      <Button className="bg-[#F9C5D5] text-[#2C3E50] hover:bg-[#f7b0c6] mt-2">
                        Xem hồ sơ
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {total > limit && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                    className={
                      page === 1
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-[#F9C5D5]/20"
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={page === pageNum}
                        className={
                          page === pageNum
                            ? "bg-[#F9C5D5] text-[#2C3E50]"
                            : "hover:bg-[#F9C5D5]/20"
                        }
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(page + 1)}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-[#F9C5D5]/20"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};