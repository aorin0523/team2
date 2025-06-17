import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UCD from "./pages/UserCaseDetails";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/details" element={<UCD />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
