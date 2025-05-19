import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    restaurant: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();
  const storage = getStorage(app);

  // Obtener lista de restaurantes
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/restaurants`);
        const data = await res.json();
        setRestaurants(data);
      } catch (error) {
        console.error('Error al obtener restaurantes:', error);
      }
    };
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (imageFile) {
        const storageRef = ref(storage, `products/${Date.now()}-${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image: imageUrl,
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error('Error al guardar producto');

      alert('Producto agregado exitosamente');
      navigate('/inventory');
    } catch (error) {
      console.error('Error al subir imagen o guardar producto:', error);
      alert('Error al guardar el producto');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="border border-gray-300 rounded-lg p-8 bg-white w-96">
          <h2 className="text-xl font-bold mb-4 text-center">Agregar Producto</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Nombre:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Precio:</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Stock:</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-lg font-semibold mb-2">Categoría:</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Selecciona una categoría</option>
                <option value="Comidas Rápidas">Comidas Rápidas</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Snacks">Snacks</option>
                <option value="Menú del Día">Menú del Día</option>
                <option value="Saludable">Saludable</option>
                <option value="Panadería">Panadería</option>
                <option value="Postres">Postres</option>
                <option value="Desayunos">Desayunos</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="restaurant" className="block text-lg font-semibold mb-2">Restaurante:</label>
              <select
                id="restaurant"
                name="restaurant"
                value={formData.restaurant}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Selecciona un restaurante</option>
                <option value="Cafe Bolsa">Cafe Bolsa</option>
                <option value="Kioskos">Kioskos</option>
                <option value="Restaurante Escuela">Restaurante Escuela</option>
                <option value="Punto Wok">Punto Wok</option>
                <option value="Embarcadero">Embarcadero</option>
                <option value="Punto Sandwich">Punto Sandwich</option>
                <option value="El Meson">El Meson</option>
                <option value="Terraza Living Lab">Terraza Living Lab</option>
              </select>
            </div>

            {imageFile && (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-4">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Vista previa"
                  className="h-full object-cover rounded"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-lg font-semibold mb-2">Imagen:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full"
            >
              Guardar Producto
            </button>
          </form>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default AddProduct;
