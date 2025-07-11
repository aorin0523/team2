import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Box, Stack } from "@mui/material";
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
// import "./App.css";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

              <Route index element={<Home />} />
              <Route path="signin" element={<SignIn />} />
              <Route path="signup" element={<SignUp />} />

            <Route path="/user/*" element={<Header sx={{ margin: 0 }} />}>
              <Route path="list" element={<List />} />
              <Route path="offer" element={<Offer />} />
              <Route path="profile" element={<Profile />} />
              <Route path="side" element={<Side />} />
              <Route path="offerdetail" element={<Offerdetail />} />
              <Route path="details" element={<UCD />} />
            </Route>
          </Routes>

          {/* <Routes
            path="kigyo/*"
            element={
              <Stack direction={"row"}>
                <Box>
                  <Side />
                </Box>
              </Stack>
            }
          >
            <Route path="/" element={<KigyoHome />} />
          </Routes> */}
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
