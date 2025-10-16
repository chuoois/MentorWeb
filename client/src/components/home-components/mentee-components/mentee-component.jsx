import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  MessageCircle,
  Trophy,
  Shield,
  Clock,
  Star,
  MapPin,
  Search,
  TrendingUp,
  Play,
  Check,
  ArrowRight,
  Sparkles,
  Video,
  Zap,
  Award,
  Target,
  BookOpen,
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
      navigate("/mentors");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F9C5D5]/20 via-[#FFFFFF] to-[#2C3E50]/10">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#F9C5D5]/50 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#2C3E50]/50 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F9C5D5] text-[#333333] shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                Mới ra mắt tại Việt Nam
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="text-[#333333]">Cùng </span>
              <span className="bg-gradient-to-r from-[#F9C5D5] to-[#2C3E50] bg-clip-text text-transparent">
                {displayedText}
                <span className="animate-pulse">|</span>
              </span>
              <br />
              <span className="text-[#333333]">với Mentor</span>
            </h1>

            <p className="text-xl text-[#333333]/80 leading-relaxed">
              Nền tảng kết nối bạn với các mentor giàu kinh nghiệm từ Google, Meta,
              Shopee và nhiều công ty hàng đầu tại Việt Nam.
            </p>

            {/* Search bar */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F9C5D5] to-[#2C3E50] rounded-2xl blur opacity-25 group-hover:opacity-40 transition" />
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#333333]/60" />
                <Input
                  placeholder="Tìm theo kỹ năng, công ty hoặc vai trò..."
                  className="pl-14 pr-40 py-7 text-lg rounded-2xl border-0 bg-[#FFFFFF] shadow-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-8 py-6 rounded-xl bg-[#F9C5D5] hover:bg-[#F9C5D5]/80 text-[#333333]"
                >
                  Khám phá
                </Button>
              </form>
            </div>

            {/* Value props */}
            <div className="flex flex-wrap gap-4 items-center pt-4">
              <div className="flex items-center gap-2 bg-[#FFFFFF] rounded-full px-4 py-2 shadow-md">
                <Check className="w-4 h-4 text-[#2C3E50]" />
                <span className="text-sm font-medium text-[#333333]">Miễn phí đăng ký</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FFFFFF] rounded-full px-4 py-2 shadow-md">
                <Check className="w-4 h-4 text-[#2C3E50]" />
                <span className="text-sm font-medium text-[#333333]">Mentor được xác thực</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FFFFFF] rounded-full px-4 py-2 shadow-md">
                <Check className="w-4 h-4 text-[#2C3E50]" />
                <span className="text-sm font-medium text-[#333333]">Bảo mật thông tin</span>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=1000&fit=crop"
                alt="Mentoring"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E50]/50 to-transparent" />

              {/* Floating cards */}
              <div className="absolute top-8 right-8 bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl p-4 shadow-xl animate-bounce" style={{ animationDuration: "3s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#F9C5D5] flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-[#333333]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#333333]">Mới ra mắt</p>
                    <p className="text-xs text-[#333333]/80">Tham gia ngay!</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F9C5D5]" />
                  <div>
                    <p className="font-semibold text-[#333333]">Mentor chất lượng</p>
                    <p className="text-xs text-[#333333]/80">100% xác thực</p>
                  </div>
                  <div className="w-2 h-2 bg-[#2C3E50] rounded-full animate-pulse ml-2" />
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
    <section className="py-20 bg-[#2C3E50] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F9C5D5]/50 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFFFFF]/50 rounded-full filter blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#FFFFFF] mb-3">
            Tại sao chọn chúng tôi?
          </h2>
          <p className="text-[#FFFFFF]/80 text-lg">
            Nền tảng mentorship hiện đại đầu tiên tại Việt Nam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fakeData.stats.map((stat, idx) => (
            <div key={idx} className="text-center group">
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 rounded-2xl bg-[#FFFFFF]/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.icon className="w-10 h-10 text-[#F9C5D5]" />
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-[#FFFFFF] mb-3">
                {stat.number}
              </h3>
              <p className="text-lg text-[#FFFFFF]/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ FEATURES BENTO GRID ============
export const FeaturesBento = () => {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-[#FFFFFF] to-[#F9C5D5]/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F9C5D5]/20 mb-6">
            <Zap className="w-4 h-4 text-[#2C3E50]" />
            <span className="text-sm font-medium text-[#333333]">
              Tính năng nổi bật
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-6"
            style={{ color: colors.text }}>
            Mentorship đơn giản và hiệu quả
          </h2>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
          {/* Large feature - spans 2 columns */}
          <div className="lg:col-span-2 lg:row-span-2 bg-[#F9C5D5] rounded-3xl p-8 text-[#333333] relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFFFFF]/20 rounded-full -translate-y-32 translate-x-32 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <Users className="w-12 h-12 mb-6 text-[#2C3E50]" />
              <h3 className="text-3xl font-bold mb-4">
                Mentor chất lượng
                <br />
                được tuyển chọn
              </h3>
              <p className="text-[#333333]/80 text-lg mb-6">
                Chúng tôi xác thực kỹ lưỡng mỗi mentor để đảm bảo
                bạn nhận được sự hướng dẫn tốt nhất
              </p>
              <Link to="/listmentor" className="flex items-center">
                <Button className="bg-[#FFFFFF] text-[#333333] hover:bg-[#FFFFFF]/80">
                  Tìm hiểu thêm
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Regular features */}
          {fakeData.features.map((feature, idx) => (
            <Card
              key={idx}
              className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 bg-[#FFFFFF] rounded-3xl overflow-hidden"
            >
              <CardContent className="p-8 h-full flex flex-col">
                <div className="w-16 h-16 rounded-2xl bg-[#F9C5D5]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-[#2C3E50]" />
                </div>
                <h3 className="text-xl font-bold text-[#333333] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#333333]/80 flex-grow">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}

          {/* CTA card */}
          <div className="lg:col-span-2 bg-[#2C3E50] rounded-3xl p-8 text-[#FFFFFF] flex items-center justify-between group cursor-pointer hover:shadow-2xl transition-all">
            <Link to="/mentor">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  Bạn là mentor?
                </h3>
                <p className="text-[#FFFFFF]/80">
                  Tham gia với chúng tôi và chia sẻ kinh nghiệm của bạn
                </p>
              </div>
            </Link>
            <ArrowRight className="w-8 h-8 text-[#F9C5D5] group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
};

// ============ MENTOR SHOWCASE ============
export const MentorShowcase = () => {
  return (
    <section className="py-32 px-6 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#333333] mb-4">
            Gặp gỡ các mentor
            <br />
            <span className="bg-gradient-to-r from-[#F9C5D5] to-[#2C3E50] bg-clip-text text-transparent">
              đầu tiên của chúng tôi
            </span>
          </h2>
          <p className="text-xl text-[#333333]/80 mt-4">
            Những chuyên gia đã sẵn sàng đồng hành cùng bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {fakeData.mentors.map((mentor) => (
            <Card
              key={mentor.id}
              className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFFFFF] to-[#F9C5D5]/10"
            >
              <CardContent className="p-0">
                {/* Image section */}
                <div className="relative overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-[#F9C5D5]/50 to-[#2C3E50]/50 relative">
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-full h-full object-cover mix-blend-overlay opacity-90 group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  {/* NEW badge */}
                  {mentor.isNew && (
                    <div className="absolute top-4 right-4 bg-[#F9C5D5] text-[#333333] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      MỚI
                    </div>
                  )}

                  {/* Online status */}
                  {mentor.available && (
                    <div className="absolute top-4 left-4 bg-[#2C3E50] text-[#FFFFFF] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                      <div className="w-2 h-2 bg-[#FFFFFF] rounded-full animate-pulse" />
                      Online
                    </div>
                  )}

                  {/* Verified badge */}
                  {mentor.verified && (
                    <div className="absolute bottom-4 left-4 bg-[#2C3E50] text-[#FFFFFF] p-2 rounded-full shadow-lg">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Content section */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-[#333333] mb-1">
                    {mentor.name}
                  </h3>

                  <p className="text-sm text-[#333333]/80 mb-1">{mentor.title}</p>
                  <p className="text-sm font-medium text-[#F9C5D5] mb-4">
                    {mentor.company}
                  </p>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-[#333333]/80 mb-4">
                    <MapPin className="w-4 h-4" />
                    {mentor.location}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.skills.slice(0, 2).map((skill, idx) => (
                      <Badge
                        key={idx}
                        className="text-xs bg-[#F9C5D5]/20 text-[#333333] hover:bg-[#F9C5D5]/40"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#F9C5D5]/20">
                    <div>
                      <p className="text-xs text-[#333333]/60">Từ</p>
                      <p className="text-lg font-bold text-[#333333]">
                        {mentor.price}₫
                      </p>
                    </div>
                    <Button className="bg-[#F9C5D5] hover:bg-[#F9C5D5]/80 text-[#333333] rounded-xl">
                      Xem hồ sơ
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-[#333333]/80 mb-4">
            Chúng tôi đang mở rộng mạng lưới mentor mỗi ngày
          </p>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 border-2 border-[#F9C5D5] hover:border-[#2C3E50] hover:text-[#2C3E50]"
          >
            Trở thành mentor
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

// ============ HOW IT WORKS ============
export const MentorshipTimeline = () => {
  return (
    <section className="py-20 px-4" style={{ background: colors.secondary }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-left mb-16">
          <h2
            className="text-4xl font-bold mb-6"
            style={{ color: colors.text }}
          >
            Hành trình cố vấn dài hạn
            <br />
            không chỉ tốt hơn – mà còn nhanh hơn
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-8 top-0 bottom-0 w-0.5"
            style={{ background: colors.primary }}
          ></div>

          {/* Timeline items */}
          <div className="space-y-16">
            {/* Khám phá */}
            <div className="relative flex items-start gap-8">
              <div
                className="relative z-10 w-4 h-4 rounded-full border-4"
                style={{
                  background: colors.primary,
                  borderColor: colors.secondary,
                }}
              ></div>
              <div className="flex-1 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3
                    className="text-2xl font-semibold mb-4"
                    style={{ color: colors.text }}
                  >
                    Khám phá
                  </h3>
                  <p className="leading-relaxed text-gray-600">
                    Duyệt qua mạng lưới cố vấn chuyên gia – kỹ sư, nhà thiết kế,
                    nhà sáng lập và nhiều lĩnh vực khác. Tìm người phù hợp với mục
                    tiêu, kỹ năng và ngân sách của bạn.
                  </p>
                </div>
                <div
                  className="rounded-lg p-6 border"
                  style={{ background: "#f9fafb", borderColor: "#e5e7eb" }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: colors.primary }}
                    >
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4
                        className="font-semibold"
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
              </div>
            </div>

            {/* Bắt đầu */}
            <div className="relative flex items-start gap-8">
              <div
                className="relative z-10 w-4 h-4 rounded-full border-4"
                style={{
                  background: colors.primary,
                  borderColor: colors.secondary,
                }}
              ></div>
              <div className="flex-1 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3
                    className="text-2xl font-semibold mb-4"
                    style={{ color: colors.text }}
                  >
                    Bắt đầu
                  </h3>
                  <p className="leading-relaxed text-gray-600">
                    Chọn gói linh hoạt phù hợp với tốc độ của bạn – dù là chat
                    Q&A, cuộc gọi 1-1 hay kết hợp. Cố vấn sẽ giúp bạn xây dựng lộ
                    trình cá nhân hóa.
                  </p>
                </div>
                <div
                  className="rounded-lg p-6 border"
                  style={{ background: "#f9fafb", borderColor: "#e5e7eb" }}
                >
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
                        className="rounded p-2 text-center"
                        style={{ background: "#e5e7eb" }}
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
                      className="flex-1 py-2 px-4 rounded text-sm font-medium"
                      style={{ background: colors.primary, color: "#fff" }}
                    >
                      Đặt ngay
                    </button>
                    <button
                      className="px-4 py-2 border rounded text-sm"
                      style={{ borderColor: "#d1d5db", color: colors.text }}
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Gặp gỡ */}
            <div className="relative flex items-start gap-8">
              <div
                className="relative z-10 w-4 h-4 rounded-full border-4"
                style={{
                  background: colors.primary,
                  borderColor: colors.secondary,
                }}
              ></div>
              <div className="flex-1 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3
                    className="text-2xl font-semibold mb-4"
                    style={{ color: colors.text }}
                  >
                    Gặp gỡ
                  </h3>
                  <p className="leading-relaxed text-gray-600">
                    Nhận hỗ trợ liên tục qua các buổi gọi, kiểm tra tiến độ và
                    phản hồi. Cố vấn sẽ đồng hành cùng bạn trong chặng đường dài.
                  </p>
                </div>
                <div
                  className="rounded-lg p-6 border"
                  style={{ background: "#f9fafb", borderColor: "#e5e7eb" }}
                >
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
                  <div
                    className="rounded-lg p-4 mb-4"
                    style={{ background: "#e5e7eb" }}
                  >
                    <div className="flex items-center gap-3">
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
              </div>
            </div>

            {/* Phát triển */}
            <div className="relative flex items-start gap-8">
              <div
                className="relative z-10 w-4 h-4 rounded-full border-4"
                style={{
                  background: colors.primary,
                  borderColor: colors.secondary,
                }}
              ></div>
              <div className="flex-1 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3
                    className="text-2xl font-semibold mb-4"
                    style={{ color: colors.text }}
                  >
                    Phát triển
                  </h3>
                  <p className="leading-relaxed text-gray-600">
                    Đo lường kết quả bằng các chỉ số rõ ràng. Tiến nhanh hơn so
                    với tự học – hiệu quả hơn sách vở, bứt phá hơn bao giờ hết.
                  </p>
                </div>
                <div
                  className="rounded-lg p-6 border"
                  style={{ background: "#f9fafb", borderColor: "#e5e7eb" }}
                >
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
                  <div className="mt-4 rounded-full h-2" style={{ background: "#e5e7eb" }}>
                    <div
                      className="h-2 rounded-full"
                      style={{ background: colors.primary, width: "80%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============ EARLY SUPPORTERS ============
export const EarlySupporters = () => {
  return (
    <section className="py-32 px-6 bg-[#FFFFFF]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F9C5D5]/20 mb-6">
            <Heart className="w-4 h-4 text-[#2C3E50]" />
            <span className="text-sm font-medium text-[#333333]">
              Cộng đồng
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-6"
            style={{ color: colors.text }}>
            Lời từ những người ủng hộ đầu tiên
          </h2>
          <p className="text-xl text-[#333333]/80 mt-4">
            Họ tin tưởng vào tầm nhìn của chúng tôi
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {fakeData.testimonials.map((testimonial, idx) => (
            <Card
              key={idx}
              className="border-0 rounded-3xl bg-[#FFFFFF] shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Badge className="bg-[#F9C5D5] text-[#333333] border-0">
                    {testimonial.role}
                  </Badge>
                </div>

                <blockquote className="text-lg text-[#333333]/80 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#F9C5D5]/50"
                  />
                  <div>
                    <p className="font-bold text-[#333333]">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-[#333333]/80">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-[#333333]/80 mb-4">
            Hãy là một trong những người đầu tiên trải nghiệm nền tảng
          </p>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 border-2 border-[#F9C5D5] text-[#333333] hover:bg-[#F9C5D5]/10"
          >
            Tham gia ngay
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

// ============ CTA SECTION ============
export const CTASection = () => {
  return (
    <section className="py-20 bg-[#F9C5D5]">
      <div className="container mx-auto px-6 text-center max-w-3xl">
        <h2 className="text-3xl lg:text-4xl font-bold text-[#333333] mb-6">
          Sẵn sàng tìm Mentor phù hợp cho bạn?
        </h2>
        <p className="text-lg text-[#333333]/80 mb-8 leading-relaxed">
          Khám phá hàng ngàn mentor toàn cầu – những người sẵn sàng đồng hành và
          hỗ trợ bạn trên hành trình phát triển cá nhân và sự nghiệp.
        </p>
        <div className="flex justify-center">
          <Link to="/listmentor">
            <Button
              size="lg"
              className="bg-[#2C3E50] hover:bg-[#1A2634] text-white px-6 shadow-lg transition"
            >
              Tìm Mentor ngay
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// ============ WHY JOIN NOW ============
export const WhyJoinNow = () => {
  const benefits = [
    {
      icon: Trophy,
      title: "Ưu đãi Early Bird",
      description: "Giảm 20% cho buổi học đầu tiên - chỉ dành cho 100 người đầu tiên",
      highlight: true,
    },
    {
      icon: Users,
      title: "Tham gia cộng đồng",
      description: "Kết nối với những người cùng chí hướng từ ngày đầu",
      highlight: false,
    },
    {
      icon: Sparkles,
      title: "Ảnh hưởng đến sản phẩm",
      description: "Góp ý và giúp định hình tương lai của nền tảng",
      highlight: false,
    },
    {
      icon: Heart,
      title: "Hỗ trợ tận tâm",
      description: "Nhận hỗ trợ trực tiếp từ team để trải nghiệm tốt nhất",
      highlight: false,
    },
  ];

  return (
    <section className="py-32 px-6 bg-gradient-to-b from-[#FFFFFF] to-[#F9C5D5]/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6"
            style={{ color: colors.text }}>
            Tại sao nên tham gia ngay bây giờ?
          </h2>
          <p className="text-xl text-[#333333]/80 mt-4">
            Những lợi ích đặc biệt dành cho người dùng đầu tiên
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, idx) => (
            <Card
              key={idx}
              className={`group cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 rounded-3xl overflow-hidden ${benefit.highlight
                ? "bg-[#F9C5D5] text-[#333333]"
                : "bg-[#FFFFFF]"
                }`}
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${benefit.highlight
                      ? "bg-[#FFFFFF]/20 backdrop-blur-sm"
                      : "bg-[#F9C5D5]/20"
                      }`}
                  >
                    <benefit.icon
                      className={`w-8 h-8 ${benefit.highlight ? "text-[#FFFFFF]" : "text-[#2C3E50]"
                        }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-bold mb-3 ${benefit.highlight ? "text-[#333333]" : "text-[#333333]"
                        }`}
                    >
                      {benefit.title}
                    </h3>
                    <p
                      className={
                        benefit.highlight ? "text-[#333333]/80" : "text-[#333333]/80"
                      }
                    >
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};