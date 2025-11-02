// src/layouts/HomeLayout.jsx
import { Outlet } from "react-router-dom";
import { Header } from "./home-header";
import { Footer } from "./home-footer";
import { Chatbot } from "@/bot/floating-chatbot";

export const HomeLayout = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Chatbot />
      <Footer />
    </>
  );
};