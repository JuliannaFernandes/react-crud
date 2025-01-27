import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrimarySearchAppBar from '../components/NavBar';
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Product";
import Items from "../pages/Item";
import Carts from "../pages/Cart";

function AppRoutes() {
  return (
    <BrowserRouter>
        <PrimarySearchAppBar />
      <Routes>
        
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/items" element={<Items />} />
        <Route path="/carts" element={<Carts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
