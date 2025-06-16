import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import KigyoHome from "./pages/KigyoHome";

function App() {
  return ( 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enterprise" element={<KigyoHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
