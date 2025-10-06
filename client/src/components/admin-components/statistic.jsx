import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  BookOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Star,
  MessageSquare,
  Calendar,
} from "lucide-react";

export const WebsiteStatisticsPage = () => {
  const [timeRange, setTimeRange] = useState("30d");

  const overviewMetrics = [
    {
      title: "Total Users",
      value: "2,543",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-[#2C3E50]",
      bgColor: "bg-[#F9C5D5]",
    },
    {
      title: "Active Mentors",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: UserCheck,
      color: "text-[#2C3E50]",
      bgColor: "bg-[#F9C5D5]",
    },
    {
      title: "Total Sessions",
      value: "1,234",
      change: "+23.1%",
      trend: "up",
      icon: BookOpen,
      color: "text-[#2C3E50]",
      bgColor: "bg-[#F9C5D5]",
    },
    {
      title: "Revenue",
      value: "$45,231",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-[#2C3E50]",
      bgColor: "bg-[#F9C5D5]",
    },
  ];

  const engagementMetrics = [
    {
      title: "Avg. Rating",
      value: "4.8",
      subtitle: "out of 5.0",
      icon: Star,
      color: "text-[#2C3E50]",
    },
    {
      title: "Total Reviews",
      value: "892",
      subtitle: "+45 this week",
      icon: MessageSquare,
      color: "text-[#2C3E50]",
    },
    {
      title: "Session Completion",
      value: "94.2%",
      subtitle: "+2.1% from last month",
      icon: Activity,
      color: "text-[#2C3E50]",
    },
    {
      title: "Avg. Session Length",
      value: "52 min",
      subtitle: "+5 min from last month",
      icon: Calendar,
      color: "text-[#2C3E50]",
    },
  ];

  const monthlyData = [
    { month: "Jan", users: 1850, sessions: 890, revenue: 32400 },
    { month: "Feb", users: 1920, sessions: 945, revenue: 34200 },
    { month: "Mar", users: 2100, sessions: 1020, revenue: 38500 },
    { month: "Apr", users: 2250, sessions: 1150, revenue: 41200 },
    { month: "May", users: 2380, sessions: 1180, revenue: 43800 },
    { month: "Jun", users: 2543, sessions: 1234, revenue: 45231 },
  ];

  const topMentors = [
    { name: "Nguyễn Văn An", sessions: 89, rating: 4.9, revenue: "$8,900", specialty: "Product Management" },
    { name: "Trần Thị Bình", sessions: 76, rating: 4.8, revenue: "$7,600", specialty: "Software Engineering" },
    { name: "Lê Văn Cường", sessions: 68, rating: 4.9, revenue: "$6,800", specialty: "UI/UX Design" },
    { name: "Phạm Thị Dung", sessions: 62, rating: 4.7, revenue: "$6,200", specialty: "Marketing" },
    { name: "Hoàng Văn Em", sessions: 58, rating: 4.8, revenue: "$5,800", specialty: "Data Science" },
  ];

  const recentActivities = [
    { user: "Nguyễn Văn A", action: "completed a session with", target: "Trần Thị B", time: "5 minutes ago" },
    { user: "Lê Văn C", action: "left a 5-star review for", target: "Phạm Thị D", time: "15 minutes ago" },
    { user: "Hoàng Văn E", action: "signed up as a new mentee", time: "1 hour ago" },
    { user: "Vũ Thị F", action: "applied to become a mentor", time: "2 hours ago" },
  ];

  const maxValue = Math.max(...monthlyData.map((d) => d.users));

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2C3E50]">Website Statistics</h1>
          <p className="mt-2 text-[#333333]/70">Comprehensive overview of platform performance and metrics.</p>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d"].map((range) => (
            <Button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`${
                timeRange === range
                  ? "bg-[#F9C5D5] text-[#2C3E50]"
                  : "border border-[#2C3E50]/20 text-[#333333] hover:bg-[#F9C5D5]/30"
              }`}
            >
              {range.replace("d", " Days")}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {overviewMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="border border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6 rounded-2xl shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#333333]/70">{metric.title}</p>
                  <p className="mt-2 text-3xl font-bold text-[#2C3E50]">{metric.value}</p>
                  <div className="mt-2 flex items-center gap-1">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        metric.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Growth Chart */}
      <Card className="mb-8 border border-[#F9C5D5]/40 bg-[#FFFFFF] p-6 rounded-2xl shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-[#2C3E50]">Growth Overview</h3>
        <div className="h-80 rounded-lg border border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6">
          <div className="flex h-full items-end justify-between gap-4">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end justify-center gap-1">
                  <div
                    className="w-1/3 rounded-t bg-[#2C3E50]"
                    style={{ height: `${(data.users / maxValue) * 100}%` }}
                  />
                  <div
                    className="w-1/3 rounded-t bg-[#333333]"
                    style={{ height: `${(data.sessions / maxValue) * 100}%` }}
                  />
                  <div
                    className="w-1/3 rounded-t bg-[#F9C5D5]"
                    style={{ height: `${(data.revenue / 500 / maxValue) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-[#333333]/70">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Engagement Metrics */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {engagementMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="border border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <Icon className={`h-8 w-8 ${metric.color}`} />
                <div>
                  <p className="text-sm text-[#333333]/70">{metric.title}</p>
                  <p className="mt-1 text-2xl font-bold text-[#2C3E50]">{metric.value}</p>
                  <p className="mt-1 text-xs text-[#333333]/60">{metric.subtitle}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
