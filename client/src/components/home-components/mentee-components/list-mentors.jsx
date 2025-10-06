import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Link } from "react-router-dom"
import MentorService from "@/services/mentor.service"
import { toast } from "react-hot-toast"

// 50 skills
const skillsData = [
  "Machine Learning", "Python", "TensorFlow", "JavaScript", "React", "Node.js", 
  "Agile", "Product Strategy", "UI/UX", "Deep Learning", "NLP", "Data Science",
  "C++", "Java", "SQL", "NoSQL", "AWS", "Azure", "GCP", "Docker", "Kubernetes",
  "DevOps", "Blockchain", "Cybersecurity", "Big Data", "Scala", "Go", "R",
  "MATLAB", "PHP", "Ruby", "Swift", "Objective-C", "HTML", "CSS", "GraphQL",
  "Django", "Flask", "Spring", "FastAPI", "Microservices", "Testing", "CI/CD",
  "Analytics", "Project Management", "Leadership", "Mentoring", "Communication",
  "Problem Solving", "Design Thinking", "Figma"
]

export const ListMentor = () => {
  const [mentors, setMentors] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(6)
  const [loading, setLoading] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkills, setSelectedSkills] = useState([])
  const [showAllSkills, setShowAllSkills] = useState(false)

  const fetchMentors = async (reset = false) => {
    try {
      setLoading(true)

      const res = await MentorService.list({
        search: searchQuery,
        page: reset ? 1 : page,
        pageSize,
      })

      let fetched = res.items || []

      // Filter skill trên frontend
      if (selectedSkills.length > 0) {
        fetched = fetched.filter((m) =>
          m.skill?.split(",").some((s) => selectedSkills.includes(s.trim()))
        )
      }

      setTotal(res.total || fetched.length)
      setMentors(reset ? fetched : [...mentors, ...fetched])
    } catch (err) {
      console.error(err)
      toast.error("Không thể tải danh sách mentor.")
    } finally {
      setLoading(false)
    }
  }

  // Reset page khi search hoặc filter thay đổi
  useEffect(() => {
    setPage(1)
    fetchMentors(true)
  }, [searchQuery, selectedSkills])

  const handleShowMore = () => {
    setPage(prev => prev + 1)
    fetchMentors()
  }

  const toggleArrayItem = (array, item, setArray) => {
    setArray(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
  }

  return (
    <div className="min-h-screen bg-white text-[#333]">
      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar Filters */}
        <div className="w-80 flex-shrink-0 space-y-6">
          {/* Search Box */}
          <Card className="border border-[#F9C5D5]">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">Search</h3>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#2C3E50]" />
                <Input
                  placeholder="Search mentors (company, skill, bio)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 border border-[#F9C5D5]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills Filter */}
          <Card className="border border-[#F9C5D5]">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">Skills</h3>
              <div className="space-y-2">
                {(showAllSkills ? skillsData : skillsData.slice(0, 30)).map(skill => (
                  <div key={skill} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={() => toggleArrayItem(selectedSkills, skill, setSelectedSkills)}
                    />
                    <span className="text-sm cursor-pointer">{skill}</span>
                  </div>
                ))}

                {skillsData.length > 10 && (
                  <Button
                    size="sm"
                    variant="link"
                    className="mt-2 p-0 text-[#F9C5D5] hover:underline"
                    onClick={() => setShowAllSkills(prev => !prev)}
                  >
                    {showAllSkills ? "Thu gọn" : `Xem thêm ${skillsData.length - 10} skills`}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {loading ? (
            <p>Loading...</p>
          ) : mentors.length === 0 ? (
            <p>No mentors found.</p>
          ) : (
            mentors.map(mentor => (
              <Card key={mentor._id} className="border border-[#F9C5D5] hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={mentor.user_id?.avatar_url || "/placeholder.svg"}
                      alt={mentor.user_id?.full_name}
                    />
                    <AvatarFallback>
                      {mentor.user_id?.full_name?.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-semibold">{mentor.user_id?.full_name}</h3>
                    <div className="text-[#2C3E50] font-medium">
                      {mentor.job_title} {mentor.company ? `at ${mentor.company}` : ""}
                    </div>
                    {mentor.category && <Badge className="bg-[#F9C5D5] text-[#2C3E50]">{mentor.category}</Badge>}
                    {mentor.skill && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {mentor.skill.split(",").map(s => (
                          <Badge key={s} className="bg-[#2C3E50] text-white">{s.trim()}</Badge>
                        ))}
                      </div>
                    )}
                    {mentor.bio && <p className="text-sm">{mentor.bio}</p>}
                    <Link to={`/mentor/${mentor._id}`}>
                      <Button className="bg-[#F9C5D5] text-[#2C3E50] hover:bg-[#f7b0c6] mt-2">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {mentors.length < total && (
            <div className="flex justify-center mt-4">
              <Button onClick={handleShowMore} variant="outline" size="lg">
                Show more mentors
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
