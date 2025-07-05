import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./components/Header";
import Side from "./components/Side";
import Home from "./pages/Home";
import Offer from "./pages/Offer";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ height: '100vh', width: '100vw' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/header" element={<Header />} />
          <Route path="/side" element={<Side />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
