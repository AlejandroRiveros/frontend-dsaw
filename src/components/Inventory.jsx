import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Inventory() {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Error al obtener los productos');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setMessage('No se pudo cargar el inventario. Por favor, intenta nuevamente más tarde.');
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryChange = (e) => setCategoryFilter(e.target.value);
  const handleStockChange = (e) => setStockFilter(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);

  const filteredProducts = products
    .filter((product) =>
      categoryFilter ? product.category === categoryFilter : true
    )
    .filter((product) => {
      if (stockFilter === 'low') return product.units < 5;
      if (stockFilter === 'in-stock') return product.units > 0;
      if (stockFilter === 'overstock') return product.units > 50;
      if (stockFilter === 'out-of-stock') return product.units === 0;
      return true;
    })
    .filter((product) =>
      searchTerm
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      if (sortOption === 'date') return new Date(a.date) - new Date(b.date);
      if (sortOption === 'quantity') return b.units - a.units;
      if (sortOption === 'category') return a.category.localeCompare(b.category);
      return 0;
    });

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="w-full bg-blue-700 text-white py-4 px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold">Nombre de POS</h1>
        <h2 className="text-lg">Panel de Inventario</h2>
        <img src={`${window.location.origin}/logo.png`} alt="Logo" className="h-10" />
      </header>
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Categoría de producto</option>
            <option value="perecederos">Ingredientes perecederos</option>
            <option value="bebidas">Bebidas</option>
            <option value="snacks">Snacks</option>
            <option value="preparados">Productos preparados</option>
            <option value="desechables">Desechables / empaques</option>
            <option value="aseo">Aseo</option>
            <option value="otros">Otros insumos</option>
          </select>
          <select
            value={stockFilter}
            onChange={handleStockChange}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Estado de stock</option>
            <option value="low">Stock bajo</option>
            <option value="in-stock">En stock</option>
            <option value="overstock">Sobrestock</option>
            <option value="out-of-stock">Agotado</option>
          </select>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Ordenar por...</option>
            <option value="name">Nombre A-Z</option>
            <option value="date">Fecha de ingreso</option>
            <option value="quantity">Cantidad disponible</option>
            <option value="category">Categoría</option>
          </select>
          <input
            type="text"
            placeholder="Buscar por palabra clave"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product._id} className="border border-gray-300 rounded-lg p-4">
              <div className="h-32 bg-gray-300 mb-4 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-bold text-center">{product.name}</h3>
              <p className="text-center">Precio: ${product.price.toLocaleString('es-CO')}</p>
              <p className="text-center">Unidades: {product.stock}</p>
              <p className="text-center">Categoría: {product.category}</p>
              <button
                onClick={() => navigate(`/edit-product/${product._id}`)}
                className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg hover:bg-blue-600"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/home-pos')}
          className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default Inventory;