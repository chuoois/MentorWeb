import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar-mentor";

export const MentorLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Nội dung thay đổi theo route */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
