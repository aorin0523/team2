import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Offerdetail from "./pages/Offerdetail";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Offerdetail" element={<Offerdetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
