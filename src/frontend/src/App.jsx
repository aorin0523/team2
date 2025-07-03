import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import KigyoHome from "./pages/KigyoHome";
import Offer from "./pages/Offer";

function App() {
  return ( 
    <AuthProvider>
      <BrowserRouter>
        <Routes>        <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/enterprise" element={<KigyoHome />} />
          <Route path="/offer" element={<Offer />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
