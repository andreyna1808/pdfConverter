import { Route, Routes } from "react-router-dom";
import About from "../pages/about";
import Home from "../pages/home";
import Converters from "../components/Converters";
import GetClassification from "../components/Converters/GetClassification";
import FormatToABNT from "../components/Converters/FormatToABNT";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/about" element={<About />}></Route>
      <Route path="converter/*" element={<Converters />}></Route>
      <Route path="pdf/*" element={<Converters />}></Route>
      
      <Route path="format/abnt" element={<FormatToABNT />}></Route>
      <Route path="classification/get-result" element={<GetClassification />}></Route>
    </Routes>
  );
};
