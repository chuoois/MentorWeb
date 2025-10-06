import { Users, UserCheck, TrendingUp, DollarSign } from "lucide-react"
import { Card } from "@/components/ui/card"

export const AdminDashboardPage = () => {
  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      change: "+12.5%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Mentors",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: UserCheck,
    },
    {
      title: "Pending Verifications",
      value: "23",
      change: "-5.1%",
      trend: "down",
      icon: TrendingUp,
    },
    {
      title: "Revenue",
      value: "$45,231",
      change: "+23.1%",
      trend: "up",
      icon: DollarSign,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F9C5D5] p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C3E50]">Dashboard</h1>
        <p className="mt-2 text-[#333333]">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="border border-[#2C3E50]/20 bg-[#FFFFFF] p-6 shadow-lg rounded-2xl transition hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#333333]/70">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-[#2C3E50]">
                    {stat.value}
                  </p>
                  <p
                    className={`mt-2 text-sm ${
                      stat.trend === "up" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {stat.change} from last month
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F9C5D5]/50">
                  <Icon className="h-6 w-6 text-[#2C3E50]" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <Card className="border border-[#2C3E50]/20 bg-[#FFFFFF] p-6 shadow-md rounded-2xl">
          <h3 className="mb-4 text-lg font-semibold text-[#2C3E50]">
            User Growth
          </h3>
          <div className="h-64 rounded-lg border border-[#2C3E50]/10 bg-[#F9C5D5]/30 p-4">
            <div className="flex h-full items-end justify-between gap-2">
              {[40, 65, 45, 80, 60, 90, 75, 95, 70, 85, 100, 90].map(
                (height, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-[#2C3E50] to-[#F9C5D5]"
                    style={{ height: `${height}%` }}
                  />
                )
              )}
            </div>
          </div>
        </Card>

        {/* Revenue Chart */}
        <Card className="border border-[#2C3E50]/20 bg-[#FFFFFF] p-6 shadow-md rounded-2xl">
          <h3 className="mb-4 text-lg font-semibold text-[#2C3E50]">
            Revenue Overview
          </h3>
          <div className="h-64 rounded-lg border border-[#2C3E50]/10 bg-[#F9C5D5]/30 p-4">
            <div className="flex h-full items-end justify-between gap-2">
              {[60, 75, 55, 90, 70, 100, 85, 95, 80, 90, 95, 100].map(
                (height, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-[#2C3E50] to-[#F9C5D5]"
                    style={{ height: `${height}%` }}
                  />
                )
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6 border border-[#2C3E50]/20 bg-[#FFFFFF] p-6 shadow-md rounded-2xl">
        <h3 className="mb-4 text-lg font-semibold text-[#2C3E50]">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            {
              user: "Nguyễn Văn A",
              action: "registered as a new user",
              time: "5 minutes ago",
            },
            {
              user: "Trần Thị B",
              action: "applied to become a mentor",
              time: "15 minutes ago",
            },
            {
              user: "Lê Văn C",
              action: "completed a mentoring session",
              time: "1 hour ago",
            },
            {
              user: "Phạm Thị D",
              action: "left a 5-star review",
              time: "2 hours ago",
            },
          ].map((activity, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-[#2C3E50]/10 pb-4 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F9C5D5]/70 text-sm font-semibold text-[#2C3E50]">
                  {activity.user.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-[#333333]">
                    <span className="font-semibold">{activity.user}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-[#333333]/70">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
