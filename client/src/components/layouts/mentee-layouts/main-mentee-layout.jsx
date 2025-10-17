import { Outlet } from "react-router-dom";
import { Sidebar } from "./siderbar-mentee";

export const MenteeLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <Outlet />
      </main>
    </div>
  );
};
