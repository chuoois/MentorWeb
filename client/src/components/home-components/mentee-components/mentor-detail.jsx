import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  MapPin,
  Clock,
  MessageCircle,
  ArrowLeft,
  CheckCircle,
  Linkedin,
  Globe,
} from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import MentorService from "@/services/mentor.service"
import MentorPricingService from "@/services/mentorPricing.service"

export const MentorDetailPage = () => {
  const { id } = useParams()
  const [mentor, setMentor] = useState(null)
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        // Lấy thông tin mentor
        const resMentor = await MentorService.getOne(id)
        console.log(resMentor)
        setMentor(resMentor)

        // Lấy pricing (sessionTypes)
        const resPricing = await MentorPricingService.list(id)
        setSessions(resPricing.data.data)
        console.log(resPricing.data.data)
      } catch (error) {
        console.error(error)
        toast.error("Không thể load dữ liệu mentor")
      }
    }

    fetchMentor()
  }, [id])

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
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={mentor.user_id?.avatar_url || "/placeholder.svg"} alt={mentor.user_id?.full_name} />
                      <AvatarFallback>{mentor.user_id?.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-foreground mb-2">{mentor.user_id?.full_name}</h1>
                    <p className="text-xl text-muted-foreground mb-2">{mentor.job_title} tại {mentor.company}</p>
                    <div className="text-sm text-muted-foreground mb-4">
                      Vị trí hiện tại: {mentor.current_position} 
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {mentor.rating || 0} ({mentor.sessions || 0} đánh giá)
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {(mentor.skill || "").split(",").map((skill, idx) => (
                        <Badge key={idx} variant="secondary">{skill.trim()}</Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Nhắn tin
                      </Button>
                      {mentor.linkedin_url && (
                        <Button size="sm" variant="outline" as="a" href={mentor.linkedin_url} target="_blank">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </Button>
                      )}
                      {mentor.personal_link_url && (
                        <Button size="sm" variant="outline" as="a" href={mentor.personal_link_url} target="_blank">
                          <Globe className="h-4 w-4 mr-2" />
                          Website
                        </Button>
                      )}
                      {mentor.intro_video && (
                        <Button size="sm" variant="outline" as="a" href={mentor.intro_video} target="_blank">
                          Video giới thiệu
                        </Button>
                      )}
                      {mentor.featured_article && (
                        <Button size="sm" variant="outline" as="a" href={mentor.featured_article} target="_blank">
                          Bài viết nổi bật
                        </Button>
                      )}
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

            {/* Questions */}
            {mentor.question && (
              <Card>
                <CardHeader>
                  <CardTitle>Câu hỏi & thông tin thêm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(mentor.question).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm text-muted-foreground">
                      <span className="capitalize">{key.replace(/_/g, " ")}</span>
                      <span>{Array.isArray(value) ? value.join(", ") : value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Đặt lịch mentoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sessions.map((session) => (
                  <div key={session._id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-foreground">{session.title}</h3>
                      <span className="text-lg font-bold text-primary">{session.price.toLocaleString()}₫</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{session.duration} phút</p>
                    <p className="text-sm text-muted-foreground mb-3">{session.description}</p>
                    <Button className="w-full">Đặt lịch</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
