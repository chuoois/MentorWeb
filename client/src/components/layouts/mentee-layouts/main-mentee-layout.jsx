import { Outlet } from "react-router-dom";
import { Sidebar } from "./siderbar-mentee";

export const MenteeLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 bg-gray-50 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
};
