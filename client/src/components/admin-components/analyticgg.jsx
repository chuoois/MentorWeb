import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
  MousePointer,
} from "lucide-react"

export const GoogleAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("7d")

  const metrics = [
    {
      title: "Total Users",
      value: "45,231",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-[#2C3E50]",
    },
    {
      title: "Page Views",
      value: "128,456",
      change: "+8.2%",
      trend: "up",
      icon: Eye,
      color: "text-[#2C3E50]",
    },
    {
      title: "Avg. Session Duration",
      value: "4m 32s",
      change: "-2.1%",
      trend: "down",
      icon: Clock,
      color: "text-[#2C3E50]",
    },
    {
      title: "Bounce Rate",
      value: "42.3%",
      change: "-5.4%",
      trend: "down",
      icon: MousePointer,
      color: "text-[#2C3E50]",
    },
  ]

  const topPages = [
    { path: "/", views: 45231, avgTime: "3m 45s", bounceRate: "38.2%" },
    { path: "/mentors", views: 32145, avgTime: "5m 12s", bounceRate: "32.5%" },
    { path: "/mentor/1", views: 18234, avgTime: "6m 34s", bounceRate: "28.9%" },
    {
      path: "/mentee-dashboard",
      views: 15678,
      avgTime: "8m 21s",
      bounceRate: "22.1%",
    },
    { path: "/mentor/2", views: 12456, avgTime: "5m 45s", bounceRate: "31.2%" },
  ]

  const trafficSources = [
    { source: "Direct", users: 18234, percentage: 40.3 },
    { source: "Organic Search", users: 13567, percentage: 30.0 },
    { source: "Social Media", users: 9012, percentage: 19.9 },
    { source: "Referral", users: 3456, percentage: 7.6 },
    { source: "Email", users: 962, percentage: 2.2 },
  ]

  const deviceBreakdown = [
    { device: "Desktop", users: 25678, percentage: 56.8 },
    { device: "Mobile", users: 16234, percentage: 35.9 },
    { device: "Tablet", users: 3319, percentage: 7.3 },
  ]

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2C3E50]">Google Analytics</h1>
          <p className="mt-2 text-[#333333]/70">
            Track user behavior and website performance metrics.
          </p>
        </div>
        <div className="flex gap-2">
          {["24h", "7d", "30d", "90d"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              onClick={() => setTimeRange(range)}
              className={
                timeRange === range
                  ? "bg-[#F9C5D5] text-[#2C3E50] hover:bg-[#f7b7c8]"
                  : "border-[#F9C5D5]/50 bg-[#FFFFFF] text-[#2C3E50] hover:bg-[#F9C5D5]/20"
              }
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card
              key={metric.title}
              className="border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#333333]/70">{metric.title}</p>
                  <p className="mt-2 text-3xl font-bold text-[#2C3E50]">
                    {metric.value}
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        metric.trend === "up"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>
                <Icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Users Over Time */}
        <Card className="border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-[#2C3E50]">
            Users Over Time
          </h3>
          <div className="h-64 rounded-lg border border-[#F9C5D5]/50 bg-[#FFFFFF] p-4">
            <div className="flex h-full items-end justify-between gap-1">
              {[65, 72, 68, 85, 78, 92, 88, 95, 90, 98, 94, 100, 96, 102].map(
                (height, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-[#2C3E50] to-[#F9C5D5]"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                )
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-[#333333]/60">
            <span>14 days ago</span>
            <span>Today</span>
          </div>
        </Card>

        {/* Page Views Over Time */}
        <Card className="border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-[#2C3E50]">
            Page Views Over Time
          </h3>
          <div className="h-64 rounded-lg border border-[#F9C5D5]/50 bg-[#FFFFFF] p-4">
            <svg
              className="h-full w-full"
              viewBox="0 0 400 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F9C5D5" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#2C3E50" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path
                d="M 0 150 L 28 140 L 57 145 L 85 120 L 114 130 L 142 100 L 171 110 L 200 90 L 228 95 L 257 80 L 285 85 L 314 70 L 342 75 L 371 60 L 400 65 L 400 200 L 0 200 Z"
                fill="url(#gradient)"
              />
              <path
                d="M 0 150 L 28 140 L 57 145 L 85 120 L 114 130 L 142 100 L 171 110 L 200 90 L 228 95 L 257 80 L 285 85 L 314 70 L 342 75 L 371 60 L 400 65"
                fill="none"
                stroke="#2C3E50"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-[#333333]/60">
            <span>14 days ago</span>
            <span>Today</span>
          </div>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <Card className="border-[#F9C5D5]/40 bg-[#F9C5D5]/20 backdrop-blur-sm">
          <div className="border-b border-[#F9C5D5]/40 p-6">
            <h3 className="text-lg font-semibold text-[#2C3E50]">Top Pages</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F9C5D5]/40">
                  {["Page", "Views", "Avg Time", "Bounce"].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#333333]/70"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F9C5D5]/30">
                {topPages.map((page, i) => (
                  <tr
                    key={i}
                    className="transition-colors hover:bg-[#F9C5D5]/20"
                  >
                    <td className="px-6 py-4 text-sm text-[#333333]">
                      {page.path}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#2C3E50]">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#2C3E50]">
                      {page.avgTime}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#2C3E50]">
                      {page.bounceRate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Traffic Sources & Device Breakdown */}
        <div className="space-y-6">
          {/* Traffic Sources */}
          <Card className="border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-[#2C3E50]">
              Traffic Sources
            </h3>
            <div className="space-y-3">
              {trafficSources.map((source) => (
                <div key={source.source}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-[#333333]/80">{source.source}</span>
                    <span className="text-[#2C3E50]">
                      {source.users.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#F9C5D5]/40">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2C3E50] to-[#F9C5D5]"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Device Breakdown */}
          <Card className="border-[#F9C5D5]/40 bg-[#F9C5D5]/20 p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-[#2C3E50]">
              Device Breakdown
            </h3>
            <div className="space-y-3">
              {deviceBreakdown.map((device) => (
                <div key={device.device}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-[#333333]/80">{device.device}</span>
                    <span className="text-[#2C3E50]">
                      {device.users.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#F9C5D5]/40">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2C3E50] to-[#F9C5D5]"
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
