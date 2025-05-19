import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaPlusCircle, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';

function HomePOS() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="relative w-full bg-blue-700 text-white py-4 px-4 md:px-16 flex items-center justify-between">
        <h1 className="text-lg font-bold">Bienvenido, Nombre de POS</h1>
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">
          Panel Principal
        </h2>
        <img src={`${window.location.origin}/logo.png`} alt="Logo" className="h-10" />
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 flex items-center gap-1 text-sm bg-red-500 px-3 py-1 rounded-md hover:bg-red-600"
        >
          <FaSignOutAlt /> Salir
        </button>
      </header>

      {/* Hero visual */}
      <div className="bg-yellow-100 p-4 text-center rounded-md shadow my-4 mx-6">
        <h2 className="text-lg font-semibold text-gray-700">
          Gestiona tu restaurante fácilmente desde aquí 🍽️
        </h2>
      </div>

      {/* Opciones principales */}
      <main className="flex flex-col items-center justify-center flex-grow gap-6 px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Inventario */}
          <div className="bg-white shadow-md p-6 rounded-lg w-72 text-center space-y-3">
            <FaBox className="text-4xl mx-auto text-blue-500" />
            <h3 className="font-bold text-lg">Inventario</h3>
            <p className="text-sm text-gray-600">Consulta o actualiza el stock de productos.</p>
            <button
              onClick={() => navigate('/inventory')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Ver Inventario
            </button>
          </div>

          {/* Agregar Producto */}
          <div className="bg-white shadow-md p-6 rounded-lg w-72 text-center space-y-3">
            <FaPlusCircle className="text-4xl mx-auto text-green-500" />
            <h3 className="font-bold text-lg">Agregar Producto</h3>
            <p className="text-sm text-gray-600">Registra nuevos productos fácilmente.</p>
            <button
              onClick={() => navigate('/add-product')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Agregar Producto
            </button>
          </div>

          {/* Pedidos */}
          <div className="bg-white shadow-md p-6 rounded-lg w-72 text-center space-y-3">
            <FaClipboardList className="text-4xl mx-auto text-purple-500" />
            <h3 className="font-bold text-lg">Pedidos</h3>
            <p className="text-sm text-gray-600">Gestiona y verifica los pedidos recibidos.</p>
            <button
              onClick={() => navigate('/orders')}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Ver Pedidos
            </button>
          </div>
          {/* Restaurantes */}
<div className="bg-white shadow-md p-6 rounded-lg w-72 text-center space-y-3">
  <FaBox className="text-4xl mx-auto text-red-500" />
  <h3 className="font-bold text-lg">Restaurantes</h3>
  <p className="text-sm text-gray-600">Gestiona o agrega nuevos restaurantes.</p>
  <button
    onClick={() => navigate('/restaurantesPOS')}
    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
  >
    Ver Restaurantes
  </button>
  
</div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-4 text-center text-sm md:text-base">
        &copy; 2025 Unisabana Dining
      </footer>
    </div>
  );
}

export default HomePOS;
