import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import KigyoHome from "./pages/KigyoHome";
import Offer from "./pages/Offer";

function App() {
  return ( 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enterprise" element={<KigyoHome />} />
        <Route path="/offer" element={<Offer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
