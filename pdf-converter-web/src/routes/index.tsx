import { Route, Routes, Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}></Route>
    </Routes>
  );
}
