import { BrowserRouter, Routes, Route } from "react-router-dom";


import Home from "../pages/Home";
import Users from "../pages/Users";
import Login from "../pages/Login";
import Register from "../pages/Register";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}


export default AppRoutes;
