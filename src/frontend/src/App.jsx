import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Offer from "./pages/Offer";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/offer" element={<Offer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
