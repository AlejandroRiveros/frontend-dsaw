import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

function RestaurantesPOS() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/restaurants`);
      if (!res.ok) {
        throw new Error('Error al cargar los restaurantes');
      }
      const data = await res.json();
      setRestaurants(data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar restaurantes:', error);
      setError('No se pudieron cargar los restaurantes. Por favor, intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este restaurante?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/restaurants/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        throw new Error('Error al eliminar el restaurante');
      }
      await fetchRestaurants();
    } catch (err) {
      console.error('Error al eliminar restaurante:', err);
      alert('Error al eliminar restaurante. Por favor, intente más tarde.');
    }
  };

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
    <div className="min-h-screen bg-gray-100 relative">
      {/* Header */}
      <header className="w-full bg-blue-700 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-lg font-bold">Gestión de Restaurantes</h1>
        <img src="/logo.png" alt="Logo Sabana" className="h-10" />
      </header>

      {/* Título */}
      <div className="text-center mt-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-1 text-gray-800">🍽️ Restaurantes Registrados</h2>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-blue-700">{restaurant.name}</h3>
              <p className="text-sm text-gray-500 italic mb-1">{restaurant.horario}</p>
              <p className="text-sm text-gray-700">{restaurant.description}</p>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => navigate(`/edit-restaurant/${restaurant._id}`)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FaEdit className="mr-1" /> Editar
                </button>
                <button
                  onClick={() => handleDelete(restaurant._id)}
                  className="flex items-center text-red-600 hover:text-red-800"
                >
                  <FaTrash className="mr-1" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón flotante: Agregar restaurante */}
      <button
        onClick={() => navigate('/add-restaurant')}
        className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-700 flex items-center gap-2 z-50"
      >
        <FaPlus /> Agregar Restaurante
      </button>

      {/* Botón volver */}
      <button
        onClick={() => navigate('/home-pos')}
        className="fixed bottom-4 left-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 z-50"
      >
        ← Volver
      </button>
    </div>
  );
}

export default RestaurantesPOS;
