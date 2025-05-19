import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

function Productos() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [category, setCategory] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const limit = 20;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Debounce input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const fetchProducts = async ({ queryKey }) => {
    const [_key, debouncedSearch, category, page] = queryKey;
    const queryParams = new URLSearchParams();
    if (debouncedSearch) queryParams.append('name', debouncedSearch);
    if (category) queryParams.append('category', category);
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/products?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Error al obtener los productos');
    return response.json();
  };

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', debouncedSearch, category, page],
    queryFn: fetchProducts,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (page === 1) {
      setAllProducts(products);
    } else if (products && products.length > 0) {
      setAllProducts((prev) => [...prev, ...products]);
    }
  }, [products, page]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.length);
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item._id === product._id);
    if (existingIndex !== -1) {
      const maxStock = product.stock || 99;
      if ((cart[existingIndex].quantity || 1) < maxStock) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
      }
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(totalCount);
  };

  const isInCart = (productId) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.some(item => item._id === productId);
  };

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesRestaurant = selectedRestaurant ? product.restaurant === selectedRestaurant : true;
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesRestaurant && matchesCategory;
  });

  if (isLoading && page === 1) return <p>Cargando productos...</p>;
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-red-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">¡Algo salió mal!</h1>
        <p className="text-red-500">No pudimos cargar los productos. Por favor, intenta nuevamente más tarde.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <header className="w-full bg-blue-700 text-white py-4 px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold text-center flex-grow">Productos disponibles</h1>
        <div className="flex items-center">
          <button
            onClick={() => navigate('/carrito')}
            className="text-white flex items-center focus:outline-none mr-4"
          >
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 mr-2">{cartCount}</span>
            <span className="text-lg font-bold">Carrito</span>
          </button>
          <img src="/logo.png" alt="Logo" className="h-10" />
        </div>
      </header>

      <div className="p-4 md:p-8">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 border border-gray-300 rounded-lg p-2 mb-4 md:mb-0"
          />
          <select
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            className="w-full md:w-1/3 border border-gray-300 rounded-lg p-2 mb-4 md:mb-0"
          >
            <option value="">Todos los restaurantes</option>
            <option value="Cafe Bolsa">Cafe Bolsa</option>
            <option value="Kioskos">Kioskos</option>
            <option value="Restaurante Escuela">Restaurante Escuela</option>
            <option value="Punto Wok">Punto Wok</option>
            <option value="Embarcadero">Embarcadero</option>
            <option value="Punto Sandwich">Punto Sandwich</option>
            <option value="El Meson">El Meson</option>
            <option value="Terraza Living Lab">Terraza Living Lab</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-1/3 border border-gray-300 rounded-lg p-2"
          >
            <option value="">Todas las categorías</option>
            <option value="Comidas Rápidas">Comidas Rápidas</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Snacks">Snacks</option>
            <option value="Menú del Día">Menú del Día</option>
            <option value="Saludable">Saludable</option>
            <option value="Panadería">Panadería</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const inCart = isInCart(product._id);
            const outOfStock = product.stock === 0;
            return (
              <div key={product._id} className="border border-gray-300 rounded-lg p-4 bg-white shadow-md relative overflow-hidden">
                <div className="h-40 w-full bg-gray-300 mb-4 flex items-center justify-center relative overflow-hidden rounded-lg">
                  <img
                    src={`https://backend-proyecto-dsaw-production.up.railway.app${product.image}`}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-center">{product.name}</h3>
                <p className="text-center">Categoría: {product.category}</p>
                <p className="text-center">Restaurante: {product.restaurant}</p>
                <p className="text-center">Precio: ${product.price.toLocaleString('es-CO')}</p>
                <p className="text-center">Unidades: {product.stock}</p>
                <div className="flex justify-center mt-4">
                  {outOfStock ? (
                    <span className="text-red-500 font-bold">Sin stock</span>
                  ) : inCart ? (
                    <span className="text-green-600 font-bold">En tu carrito</span>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                    >
                      Agregar al carrito
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => navigate('/home-cliente')}
        className="absolute bottom-4 left-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Volver
      </button>
    </div>
  );
}

export default Productos;
