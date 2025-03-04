import { Route, Routes } from "react-router-dom";
import About from "../pages/about";

export const Router = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Layout />}></Route> */}
      <Route path="/about" element={<About />}></Route>
    </Routes>
  );
};
