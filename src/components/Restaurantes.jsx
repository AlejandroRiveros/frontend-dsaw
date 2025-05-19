import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';


function Restaurantes() {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    try {
      const res = await fetch('https://backend-proyecto-dsaw-production.up.railway.app/restaurants');
      if (!res.ok) {
        throw new Error('Error al cargar los restaurantes');
      }
      const data = await res.json();
      setRestaurants(data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar restaurantes:', error);
      setError('No se pudieron cargar los restaurantes. Por favor, intente más tarde.');
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);
if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando restaurantes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchRestaurants}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header institucional */}
      <header className="w-full bg-blue-700 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-lg font-bold">Universidad de La Sabana</h1>
        <img src="/logo.png" alt="Logo Sabana" className="h-10" />
      </header>

      {/* Título */}
      <div className="text-center mt-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-1 text-gray-800">🍽️ Restaurantes del Campus</h2>
        <p className="text-sm text-gray-600">Haz clic en alguno para ver su menú</p>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-200"
          >
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
  <h3 className="text-xl font-semibold text-blue-700">{restaurant.name}</h3>
  <p className="text-sm text-gray-500 italic mb-1">{restaurant.horario}</p>
  <p className="text-sm text-gray-700 mb-3">{restaurant.description}</p>

  {restaurant.menu && (
    <a
      href={restaurant.menu}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Ver Menú 📄
    </a>
  )}
</div>

          </div>
        ))}
      </div>

      {/* Botón volver */}
      <button
        onClick={() => navigate('/home-cliente')}
        className="fixed bottom-4 left-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 z-50"
      >
        ← Volver
      </button>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-4 text-center text-sm md:text-base mt-10">
        &copy; 2025 Unisabana Dining
      </footer>
    </div>
  );
}

export default Restaurantes;

