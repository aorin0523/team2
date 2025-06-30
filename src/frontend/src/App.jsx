import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Offerlist from "./pages/Offerlist";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Offerlist" element={<Offerlist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
