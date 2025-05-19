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
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Agregar Producto</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="name" placeholder="Nombre" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="number" name="price" placeholder="Precio" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="number" name="stock" placeholder="Stock" onChange={handleChange} required className="w-full border p-2 rounded" />

        {/* Select de Categoría */}
        <select name="category" value={formData.category} onChange={handleChange} required className="w-full border p-2 rounded">
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

        {/* Select de Restaurante */}
        <select name="restaurant" value={formData.restaurant} onChange={handleChange} required className="w-full border p-2 rounded">
  <option value="">Selecciona un restaurante</option>
    <option value="Cafe Bolsa">Cafe Bolsa</option>
    <option value="Kioskos">Kioskos</option>
    <option value="Restaurante Escuela">Restaurante Escuela</option>
    <option value="¨Punto Wok">¨Punto Wok</option>
    <option value="Embarcadero">Embarcadero</option>
    <option value="Punto Sandwich">Punto Sandwich</option>
    <option value="El Meson">El Mesón</option>
    <option value="Terraza Living Lab">Terraza Living Lab</option>
</select>

        <input type="file" accept="image/*" onChange={handleImageChange} required className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Guardar Producto
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
