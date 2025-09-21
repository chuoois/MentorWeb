import { createBrowserRouter } from "react-router-dom";
import {
  AuthLayout,
  HomeLayout
} from "@/components/layouts";
import {
  LoginPage,
  MenteeRegisterPage,
  ForgotPasswordPage,
  HomeRegisterMentorPage
} from "@/pages";

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
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        path: "mentor",
        element: <HomeRegisterMentorPage />,
      },
    ],
  },
]);