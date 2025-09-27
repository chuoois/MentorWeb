import { useState } from "react"
import { Search, Filter, Heart, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom"

const skillsData = [
  { name: "Leadership", count: 572 },
  { name: "Career Growth", count: 440 },
  { name: "Product Management", count: 410 },
  { name: "Career", count: 371 },
  { name: "Product Strategy", count: 363 },
  { name: "Management", count: 341 },
]

const jobTitlesData = [
  { name: "Founder", count: 147 },
  { name: "CEO", count: 71 },
  { name: "Senior Software Engineer", count: 62 },
  { name: "Software Engineer", count: 39 },
  { name: "CTO", count: 38 },
  { name: "Engineering Manager", count: 32 },
]

const mentorsData = [
  {
    id: 1,
    name: "Ayan Sengupta",
    avatar: "/professional-asian-man-suit.png",
    isTopMentor: true,
    rating: 5.0,
    reviewCount: 19,
    title: "CTO and Co-founder",
    company: "MyImmune Corporation",
    experience: "6 years of experience building AI products",
    description:
      "Ayan Sengupta is the Co-founder and Chief Technology Officer (CTO) of MyImmune, a disruptive company leveraging Artificial Intelligence...",
    skills: ["Large Language Models", "AI Agents", "CTO", "Machine Learning"],
    price: 180,
    availableSpots: 1,
  },
  {
    id: 2,
    name: "Benjamin Kaiser",
    avatar: "/professional-asian-designer.png",
    isTopMentor: false,
    rating: 4.9,
    reviewCount: 24,
    title: "Senior Product Designer",
    company: "Meta",
    experience: "8 years of experience in product design",
    description:
      "Benjamin is a Senior Product Designer at Meta with extensive experience in designing user-centric products...",
    skills: ["Product Design", "UX Research", "Design Systems", "Figma"],
    price: 150,
    availableSpots: 3,
  },
]

export const ListMentor = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkills, setSelectedSkills] = useState([])
  const [selectedJobTitles, setSelectedJobTitles] = useState([])
  const [showMoreSkills, setShowMoreSkills] = useState(false)
  const [showMoreJobTitles, setShowMoreJobTitles] = useState(false)
  const [displayedMentors, setDisplayedMentors] = useState(3)

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const handleJobTitleToggle = (jobTitle) => {
    setSelectedJobTitles((prev) =>
      prev.includes(jobTitle) ? prev.filter((j) => j !== jobTitle) : [...prev, jobTitle]
    )
  }

  const handleShowMore = () => {
    setDisplayedMentors((prev) => Math.min(prev + 3, mentorsData.length))
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#333333]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 space-y-6">
            {/* Skills Filter */}
            <Card className="border border-[#F9C5D5]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Skills</h3>
                <div className="space-y-4">
                  <Input placeholder="Search for skills" className="border border-[#F9C5D5]" />
                  <div className="space-y-3">
                    {skillsData
                      .slice(0, showMoreSkills ? skillsData.length : 6)
                      .map((skill) => (
                        <div key={skill.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`skill-${skill.name}`}
                              checked={selectedSkills.includes(skill.name)}
                              onCheckedChange={() => handleSkillToggle(skill.name)}
                            />
                            <label
                              htmlFor={`skill-${skill.name}`}
                              className="text-sm cursor-pointer"
                            >
                              {skill.name}
                            </label>
                          </div>
                          <span className="text-sm">{skill.count}</span>
                        </div>
                      ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMoreSkills(!showMoreSkills)}
                    className="text-[#2C3E50] hover:text-[#2C3E50]/80"
                  >
                    {showMoreSkills ? "Show less" : "Show more"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Job Titles Filter */}
            <Card className="border border-[#F9C5D5]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Job titles</h3>
                <div className="space-y-4">
                  <Input placeholder="Search for job titles" className="border border-[#F9C5D5]" />
                  <div className="space-y-3">
                    {jobTitlesData
                      .slice(0, showMoreJobTitles ? jobTitlesData.length : 6)
                      .map((jobTitle) => (
                        <div key={jobTitle.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`job-${jobTitle.name}`}
                              checked={selectedJobTitles.includes(jobTitle.name)}
                              onCheckedChange={() => handleJobTitleToggle(jobTitle.name)}
                            />
                            <label
                              htmlFor={`job-${jobTitle.name}`}
                              className="text-sm cursor-pointer"
                            >
                              {jobTitle.name}
                            </label>
                          </div>
                          <span className="text-sm">{jobTitle.count}</span>
                        </div>
                      ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMoreJobTitles(!showMoreJobTitles)}
                    className="text-[#2C3E50] hover:text-[#2C3E50]/80"
                  >
                    {showMoreJobTitles ? "Show less" : "Show more"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Filters Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2C3E50] h-4 w-4" />
                  <Input
                    placeholder="Search for any skill, title or company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border border-[#F9C5D5]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border border-[#F9C5D5]">
                    <Filter className="h-4 w-4 mr-2 text-[#2C3E50]" />
                    More filters
                  </Button>
                  <Button variant="outline" size="sm" className="border border-[#F9C5D5]">
                    <Heart className="h-4 w-4 mr-2 text-[#2C3E50]" />
                    Save search
                  </Button>
                </div>
              </div>
              <p className="text-sm text-[#333333]">1,000+ mentors found</p>
            </div>

            {/* Mentors Grid */}
            <div className="space-y-6">
              {mentorsData.slice(0, displayedMentors).map((mentor) => (
                <Card key={mentor.id} className="border border-[#F9C5D5] hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Avatar */}
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                        <AvatarFallback>
                          {mentor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      {/* Content */}
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-semibold">{mentor.name}</h3>
                              {mentor.isTopMentor && (
                                <Badge className="bg-[#F9C5D5] text-[#2C3E50]">Top Mentor</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{mentor.rating}</span>
                              <span className="text-sm text-[#333333]">
                                ({mentor.reviewCount} Reviews)
                              </span>
                            </div>
                          </div>
                          {mentor.availableSpots <= 3 && (
                            <Badge className="bg-[#F9C5D5] text-[#2C3E50] border border-[#2C3E50]/20">
                              Only {mentor.availableSpots} spot
                              {mentor.availableSpots !== 1 ? "s" : ""} left
                            </Badge>
                          )}
                        </div>

                        {/* Position */}
                        <div className="text-[#2C3E50] font-medium">
                          {mentor.title} at {mentor.company}
                        </div>

                        {/* Experience */}
                        <div className="text-sm text-[#333333]">{mentor.experience}</div>

                        {/* Description */}
                        <p className="text-sm leading-relaxed">{mentor.description}</p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2">
                          {mentor.skills.map((skill) => (
                            <Badge key={skill} className="bg-[#2C3E50] text-[#FFFFFF]">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        {/* Price and Action */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                          <div>
                            <span className="text-sm text-[#333333]">Starting from</span>
                            <div className="text-2xl font-bold text-[#F9C5D5]">
                              ${mentor.price}
                              <span className="text-sm font-normal text-[#333333]">/month</span>
                            </div>
                          </div>
                          <Link to={`/mentor/${mentor.id}`}>
                            <Button className="w-full sm:w-auto bg-[#F9C5D5] text-[#2C3E50] hover:bg-[#f7b0c6]">
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Show More button */}
            {displayedMentors < mentorsData.length && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleShowMore}
                  variant="outline"
                  size="lg"
                  className="border border-[#F9C5D5] text-[#2C3E50] hover:bg-[#F9C5D5]/20"
                >
                  Show more mentors
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
