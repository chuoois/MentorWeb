import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "@/components/layouts";
import { LoginPage, MenteeRegisterPage, ForgotPasswordPage } from "@/pages/auth-pages";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <MenteeRegisterPage />,
      },
      {
        path: "password_reset",
        element: <ForgotPasswordPage />,
      },
    ],
  },

]);