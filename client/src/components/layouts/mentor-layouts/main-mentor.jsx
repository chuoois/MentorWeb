import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar-mentor";

export const MentorLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Outlet />
      </main>
    </div>
  );
};