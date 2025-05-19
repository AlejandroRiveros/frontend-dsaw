import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Register from './components/Register.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import Inventory from './components/Inventory.jsx';
import HomePOS from './components/HomePOS.jsx';
import EditProduct from './components/EditProduct.jsx';
import AddProduct from './components/AddProduct.jsx';
import HomeCliente from './components/HomeCliente.jsx';
import Productos from './components/Productos.jsx';
import Carrito from './components/Carrito.jsx';
import Map from './components/Map.jsx';
import PedidosPOS from './components/PedidosPOS.jsx';
import HistorialPedidos from './components/HistorialPedidos.jsx';
import Restaurantes from './components/Restaurantes';
import AddRestaurant from './components/AddRestaurant.jsx';
import EditRestaurant from './components/EditRestaurant.jsx';
import RestaurantesPOS from './components/RestaurantesPOS.jsx';




const clientId = "wF6ZqEmxWjhHUkiZn8SCLhsKvQtnFowW";

function App() {
  return (
   
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/cliente"
            element={
              <ProtectedRoute>
                <div>Vista para Clientes</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pos"
            element={
              <ProtectedRoute>
                <div>Vista para POS</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute requiredRole="POS">
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-pos"
            element={
              <ProtectedRoute requiredRole="POS">
                <HomePOS />
              </ProtectedRoute>
            }
          />
          <Route path="/edit-product/:id" element={
           < ProtectedRoute requiredRole="POS">
            <EditProduct />
            </ProtectedRoute>       
              } />
          <Route path="/add-product" element={
            <ProtectedRoute requiredRole="POS">
              <AddProduct />
            </ProtectedRoute>
            } />
          <Route
  path="/restaurantesPOS"
  element={
    <ProtectedRoute requiredRole="POS">
      <RestaurantesPOS />
    </ProtectedRoute>
  }
/>

          <Route
  path="/add-restaurant"
  element={
    <ProtectedRoute requiredRole="POS">
      <AddRestaurant />
    </ProtectedRoute>
  }
/>
<Route
  path="/edit-restaurant/:id"
  element={
    <ProtectedRoute requiredRole="POS">
      <EditRestaurant />
    </ProtectedRoute>
  }
/>


          <Route path="/home-cliente" element={
            <ProtectedRoute requiredRole="Cliente">
            <HomeCliente />
            </ProtectedRoute>
            } />
          <Route path="/productos" element={
            <ProtectedRoute requiredRole="Cliente">
            <Productos />
            </ProtectedRoute>
            } />
          <Route path="/carrito" element={
            <ProtectedRoute requiredRole="Cliente">
            <Carrito />
            </ProtectedRoute>
            } />
          <Route path="/map" element={
            <ProtectedRoute requiredRole="Cliente">
            <Map />
            </ProtectedRoute>
            } />
          <Route path="/restaurantes" element={
            <ProtectedRoute requiredRole="Cliente">
            <Restaurantes />
            </ProtectedRoute>
            } />
          <Route
            path="/orders"
            element={
              <ProtectedRoute requiredRole="POS">
                <PedidosPOS />
              </ProtectedRoute>
            }
          />
          <Route path="/orders/history" element={
            <ProtectedRoute requiredRole="Cliente">
              <HistorialPedidos />
            </ProtectedRoute>
            } />
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
  );
}

export default App;