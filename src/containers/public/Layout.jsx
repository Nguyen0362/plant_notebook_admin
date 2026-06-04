import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Header"
import Sidebar from "./Sidebar"
import Footer from "./Footer";

const Layout = () => {
  const { isLoggedIn } = useSelector(state => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <div>
      <Header />
      <div className="body">
        <Sidebar />
        <main className="min-h-[calc(100vh-3rem)] mt-20 ml-[17.5rem] bg-[#f9f9f6] pt-[1.875rem] px-[1.5625rem] pb-[3.375rem] transition-all duration-500 ease-in-out">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout