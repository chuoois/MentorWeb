import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// 🎨 Màu sắc theo HomeRegisterMentor
const colors = {
  primary: "#F9C5D5", // hồng nhạt
  secondary: "#FFFFFF", // trắng
  accent: "#2C3E50", // xanh đậm
  text: "#333333", // chữ đậm
};

// ---------------- DỮ LIỆU GIẢ ----------------
export const fakeData = {
  features: [
    {
      icon: Users,
      title: "Hàng nghìn mentor",
      description:
        "Kết nối với mentor từ Google, Meta, Amazon và nhiều công ty hàng đầu khác.",
    },
    {
      icon: Calendar,
      title: "Lịch học linh hoạt",
      description:
        "Đặt buổi học phù hợp với lịch của bạn, có sẵn 24/7 trên toàn thế giới.",
    },
    {
      icon: MessageCircle,
      title: "Trò chuyện riêng",
      description:
        "Trao đổi trực tiếp với mentor qua tin nhắn và cuộc gọi video.",
    },
    {
      icon: Trophy,
      title: "Theo dõi tiến độ",
      description:
        "Đặt mục tiêu và theo dõi sự phát triển sự nghiệp theo thời gian.",
    },
    {
      icon: Shield,
      title: "Đảm bảo chất lượng",
      description: "Tất cả mentor đều được xác minh và đánh giá bởi mentee.",
    },
    {
      icon: Clock,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ hỗ trợ luôn sẵn sàng giúp bạn bất cứ lúc nào.",
    },
  ],
  mentors: [
    {
      id: 1,
      name: "Minh Anh Nguyen",
      title: "Senior Product Manager tại Google",
      company: "Google",
      location: "TP. Hồ Chí Minh",
      rating: 4.9,
      sessions: 150,
      price: "2,500,000",
      image:
        "https://anhgaixinhonline.com/wp-content/uploads/2025/02/anh-gai-xinh-cute-1.jpg",
      skills: ["Chiến lược sản phẩm", "Lãnh đạo", "Phân tích"],
      available: true,
    },
    {
      id: 2,
      name: "Duc Huy Tran",
      title: "Engineering Manager tại Meta",
      company: "Meta",
      location: "Hà Nội",
      rating: 4.8,
      sessions: 89,
      price: "3,000,000",
      image:
        "https://anhgaixinhonline.com/wp-content/uploads/2025/02/anh-gai-xinh-cute-1.jpg",
      skills: ["Kỹ thuật phần mềm", "Quản lý nhóm", "Thiết kế hệ thống"],
      available: true,
    },
    {
      id: 3,
      name: "Mai Le",
      title: "UX Design Lead tại Shopee",
      company: "Shopee",
      location: "TP. Hồ Chí Minh",
      rating: 4.9,
      sessions: 203,
      price: "2,200,000",
      image:
        "https://anhgaixinhonline.com/wp-content/uploads/2025/02/anh-gai-xinh-cute-1.jpg",
      skills: ["Thiết kế UX", "Design System", "Nghiên cứu người dùng"],
      available: false,
    },
    {
      id: 4,
      name: "Khanh Pham",
      title: "Data Scientist tại Grab",
      company: "Grab",
      location: "Đà Nẵng",
      rating: 4.7,
      sessions: 120,
      price: "2,800,000",
      image:
        "https://anhgaixinhonline.com/wp-content/uploads/2025/02/anh-gai-xinh-cute-1.jpg",
      skills: ["Machine Learning", "Phân tích dữ liệu", "AI"],
      available: true,
    },
    {
      id: 5,
      name: "Thu Hoang",
      title: "Marketing Director tại Unilever",
      company: "Unilever",
      location: "TP. Hồ Chí Minh",
      rating: 4.9,
      sessions: 175,
      price: "3,200,000",
      image:
        "https://anhgaixinhonline.com/wp-content/uploads/2025/02/anh-gai-xinh-cute-1.jpg",
      skills: ["Chiến lược thương hiệu", "Digital Marketing", "Truyền thông"],
      available: true,
    },
    {
      id: 6,
      name: "Nam Bui",
      title: "Fullstack Developer tại VNG",
      company: "VNG",
      location: "Hà Nội",
      rating: 4.6,
      sessions: 95,
      price: "1,800,000",
      image:
        "https://anhgaixinhonline.com/wp-content/uploads/2025/02/anh-gai-xinh-cute-1.jpg",
      skills: ["React", "Node.js", "Cloud"],
      available: false,
    },
  ],
  testimonial: [
    {
      quote:
        "Được tiếp cận với kiến thức và kinh nghiệm của mentor trên nền tảng này là cơ hội mà tôi không thể bỏ qua. Nhờ mentor, tôi đã đạt được mục tiêu gia nhập Tesla.",
      name: "Lan Pham",
      title: "Kỹ sư phần mềm tại Tesla",
      image:
        "https://anhgaixinhonline.com/wp-content/uploads/2025/02/anh-gai-xinh-cute-1.jpg",
      rating: 5,
      companyLogo: "/tesla-logo.png",
    },
    {
      quote:
        "Mentor đã giúp tôi định hướng sự nghiệp trong ngành Marketing quốc tế. Tôi tự tin ứng tuyển và hiện đang làm tại Unilever.",
      name: "Nguyen Hoang",
      title: "Chuyên viên Marketing tại Unilever",
      image:
        "https://anhgaixinhonline.com/wp-content/uploads/2025/02/anh-gai-xinh-cute-1.jpg",
      rating: 5,
      companyLogo: "/unilever-logo.png",
    },
    {
      quote:
        "Từ một sinh viên mới ra trường, tôi được mentor hướng dẫn cách phát triển kỹ năng quản lý dự án. Hiện tôi đã trở thành Project Manager tại một công ty công nghệ.",
      name: "Minh Tran",
      title: "Project Manager tại FPT Software",
      image:
        "https://anhgaixinhonline.com/wp-content/uploads/2025/02/anh-gai-xinh-cute-1.jpg",
      rating: 4,
      companyLogo: "/fpt-logo.png",
    },
    {
      quote:
        "Trước đây tôi khá mơ hồ về con đường học tập ở nước ngoài. Mentor đã chia sẻ kinh nghiệm thực tế và nhờ vậy tôi nhận học bổng toàn phần tại Anh.",
      name: "Thao Le",
      title: "Du học sinh tại University of Oxford",
      image:
        "https://anhgaixinhonline.com/wp-content/uploads/2025/02/anh-gai-xinh-cute-1.jpg",
      rating: 5,
      companyLogo: "/oxford-logo.png",
    },
  ],
};

