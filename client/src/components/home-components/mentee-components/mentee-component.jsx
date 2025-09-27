// mentee-home.js
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
// import { Star, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
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
} from "lucide-react"

// 🎨 Màu sắc
const colors = {
  primary: "#F9C5D5",
  secondary: "#FFFFFF",
  accent: "#2C3E50",
  text: "#333333",
}

// ---------------- DỮ LIỆU GIẢ ----------------
export const fakeData = {
  features: [
    { icon: Users, title: "Hàng nghìn mentor", description: "Kết nối với mentor từ Google, Meta, Amazon và nhiều công ty hàng đầu khác." },
    { icon: Calendar, title: "Lịch học linh hoạt", description: "Đặt buổi học phù hợp với lịch của bạn, có sẵn 24/7 trên toàn thế giới." },
    { icon: MessageCircle, title: "Trò chuyện riêng", description: "Trao đổi trực tiếp với mentor qua tin nhắn và cuộc gọi video." },
    { icon: Trophy, title: "Theo dõi tiến độ", description: "Đặt mục tiêu và theo dõi sự phát triển sự nghiệp theo thời gian." },
    { icon: Shield, title: "Đảm bảo chất lượng", description: "Tất cả mentor đều được xác minh và đánh giá bởi mentee." },
    { icon: Clock, title: "Hỗ trợ 24/7", description: "Đội ngũ hỗ trợ luôn sẵn sàng giúp bạn bất cứ lúc nào." },
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
      image: "/professional-asian-woman-smiling.png",
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
      image: "/professional-asian-man-suit.png",
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
      image: "/professional-asian-designer.png",
      skills: ["Thiết kế UX", "Design System", "Nghiên cứu người dùng"],
      available: false,
    },

    {
      id: 4,
      name: "Mai Le",
      title: "UX Design Lead tại Shopee",
      company: "Shopee",
      location: "TP. Hồ Chí Minh",
      rating: 4.9,
      sessions: 203,
      price: "2,200,000",
      image: "/professional-asian-designer.png",
      skills: ["Thiết kế UX", "Design System", "Nghiên cứu người dùng"],
      available: false,
    },
  ],

  stats: [
    { number: "6,400+", label: "Mentor sẵn có" },
    { number: "33,000+", label: "Phiên mentoring" },
    { number: "130+", label: "Quốc gia" },
  ],

  testimonial: {
    quote:
      "Được tiếp cận với kiến thức và kinh nghiệm của mentor trên nền tảng này là cơ hội mà tôi không thể bỏ qua. Nhờ mentor, tôi đã đạt được mục tiêu gia nhập Tesla.",
    name: "Lan Pham",
    title: "Kỹ sư phần mềm tại Tesla",
    image: "/professional-vietnamese-woman-smiling.jpg",
  },
}

