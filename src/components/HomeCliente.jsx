import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaMapMarkedAlt, FaHistory, FaShoppingBag } from 'react-icons/fa';

function HomeCliente() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.length);

    const storedUser = localStorage.getItem('username');
    if (storedUser) setUserName(storedUser);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const goToMap = () => navigate('/map');
  const goToProductos = () => navigate('/productos');
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* HEADER */}
      <header className="relative w-full bg-blue-700 text-white py-4 px-4 md:px-16 flex items-center justify-between">
        {/* Menú lateral */}
        <button onClick={toggleMenu} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Título centrado absolutamente */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold whitespace-nowrap">
          Unisabana Dining
        </h1>

        {/* Logo + Carrito */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-10" />
          <button onClick={() => navigate('/carrito')} className="relative flex items-center">
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
              {cartCount}
            </span>
            <FaShoppingBag className="text-xl mr-1" />
            <span className="text-sm font-semibold">Carrito</span>
          </button>
        </div>
      </header>

      {/* Menú desplegable */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-48 bg-white shadow-lg rounded-lg">
          <ul className="flex flex-col">
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Perfil</li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Configuración</li>
            <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Cerrar Sesión</li>
          </ul>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow p-4 md:p-8">
        {/* Bienvenida */}
        <div className="mb-6">
          <div className="bg-yellow-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-2">¡Bienvenido {userName || 'de nuevo'}! 👋</h2>
            <p className="text-gray-700">Explora los restaurantes del campus, revisa el menú y disfruta de tu comida favorita.</p>
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-6">Menu Principal</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            <button onClick={() => navigate('/restaurantes')} className="bg-white border border-gray-300 shadow-sm flex items-center justify-center gap-2 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100">
              <FaUtensils /> Restaurantes
            </button>
            <button onClick={goToMap} className="bg-white border border-gray-300 shadow-sm flex items-center justify-center gap-2 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100">
              <FaMapMarkedAlt /> Ver Mapa
            </button>
            <button
              onClick={() => navigate('/orders/history')}
              className="bg-white border border-gray-300 shadow-sm flex items-center justify-center gap-2 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100"
            >
              <FaHistory /> Historial
            </button>
            <button onClick={goToProductos} className="bg-white border border-gray-300 shadow-sm flex items-center justify-center gap-2 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100">
              <FaShoppingBag /> Productos
            </button>
          </div>
        </div>

        {/* Platos destacados */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">⭐ Platos destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-gray-800 text-white py-4 text-center text-sm md:text-base">
        &copy; 2025 Unisabana Dining
      </footer>
    </div>
  );
}

export default HomeCliente;
