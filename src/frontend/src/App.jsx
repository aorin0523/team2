import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import List from "./pages/Project_List";
import Jobs from "./pages/Jobs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {<Route path="/" element={<Home />} /> }
        {<Route path="/list" element={<List />} />}
         {<Route path="/jobs" element={<Jobs />} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
