import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  Users,
  Award,
  MessageCircle,
  ArrowLeft,
  CheckCircle,
  Globe,
  Linkedin,
} from "lucide-react"
import { Link, useParams } from "react-router-dom"

// Mock data - trong thực tế sẽ fetch từ API dựa trên params.id
const getMentorData = (id) => {
  const mentors = {
    "1": {
      id: 1,
      name: "Nguyễn Minh Anh",
      title: "Senior Product Manager tại Google",
      company: "Google",
      location: "Hồ Chí Minh",
      rating: 4.9,
      sessions: 150,
      price: "2,500,000",
      image: "/professional-asian-woman-smiling.png",
      skills: ["Product Strategy", "Leadership", "Analytics", "Agile", "Data Analysis", "User Research"],
      available: true,
      bio: "Với hơn 8 năm kinh nghiệm trong lĩnh vực Product Management tại các công ty công nghệ hàng đầu như Google và Facebook, tôi đã dẫn dắt nhiều sản phẩm từ ý tưởng đến triển khai thành công với hàng triệu người dùng.",
      experience: [
        {
          company: "Google",
          position: "Senior Product Manager",
          duration: "2020 - Hiện tại",
          description: "Dẫn dắt team phát triển Google Search features, tăng 25% user engagement",
        },
        {
          company: "Facebook",
          position: "Product Manager",
          duration: "2018 - 2020",
          description: "Phát triển Instagram Shopping, đạt 50M+ monthly active users",
        },
      ],
      education: [
        {
          school: "Stanford University",
          degree: "MBA",
          year: "2018",
        },
        {
          school: "Đại học Bách Khoa Hà Nội",
          degree: "Cử nhân Công nghệ Thông tin",
          year: "2016",
        },
      ],
      reviews: [
        {
          name: "Trần Văn Nam",
          rating: 5,
          comment: "Chị Anh đã giúp tôi hiểu rõ hơn về product strategy và cách build roadmap hiệu quả. Rất recommend!",
          date: "2 tuần trước",
        },
        {
          name: "Lê Thị Hoa",
          rating: 5,
          comment: "Session rất bổ ích, chị chia sẻ nhiều kinh nghiệm thực tế từ Google. Sẽ book thêm session.",
          date: "1 tháng trước",
        },
      ],
      languages: ["Tiếng Việt", "English", "中文"],
      responseTime: "Trong vòng 2 giờ",
      sessionTypes: [
        {
          name: "1-on-1 Mentoring",
          duration: "60 phút",
          price: "2,500,000₫",
        },
        {
          name: "Portfolio Review",
          duration: "45 phút",
          price: "2,000,000₫",
        },
        {
          name: "Career Consultation",
          duration: "30 phút",
          price: "1,500,000₫",
        },
      ],
    },
  }

  return mentors[id] || null
}

const getSimilarMentors = (currentMentorId) => {
  const allMentors = [
    {
      id: 2,
      name: "Trần Đức Minh",
      title: "Tech Lead tại Shopee",
      company: "Shopee",
      location: "Hà Nội",
      rating: 4.8,
      sessions: 120,
      price: "2,200,000",
      image: "/professional-asian-man-suit.png",
      skills: ["React", "Node.js", "System Design", "Leadership"],
    },
    {
      id: 3,
      name: "Lê Thị Mai",
      title: "UX Designer tại Grab",
      company: "Grab",
      location: "Hồ Chí Minh",
      rating: 4.9,
      sessions: 95,
      price: "1,800,000",
      image: "/professional-asian-designer.png",
      skills: ["UI/UX Design", "Figma", "User Research", "Prototyping"],
    },
    {
      id: 4,
      name: "Phạm Văn Hùng",
      title: "Data Scientist tại VinAI",
      company: "VinAI",
      location: "Hà Nội",
      rating: 4.7,
      sessions: 80,
      price: "2,000,000",
      image: "/professional-asian-data-scientist.jpg",
      skills: ["Machine Learning", "Python", "Data Analysis", "AI"],
    },
  ]

  return allMentors.filter((mentor) => mentor.id.toString() !== currentMentorId)
}

export const MentorDetailPage = () => {
  const { id } = useParams()
  const mentor = getMentorData(id)
  const similarMentors = getSimilarMentors(id)

  if (!mentor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Không tìm thấy mentor</h1>
          <Link to="/">
            <Button>Quay về trang chủ</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={mentor.image || "/placeholder.svg"} alt={mentor.name} />
                      <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {mentor.available && (
                      <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                        <CheckCircle className="h-3 w-3" />
                        Khả dụng
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-foreground mb-2">{mentor.name}</h1>
                    <p className="text-xl text-muted-foreground mb-4">{mentor.title}</p>

                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {mentor.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {mentor.rating} ({mentor.sessions} đánh giá)
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {mentor.responseTime}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {mentor.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Nhắn tin
                      </Button>
                      <Button size="sm" variant="outline">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>Giới thiệu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{mentor.bio}</p>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Kinh nghiệm làm việc</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {mentor.experience.map((exp, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{exp.position}</h3>
                      <p className="text-primary font-medium">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mb-2">{exp.duration}</p>
                      <p className="text-muted-foreground">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle>Học vấn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mentor.education.map((edu, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                      <p className="text-muted-foreground">{edu.school}</p>
                      <p className="text-sm text-muted-foreground">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Đánh giá từ mentee</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {mentor.reviews.map((review, index) => (
                  <div key={index}>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-foreground">{review.name}</h4>
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                    {index < mentor.reviews.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Similar Mentors */}
            <Card>
              <CardHeader>
                <CardTitle>Mentor tương tự</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {similarMentors.map((similarMentor) => (
                    <div key={similarMentor.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={similarMentor.image || "/placeholder.svg"} alt={similarMentor.name} />
                          <AvatarFallback>{similarMentor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{similarMentor.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{similarMentor.title}</p>
                          <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {similarMentor.rating}
                            </div>
                            <span>•</span>
                            <span>{similarMentor.sessions} phiên</span>
                            <span>•</span>
                            <span>{similarMentor.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {similarMentor.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-primary">
                              {similarMentor.price.toLocaleString()}₫
                            </span>
                            <Link to={`/mentor/${similarMentor.id}`}>
                              <Button size="sm" variant="outline">
                                Xem hồ sơ
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Đặt lịch mentoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mentor.sessionTypes.map((session, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-foreground">{session.name}</h3>
                      <span className="text-lg font-bold text-primary">{session.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{session.duration}</p>
                    <Button className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Đặt lịch
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle>Ngôn ngữ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mentor.languages.map((lang) => (
                    <Badge key={lang} variant="outline">
                      <Globe className="h-3 w-3 mr-1" />
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Thống kê</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tổng phiên</span>
                  <span className="font-medium">{mentor.sessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Đánh giá</span>
                  <span className="font-medium">{mentor.rating}/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thời gian phản hồi</span>
                  <span className="font-medium">{mentor.responseTime}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
