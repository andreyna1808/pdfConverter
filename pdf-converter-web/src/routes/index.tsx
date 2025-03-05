import { Route, Routes } from "react-router-dom";
import About from "../pages/about";
import Home from "../pages/home";
import Converters from "../components/converters";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/about" element={<About />}></Route>
      <Route path="converter/*" element={<Converters />}></Route>
      <Route path="pdf/*" element={<Converters />}></Route>
      <Route path="format/abnt" element={<Home />}></Route>
      <Route path="classification/get-result" element={<Home />}></Route>
    </Routes>
  );
};