// ---------------- HERO ----------------
const benefits = [
  "Học hỏi từ mentor chuyên nghiệp",
  "Kết nối với nhiều lĩnh vực khác nhau",
  "Phát triển cá nhân và sự nghiệp",
];

export const HeroSection = () => {
  const words = [
    "Mentor chuyên nghiệp",
    "Công nghệ thông tin",
    "Marketing",
    "Kỹ năng lãnh đạo",
    "Thiết kế UX",
  ];

  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentWord = words[wordIndex];

    const interval = setInterval(() => {
      if (!isDeleting) {
        setDisplayedText(currentWord.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);

        if (charIndex + 1 === currentWord.length) {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        setDisplayedText(currentWord.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);

        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, 120);

    return () => clearInterval(interval);
  }, [charIndex, isDeleting, wordIndex]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listmentor?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/mentors");
    }
  };

  return (
    <section className="py-20" style={{ background: colors.primary }}>
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Nội dung bên trái */}
          <div className="space-y-8">
            <h2
              className="text-4xl lg:text-5xl font-bold leading-tight"
              style={{ color: colors.text }}
            >
              Kết nối với Mentor hàng đầu.{" "}
              <span style={{ color: colors.accent }}>
                Khởi đầu hành trình phát triển của bạn.
              </span>
            </h2>

            {/* Text typing effect */}
            <h3
              className="text-3xl lg:text-4xl font-semibold h-12"
              style={{ color: colors.accent }}
            >
              {displayedText}
              <span className="animate-pulse">|</span>
            </h3>

            <div className="space-y-4">
              {benefits.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className="w-7 h-7 bg-[#2C3E50] rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span style={{ color: colors.text }} className="text-base">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Search box */}
            <div className="max-w-xl">
              <form onSubmit={handleSearch} className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  style={{ color: colors.text }}
                />
                <Input
                  placeholder="Tìm theo công ty, kỹ năng hoặc vai trò..."
                  className="pl-12 pr-4 py-6 text-lg rounded-xl border"
                  style={{
                    backgroundColor: colors.secondary,
                    color: colors.text,
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg px-8"
                  style={{ background: colors.accent, color: colors.secondary }}
                >
                  Tìm mentor
                </Button>
              </form>
            </div>
          </div>

          {/* Ảnh mockup bên phải */}
          <div className="relative flex justify-center lg:justify-end">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/mobile-app-mockup-showing-mentoring-interface-aD4pt8qMaAcMg2Jeb08MLSwvwHxVEI.jpg"
              alt="Ứng dụng cố vấn trên di động"
              className="w-full max-w-md lg:max-w-lg xl:max-w-xl h-auto rounded-2xl shadow-xl object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------------- FEATURE ----------------
export const FeatureSection = () => {
  return (
    <section className="py-20 px-4 bg-[#FDF7F9]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2
              className="text-4xl font-bold mb-6"
              style={{ color: colors.text }}
            >
              Tại sao chọn nền tảng của chúng tôi?
            </h2>
            <p className="text-xl mb-8" style={{ color: colors.text }}>
              Chúng tôi kết nối bạn với các mentor giàu kinh nghiệm để giúp sự
              nghiệp của bạn phát triển hiệu quả.
            </p>

            <Button
              size="lg"
              className="mt-8"
              style={{ background: colors.accent, color: colors.secondary }}
            >
              Bắt đầu ngay
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {fakeData.features.map((feature, index) => (
              <Card
                key={index}
                className="border hover:shadow-lg transition-shadow"
                style={{
                  background: colors.secondary,
                  borderColor: `${colors.accent}20`,
                }}
              >
                <CardContent className="p-6">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: colors.primary }}
                  >
                    <feature.icon
                      className="h-6 w-6"
                      style={{ color: colors.accent }}
                    />
                  </div>
                  <h3
                    className="font-semibold text-lg mb-2"
                    style={{ color: colors.text }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ color: colors.text }}>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------------- MENTORSHIP TIMELINE ----------------
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

// ---------------- MENTOR GRID ----------------
export const MentorGrid = () => {
  return (
    <section className="py-20 px-4 bg-[#FDF7F9]">
      <div className="max-w-7xl mx-auto">
        {/* Tiêu đề */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Mentor nổi bật
          </h2>
          <p className="text-xl max-w-2xl mx-auto text-gray-600">
            Kết nối với các chuyên gia hàng đầu từ những công ty công nghệ lớn
          </p>
        </div>

        {/* Grid Mentor */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fakeData.mentors.map((mentor) => (
            <Card
              key={mentor.id}
              className="hover:shadow-xl transition-all duration-300 border rounded-2xl"
              style={{ background: "#FFFFFF", borderColor: "#E5E7EB" }}
            >
              <CardContent className="p-6">
                {/* Avatar */}
                <div className="relative mb-4">
                  <img
                    src={mentor.image || "/placeholder.svg"}
                    alt={mentor.name}
                    className="w-20 h-20 rounded-full mx-auto object-cover"
                  />
                  {mentor.available && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Thông tin mentor */}
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg mb-1 text-gray-800">
                    {mentor.name}
                  </h3>
                  <p className="text-sm mb-2 text-gray-500">{mentor.title}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {mentor.location}
                  </div>
                </div>

                {/* Rating & Sessions */}
                <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{mentor.rating}</span>
                  </div>
                  <div>{mentor.sessions} phiên</div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {mentor.skills.slice(0, 2).map((skill) => (
                    <Badge
                      key={skill}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ background: "#F9C5D5", color: "#333" }}
                    >
                      {skill}
                    </Badge>
                  ))}
                  {mentor.skills.length > 2 && (
                    <Badge
                      variant="outline"
                      className="text-xs px-3 py-1 rounded-full border"
                      style={{ borderColor: "#2C3E50", color: "#2C3E50" }}
                    >
                      +{mentor.skills.length - 2}
                    </Badge>
                  )}
                </div>

                {/* Giá */}
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-[#2C3E50]">
                    {mentor.price}₫
                  </div>
                  <div className="text-sm text-gray-600">/ mỗi phiên 1 giờ</div>
                </div>

                {/* Nút */}
                <div className="flex justify-center">
                  <Link to={`/mentor/${mentor.id}`}>
                    <Button className="bg-[#2C3E50] text-white hover:opacity-90 rounded-full px-6">
                      Xem hồ sơ
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nút xem tất cả */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="px-8 rounded-full"
            style={{ borderColor: "#2C3E50", color: "#2C3E50" }}
          >
            Xem tất cả mentor
          </Button>
        </div>
      </div>
    </section>
  );
};

// ---------------- STATS ----------------
export const StatsSection = () => {
  return (
    <section className="py-20 px-4" style={{ background: colors.accent }}>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
          {fakeData.stats.map((stat, index) => (
            <div key={index}>
              <div className="text-5xl md:text-6xl font-bold mb-2">
                {stat.number}
              </div>
              <div className="text-xl opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------- TESTIMONIAL ----------------
export const TestimonialSection = () => {
  const testimonials = fakeData.testimonial;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide mỗi 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section
      className="py-20 px-4"
      style={{ backgroundColor: colors.secondary }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Tiêu đề */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl lg:text-4xl font-bold"
            style={{ color: colors.accent }}
          >
            Vẫn còn phân vân? Hãy nghe từ mentee & mentor
          </h2>
          <p className="mt-4" style={{ color: `${colors.text}cc` }}>
            Hàng ngàn người đã trải nghiệm mentorship 1-1 và để lại đánh giá
            trung bình 4.9/5 cho mentor của chúng tôi.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out items-stretch"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${testimonials.length * 100}%`,
            }}
          >
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 px-4"
                style={{ minWidth: "100%" }} // mỗi slide chiếm 100%
              >
                <div
                  className="rounded-xl shadow-lg p-8 h-full flex flex-col justify-between"
                  style={{ backgroundColor: colors.secondary }}
                >
                  <blockquote
                    className="italic mb-6 text-lg leading-relaxed"
                    style={{ color: colors.text }}
                  >
                    "{t.quote}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-16 h-16 rounded-full object-cover border-2"
                      style={{ borderColor: colors.primary }}
                    />
                    <div>
                      <div
                        className="font-semibold text-xl"
                        style={{ color: colors.accent }}
                      >
                        {t.name}
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: `${colors.text}b3` }}
                      >
                        {t.title}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, i) => (
              <span
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="w-3 h-3 rounded-full cursor-pointer transition"
                style={{
                  backgroundColor:
                    i === currentIndex ? colors.accent : colors.primary,
                }}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------------- CTA ----------------
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
          <Link to="/mentors">
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