import { Outlet } from "react-router-dom";
import { Header } from "./home-header";
import { Footer } from "./home-footer";

export const HomeLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};
