import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import List from "./pages/Project_List";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {<Route path="/" element={<Home />} /> }
        {<Route path="/list" element={<List />} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