// ---------------- HERO ----------------
export const HeroSection = () => {
  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center px-4"
      style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})` }}
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance" style={{ color: colors.text }}>
          Kết nối 1-1 với{" "}
          <span
            className="px-4 py-2 rounded-lg inline-block"
            style={{ background: colors.accent, color: colors.secondary }}
          >
            Mentor chuyên nghiệp
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-pretty" style={{ color: colors.text }}>
          Học kỹ năng mới, bắt đầu dự án và tăng tốc phát triển sự nghiệp
        </p>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.text }} />
            <Input
              placeholder="Tìm theo công ty, kỹ năng hoặc vai trò..."
              className="pl-12 pr-4 py-6 text-lg rounded-xl border"
              style={{ backgroundColor: colors.secondary, color: colors.text }}
            />
            <Button
              size="lg"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg px-8"
              style={{ background: colors.accent, color: colors.secondary }}
            >
              Tìm mentor
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {["Quản lý sản phẩm", "Huấn luyện sự nghiệp", "Kỹ sư phần mềm", "Lãnh đạo", "Nhà thiết kế UX", "Huấn luyện Marketing"].map(
            (tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full backdrop-blur-sm"
                style={{ background: colors.primary, color: colors.text }}
              >
                {tag}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  )
}

// ---------------- FEATURE ----------------
export const FeatureSection = () => {
  return (
    <section className="py-20 px-4" style={{ background: colors.secondary }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-balance" style={{ color: colors.text }}>
              Tại sao chọn nền tảng của chúng tôi?
            </h2>
            <p className="text-xl mb-8 text-pretty" style={{ color: colors.text }}>
              Chúng tôi kết nối bạn với các mentor giàu kinh nghiệm để giúp sự nghiệp của bạn phát triển hiệu quả.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: colors.primary }}>
                  <Users className="h-6 w-6" style={{ color: colors.accent }} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: colors.text }}>Mentor chất lượng cao</h3>
                  <p style={{ color: colors.text }}>Tất cả mentor đều có ít nhất 5 năm kinh nghiệm trong ngành.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: colors.primary }}>
                  <Trophy className="h-6 w-6" style={{ color: colors.accent }} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: colors.text }}>Kết quả rõ ràng</h3>
                  <p style={{ color: colors.text }}>95% mentee đạt được mục tiêu sự nghiệp sau 6 tháng mentoring.</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="mt-8" style={{ background: colors.accent, color: colors.secondary }}>
              Bắt đầu ngay
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {fakeData.features.map((feature, index) => (
              <Card key={index} className="border-0 hover:shadow-lg transition-shadow" style={{ background: colors.secondary }}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: colors.primary }}>
                    <feature.icon className="h-6 w-6" style={{ color: colors.accent }} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: colors.text }}>{feature.title}</h3>
                  <p style={{ color: colors.text }}>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------- MENTOR GRID ----------------
export const MentorGrid = () => {
  return (
    <section className="py-20 px-4" style={{ background: colors.primary + "40" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{ color: colors.text }}>Mentor nổi bật</h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: colors.text }}>
            Kết nối với các chuyên gia hàng đầu từ những công ty công nghệ lớn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fakeData.mentors.map((mentor) => (
            <Card key={mentor.id} className="group hover:shadow-xl transition-all duration-300 border-0" style={{ background: colors.secondary }}>
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <img src={mentor.image || "/placeholder.svg"} alt={mentor.name} className="w-20 h-20 rounded-full mx-auto object-cover" />
                  {mentor.available && <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />}
                </div>

                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg mb-1" style={{ color: colors.text }}>{mentor.name}</h3>
                  <p className="text-sm mb-2" style={{ color: colors.text }}>{mentor.title}</p>
                  <div className="flex items-center justify-center gap-2 text-sm" style={{ color: colors.text }}>
                    <MapPin className="h-4 w-4" />
                    {mentor.location}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 mb-4 text-sm" style={{ color: colors.text }}>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{mentor.rating}</span>
                  </div>
                  <div>{mentor.sessions} phiên</div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {mentor.skills.slice(0, 2).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs" style={{ background: colors.primary, color: colors.text }}>
                      {skill}
                    </Badge>
                  ))}
                  {mentor.skills.length > 2 && (
                    <Badge variant="outline" className="text-xs" style={{ borderColor: colors.text, color: colors.text }}>
                      +{mentor.skills.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="text-center mb-4">
                  <div className="text-2xl font-bold" style={{ color: colors.accent }}>{mentor.price}₫</div>
                  <div className="text-sm" style={{ color: colors.text }}>/ mỗi phiên 1 giờ</div>
                </div>

                <div className="flex justify-center">
                  <Link to={`/mentor/${mentor.id}`}>
                    <Button variant="default">Xem hồ sơ</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="px-8" style={{ borderColor: colors.accent, color: colors.accent }}>
            Xem tất cả mentor
          </Button>
        </div>
      </div>
    </section>
  )
}

// ---------------- STATS ----------------
export const StatsSection = () => {
  return (
    <section className="py-20 px-4" style={{ background: colors.accent }}>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
          {fakeData.stats.map((stat, index) => (
            <div key={index}>
              <div className="text-5xl md:text-6xl font-bold mb-2">{stat.number}</div>
              <div className="text-xl opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------- TESTIMONIAL ----------------
export const TestimonialSection = () => {
  const t = fakeData.testimonial
  return (
    <section className="py-20 px-4" style={{ background: colors.primary + "40" }}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-8 w-8 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        <blockquote className="text-2xl md:text-3xl font-medium mb-8 text-balance" style={{ color: colors.text }}>
          "{t.quote}"
        </blockquote>

        <div className="flex items-center justify-center gap-4">
          <img src={t.image} alt="Testimonial" className="w-15 h-15 rounded-full object-cover" />
          <div className="text-left">
            <div className="font-semibold text-lg" style={{ color: colors.text }}>{t.name}</div>
            <div style={{ color: colors.text }}>{t.title}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
