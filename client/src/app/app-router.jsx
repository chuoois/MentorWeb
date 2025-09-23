import { createBrowserRouter, Outlet } from "react-router-dom"

// Layouts
import {
  AuthLayout,
  HomeLayout
} from "@/components/layouts"

// Pages
import {
  LoginPage,
  MenteeRegisterPage,
  ForgotPasswordPage,
  HomeRegisterMentorPage,
  MentorApplicationFormPage,
  MentorApplicationSubmittedPage,
} from "@/pages"

// Layout trống (không có header/footer)
const BlankLayout = () => <Outlet />

export const router = createBrowserRouter([
  // Auth routes
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <MenteeRegisterPage /> },
      { path: "password_reset", element: <ForgotPasswordPage /> },
    ],
  },

  // Home routes
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { path: "mentor", element: <HomeRegisterMentorPage /> },
      { path: "mentor-apply", element: <MentorApplicationFormPage /> },
    ],
  },

  // Mentor apply success (trang riêng, không header/footer)
  {
    path: "/mentor-apply",
    element: <BlankLayout />,
    children: [
      { path: "success", element: <MentorApplicationSubmittedPage /> },
    ],
  },
])
