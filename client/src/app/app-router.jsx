import { createBrowserRouter, Outlet } from "react-router-dom"

// Layouts
import {
  AuthLayout,
  HomeLayout,
  MentorLayout,
  AdminLayout
} from "@/components/layouts"

// Pages
import {
  LoginPage,
  MenteeRegisterPage,
  ForgotPasswordPage,
  HomeRegisterMentorPage,
  MentorApplicationFormPage,
  MentorApplicationSubmittedPage,
  MentorHome,
  MentorDetail,
  ApplicationsPage,
  SettingsMentorPage,
  ChatMentorPage,
  MentorList,
  ListMenteeApply,
  AdminDashboard,
  MentorManagement,
  MenteesManagement,
  WebsiteStatistic,
  AnalysisPage,
  MentorVerification
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
      { path: "/", element: <MentorHome /> },
      { path: "mentor/:id", element: <MentorDetail /> },
      { path: "/listmentor", element: <MentorList /> },
      { path: "/menteedashboard", element: <ListMenteeApply /> }
    ],
  },

  // Mentor apply success
  {
    path: "/mentor-apply",
    element: <BlankLayout />,
    children: [
      { path: "success", element: <MentorApplicationSubmittedPage /> },
    ],
  },
  // Mentor routes
  {
    path: "/",
    element: <MentorLayout />,
    children: [
      { path: "applications", element: <ApplicationsPage /> },
      { path: "chat", element: <ChatMentorPage /> },
      { path: "settings", element: <SettingsMentorPage /> },
    ],
  },
  // Admin routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <AdminDashboard/>},
      { path: "mentors", element: <MentorManagement />},
      { path: "mentees", element: <MenteesManagement/> },
      { path: "applications", element: <ApplicationsPage /> },
    ],
  },
])
