import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Calendar,
  GraduationCap,
  LogOut,
  Timer
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  const navigate = useNavigate();

  const tabs = [
    { path: "/applications", label: "Danh sách Mentee", icon: <Users className="w-4 h-4" /> },
    { path: "/progress", label: "Tiến độ hướng dẫn", icon: <BookOpen className="w-4 h-4" /> },
    { path: "/schedule", label: "Lịch hướng dẫn", icon: <Calendar className="w-4 h-4" /> },
    { path: "/availability", label: "Thời gian khả dụng", icon: <Timer className="w-4 h-4" /> },
  ];

  const handleLogout = () => {
    // Xóa localStorage (có thể tùy chỉnh)
    localStorage.clear();

    // Điều hướng về trang đăng nhập
    navigate("/mentor");
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r shadow-sm"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#F3F3F3",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-6 py-4 border-b"
        style={{
          borderColor: "#F3F3F3",
          background: "linear-gradient(135deg, #A3BFFA, #E2E8F0)",
          color: "#2C3E50",
        }}
      >
        <GraduationCap className="w-6 h-6" />
        <Link to="/">
          <h1 className="text-lg font-semibold">Mentor Dashboard</h1>
        </Link>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F3F3F3]">
        <Avatar className="w-10 h-10 border">
          <AvatarImage src="https://i.pravatar.cc/100?img=14" alt="Mentor avatar" />
          <AvatarFallback>MT</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-[#2C3E50]">Minh Tuấn</p>
          <p className="text-xs text-gray-500">Mentor</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-3">
        <ul className="space-y-1 px-3">
          {tabs.map((tab) => (
            <li key={tab.path}>
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#A3BFFA]/80 text-[#2C3E50] shadow-[0_0_10px_rgba(163,191,250,0.5)]"
                      : "text-[#333] hover:bg-[#A3BFFA]/30 hover:translate-x-1"
                  }`
                }
              >
                {tab.icon}
                <span>{tab.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="px-6 pb-3">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-sm border-[#E5E7EB] hover:bg-[#A3BFFA]/40 transition"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-[#F3F3F3] px-6 py-3">
        <p className="text-xs text-center text-gray-400 mt-2">
          © 2025 Mentor App
        </p>
      </div>
    </aside>
  );
};
