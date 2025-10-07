import { NavLink, Link } from "react-router-dom";
import {
  Home,
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  User,
  Settings,
  GraduationCap,
} from "lucide-react";

export const Sidebar = () => {
  const tabs = [
    { path: "/mentee/applications", label: "Đơn xét duyệt", icon: <Users className="w-4 h-4" /> },
    { path: "/mentee/progress", label: "Tiến độ học tập", icon: <BookOpen className="w-4 h-4" /> },
    { path: "/mentee/schedule", label: "Lịch học", icon: <Calendar className="w-4 h-4" /> },
    { path: "/mentee/messages", label: "Tin nhắn", icon: <MessageSquare className="w-4 h-4" /> },
    { path: "/mentee/profile", label: "Hồ sơ", icon: <User className="w-4 h-4" /> },
  ];

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r"
      style={{
        backgroundColor: "#FFFFFF", // Secondary
        borderColor: "#F3F3F3",
        color: "#333333", // Text
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 px-6 py-4 border-b"
        style={{
          borderColor: "#F3F3F3",
          backgroundColor: "#F9C5D5", // Primary
          color: "#2C3E50", // Accent
        }}
      >
        <GraduationCap className="w-6 h-6" />
        <Link to="/">
          <h1 className="text-lg font-semibold">Mentee Dashboard</h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4">
        <ul className="space-y-1">
          {tabs.map((tab) => (
            <li key={tab.path}>
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${isActive
                    ? "shadow-sm"
                    : "hover:translate-x-1"
                  }`
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#F9C5D5" : "#FFFFFF",
                  color: isActive ? "#2C3E50" : "#333333",
                })}
              >
                {tab.icon}
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div
        className="border-t px-6 py-3 text-sm"
        style={{
          borderColor: "#F3F3F3",
          color: "#333333",
        }}
      >
        © 2025 Mentee App
      </div>
    </aside>
  );
};
