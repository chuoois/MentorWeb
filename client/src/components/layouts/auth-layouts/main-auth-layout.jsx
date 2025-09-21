import { Outlet } from "react-router-dom";
import { AuthLeftLogo } from "./auth-left-logo";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div className="w-1/2">
        <AuthLeftLogo />
      </div>

      {/* Right side */}
      <div className="w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
