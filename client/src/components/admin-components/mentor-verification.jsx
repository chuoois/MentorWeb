import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Eye, Clock, CheckCircle, XCircle } from "lucide-react"

export const MentorVerificationPage = () => {
  const [selectedStatus, setSelectedStatus] = useState("pending")

  const applications = [
    {
      id: 1,
      name: "Nguyễn Minh Tuấn",
      email: "nguyenminhtuan@gmail.com",
      expertise: ["Product Management", "Leadership", "Career Growth"],
      experience: "8 years",
      company: "VNG Corporation",
      position: "Senior Product Manager",
      bio: "Experienced product manager with a passion for mentoring the next generation of tech leaders. Specialized in product strategy and team leadership.",
      linkedIn: "linkedin.com/in/nguyenminhtuan",
      status: "pending",
      appliedDate: "2024-03-15",
      hourlyRate: "$150",
    },
    {
      id: 2,
      name: "Trần Thị Mai",
      email: "tranthimai@gmail.com",
      expertise: ["Software Engineering", "System Design", "Cloud Architecture"],
      experience: "10 years",
      company: "FPT Software",
      position: "Tech Lead",
      bio: "Tech lead with extensive experience in building scalable systems. Love sharing knowledge about software architecture and best practices.",
      linkedIn: "linkedin.com/in/tranthimai",
      status: "pending",
      appliedDate: "2024-03-14",
      hourlyRate: "$180",
    },
    {
      id: 3,
      name: "Lê Văn Hùng",
      email: "levanhung@gmail.com",
      expertise: ["UI/UX Design", "Product Design", "Design Systems"],
      experience: "6 years",
      company: "Tiki",
      position: "Lead Designer",
      bio: "Lead designer passionate about creating beautiful and functional user experiences. Mentor aspiring designers in their career journey.",
      linkedIn: "linkedin.com/in/levanhung",
      status: "approved",
      appliedDate: "2024-03-10",
      hourlyRate: "$120",
    },
    {
      id: 4,
      name: "Phạm Thị Lan",
      email: "phamthilan@gmail.com",
      expertise: ["Marketing", "Growth Hacking", "Content Strategy"],
      experience: "5 years",
      company: "Shopee",
      position: "Growth Marketing Manager",
      bio: "Growth marketing expert helping startups scale their user acquisition. Specialized in data-driven marketing strategies.",
      linkedIn: "linkedin.com/in/phamthilan",
      status: "rejected",
      appliedDate: "2024-03-08",
      hourlyRate: "$100",
    },
  ]

  const filteredApplications = applications.filter((app) => app.status === selectedStatus)

  const stats = [
    {
      label: "Pending",
      value: applications.filter((a) => a.status === "pending").length,
      icon: Clock,
      color: "text-[#F9C5D5]",
    },
    {
      label: "Approved",
      value: applications.filter((a) => a.status === "approved").length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Rejected",
      value: applications.filter((a) => a.status === "rejected").length,
      icon: XCircle,
      color: "text-red-500",
    },
  ]

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C3E50]">Mentor Verification</h1>
        <p className="mt-2 text-[#333333]">Review and approve mentor applications to maintain platform quality.</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border border-[#F9C5D5] bg-[#F9C5D5]/10 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#333333]">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-[#2C3E50]">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex gap-3">
        <Button
          onClick={() => setSelectedStatus("pending")}
          className={`${
            selectedStatus === "pending"
              ? "bg-[#F9C5D5] text-[#2C3E50]"
              : "border border-[#F9C5D5] bg-white text-[#333333] hover:bg-[#F9C5D5]/30"
          }`}
        >
          <Clock className="mr-2 h-4 w-4" />
          Pending ({applications.filter((a) => a.status === "pending").length})
        </Button>
        <Button
          onClick={() => setSelectedStatus("approved")}
          className={`${
            selectedStatus === "approved"
              ? "bg-green-500 text-white"
              : "border border-[#F9C5D5] bg-white text-[#333333] hover:bg-[#F9C5D5]/30"
          }`}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Approved ({applications.filter((a) => a.status === "approved").length})
        </Button>
        <Button
          onClick={() => setSelectedStatus("rejected")}
          className={`${
            selectedStatus === "rejected"
              ? "bg-red-500 text-white"
              : "border border-[#F9C5D5] bg-white text-[#333333] hover:bg-[#F9C5D5]/30"
          }`}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Rejected ({applications.filter((a) => a.status === "rejected").length})
        </Button>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {filteredApplications.map((app) => (
          <Card key={app.id} className="border border-[#F9C5D5] bg-[#F9C5D5]/10 p-6 shadow-md">
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Left: Info */}
              <div className="flex-1">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F9C5D5]/60 text-xl font-semibold text-[#2C3E50]">
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#2C3E50]">{app.name}</h3>
                      <p className="text-sm text-[#333333]">{app.email}</p>
                      <p className="mt-1 text-sm text-[#2C3E50]">
                        {app.position} at {app.company}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`${
                      app.status === "pending"
                        ? "bg-[#F9C5D5]/30 text-[#2C3E50]"
                        : app.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {app.status}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#2C3E50]">Bio</p>
                    <p className="text-sm text-[#333333] leading-relaxed">{app.bio}</p>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#2C3E50]">Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {app.expertise.map((skill) => (
                        <Badge key={skill} className="bg-[#F9C5D5]/40 text-[#2C3E50]">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold text-[#2C3E50]">Experience</p>
                      <p className="mt-1 text-sm text-[#333333]">{app.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2C3E50]">Hourly Rate</p>
                      <p className="mt-1 text-sm text-[#333333]">{app.hourlyRate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2C3E50]">Applied Date</p>
                      <p className="mt-1 text-sm text-[#333333]">{app.appliedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2C3E50]">LinkedIn</p>
                      <a href={`https://${app.linkedIn}`} className="mt-1 text-sm text-[#2C3E50] underline">
                        View Profile
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-col gap-3 lg:w-48">
                <Button className="w-full bg-[#2C3E50] text-white hover:bg-[#333333]">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                {app.status === "pending" && (
                  <>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      className="w-full border border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </>
                )}
                {app.status === "approved" && (
                  <Button className="w-full border border-red-500 text-red-600 hover:bg-red-50 bg-transparent">
                    <X className="mr-2 h-4 w-4" />
                    Revoke
                  </Button>
                )}
                {app.status === "rejected" && (
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    <Check className="mr-2 h-4 w-4" />
                    Reconsider
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {filteredApplications.length === 0 && (
          <Card className="border border-[#F9C5D5] bg-[#F9C5D5]/10 p-12 text-center">
            <p className="text-[#333333]">No {selectedStatus} applications found.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
