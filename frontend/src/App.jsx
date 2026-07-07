import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Feedback from "./pages/Feedback";
import Assistant from "./pages/Assistant";
import Analytics from "./pages/Analytics";
import History from "./pages/History";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/assistant" element={<Assistant />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}

export default App;