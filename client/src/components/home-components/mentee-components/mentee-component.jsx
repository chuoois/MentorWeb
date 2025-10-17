import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MentorService from "@/services/mentor.service";
import {
  Users,
  Calendar,
  Shield,
  Briefcase,
  Search,
  TrendingUp,
  Play,
  Check,
  ArrowRight,
  Sparkles,
  Video,
  Zap,
  Target,
  Brain,
  Heart,
  Rocket,
} from "lucide-react";
import { Link } from "react-router-dom";

const colors = {
  primary: "#F9C5D5", // Hồng pastel
  secondary: "#FFFFFF", // Trắng
  accent: "#2C3E50", // Xanh navy
  text: "#333333", // Xám đậm
};

// Dữ liệu giả không thay đổi
const fakeData = {
  stats: [
    { number: "Mới ra mắt", label: "Nền tảng kết nối mentor Việt Nam", icon: Rocket },
    { number: "Miễn phí", label: "Đăng ký và tìm kiếm mentor", icon: Heart },
    { number: "100%", label: "Mentor được xác thực kỹ lưỡng", icon: Shield },
  ],
  features: [
    {
      icon: Users,
      title: "Kết nối trực tiếp",
      description: "Gặp gỡ mentor qua video call hoặc chat - không qua trung gian",
    },
    {
      icon: Brain,
      title: "Tìm kiếm thông minh",
      description: "Lọc theo kỹ năng, ngành nghề và kinh nghiệm mong muốn",
    },
    {
      icon: Video,
      title: "Học linh hoạt",
      description: "Đặt lịch theo thời gian của bạn, không bị ràng buộc",
    },
    {
      icon: Target,
      title: "Phát triển bền vững",
      description: "Xây dựng kế hoạch dài hạn cùng mentor phù hợp",
    },
  ],
  mentors: [
    {
      id: 1,
      name: "Minh Anh Nguyen",
      title: "Senior Product Manager",
      company: "Google",
      location: "TP.HCM",
      rating: 5.0,
      sessions: 0,
      price: "2,500,000",
      image: "https://i.pravatar.cc/150?img=1",
      skills: ["Product Strategy", "Leadership", "Analytics"],
      available: true,
      verified: true,
      isNew: true,
    },
    {
      id: 2,
      name: "Duc Huy Tran",
      title: "Engineering Manager",
      company: "Meta",
      location: "Hà Nội",
      rating: 5.0,
      sessions: 0,
      price: "3,000,000",
      image: "https://i.pravatar.cc/150?img=2",
      skills: ["Software Engineering", "Team Management"],
      available: true,
      verified: true,
      isNew: true,
    },
    {
      id: 3,
      name: "Mai Le",
      title: "UX Design Lead",
      company: "Shopee",
      location: "TP.HCM",
      rating: 5.0,
      sessions: 0,
      price: "2,200,000",
      image: "https://i.pravatar.cc/150?img=3",
      skills: ["UX Design", "Design System"],
      available: true,
      verified: true,
      isNew: true,
    },
    {
      id: 4,
      name: "Khanh Pham",
      title: "Data Scientist",
      company: "Grab",
      location: "Đà Nẵng",
      rating: 5.0,
      sessions: 0,
      price: "2,800,000",
      image: "https://i.pravatar.cc/150?img=4",
      skills: ["Machine Learning", "AI"],
      available: true,
      verified: true,
      isNew: true,
    },
  ],
  testimonials: [
    {
      quote: "Ý tưởng tuyệt vời! Việt Nam cần một nền tảng kết nối mentor chất lượng như thế này.",
      name: "Lan Pham",
      title: "Product Designer",
      image: "https://i.pravatar.cc/80?img=5",
      role: "Early Supporter",
    },
    {
      quote: "Rất mong chờ được tham gia và kết nối với các mentor từ những công ty lớn.",
      name: "Nguyen Hoang",
      title: "Software Engineer",
      image: "https://i.pravatar.cc/80?img=6",
      role: "Early Supporter",
    },
  ],
};

