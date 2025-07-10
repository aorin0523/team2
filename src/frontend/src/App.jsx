import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Box } from "@mui/material";
import Header from "./components/Header";
import Side from "./components/Side";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import UCD from "./pages/UserCaseDetails";

import Offerdetail from "./pages/Offerdetail";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import KigyoHome from "./pages/KigyoHome";
import Offer from "./pages/Offer";
import Profile from "./pages/Profile";
import List from "./pages/Project_List";
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
          <Route path="/list" element={<List />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/header" element={<Header />} />
          <Route path="/side" element={<Side />} />
          <Route path="/Offerdetail" element={<Offerdetail />} />
          <Route path="/user/details" element={<UCD />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
