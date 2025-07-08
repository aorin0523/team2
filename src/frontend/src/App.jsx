import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Box } from "@mui/material";
import Header from "./components/Header";
import Side from "./components/Side";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Offerdetail from "./pages/Offerdetail";


import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import KigyoHome from "./pages/KigyoHome";
import Offer from "./pages/Offer";
import "./App.css";

function App() {
  return ( 
    <AuthProvider>
      <BrowserRouter>
        <Routes>
    　　　<Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/enterprise" element={<KigyoHome />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/header" element={<Header />} />
          <Route path="/side" element={<Side />} />
          <Route path="/Offerdetail" element={<Offerdetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