// ============ HERO SECTION ============
export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const navigate = useNavigate();

  const words = ["phát triển", "kết nối", "học hỏi", "thành công"];

  useEffect(() => {
    let timeout;
    const currentWord = words[wordIndex];

    if (displayedText.length < currentWord.length) {
      timeout = setTimeout(() => {
        setDisplayedText(currentWord.slice(0, displayedText.length + 1));
      }, 100);
    } else {
      timeout = setTimeout(() => {
        setDisplayedText("");
        setWordIndex((prev) => (prev + 1) % words.length);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, wordIndex]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listmentor?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/listmentor");
    }
  };

  return (
    <section className="relative flex items-center py-16 md:py-20 overflow-hidden bg-gradient-to-br from-[#F9C5D5]/10 via-[#FFFFFF] to-[#2C3E50]/10">
      {/* Hiệu ứng nền */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#F9C5D5]/50 rounded-full mix-blend-multiply blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-72 h-72 bg-[#2C3E50]/50 rounded-full mix-blend-multiply blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F9C5D5] text-[#333333] shadow">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">Mới ra mắt tại Việt Nam</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-snug">
              <span className="text-[#333333]">Cùng </span>
              <span className="bg-gradient-to-r from-[#F9C5D5] to-[#2C3E50] bg-clip-text text-transparent">
                {displayedText}
                <span className="animate-pulse">|</span>
              </span>
              <br />
              <span className="text-[#333333]">với Mentor</span>
            </h1>

            <p className="text-base md:text-lg text-[#333333]/80 leading-relaxed max-w-xl">
              Nền tảng giúp bạn kết nối với các mentor uy tín, học hỏi từ kinh nghiệm
              thực tế và phát triển bản thân.
            </p>

            {/* SEARCH BAR */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F9C5D5] to-[#2C3E50] rounded-2xl blur opacity-25 group-hover:opacity-40 transition" />
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#333333]/60" />
                <Input
                  placeholder="Tìm theo kỹ năng, công ty hoặc vai trò..."
                  className="pl-12 pr-32 py-5 text-base rounded-2xl border-0 bg-white shadow"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-4 rounded-xl bg-[#F9C5D5] hover:bg-[#F9C5D5]/80 text-[#333333] text-sm"
                >
                  Khám phá
                </Button>
              </form>
            </div>

            {/* Value props */}
            <div className="flex flex-wrap gap-3 pt-2">
              {[
                "Miễn phí đăng ký",
                "Mentor được xác thực",
                "Bảo mật thông tin",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow"
                >
                  <Check className="w-3.5 h-3.5 text-[#2C3E50]" />
                  <span className="text-sm font-medium text-[#333333]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative flex justify-center">
            <div className="relative w-[450px] h-[550px] md:w-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=1000&fit=crop"
                alt="Mentoring"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E50]/40 to-transparent" />

              {/* Floating cards */}
              <div
                className="absolute top-6 right-6 bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl p-4 shadow-xl animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#F9C5D5] flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-[#333333]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#333333] text-sm">Mới ra mắt</p>
                    <p className="text-xs text-[#333333]/80">Tham gia ngay!</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F9C5D5]" />
                  <div>
                    <p className="font-semibold text-[#333333] text-sm">Mentor chất lượng</p>
                    <p className="text-xs text-[#333333]/80">100% xác thực</p>
                  </div>
                  <div className="w-2 h-2 bg-[#2C3E50] rounded-full animate-pulse ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============ STATS SECTION ============
export const StatsSection = () => {
  return (
    <section className="py-12 bg-[#2C3E50] relative overflow-hidden">
      {/* Hiệu ứng nền */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#F9C5D5]/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/40 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Tiêu đề */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Tại sao chọn chúng tôi?
          </h2>
          <p className="text-white/70 text-base">
            Nền tảng mentorship hiện đại đầu tiên tại Việt Nam
          </p>
        </div>

        {/* Các số liệu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fakeData.stats.map((stat, idx) => (
            <div key={idx} className="text-center group">
              <div className="mb-3 flex justify-center">
                <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                  <stat.icon className="w-7 h-7 text-[#F9C5D5]" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {stat.number}
              </h3>
              <p className="text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ MENTOR SHOWCASE ============
export const MentorShowcase = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewMentors = async () => {
      try {
        setLoading(true);
        const response = await MentorService.get8MentorsNew();
        if (response.ok) {
          setMentors(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch new mentors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewMentors();
  }, []);

  if (loading) {
    return (
      <section className="py-16 text-center">
        <p className="text-[#333333]/80">Đang tải danh sách mentor...</p>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Tiêu đề */}
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            Các mentor mới gia nhập
          </h2>
          <p className="text-base text-[#333333]/70">
            Có thể sẽ phù hợp với bạn
          </p>
        </div>

        {/* Danh sách mentor */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((mentor) => (
            <Card
              key={mentor._id}
              onClick={() => navigate(`/mentor/${mentor._id}`)}
              className="group bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
            >
              <CardContent className="p-0">
                {/* Header gradient */}
                <div className="bg-gradient-to-br from-[#F9C5D5] to-[#f5b3c9] p-6 relative">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-lg ring-2 ring-pink-100">
                      <AvatarImage
                        src={mentor.avatar_url || "/default-avatar.png"}
                        alt={mentor.full_name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-white text-[#F9C5D5] text-xl font-bold">
                        {mentor.full_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
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

                    {/* Label “MỚI” */}
                    <div className="absolute top-3 right-3 bg-white text-[#F9C5D5] px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow">
                      <Sparkles className="w-3 h-3" />
                      MỚI
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
                        <Badge
                          variant="outline"
                          className="border-gray-300 text-gray-500 text-xs"
                        >
                          +{mentor.skill.split(",").length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Bio preview */}
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
                          {mentor.price.toLocaleString("vi-VN")}₫
                          <span className="text-xs text-gray-500 font-normal">
                            /giờ
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#F9C5D5] hover:bg-[#f5b3c9] text-white rounded-lg px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/mentor/${mentor._id}`);
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nút xem thêm */}
        <div className="text-center mt-10">
          <Link to="/listmentor">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-2 border-[#F9C5D5] hover:border-[#2C3E50] text-[#333333] hover:text-[#2C3E50] px-6"
            >
              Xem thêm mentor khác
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// ============ MENTOR SHOWCASE RATING============

export const MentorShowcaseRating = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewMentors = async () => {
      try {
        setLoading(true);
        const response = await MentorService.get8MentorsRating();
        if (response.ok) {
          setMentors(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch new mentors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewMentors();
  }, []);

  if (loading) {
    return (
      <section className="py-16 text-center">
        <p className="text-[#333333]/80">Đang tải danh sách mentor...</p>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Tiêu đề */}
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            Các mentor nổi bật nhất
          </h2>
          <p className="text-base text-[#333333]/70">
            Có thể sẽ phù hợp với bạn
          </p>
        </div>

        {/* Danh sách mentor */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((mentor) => (
            <Card
              key={mentor._id}
              onClick={() => navigate(`/mentor/${mentor._id}`)}
              className="group bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
            >
              <CardContent className="p-0">
                {/* Header gradient */}
                <div className="bg-gradient-to-br from-[#F9C5D5] to-[#f5b3c9] p-6 relative">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-lg ring-2 ring-pink-100">
                      <AvatarImage
                        src={mentor.avatar_url || "/default-avatar.png"}
                        alt={mentor.full_name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-white text-[#F9C5D5] text-xl font-bold">
                        {mentor.full_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
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

                    {/* Label “MỚI” */}
                    <div className="absolute top-3 right-3 bg-white text-[#F9C5D5] px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow">
                      <Sparkles className="w-3 h-3" />
                      NỔI BẬT
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
                        <Badge
                          variant="outline"
                          className="border-gray-300 text-gray-500 text-xs"
                        >
                          +{mentor.skill.split(",").length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Bio preview */}
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
                          {mentor.price.toLocaleString("vi-VN")}₫
                          <span className="text-xs text-gray-500 font-normal">
                            /giờ
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#F9C5D5] hover:bg-[#f5b3c9] text-white rounded-lg px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/mentor/${mentor._id}`);
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nút xem thêm */}
        <div className="text-center mt-10">
          <Link to="/listmentor">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-2 border-[#F9C5D5] hover:border-[#2C3E50] text-[#333333] hover:text-[#2C3E50] px-6"
            >
              Xem thêm mentor khác
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};


// ============ HOW IT WORKS ============
export const MentorshipTimeline = () => {
  return (
    <section
      className="py-20 px-6 bg-gradient-to-br from-pink-50 via-white to-blue-50"
      style={{ background: colors.secondary }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            Hành trình cố vấn dài hạn
          </h2>
          <p className="text-base md:text-lg text-[#333333]/70">
            Không chỉ tốt hơn – mà còn nhanh hơn
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 hidden md:block"
            style={{ background: colors.primary }}
          ></div>

          {/* Timeline items */}
          <div className="space-y-20">
            {[
              {
                title: "Khám phá",
                desc: "Duyệt qua mạng lưới cố vấn chuyên gia – kỹ sư, nhà thiết kế, nhà sáng lập và nhiều lĩnh vực khác. Tìm người phù hợp với mục tiêu, kỹ năng và ngân sách của bạn.",
                card: (
                  <div className="rounded-2xl p-6 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
                        style={{ background: colors.primary }}
                      >
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4
                          className="font-semibold text-lg"
                          style={{ color: colors.text }}
                        >
                          Arlene McCoy
                        </h4>
                        <p className="text-gray-500 text-sm">
                          Chuyên gia Thiết kế Sản phẩm
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Kinh nghiệm</span>
                        <span style={{ color: colors.text }}>8+ năm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Đánh giá</span>
                        <span style={{ color: colors.text }}>4.9/5</span>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: "Bắt đầu",
                desc: "Chọn gói linh hoạt phù hợp với tốc độ của bạn – dù là chat Q&A, cuộc gọi 1-1 hay kết hợp. Cố vấn sẽ giúp bạn xây dựng lộ trình cá nhân hóa.",
                card: (
                  <div className="rounded-2xl p-6 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h4
                        className="font-semibold"
                        style={{ color: colors.text }}
                      >
                        Lên lịch buổi học
                      </h4>
                      <Calendar
                        className="w-5 h-5"
                        style={{ color: colors.primary }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {["T2", "T3", "T4"].map((day) => (
                        <div
                          key={day}
                          className="rounded-lg p-2 text-center bg-gray-100"
                        >
                          <div className="text-xs text-gray-500">{day}</div>
                          <div
                            className="text-sm font-medium"
                            style={{ color: colors.text }}
                          >
                            15
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-white"
                        style={{ background: colors.primary }}
                      >
                        Đặt ngay
                      </button>
                      <button
                        className="px-4 py-2 border rounded-lg text-sm"
                        style={{
                          borderColor: "#d1d5db",
                          color: colors.text,
                        }}
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ),
              },
              {
                title: "Gặp gỡ",
                desc: "Nhận hỗ trợ liên tục qua các buổi gọi, kiểm tra tiến độ và phản hồi. Cố vấn sẽ đồng hành cùng bạn trong chặng đường dài.",
                card: (
                  <div className="rounded-2xl p-6 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h4
                        className="font-semibold"
                        style={{ color: colors.text }}
                      >
                        Cuộc gọi video
                      </h4>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="rounded-xl p-4 bg-gray-100 mb-4 flex items-center gap-3 justify-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: colors.primary }}
                      >
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className="text-sm font-medium"
                        style={{ color: colors.text }}
                      >
                        45:32
                      </div>
                      <div className="text-xs text-gray-500">
                        Buổi học đang diễn ra
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: "Phát triển",
                desc: "Đo lường kết quả bằng các chỉ số rõ ràng. Tiến nhanh hơn so với tự học – hiệu quả hơn sách vở, bứt phá hơn bao giờ hết.",
                card: (
                  <div className="rounded-2xl p-6 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h4
                        className="font-semibold"
                        style={{ color: colors.text }}
                      >
                        Theo dõi tiến trình
                      </h4>
                      <TrendingUp
                        className="w-5 h-5"
                        style={{ color: colors.primary }}
                      />
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Kỹ năng cải thiện</span>
                        <span style={{ color: colors.text }}>12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Mục tiêu đạt được</span>
                        <span style={{ color: colors.text }}>8/10</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Số buổi học</span>
                        <span style={{ color: colors.text }}>24</span>
                      </div>
                    </div>
                    <div className="mt-4 rounded-full h-2 bg-gray-200">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          background: colors.primary,
                          width: "80%",
                        }}
                      ></div>
                    </div>
                  </div>
                ),
              },
            ].map((step, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
              >
                {/* Dot */}
                <div
                  className="hidden md:block absolute left-1/2 -translate-x-1/2 z-10 w-5 h-5 rounded-full border-4"
                  style={{
                    background: colors.primary,
                    borderColor: colors.secondary,
                  }}
                ></div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <h3
                    className="text-2xl font-semibold"
                    style={{ color: colors.text }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>

                {/* Card */}
                <div className="flex-1">{step.card}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============ EARLY SUPPORTERS ============
export const EarlySupporters = () => {
  return (
    <section
      className="py-32 px-6"
      style={{ background: colors.secondary }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: `${colors.primary}20` }} // 20% opacity
          >
            <Heart className="w-4 h-4" style={{ color: colors.accent }} />
            <span
              className="text-sm font-medium"
              style={{ color: colors.text }}
            >
              Cộng đồng
            </span>
          </div>

          <h2
            className="text-4xl font-bold mb-6"
            style={{ color: colors.text }}
          >
            Lời từ những người ủng hộ đầu tiên
          </h2>
          <p
            className="text-xl mt-4"
            style={{ color: `${colors.text}CC` }} // 80% opacity
          >
            Họ tin tưởng vào tầm nhìn của chúng tôi
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-8">
          {fakeData.testimonials.map((testimonial, idx) => (
            <Card
              key={idx}
              className="border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              style={{ background: colors.secondary }}
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Badge
                    className="border-0"
                    style={{
                      background: colors.primary,
                      color: colors.text,
                    }}
                  >
                    {testimonial.role}
                  </Badge>
                </div>

                <blockquote
                  className="text-lg mb-6 leading-relaxed"
                  style={{ color: `${colors.text}CC` }}
                >
                  “{testimonial.quote}”
                </blockquote>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover"
                    style={{
                      border: `2px solid ${colors.primary}80`,
                    }}
                  />
                  <div>
                    <p
                      className="font-bold"
                      style={{ color: colors.text }}
                    >
                      {testimonial.name}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: `${colors.text}CC` }}
                    >
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p
            className="mb-4"
            style={{ color: `${colors.text}CC` }}
          >
            Hãy là một trong những người đầu tiên trải nghiệm nền tảng
          </p>
          <Link
            to="/auth/signup"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white"
            style={{ background: colors.primary }}
          >
            <span>Đăng ký ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
